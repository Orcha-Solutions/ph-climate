-- ============================================================================
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
