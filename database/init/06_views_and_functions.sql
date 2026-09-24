-- ============================================================================
-- 06: Traceability & Analytical Views and Functions
-- ============================================================================

-- 1. Unified Regional Metadata View (Bridging v1 and v2 region keys)
CREATE OR REPLACE VIEW v_unified_regions AS
SELECT 
    r.region_psgc,
    r.region_code AS region_code_v1,
    m.region_code_v2,
    r.region_name,
    r.centroid_lat,
    r.centroid_lon,
    r.population_2020
FROM ref_regions r
JOIN ref_region_mappings m ON r.region_psgc = m.region_psgc;

-- 2. IPPU Traceability View (Bridging derived outputs with upstream EMB activity records)
CREATE OR REPLACE VIEW v_emb_ippu_provenance AS
SELECT 
    out.record_id AS derived_record_id,
    out.year,
    out.region_code,
    out.region_name,
    out.estimated_tco2e,
    out.derived_from,
    out.method_note,
    out.data_status,
    COALESCE(pod.pod_count, 0) AS pod_records_count,
    COALESCE(pod.pod_tco2e, 0) AS pod_tco2e_sum,
    COALESCE(fg.fg_records_count, 0) AS fgas_records_count,
    COALESCE(fg.fg_tco2e, 0) AS fgas_tco2e_sum,
    COALESCE(ip.ip_records_count, 0) AS process_records_count,
    COALESCE(ip.ip_tco2e, 0) AS process_tco2e_sum
FROM emb_ghg_inventory_output out
LEFT JOIN (
    SELECT year, region_code, COUNT(*) AS pod_count, SUM(tco2e_proxy) AS pod_tco2e
    FROM emb_pod_hfc_activity
    GROUP BY year, region_code
) pod ON out.year = pod.year AND out.region_code = pod.region_code
LEFT JOIN (
    SELECT year, region_code, COUNT(*) AS fg_records_count, SUM(tco2e_proxy) AS fg_tco2e
    FROM emb_eqmd_fgas_activity
    GROUP BY year, region_code
) fg ON out.year = fg.year AND out.region_code = fg.region_code
LEFT JOIN (
    SELECT year, region_code, COUNT(*) AS ip_records_count, SUM(estimated_emissions) AS ip_tco2e
    FROM emb_industrial_process_activity
    GROUP BY year, region_code
) ip ON out.year = ip.year AND out.region_code = ip.region_code;

-- 3. MGB Mining Energy & Proxy Emissions Reconciliation View
CREATE OR REPLACE VIEW v_mgb_mining_emissions_reconciliation AS
SELECT 
    e.facility_id,
    m.operator,
    e.region_code,
    e.region_name,
    e.year,
    e.quarter,
    e.commodity,
    e.diesel_l,
    e.gasoline_l,
    e.coal_t,
    e.purchased_electricity_kwh,
    p.scope1_proxy_tco2e,
    p.method AS proxy_calculation_method,
    p.data_status AS proxy_data_status
FROM mgb_energy_consumption_29_18 e
JOIN mgb_operating_mines_quarries m ON e.facility_id = m.facility_id
JOIN mgb_energy_emissions_proxy p ON e.record_id = p.record_id;

-- 4. Facility Master Profile View (360-degree drilldown per facility)
CREATE OR REPLACE VIEW v_mgb_facility_annual_profile AS
SELECT 
    f.facility_id,
    f.operator,
    f.region_code,
    f.region_name,
    f.commodity,
    f.permit_type,
    f.permit_no,
    f.operating_status,
    p.year,
    p.production_volume,
    p.unit AS production_unit,
    p.production_value_php,
    COALESCE(l.raw_material_moved_t, 0) AS raw_material_moved_t,
    COALESCE(l.disturbed_area_ha, 0) AS disturbed_area_ha,
    COALESCE(l.rehabilitated_area_ha, 0) AS rehabilitated_area_ha,
    COALESCE(rr.resource_or_reserve, 0) AS resource_reserve_tonnage,
    rr.classification AS reserve_classification,
    COALESCE(eq.annual_diesel_l, 0) AS annual_diesel_l,
    COALESCE(eq.annual_coal_t, 0) AS annual_coal_t,
    COALESCE(eq.annual_electricity_kwh, 0) AS annual_electricity_kwh,
    COALESCE(eq.annual_scope1_tco2e, 0) AS annual_scope1_proxy_tco2e
FROM mgb_operating_mines_quarries f
JOIN mgb_mineral_production p ON f.facility_id = p.facility_id
LEFT JOIN mgb_integrated_annual_landuse l ON f.facility_id = l.facility_id AND p.year = l.year
LEFT JOIN mgb_resource_reserve_29_19 rr ON f.facility_id = rr.facility_id AND p.year = rr.year
LEFT JOIN (
    SELECT 
        e.facility_id,
        e.year,
        SUM(e.diesel_l) AS annual_diesel_l,
        SUM(e.coal_t) AS annual_coal_t,
        SUM(e.purchased_electricity_kwh) AS annual_electricity_kwh,
        SUM(p.scope1_proxy_tco2e) AS annual_scope1_tco2e
    FROM mgb_energy_consumption_29_18 e
    JOIN mgb_energy_emissions_proxy p ON e.record_id = p.record_id
    GROUP BY e.facility_id, e.year
) eq ON f.facility_id = eq.facility_id AND p.year = eq.year;

-- 5. Standard Traceability Helper Function
CREATE OR REPLACE FUNCTION get_metric_traceability(
    p_metric_id VARCHAR,
    p_region VARCHAR,
    p_year INT
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_result JSONB;
BEGIN
    IF p_metric_id = 'EMB_IPPU_TOTAL' THEN
        SELECT jsonb_build_object(
            'metric_id', p_metric_id,
            'reporting_period', p_year::TEXT,
            'geography', jsonb_build_object('region_code', p_region),
            'value', COALESCE(SUM(estimated_tco2e), 0),
            'unit', 'tCO2e proxy',
            'source_dataset_ids', jsonb_build_array('emb_pod_hfc_activity', 'emb_eqmd_fgas_activity', 'emb_industrial_process_activity'),
            'source_record_count', (
                SELECT COUNT(*) FROM emb_pod_hfc_activity WHERE year = p_year AND region_code = p_region
            ) + (
                SELECT COUNT(*) FROM emb_eqmd_fgas_activity WHERE year = p_year AND region_code = p_region
            ) + (
                SELECT COUNT(*) FROM emb_industrial_process_activity WHERE year = p_year AND region_code = p_region
            ),
            'method_note', 'Aggregated synthetic IPPU calculation (POD HFCs + EQMD F-gases + Industrial Process)',
            'qa_status', 'SYNTHETIC_VERIFIED',
            'data_status', 'SYNTHETIC_DEMO_DATA'
        ) INTO v_result
        FROM emb_ghg_inventory_output
        WHERE year = p_year AND region_code = p_region;

    ELSIF p_metric_id = 'MGB_MINING_SCOPE1' THEN
        SELECT jsonb_build_object(
            'metric_id', p_metric_id,
            'reporting_period', p_year::TEXT,
            'geography', jsonb_build_object('region_code', p_region),
            'value', COALESCE(SUM(scope1_proxy_tco2e), 0),
            'unit', 'tCO2e proxy',
            'source_dataset_ids', jsonb_build_array('mgb_energy_consumption_29_18'),
            'source_record_count', COUNT(*),
            'method_note', 'Scope 1 fuel proxy: Diesel + Gasoline + Coal combustion factors per Form 29-18',
            'qa_status', 'SELF_REPORTED_QUARTERLY',
            'data_status', 'SYNTHETIC_DEMO_DATA'
        ) INTO v_result
        FROM mgb_energy_emissions_proxy
        WHERE year = p_year AND region_code = p_region;
    ELSE
        v_result := jsonb_build_object('error', 'Unknown metric_id');
    END IF;

    RETURN v_result;
END;
$$;
