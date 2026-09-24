# Philippine Climate Data Portal PoC — Database Architecture

This directory houses the PostgreSQL database schema, seed datasets, and analytical views for the Philippine Climate Data Portal PoC (v2.0 Developer Handoff).

> [!WARNING]
> **SYNTHETIC DEMO DATA NOTICE**: All records introduced in the DENR-EMB and DENR-MGB domains and their derived proxies are synthetic demonstration records. They are designed for data orchestration and workflow prototyping, not official national inventory submissions.

---

## 1. Quick Start with Docker Compose

To launch the PostgreSQL database and Adminer web management tool:

```bash
# Start PostgreSQL (port 5432) and Adminer (port 8080)
docker compose up -d

# Check startup logs and seed progression
docker compose logs -f db

# Test connection using psql inside container
docker compose exec db psql -U postgres -d ph_climate_poc -c "\dt"
```

Access the database GUI via **Adminer**:
- URL: `http://localhost:8080`
- System: `PostgreSQL`
- Server: `db`
- Username: `postgres`
- Password: `postgres`
- Database: `ph_climate_poc`

---

## 2. Initialization Scripts (`database/init/`)

When PostgreSQL starts with an empty data directory, it automatically executes files in `/docker-entrypoint-initdb.d/` in alphabetical order:

1. **`01_schema.sql`**:
   - DDL definitions for Reference, v1 Core, EMB Source, MGB Source, and Derived tables.
   - Primary keys, foreign key constraints, column data types, check constraints, comments, and query performance indexes.
2. **`02_seed_metadata.sql`**:
   - `ref_regions` (17 regions with PSGC codes and centroids)
   - `ref_region_mappings` (Crosswalk between v1 Roman numerals e.g. `IV-A` and v2 codes `R04A`)
   - `data_catalog`, `source_to_poc_crosswalk`, `source_data_catalog`
3. **`03_seed_v1_foundations.sql`**:
   - `adaptation_projects` (60 records)
   - `climate_finance_ccet` (680 records)
   - `climate_risk_region` (102 records)
   - `climate_stations` (40 records)
   - `ecosystem_indicators` (17 records)
   - `ghg_inventory_region_sector` (612 records)
   - `ndc_pams` (15 records)
4. **`04_seed_emb.sql`**:
   - `emb_pod_hfc_activity` (120 records)
   - `emb_eqmd_fgas_activity` (100 records)
   - `emb_industrial_process_activity` (140 records)
   - `emb_cement_scm_activity` (80 records)
   - `emb_ods_recovery_destruction` (90 records)
   - `emb_aqms_facility_emissions` (170 records)
   - `emb_regional_facility_verification` (210 records)
   - `emb_eia_ecc_ghg_monitoring` (120 records)
   - `emb_ghg_inventory_output` (85 records - derived IPPU orchestration)
5. **`05_seed_mgb.sql`**:
   - `mgb_operating_mines_quarries` (36 master facilities)
   - `mgb_mineral_production` (180 records)
   - `mgb_energy_consumption_29_18` (720 quarterly energy records)
   - `mgb_resource_reserve_29_19` (180 resource/reserve records)
   - `mgb_integrated_annual_landuse` (180 disturbed/rehab land records)
   - `mgb_energy_emissions_proxy` (720 derived quarterly Scope-1 fuel proxies)
6. **`06_views_and_functions.sql`**:
   - `v_unified_regions`: Combines v1 and v2 region keys and PSGC codes.
   - `v_emb_ippu_provenance`: Aggregates and connects derived IPPU totals to underlying POD, EQMD, and industrial process records.
   - `v_mgb_mining_emissions_reconciliation`: Reconciles quarterly fuel consumption with Scope-1 proxies.
   - `v_mgb_facility_annual_profile`: Unified 360-degree view per mining facility per year.
   - `get_metric_traceability(metric_id, region, year)`: Stored function implementing the Developer Handoff Section 6 Traceability Contract.

---

## 3. Sample Verification Queries

```sql
-- Check total table counts
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Query IPPU provenance reconciliation
SELECT 
    year, 
    region_code, 
    estimated_tco2e AS derived_ippu_tco2e,
    pod_records_count,
    fgas_records_count,
    process_records_count
FROM v_emb_ippu_provenance
WHERE year = 2024
ORDER BY estimated_tco2e DESC
LIMIT 5;

-- Test Section 6 Traceability Contract Stored Function
SELECT get_metric_traceability('EMB_IPPU_TOTAL', 'R03', 2024);
SELECT get_metric_traceability('MGB_MINING_SCOPE1', 'R13', 2024);
```
