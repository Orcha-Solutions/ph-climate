-- ============================================================================
-- Seed 02: Reference Geography & Data Catalogs
-- ============================================================================

-- ref_regions (17 rows)
INSERT INTO "ref_regions" ("region_psgc", "region_code", "region_name", "centroid_lat", "centroid_lon", "population_2020") VALUES
  ('PH130000000', 'NCR', 'National Capital Region', '14.6091', '121.0223', '13484462'),
  ('PH140000000', 'CAR', 'Cordillera Administrative Region', '16.4023', '120.596', '1797660'),
  ('PH010000000', 'I', 'Ilocos Region', '16.0832', '120.619', '5301139'),
  ('PH020000000', 'II', 'Cagayan Valley', '16.9754', '121.8107', '3685744'),
  ('PH030000000', 'III', 'Central Luzon', '15.4828', '120.712', '12422172'),
  ('PH040000000', 'IV-A', 'CALABARZON', '14.1008', '121.0794', '16195042'),
  ('PH170000000', 'MIMAROPA', 'MIMAROPA Region', '12.8797', '121.774', '3228558'),
  ('PH050000000', 'V', 'Bicol Region', '13.4209', '123.4137', '6082165'),
  ('PH060000000', 'VI', 'Western Visayas', '10.7202', '122.5621', '7954723'),
  ('PH070000000', 'VII', 'Central Visayas', '10.3157', '123.8854', '8081988'),
  ('PH080000000', 'VIII', 'Eastern Visayas', '11.2443', '125.0048', '4547150'),
  ('PH090000000', 'IX', 'Zamboanga Peninsula', '7.8383', '123.2967', '3875576'),
  ('PH100000000', 'X', 'Northern Mindanao', '8.0202', '124.6857', '5022768'),
  ('PH110000000', 'XI', 'Davao Region', '7.1907', '125.4553', '5243536'),
  ('PH120000000', 'XII', 'SOCCSKSARGEN', '6.2707', '124.6857', '4901486'),
  ('PH160000000', 'XIII', 'Caraga', '8.8015', '125.7407', '2804788'),
  ('PH190000000', 'BARMM', 'Bangsamoro Autonomous Region in Muslim Mindanao', '7.2167', '124.25', '4404288');


-- ref_region_mappings (17 rows)
INSERT INTO "ref_region_mappings" ("region_code_v1", "region_code_v2", "region_psgc", "region_name") VALUES
  ('NCR', 'NCR', 'PH130000000', 'National Capital Region'),
  ('CAR', 'CAR', 'PH140000000', 'Cordillera Administrative Region'),
  ('I', 'R01', 'PH010000000', 'Ilocos Region'),
  ('II', 'R02', 'PH020000000', 'Cagayan Valley'),
  ('III', 'R03', 'PH030000000', 'Central Luzon'),
  ('IV-A', 'R04A', 'PH040000000', 'CALABARZON'),
  ('MIMAROPA', 'MIMAROPA', 'PH170000000', 'MIMAROPA Region'),
  ('V', 'R05', 'PH050000000', 'Bicol Region'),
  ('VI', 'R06', 'PH060000000', 'Western Visayas'),
  ('VII', 'R07', 'PH070000000', 'Central Visayas'),
  ('VIII', 'R08', 'PH080000000', 'Eastern Visayas'),
  ('IX', 'R09', 'PH090000000', 'Zamboanga Peninsula'),
  ('X', 'R10', 'PH100000000', 'Northern Mindanao'),
  ('XI', 'R11', 'PH110000000', 'Davao Region'),
  ('XII', 'R12', 'PH120000000', 'SOCCSKSARGEN'),
  ('XIII', 'R13', 'PH160000000', 'Caraga'),
  ('BARMM', 'BARMM', 'PH190000000', 'Bangsamoro Autonomous Region in Muslim Mindanao');


-- data_catalog (8 rows)
INSERT INTO "data_catalog" ("dataset_id", "title", "domain", "records", "spatial_granularity", "temporal_granularity", "authoritative_owner_candidate", "poc_status", "file") VALUES
  ('ref_regions', 'Ref Regions', 'Reference', '17', 'Region', 'Annual / latest', 'DENR/CCC/sector agency depending on dataset', 'Synthetic demo data - NOT OFFICIAL', 'ref_regions.csv'),
  ('ghg_inventory_region_sector', 'Ghg Inventory Region Sector', 'Mitigation', '612', 'Region', 'Annual / latest', 'DENR/CCC/sector agency depending on dataset', 'Synthetic demo data - NOT OFFICIAL', 'ghg_inventory_region_sector.csv'),
  ('climate_risk_region', 'Climate Risk Region', 'Adaptation/Risk', '102', 'Region', 'Annual / latest', 'DENR/CCC/sector agency depending on dataset', 'Synthetic demo data - NOT OFFICIAL', 'climate_risk_region.csv'),
  ('climate_finance_ccet', 'Climate Finance Ccet', 'Finance', '680', 'Region', 'Annual / latest', 'DENR/CCC/sector agency depending on dataset', 'Synthetic demo data - NOT OFFICIAL', 'climate_finance_ccet.csv'),
  ('ndc_pams', 'Ndc Pams', 'Mitigation', '15', 'National/Action', 'Annual / latest', 'DENR/CCC/sector agency depending on dataset', 'Synthetic demo data - NOT OFFICIAL', 'ndc_pams.csv'),
  ('adaptation_projects', 'Adaptation Projects', 'Adaptation/Risk', '60', 'Region', 'Annual / latest', 'DENR/CCC/sector agency depending on dataset', 'Synthetic demo data - NOT OFFICIAL', 'adaptation_projects.csv'),
  ('ecosystem_indicators', 'Ecosystem Indicators', 'Environment/CIS', '17', 'Region', 'Annual / latest', 'DENR/CCC/sector agency depending on dataset', 'Synthetic demo data - NOT OFFICIAL', 'ecosystem_indicators.csv'),
  ('climate_stations', 'Climate Stations', 'Environment/CIS', '40', 'Point', 'Annual / latest', 'DENR/CCC/sector agency depending on dataset', 'Synthetic demo data - NOT OFFICIAL', 'climate_stations.csv');


-- source_to_poc_crosswalk (15 rows)
INSERT INTO "source_to_poc_crosswalk" ("agency", "source_unit", "source_dataset", "synthetic_table", "record_count", "key_fields", "transformation", "dashboard_use") VALUES
  ('EMB', 'Philippine Ozone Desk', 'HFC / controlled-substance activity', 'emb_pod_hfc_activity', 120, 'year; region; substance; quantity; GWP', 'IPCC 2.F synthetic CO2e proxy', 'IPPU F-gases + provenance'),
  ('EMB', 'EQMD / industry reporting', 'PFC, SF6, NF3 activity', 'emb_eqmd_fgas_activity', 100, 'gas; application; kg; GWP', 'IPCC 2.E/2.G synthetic CO2e proxy', 'IPPU electronics/electrical'),
  ('EMB', 'IPPU inventory team', 'Industrial process activity', 'emb_industrial_process_activity', 140, 'facility; process; activity; EF', 'illustrative activity × EF', 'IPPU process emissions'),
  ('EMB', 'Industry/SCMAR-type reporting', 'Cement/clinker/SCM activity', 'emb_cement_scm_activity', 80, 'cement; clinker ratio; SCM', 'feeds mineral-products activity', 'cement decarbonization'),
  ('EMB', 'POD / CHWMS', 'ODS/HFC recovery, storage, reclamation, destruction', 'emb_ods_recovery_destruction', 90, 'substance; action; kg', 'management activity', 'refrigerant management'),
  ('EMB', 'AQMS / Regional Offices', 'Facility stationary-source activity/emissions', 'emb_aqms_facility_emissions', 170, 'fuel/source; activity; CO2/CH4/N2O', 'facility source record', 'facility emissions explorer'),
  ('EMB', 'Regional Offices', 'Facility GHG reporting/verification', 'emb_regional_facility_verification', 210, 'baseline; reduction; net; status', 'verification layer', 'QA/QC + drill-down'),
  ('EMB', 'EIA / Regional Offices', 'ECC/CMR GHG-relevant monitoring', 'emb_eia_ecc_ghg_monitoring', 120, 'project; ECC; emissions; mitigation; CMR', 'commitment-to-monitoring link', 'EIA/ECC traceability'),
  ('MGB', 'Mineral Economics / Regional Offices', 'Mineral production and inventory', 'mgb_mineral_production', 180, 'operator; commodity; production', 'mineral-industry activity', 'mining activity explorer'),
  ('MGB', 'Contractors / MPP holders', 'Quarterly Energy Consumption Report (29-18)', 'mgb_energy_consumption_29_18', 720, 'diesel; gasoline; coal; electricity', 'fuel activity → PoC proxy', 'mining energy/GHG'),
  ('MGB', 'Contractors / permittees', 'Annual Resource/Reserve Inventory (29-19)', 'mgb_resource_reserve_29_19', 180, 'commodity; quantity; class', 'context / denominator', 'resource context'),
  ('MGB', 'Central/Regional Offices', 'Directory of Operating Mines and Quarries', 'mgb_operating_mines_quarries', 36, 'operator; commodity; permit; status', 'facility master join', 'map + registry'),
  ('MGB', 'Contractors / permittees', 'Integrated Annual Report / land-use footprint', 'mgb_integrated_annual_landuse', 180, 'raw material; disturbed/rehab ha', 'production-land footprint link', 'mining/FOLU context'),
  ('DERIVED', 'PoC orchestration layer', 'EMB synthetic inventory output', 'emb_ghg_inventory_output', 85, 'region; year; IPPU tCO2e', 'sum selected EMB streams', 'executive/IPPU dashboard'),
  ('DERIVED', 'PoC orchestration layer', 'MGB mining fuel-emissions proxy', 'mgb_energy_emissions_proxy', 720, 'facility; quarter; tCO2e', 'fuel activity × illustrative EF', 'mining emissions explorer');


-- source_data_catalog (15 rows)
INSERT INTO "source_data_catalog" ("dataset_id", "agency", "source_unit", "dataset_title", "records", "coverage", "geography", "status", "portal_use") VALUES
  ('emb_pod_hfc_activity', 'EMB', 'Philippine Ozone Desk', 'HFC / controlled-substance activity', 120, '2021-2025 where applicable', 'Philippines / region / facility', 'SYNTHETIC DEMO DATA', 'IPPU F-gases + provenance'),
  ('emb_eqmd_fgas_activity', 'EMB', 'EQMD / industry reporting', 'PFC, SF6, NF3 activity', 100, '2021-2025 where applicable', 'Philippines / region / facility', 'SYNTHETIC DEMO DATA', 'IPPU electronics/electrical'),
  ('emb_industrial_process_activity', 'EMB', 'IPPU inventory team', 'Industrial process activity', 140, '2021-2025 where applicable', 'Philippines / region / facility', 'SYNTHETIC DEMO DATA', 'IPPU process emissions'),
  ('emb_cement_scm_activity', 'EMB', 'Industry/SCMAR-type reporting', 'Cement/clinker/SCM activity', 80, '2021-2025 where applicable', 'Philippines / region / facility', 'SYNTHETIC DEMO DATA', 'cement decarbonization'),
  ('emb_ods_recovery_destruction', 'EMB', 'POD / CHWMS', 'ODS/HFC recovery, storage, reclamation, destruction', 90, '2021-2025 where applicable', 'Philippines / region / facility', 'SYNTHETIC DEMO DATA', 'refrigerant management'),
  ('emb_aqms_facility_emissions', 'EMB', 'AQMS / Regional Offices', 'Facility stationary-source activity/emissions', 170, '2021-2025 where applicable', 'Philippines / region / facility', 'SYNTHETIC DEMO DATA', 'facility emissions explorer'),
  ('emb_regional_facility_verification', 'EMB', 'Regional Offices', 'Facility GHG reporting/verification', 210, '2021-2025 where applicable', 'Philippines / region / facility', 'SYNTHETIC DEMO DATA', 'QA/QC + drill-down'),
  ('emb_eia_ecc_ghg_monitoring', 'EMB', 'EIA / Regional Offices', 'ECC/CMR GHG-relevant monitoring', 120, '2021-2025 where applicable', 'Philippines / region / facility', 'SYNTHETIC DEMO DATA', 'EIA/ECC traceability'),
  ('mgb_mineral_production', 'MGB', 'Mineral Economics / Regional Offices', 'Mineral production and inventory', 180, '2021-2025 where applicable', 'Philippines / region / facility', 'SYNTHETIC DEMO DATA', 'mining activity explorer'),
  ('mgb_energy_consumption_29_18', 'MGB', 'Contractors / MPP holders', 'Quarterly Energy Consumption Report (29-18)', 720, '2021-2025 where applicable', 'Philippines / region / facility', 'SYNTHETIC DEMO DATA', 'mining energy/GHG'),
  ('mgb_resource_reserve_29_19', 'MGB', 'Contractors / permittees', 'Annual Resource/Reserve Inventory (29-19)', 180, '2021-2025 where applicable', 'Philippines / region / facility', 'SYNTHETIC DEMO DATA', 'resource context'),
  ('mgb_operating_mines_quarries', 'MGB', 'Central/Regional Offices', 'Directory of Operating Mines and Quarries', 36, '2021-2025 where applicable', 'Philippines / region / facility', 'SYNTHETIC DEMO DATA', 'map + registry'),
  ('mgb_integrated_annual_landuse', 'MGB', 'Contractors / permittees', 'Integrated Annual Report / land-use footprint', 180, '2021-2025 where applicable', 'Philippines / region / facility', 'SYNTHETIC DEMO DATA', 'mining/FOLU context'),
  ('emb_ghg_inventory_output', 'DERIVED', 'PoC orchestration layer', 'EMB synthetic inventory output', 85, '2021-2025 where applicable', 'Philippines / region / facility', 'SYNTHETIC DEMO DATA', 'executive/IPPU dashboard'),
  ('mgb_energy_emissions_proxy', 'DERIVED', 'PoC orchestration layer', 'MGB mining fuel-emissions proxy', 720, '2021-2025 where applicable', 'Philippines / region / facility', 'SYNTHETIC DEMO DATA', 'mining emissions explorer');

