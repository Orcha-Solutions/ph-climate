import json
import os
from decimal import Decimal

JSON_DIR = r'c:\repos\ph-climate\data\json'
INIT_DIR = r'c:\repos\ph-climate\database\init'
os.makedirs(INIT_DIR, exist_ok=True)

def load_json(name):
    path = os.path.join(JSON_DIR, f'{name}.json')
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

def sql_quote(val):
    if val is None or val == '':
        return 'NULL'
    if isinstance(val, (int, float, Decimal)):
        return str(val)
    val_str = str(val).replace("'", "''")
    return f"'{val_str}'"

def build_insert_statements(table_name, records, batch_size=50):
    if not records:
        return ''
    cols = list(records[0].keys())
    col_str = ', '.join([f'"{c}"' for c in cols])
    
    statements = []
    for i in range(0, len(records), batch_size):
        batch = records[i:i + batch_size]
        val_rows = []
        for r in batch:
            vals = [sql_quote(r.get(c)) for c in cols]
            val_rows.append(f"  ({', '.join(vals)})")
        stmt = f'INSERT INTO "{table_name}" ({col_str}) VALUES\n' + ',\n'.join(val_rows) + ';\n'
        statements.append(stmt)
    return '\n'.join(statements)

# -------------------------------------------------------------
# 1. Generate 01_schema.sql
# -------------------------------------------------------------
schema_sql = """-- ============================================================================
-- Philippine Climate Data Portal PoC — Database Schema (PostgreSQL)
-- Specification: Developer Handoff v2.0 (DENR-EMB + DENR-MGB Source Expansion)
-- ALL EMB/MGB AND PROXY DATA ARE SYNTHETIC DEMONSTRATION RECORDS
-- ============================================================================

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

-- ============================================================================
-- 1. REFERENCE & METADATA TABLES
-- ============================================================================

DROP TABLE IF EXISTS "ref_region_mappings" CASCADE;
DROP TABLE IF EXISTS "ref_regions" CASCADE;
DROP TABLE IF EXISTS "data_catalog" CASCADE;
DROP TABLE IF EXISTS "source_to_poc_crosswalk" CASCADE;
DROP TABLE IF EXISTS "source_data_catalog" CASCADE;

CREATE TABLE "ref_regions" (
    "region_psgc" VARCHAR(20) PRIMARY KEY,
    "region_code" VARCHAR(10) NOT NULL UNIQUE,
    "region_name" VARCHAR(100) NOT NULL,
    "centroid_lat" NUMERIC(9, 6) NOT NULL,
    "centroid_lon" NUMERIC(9, 6) NOT NULL,
    "population_2020" INTEGER NOT NULL
);
COMMENT ON TABLE "ref_regions" IS 'Philippine administrative regions with 2020 Census populations and centroids';

CREATE TABLE "ref_region_mappings" (
    "region_code_v1" VARCHAR(10) NOT NULL,
    "region_code_v2" VARCHAR(10) NOT NULL,
    "region_psgc" VARCHAR(20) NOT NULL REFERENCES "ref_regions"("region_psgc"),
    "region_name" VARCHAR(100) NOT NULL,
    PRIMARY KEY ("region_code_v1", "region_code_v2")
);
COMMENT ON TABLE "ref_region_mappings" IS 'Bidirectional region code crosswalk between v1 Roman numerals (e.g. IV-A) and v2 prefixed codes (e.g. R04A)';

CREATE TABLE "data_catalog" (
    "dataset_id" VARCHAR(50) PRIMARY KEY,
    "title" VARCHAR(100) NOT NULL,
    "domain" VARCHAR(50) NOT NULL,
    "records" INTEGER NOT NULL,
    "spatial_granularity" VARCHAR(50) NOT NULL,
    "temporal_granularity" VARCHAR(50) NOT NULL,
    "authoritative_owner_candidate" VARCHAR(150) NOT NULL,
    "poc_status" VARCHAR(100) NOT NULL,
    "file" VARCHAR(100) NOT NULL
);

CREATE TABLE "source_to_poc_crosswalk" (
    "id" SERIAL PRIMARY KEY,
    "agency" VARCHAR(20) NOT NULL,
    "source_unit" VARCHAR(100) NOT NULL,
    "source_dataset" VARCHAR(150) NOT NULL,
    "synthetic_table" VARCHAR(60) NOT NULL,
    "record_count" INTEGER NOT NULL,
    "key_fields" TEXT NOT NULL,
    "transformation" TEXT NOT NULL,
    "dashboard_use" TEXT NOT NULL
);

CREATE TABLE "source_data_catalog" (
    "dataset_id" VARCHAR(60) PRIMARY KEY,
    "agency" VARCHAR(20) NOT NULL,
    "source_unit" VARCHAR(100) NOT NULL,
    "dataset_title" VARCHAR(150) NOT NULL,
    "records" INTEGER NOT NULL,
    "coverage" VARCHAR(100) NOT NULL,
    "geography" VARCHAR(100) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "portal_use" TEXT NOT NULL
);

-- ============================================================================
-- 2. V1 FOUNDATION TABLES
-- ============================================================================

DROP TABLE IF EXISTS "adaptation_projects" CASCADE;
DROP TABLE IF EXISTS "climate_finance_ccet" CASCADE;
DROP TABLE IF EXISTS "climate_risk_region" CASCADE;
DROP TABLE IF EXISTS "climate_stations" CASCADE;
DROP TABLE IF EXISTS "ecosystem_indicators" CASCADE;
DROP TABLE IF EXISTS "ghg_inventory_region_sector" CASCADE;
DROP TABLE IF EXISTS "ndc_pams" CASCADE;

CREATE TABLE "adaptation_projects" (
    "project_id" VARCHAR(20) PRIMARY KEY,
    "project_name" VARCHAR(150) NOT NULL,
    "region_psgc" VARCHAR(20) NOT NULL REFERENCES "ref_regions"("region_psgc"),
    "region_code" VARCHAR(10) NOT NULL,
    "lead_agency" VARCHAR(50) NOT NULL,
    "adaptation_theme" VARCHAR(50) NOT NULL,
    "start_year" INTEGER NOT NULL,
    "end_year" INTEGER NOT NULL,
    "budget_php_m" NUMERIC(12, 2) NOT NULL,
    "physical_progress_pct" NUMERIC(5, 2) NOT NULL,
    "beneficiaries_est" INTEGER NOT NULL,
    "status" VARCHAR(30) NOT NULL,
    "data_status" VARCHAR(30) NOT NULL DEFAULT 'SYNTHETIC'
);

CREATE TABLE "climate_finance_ccet" (
    "id" SERIAL PRIMARY KEY,
    "fiscal_year" INTEGER NOT NULL,
    "region_psgc" VARCHAR(20) NOT NULL REFERENCES "ref_regions"("region_psgc"),
    "region_code" VARCHAR(10) NOT NULL,
    "nccap_theme" VARCHAR(100) NOT NULL,
    "tagged_budget_php_m" NUMERIC(12, 2) NOT NULL,
    "adaptation_share_pct" NUMERIC(5, 2) NOT NULL,
    "source_system" VARCHAR(100) NOT NULL,
    "data_status" VARCHAR(30) NOT NULL DEFAULT 'SYNTHETIC'
);

CREATE TABLE "climate_risk_region" (
    "id" SERIAL PRIMARY KEY,
    "year" INTEGER NOT NULL,
    "region_psgc" VARCHAR(20) NOT NULL REFERENCES "ref_regions"("region_psgc"),
    "region_code" VARCHAR(10) NOT NULL,
    "mean_temp_anomaly_c" NUMERIC(5, 2) NOT NULL,
    "rainfall_anomaly_pct" NUMERIC(6, 2) NOT NULL,
    "flood_risk_index" NUMERIC(5, 2) NOT NULL,
    "drought_risk_index" NUMERIC(5, 2) NOT NULL,
    "landslide_risk_index" NUMERIC(5, 2) NOT NULL,
    "cyclone_exposure_index" NUMERIC(5, 2) NOT NULL,
    "composite_climate_risk_index" NUMERIC(5, 2) NOT NULL,
    "data_status" VARCHAR(30) NOT NULL DEFAULT 'SYNTHETIC'
);

CREATE TABLE "climate_stations" (
    "station_id" VARCHAR(20) PRIMARY KEY,
    "station_name" VARCHAR(100) NOT NULL,
    "region_psgc" VARCHAR(20) NOT NULL REFERENCES "ref_regions"("region_psgc"),
    "region_code" VARCHAR(10) NOT NULL,
    "latitude" NUMERIC(9, 6) NOT NULL,
    "longitude" NUMERIC(9, 6) NOT NULL,
    "station_type" VARCHAR(50) NOT NULL,
    "latest_obs_date" DATE NOT NULL,
    "completeness_30d_pct" NUMERIC(5, 2) NOT NULL,
    "data_status" VARCHAR(30) NOT NULL DEFAULT 'SYNTHETIC'
);

CREATE TABLE "ecosystem_indicators" (
    "id" SERIAL PRIMARY KEY,
    "year" INTEGER NOT NULL,
    "region_psgc" VARCHAR(20) NOT NULL REFERENCES "ref_regions"("region_psgc"),
    "region_code" VARCHAR(10) NOT NULL,
    "forest_cover_pct_land_area" NUMERIC(5, 2) NOT NULL,
    "mangrove_area_kha" NUMERIC(6, 2) NOT NULL,
    "protected_area_pct_land_area" NUMERIC(5, 2) NOT NULL,
    "watershed_condition_index" NUMERIC(5, 2) NOT NULL,
    "data_status" VARCHAR(30) NOT NULL DEFAULT 'SYNTHETIC'
);

CREATE TABLE "ghg_inventory_region_sector" (
    "id" SERIAL PRIMARY KEY,
    "year" INTEGER NOT NULL,
    "region_psgc" VARCHAR(20) NOT NULL REFERENCES "ref_regions"("region_psgc"),
    "region_code" VARCHAR(10) NOT NULL,
    "sector" VARCHAR(50) NOT NULL,
    "emissions_mtco2e" NUMERIC(10, 4) NOT NULL,
    "data_status" VARCHAR(30) NOT NULL DEFAULT 'SYNTHETIC',
    "method" TEXT NOT NULL
);

CREATE TABLE "ndc_pams" (
    "pam_id" VARCHAR(20) PRIMARY KEY,
    "sector" VARCHAR(50) NOT NULL,
    "policy_action" VARCHAR(150) NOT NULL,
    "action_type" VARCHAR(50) NOT NULL,
    "lead_agency" VARCHAR(50) NOT NULL,
    "period" VARCHAR(30) NOT NULL,
    "target_value" NUMERIC(10, 2) NOT NULL,
    "target_unit" VARCHAR(100) NOT NULL,
    "latest_progress" NUMERIC(10, 2) NOT NULL,
    "progress_pct" NUMERIC(5, 2) NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "data_status" VARCHAR(30) NOT NULL DEFAULT 'SYNTHETIC'
);

-- ============================================================================
-- 3. EMB SOURCE DOMAIN TABLES
-- ============================================================================

DROP TABLE IF EXISTS "emb_pod_hfc_activity" CASCADE;
DROP TABLE IF EXISTS "emb_eqmd_fgas_activity" CASCADE;
DROP TABLE IF EXISTS "emb_industrial_process_activity" CASCADE;
DROP TABLE IF EXISTS "emb_cement_scm_activity" CASCADE;
DROP TABLE IF EXISTS "emb_ods_recovery_destruction" CASCADE;
DROP TABLE IF EXISTS "emb_aqms_facility_emissions" CASCADE;
DROP TABLE IF EXISTS "emb_regional_facility_verification" CASCADE;
DROP TABLE IF EXISTS "emb_eia_ecc_ghg_monitoring" CASCADE;
DROP TABLE IF EXISTS "emb_ghg_inventory_output" CASCADE;

CREATE TABLE "emb_pod_hfc_activity" (
    "record_id" VARCHAR(30) PRIMARY KEY,
    "year" INTEGER NOT NULL,
    "region_code" VARCHAR(10) NOT NULL,
    "region_name" VARCHAR(100) NOT NULL,
    "substance" VARCHAR(50) NOT NULL,
    "activity_type" VARCHAR(100) NOT NULL,
    "quantity" NUMERIC(12, 2) NOT NULL,
    "unit" VARCHAR(30) NOT NULL,
    "gwp_ar4" INTEGER NOT NULL,
    "tco2e_proxy" NUMERIC(14, 2) NOT NULL,
    "source_office" VARCHAR(100) NOT NULL,
    "reporting_entity" VARCHAR(100) NOT NULL,
    "data_status" VARCHAR(30) NOT NULL DEFAULT 'SYNTHETIC_DEMO',
    "ipcc_category" VARCHAR(20) NOT NULL DEFAULT '2.F'
);
COMMENT ON TABLE "emb_pod_hfc_activity" IS 'Synthetic import and placing on market of HFCs from Philippine Ozone Desk (IPCC 2.F)';

CREATE TABLE "emb_eqmd_fgas_activity" (
    "record_id" VARCHAR(30) PRIMARY KEY,
    "year" INTEGER NOT NULL,
    "region_code" VARCHAR(10) NOT NULL,
    "region_name" VARCHAR(100) NOT NULL,
    "gas" VARCHAR(20) NOT NULL,
    "gas_family" VARCHAR(20) NOT NULL,
    "quantity" NUMERIC(12, 2) NOT NULL,
    "unit" VARCHAR(20) NOT NULL,
    "gwp_ar4" INTEGER NOT NULL,
    "tco2e_proxy" NUMERIC(14, 2) NOT NULL,
    "application" VARCHAR(100) NOT NULL,
    "source_office" VARCHAR(100) NOT NULL,
    "data_status" VARCHAR(30) NOT NULL DEFAULT 'SYNTHETIC_DEMO',
    "ipcc_category" VARCHAR(20) NOT NULL DEFAULT '2.E/2.G'
);
COMMENT ON TABLE "emb_eqmd_fgas_activity" IS 'Synthetic fluorinated gas usage (PFC, SF6, NF3) by EQMD / industrial activity';

CREATE TABLE "emb_industrial_process_activity" (
    "record_id" VARCHAR(30) PRIMARY KEY,
    "year" INTEGER NOT NULL,
    "region_code" VARCHAR(10) NOT NULL,
    "region_name" VARCHAR(100) NOT NULL,
    "facility" VARCHAR(100) NOT NULL,
    "process" VARCHAR(100) NOT NULL,
    "ipcc_category" VARCHAR(20) NOT NULL,
    "activity_value" NUMERIC(14, 2) NOT NULL,
    "activity_unit" VARCHAR(50) NOT NULL,
    "demo_emission_factor" NUMERIC(8, 4) NOT NULL,
    "estimated_emissions" NUMERIC(14, 2) NOT NULL,
    "emission_unit" VARCHAR(30) NOT NULL,
    "source_office" VARCHAR(100) NOT NULL,
    "data_status" VARCHAR(30) NOT NULL DEFAULT 'SYNTHETIC_DEMO'
);
COMMENT ON TABLE "emb_industrial_process_activity" IS 'Synthetic mineral and metal industrial process activity with demo emission factors';

CREATE TABLE "emb_cement_scm_activity" (
    "record_id" VARCHAR(30) PRIMARY KEY,
    "year" INTEGER NOT NULL,
    "region_code" VARCHAR(10) NOT NULL,
    "region_name" VARCHAR(100) NOT NULL,
    "facility" VARCHAR(100) NOT NULL,
    "cement_output_t" NUMERIC(14, 2) NOT NULL,
    "clinker_ratio" NUMERIC(6, 4) NOT NULL,
    "scm_type" VARCHAR(100) NOT NULL,
    "scm_use_t" NUMERIC(14, 2) NOT NULL,
    "estimated_clinker_t" NUMERIC(14, 2) NOT NULL,
    "source_office" VARCHAR(100) NOT NULL,
    "data_status" VARCHAR(30) NOT NULL DEFAULT 'SYNTHETIC_DEMO',
    "ipcc_category" VARCHAR(20) NOT NULL DEFAULT '2.A.1'
);
COMMENT ON TABLE "emb_cement_scm_activity" IS 'Synthetic cement facility activity, supplementary cementitious materials, and clinker ratios';

CREATE TABLE "emb_ods_recovery_destruction" (
    "record_id" VARCHAR(30) PRIMARY KEY,
    "year" INTEGER NOT NULL,
    "region_code" VARCHAR(10) NOT NULL,
    "region_name" VARCHAR(100) NOT NULL,
    "substance" VARCHAR(50) NOT NULL,
    "management_action" VARCHAR(50) NOT NULL,
    "quantity_kg" NUMERIC(12, 2) NOT NULL,
    "unit" VARCHAR(20) NOT NULL,
    "facility" VARCHAR(100) NOT NULL,
    "source_office" VARCHAR(100) NOT NULL,
    "data_status" VARCHAR(30) NOT NULL DEFAULT 'SYNTHETIC_DEMO'
);
COMMENT ON TABLE "emb_ods_recovery_destruction" IS 'Synthetic refrigerant recovery, storage, reclamation and destruction records';

CREATE TABLE "emb_aqms_facility_emissions" (
    "record_id" VARCHAR(30) PRIMARY KEY,
    "year" INTEGER NOT NULL,
    "region_code" VARCHAR(10) NOT NULL,
    "region_name" VARCHAR(100) NOT NULL,
    "facility" VARCHAR(100) NOT NULL,
    "fuel_or_source" VARCHAR(50) NOT NULL,
    "activity_value" NUMERIC(14, 2) NOT NULL,
    "activity_unit" VARCHAR(50) NOT NULL,
    "co2_t" NUMERIC(14, 2) NOT NULL,
    "ch4_t" NUMERIC(10, 4) NOT NULL,
    "n2o_t" NUMERIC(10, 4) NOT NULL,
    "source_office" VARCHAR(100) NOT NULL,
    "data_status" VARCHAR(30) NOT NULL DEFAULT 'SYNTHETIC_DEMO'
);
COMMENT ON TABLE "emb_aqms_facility_emissions" IS 'Synthetic stationary source emissions reported to AQMS / Regional Offices';

CREATE TABLE "emb_regional_facility_verification" (
    "record_id" VARCHAR(30) PRIMARY KEY,
    "year" INTEGER NOT NULL,
    "region_code" VARCHAR(10) NOT NULL,
    "region_name" VARCHAR(100) NOT NULL,
    "facility" VARCHAR(100) NOT NULL,
    "baseline_tco2e" NUMERIC(14, 2) NOT NULL,
    "reported_reduction_tco2e" NUMERIC(14, 2) NOT NULL,
    "net_tco2e" NUMERIC(14, 2) NOT NULL,
    "verification_status" VARCHAR(50) NOT NULL,
    "source_office" VARCHAR(100) NOT NULL,
    "data_status" VARCHAR(30) NOT NULL DEFAULT 'SYNTHETIC_DEMO'
);
COMMENT ON TABLE "emb_regional_facility_verification" IS 'Synthetic MRV and regional QA/QC verification tracking records';

CREATE TABLE "emb_eia_ecc_ghg_monitoring" (
    "record_id" VARCHAR(30) PRIMARY KEY,
    "year" INTEGER NOT NULL,
    "region_code" VARCHAR(10) NOT NULL,
    "region_name" VARCHAR(100) NOT NULL,
    "project" VARCHAR(100) NOT NULL,
    "sector" VARCHAR(50) NOT NULL,
    "ecc_reference" VARCHAR(50) NOT NULL,
    "estimated_annual_tco2e" NUMERIC(14, 2) NOT NULL,
    "ghg_mitigation_commitment" VARCHAR(100) NOT NULL,
    "cmr_status" VARCHAR(50) NOT NULL,
    "source_office" VARCHAR(100) NOT NULL,
    "data_status" VARCHAR(30) NOT NULL DEFAULT 'SYNTHETIC_DEMO'
);
COMMENT ON TABLE "emb_eia_ecc_ghg_monitoring" IS 'Synthetic ECC projects linking commitments with Compliance Monitoring Reports';

CREATE TABLE "emb_ghg_inventory_output" (
    "record_id" VARCHAR(30) PRIMARY KEY,
    "year" INTEGER NOT NULL,
    "region_code" VARCHAR(10) NOT NULL,
    "region_name" VARCHAR(100) NOT NULL,
    "sector" VARCHAR(50) NOT NULL,
    "estimated_tco2e" NUMERIC(14, 2) NOT NULL,
    "unit" VARCHAR(30) NOT NULL,
    "derived_from" TEXT NOT NULL,
    "method_note" TEXT NOT NULL,
    "source_office" VARCHAR(100) NOT NULL,
    "data_status" VARCHAR(30) NOT NULL DEFAULT 'SYNTHETIC_DERIVED'
);
COMMENT ON TABLE "emb_ghg_inventory_output" IS 'Derived orchestration output consolidating EMB POD HFC, EQMD F-Gas, and process streams';

-- ============================================================================
-- 4. MGB SOURCE DOMAIN TABLES
-- ============================================================================

DROP TABLE IF EXISTS "mgb_operating_mines_quarries" CASCADE;
DROP TABLE IF EXISTS "mgb_mineral_production" CASCADE;
DROP TABLE IF EXISTS "mgb_energy_consumption_29_18" CASCADE;
DROP TABLE IF EXISTS "mgb_resource_reserve_29_19" CASCADE;
DROP TABLE IF EXISTS "mgb_integrated_annual_landuse" CASCADE;
DROP TABLE IF EXISTS "mgb_energy_emissions_proxy" CASCADE;

CREATE TABLE "mgb_operating_mines_quarries" (
    "facility_id" VARCHAR(30) PRIMARY KEY,
    "operator" VARCHAR(100) NOT NULL,
    "region_code" VARCHAR(10) NOT NULL,
    "region_name" VARCHAR(100) NOT NULL,
    "commodity" VARCHAR(50) NOT NULL,
    "permit_type" VARCHAR(50) NOT NULL,
    "permit_no" VARCHAR(50) NOT NULL,
    "operating_status" VARCHAR(50) NOT NULL,
    "source_dataset" VARCHAR(100) NOT NULL,
    "data_status" VARCHAR(30) NOT NULL DEFAULT 'SYNTHETIC_DEMO'
);
COMMENT ON TABLE "mgb_operating_mines_quarries" IS 'Master registry of 36 synthetic operating mines, quarries, and permit holders';

CREATE TABLE "mgb_mineral_production" (
    "record_id" VARCHAR(30) PRIMARY KEY,
    "year" INTEGER NOT NULL,
    "facility_id" VARCHAR(30) NOT NULL REFERENCES "mgb_operating_mines_quarries"("facility_id"),
    "operator" VARCHAR(100) NOT NULL,
    "region_code" VARCHAR(10) NOT NULL,
    "region_name" VARCHAR(100) NOT NULL,
    "commodity" VARCHAR(50) NOT NULL,
    "production_volume" NUMERIC(14, 2) NOT NULL,
    "unit" VARCHAR(30) NOT NULL,
    "production_value_php" NUMERIC(16, 2) NOT NULL,
    "report_basis" VARCHAR(100) NOT NULL,
    "source_office" VARCHAR(100) NOT NULL,
    "data_status" VARCHAR(30) NOT NULL DEFAULT 'SYNTHETIC_DEMO'
);
COMMENT ON TABLE "mgb_mineral_production" IS 'Synthetic annual mineral production volumes and gross values by operator';

CREATE TABLE "mgb_energy_consumption_29_18" (
    "record_id" VARCHAR(30) PRIMARY KEY,
    "year" INTEGER NOT NULL,
    "quarter" INTEGER NOT NULL CHECK ("quarter" BETWEEN 1 AND 4),
    "facility_id" VARCHAR(30) NOT NULL REFERENCES "mgb_operating_mines_quarries"("facility_id"),
    "operator" VARCHAR(100) NOT NULL,
    "region_code" VARCHAR(10) NOT NULL,
    "region_name" VARCHAR(100) NOT NULL,
    "commodity" VARCHAR(50) NOT NULL,
    "diesel_l" NUMERIC(14, 2) NOT NULL,
    "gasoline_l" NUMERIC(14, 2) NOT NULL,
    "coal_t" NUMERIC(14, 2) NOT NULL,
    "purchased_electricity_kwh" NUMERIC(16, 2) NOT NULL,
    "report_basis" VARCHAR(100) NOT NULL,
    "source_office" VARCHAR(100) NOT NULL,
    "data_status" VARCHAR(30) NOT NULL DEFAULT 'SYNTHETIC_DEMO'
);
COMMENT ON TABLE "mgb_energy_consumption_29_18" IS 'Synthetic quarterly energy consumption from MGB Form 29-18';

CREATE TABLE "mgb_resource_reserve_29_19" (
    "record_id" VARCHAR(30) PRIMARY KEY,
    "year" INTEGER NOT NULL,
    "facility_id" VARCHAR(30) NOT NULL REFERENCES "mgb_operating_mines_quarries"("facility_id"),
    "operator" VARCHAR(100) NOT NULL,
    "region_code" VARCHAR(10) NOT NULL,
    "region_name" VARCHAR(100) NOT NULL,
    "commodity" VARCHAR(50) NOT NULL,
    "resource_or_reserve" NUMERIC(12, 2) NOT NULL,
    "unit" VARCHAR(50) NOT NULL,
    "classification" VARCHAR(50) NOT NULL,
    "report_basis" VARCHAR(100) NOT NULL,
    "source_office" VARCHAR(100) NOT NULL,
    "data_status" VARCHAR(30) NOT NULL DEFAULT 'SYNTHETIC_DEMO'
);
COMMENT ON TABLE "mgb_resource_reserve_29_19" IS 'Synthetic resource and reserve inventory from MGB Form 29-19';

CREATE TABLE "mgb_integrated_annual_landuse" (
    "record_id" VARCHAR(30) PRIMARY KEY,
    "year" INTEGER NOT NULL,
    "facility_id" VARCHAR(30) NOT NULL REFERENCES "mgb_operating_mines_quarries"("facility_id"),
    "operator" VARCHAR(100) NOT NULL,
    "region_code" VARCHAR(10) NOT NULL,
    "region_name" VARCHAR(100) NOT NULL,
    "commodity" VARCHAR(50) NOT NULL,
    "raw_material_moved_t" NUMERIC(14, 2) NOT NULL,
    "disturbed_area_ha" NUMERIC(10, 2) NOT NULL,
    "rehabilitated_area_ha" NUMERIC(10, 2) NOT NULL,
    "report_basis" VARCHAR(100) NOT NULL,
    "source_office" VARCHAR(100) NOT NULL,
    "data_status" VARCHAR(30) NOT NULL DEFAULT 'SYNTHETIC_DEMO'
);
COMMENT ON TABLE "mgb_integrated_annual_landuse" IS 'Synthetic Integrated Annual Report (IAR) disturbed and rehabilitated land-use footprint';

CREATE TABLE "mgb_energy_emissions_proxy" (
    "record_id" VARCHAR(30) PRIMARY KEY REFERENCES "mgb_energy_consumption_29_18"("record_id"),
    "year" INTEGER NOT NULL,
    "quarter" INTEGER NOT NULL CHECK ("quarter" BETWEEN 1 AND 4),
    "facility_id" VARCHAR(30) NOT NULL REFERENCES "mgb_operating_mines_quarries"("facility_id"),
    "region_code" VARCHAR(10) NOT NULL,
    "region_name" VARCHAR(100) NOT NULL,
    "scope1_proxy_tco2e" NUMERIC(14, 2) NOT NULL,
    "method" TEXT NOT NULL,
    "data_status" VARCHAR(30) NOT NULL DEFAULT 'SYNTHETIC_DERIVED'
);
COMMENT ON TABLE "mgb_energy_emissions_proxy" IS 'Derived quarterly Scope-1 fuel combustion GHG proxy from Form 29-18';

-- ============================================================================
-- 5. PERFORMANCE INDEXES
-- ============================================================================

CREATE INDEX idx_ref_regions_code ON "ref_regions"("region_code");
CREATE INDEX idx_ap_region ON "adaptation_projects"("region_code", "start_year");
CREATE INDEX idx_ccet_year_region ON "climate_finance_ccet"("fiscal_year", "region_code");
CREATE INDEX idx_risk_year_region ON "climate_risk_region"("year", "region_code");
CREATE INDEX idx_ghgi_year_region_sector ON "ghg_inventory_region_sector"("year", "region_code", "sector");

CREATE INDEX idx_emb_pod_year_region ON "emb_pod_hfc_activity"("year", "region_code");
CREATE INDEX idx_emb_eqmd_year_region ON "emb_eqmd_fgas_activity"("year", "region_code");
CREATE INDEX idx_emb_proc_year_region ON "emb_industrial_process_activity"("year", "region_code");
CREATE INDEX idx_emb_scm_year_region ON "emb_cement_scm_activity"("year", "region_code");
CREATE INDEX idx_emb_ods_year_region ON "emb_ods_recovery_destruction"("year", "region_code");
CREATE INDEX idx_emb_aqms_year_region ON "emb_aqms_facility_emissions"("year", "region_code");
CREATE INDEX idx_emb_verif_year_region ON "emb_regional_facility_verification"("year", "region_code");
CREATE INDEX idx_emb_eia_year_region ON "emb_eia_ecc_ghg_monitoring"("year", "region_code");
CREATE INDEX idx_emb_out_year_region ON "emb_ghg_inventory_output"("year", "region_code");

CREATE INDEX idx_mgb_ops_region ON "mgb_operating_mines_quarries"("region_code", "commodity");
CREATE INDEX idx_mgb_prod_fac_year ON "mgb_mineral_production"("facility_id", "year");
CREATE INDEX idx_mgb_energy_fac_year_qtr ON "mgb_energy_consumption_29_18"("facility_id", "year", "quarter");
CREATE INDEX idx_mgb_res_fac_year ON "mgb_resource_reserve_29_19"("facility_id", "year");
CREATE INDEX idx_mgb_land_fac_year ON "mgb_integrated_annual_landuse"("facility_id", "year");
CREATE INDEX idx_mgb_proxy_fac_year_qtr ON "mgb_energy_emissions_proxy"("facility_id", "year", "quarter");
"""

with open(os.path.join(INIT_DIR, '01_schema.sql'), 'w', encoding='utf-8') as f:
    f.write(schema_sql)
print("Created 01_schema.sql")

# -------------------------------------------------------------
# 2. Generate 02_seed_metadata.sql
# -------------------------------------------------------------
ref_regions_data = load_json('ref_regions')
data_catalog_data = load_json('data_catalog')
crosswalk_data = load_json('source_to_poc_crosswalk')
source_cat_data = load_json('source_data_catalog')

region_mappings_data = [
    {"region_code_v1": "NCR", "region_code_v2": "NCR", "region_psgc": "PH130000000", "region_name": "National Capital Region"},
    {"region_code_v1": "CAR", "region_code_v2": "CAR", "region_psgc": "PH140000000", "region_name": "Cordillera Administrative Region"},
    {"region_code_v1": "I", "region_code_v2": "R01", "region_psgc": "PH010000000", "region_name": "Ilocos Region"},
    {"region_code_v1": "II", "region_code_v2": "R02", "region_psgc": "PH020000000", "region_name": "Cagayan Valley"},
    {"region_code_v1": "III", "region_code_v2": "R03", "region_psgc": "PH030000000", "region_name": "Central Luzon"},
    {"region_code_v1": "IV-A", "region_code_v2": "R04A", "region_psgc": "PH040000000", "region_name": "CALABARZON"},
    {"region_code_v1": "MIMAROPA", "region_code_v2": "MIMAROPA", "region_psgc": "PH170000000", "region_name": "MIMAROPA Region"},
    {"region_code_v1": "V", "region_code_v2": "R05", "region_psgc": "PH050000000", "region_name": "Bicol Region"},
    {"region_code_v1": "VI", "region_code_v2": "R06", "region_psgc": "PH060000000", "region_name": "Western Visayas"},
    {"region_code_v1": "VII", "region_code_v2": "R07", "region_psgc": "PH070000000", "region_name": "Central Visayas"},
    {"region_code_v1": "VIII", "region_code_v2": "R08", "region_psgc": "PH080000000", "region_name": "Eastern Visayas"},
    {"region_code_v1": "IX", "region_code_v2": "R09", "region_psgc": "PH090000000", "region_name": "Zamboanga Peninsula"},
    {"region_code_v1": "X", "region_code_v2": "R10", "region_psgc": "PH100000000", "region_name": "Northern Mindanao"},
    {"region_code_v1": "XI", "region_code_v2": "R11", "region_psgc": "PH110000000", "region_name": "Davao Region"},
    {"region_code_v1": "XII", "region_code_v2": "R12", "region_psgc": "PH120000000", "region_name": "SOCCSKSARGEN"},
    {"region_code_v1": "XIII", "region_code_v2": "R13", "region_psgc": "PH160000000", "region_name": "Caraga"},
    {"region_code_v1": "BARMM", "region_code_v2": "BARMM", "region_psgc": "PH190000000", "region_name": "Bangsamoro Autonomous Region in Muslim Mindanao"}
]

seed_metadata_sql = f"""-- ============================================================================
-- Seed 02: Reference Geography & Data Catalogs
-- ============================================================================

-- ref_regions ({len(ref_regions_data)} rows)
{build_insert_statements('ref_regions', ref_regions_data)}

-- ref_region_mappings ({len(region_mappings_data)} rows)
{build_insert_statements('ref_region_mappings', region_mappings_data)}

-- data_catalog ({len(data_catalog_data)} rows)
{build_insert_statements('data_catalog', data_catalog_data)}

-- source_to_poc_crosswalk ({len(crosswalk_data)} rows)
{build_insert_statements('source_to_poc_crosswalk', crosswalk_data)}

-- source_data_catalog ({len(source_cat_data)} rows)
{build_insert_statements('source_data_catalog', source_cat_data)}
"""

with open(os.path.join(INIT_DIR, '02_seed_metadata.sql'), 'w', encoding='utf-8') as f:
    f.write(seed_metadata_sql)
print("Created 02_seed_metadata.sql")

# -------------------------------------------------------------
# 3. Generate 03_seed_v1_foundations.sql
# -------------------------------------------------------------
adaptation_data = load_json('adaptation_projects')
ccet_data = load_json('climate_finance_ccet')
risk_data = load_json('climate_risk_region')
stations_data = load_json('climate_stations')
ecosystem_data = load_json('ecosystem_indicators')
ghg_data = load_json('ghg_inventory_region_sector')
pams_data = load_json('ndc_pams')

seed_v1_sql = f"""-- ============================================================================
-- Seed 03: V1 Core Datasets
-- ============================================================================

-- adaptation_projects ({len(adaptation_data)} rows)
{build_insert_statements('adaptation_projects', adaptation_data, batch_size=30)}

-- climate_finance_ccet ({len(ccet_data)} rows)
{build_insert_statements('climate_finance_ccet', ccet_data, batch_size=70)}

-- climate_risk_region ({len(risk_data)} rows)
{build_insert_statements('climate_risk_region', risk_data, batch_size=50)}

-- climate_stations ({len(stations_data)} rows)
{build_insert_statements('climate_stations', stations_data, batch_size=40)}

-- ecosystem_indicators ({len(ecosystem_data)} rows)
{build_insert_statements('ecosystem_indicators', ecosystem_data, batch_size=20)}

-- ghg_inventory_region_sector ({len(ghg_data)} rows)
{build_insert_statements('ghg_inventory_region_sector', ghg_data, batch_size=70)}

-- ndc_pams ({len(pams_data)} rows)
{build_insert_statements('ndc_pams', pams_data, batch_size=20)}
"""

with open(os.path.join(INIT_DIR, '03_seed_v1_foundations.sql'), 'w', encoding='utf-8') as f:
    f.write(seed_v1_sql)
print("Created 03_seed_v1_foundations.sql")

# -------------------------------------------------------------
# 4. Generate 04_seed_emb.sql
# -------------------------------------------------------------
pod_data = load_json('emb_pod_hfc_activity')
eqmd_data = load_json('emb_eqmd_fgas_activity')
ind_data = load_json('emb_industrial_process_activity')
scm_data = load_json('emb_cement_scm_activity')
ods_data = load_json('emb_ods_recovery_destruction')
aqms_data = load_json('emb_aqms_facility_emissions')
verif_data = load_json('emb_regional_facility_verification')
eia_data = load_json('emb_eia_ecc_ghg_monitoring')
emb_out_data = load_json('emb_ghg_inventory_output')

seed_emb_sql = f"""-- ============================================================================
-- Seed 04: EMB Source & Derived Datasets (SYNTHETIC DEMO DATA)
-- ============================================================================

-- emb_pod_hfc_activity ({len(pod_data)} rows)
{build_insert_statements('emb_pod_hfc_activity', pod_data, batch_size=40)}

-- emb_eqmd_fgas_activity ({len(eqmd_data)} rows)
{build_insert_statements('emb_eqmd_fgas_activity', eqmd_data, batch_size=40)}

-- emb_industrial_process_activity ({len(ind_data)} rows)
{build_insert_statements('emb_industrial_process_activity', ind_data, batch_size=40)}

-- emb_cement_scm_activity ({len(scm_data)} rows)
{build_insert_statements('emb_cement_scm_activity', scm_data, batch_size=40)}

-- emb_ods_recovery_destruction ({len(ods_data)} rows)
{build_insert_statements('emb_ods_recovery_destruction', ods_data, batch_size=40)}

-- emb_aqms_facility_emissions ({len(aqms_data)} rows)
{build_insert_statements('emb_aqms_facility_emissions', aqms_data, batch_size=50)}

-- emb_regional_facility_verification ({len(verif_data)} rows)
{build_insert_statements('emb_regional_facility_verification', verif_data, batch_size=50)}

-- emb_eia_ecc_ghg_monitoring ({len(eia_data)} rows)
{build_insert_statements('emb_eia_ecc_ghg_monitoring', eia_data, batch_size=40)}

-- emb_ghg_inventory_output ({len(emb_out_data)} rows)
{build_insert_statements('emb_ghg_inventory_output', emb_out_data, batch_size=40)}
"""

with open(os.path.join(INIT_DIR, '04_seed_emb.sql'), 'w', encoding='utf-8') as f:
    f.write(seed_emb_sql)
print("Created 04_seed_emb.sql")

# -------------------------------------------------------------
# 5. Generate 05_seed_mgb.sql
# -------------------------------------------------------------
mgb_fac_data = load_json('mgb_operating_mines_quarries')
mgb_prod_data = load_json('mgb_mineral_production')
mgb_energy_data = load_json('mgb_energy_consumption_29_18')
mgb_res_data = load_json('mgb_resource_reserve_29_19')
mgb_land_data = load_json('mgb_integrated_annual_landuse')
mgb_proxy_data = load_json('mgb_energy_emissions_proxy')

seed_mgb_sql = f"""-- ============================================================================
-- Seed 05: MGB Source & Derived Datasets (SYNTHETIC DEMO DATA)
-- ============================================================================

-- mgb_operating_mines_quarries ({len(mgb_fac_data)} rows - Facility Master)
{build_insert_statements('mgb_operating_mines_quarries', mgb_fac_data, batch_size=36)}

-- mgb_mineral_production ({len(mgb_prod_data)} rows)
{build_insert_statements('mgb_mineral_production', mgb_prod_data, batch_size=50)}

-- mgb_energy_consumption_29_18 ({len(mgb_energy_data)} rows)
{build_insert_statements('mgb_energy_consumption_29_18', mgb_energy_data, batch_size=60)}

-- mgb_resource_reserve_29_19 ({len(mgb_res_data)} rows)
{build_insert_statements('mgb_resource_reserve_29_19', mgb_res_data, batch_size=50)}

-- mgb_integrated_annual_landuse ({len(mgb_land_data)} rows)
{build_insert_statements('mgb_integrated_annual_landuse', mgb_land_data, batch_size=50)}

-- mgb_energy_emissions_proxy ({len(mgb_proxy_data)} rows)
{build_insert_statements('mgb_energy_emissions_proxy', mgb_proxy_data, batch_size=60)}
"""

with open(os.path.join(INIT_DIR, '05_seed_mgb.sql'), 'w', encoding='utf-8') as f:
    f.write(seed_mgb_sql)
print("Created 05_seed_mgb.sql")

# -------------------------------------------------------------
# 6. Generate 06_views_and_functions.sql
# -------------------------------------------------------------
views_sql = """-- ============================================================================
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
"""

with open(os.path.join(INIT_DIR, '06_views_and_functions.sql'), 'w', encoding='utf-8') as f:
    f.write(views_sql)
print("Created 06_views_and_functions.sql")
print("All SQL files successfully generated.")
