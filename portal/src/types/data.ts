export interface Region {
  region_psgc: string;
  region_code: string;
  region_name: string;
  centroid_lat: number;
  centroid_lon: number;
  population_2020: number;
}

export interface RegionMapping {
  region_code_v1: string;
  region_code_v2: string;
  region_psgc: string;
  region_name: string;
}

export interface AdaptationProject {
  project_id: string;
  project_name: string;
  region_psgc: string;
  region_code: string;
  lead_agency: string;
  adaptation_theme: string;
  start_year: number;
  end_year: number;
  budget_php_m: number;
  physical_progress_pct: number;
  beneficiaries_est: number;
  status: string;
  data_status: string;
}

export interface ClimateFinanceCCET {
  fiscal_year: number;
  region_psgc: string;
  region_code: string;
  nccap_theme: string;
  tagged_budget_php_m: number;
  adaptation_share_pct: number;
  source_system: string;
  data_status: string;
}

export interface ClimateRiskRegion {
  year: number;
  region_psgc: string;
  region_code: string;
  mean_temp_anomaly_c: number;
  rainfall_anomaly_pct: number;
  flood_risk_index: number;
  drought_risk_index: number;
  landslide_risk_index: number;
  cyclone_exposure_index: number;
  composite_climate_risk_index: number;
  data_status: string;
}

export interface ClimateStation {
  station_id: string;
  station_name: string;
  region_psgc: string;
  region_code: string;
  latitude: number;
  longitude: number;
  station_type: string;
  latest_obs_date: string;
  completeness_30d_pct: number;
  data_status: string;
}

export interface EcosystemIndicator {
  year: number;
  region_psgc: string;
  region_code: string;
  forest_cover_pct_land_area: number;
  mangrove_area_kha: number;
  protected_area_pct_land_area: number;
  watershed_condition_index: number;
  data_status: string;
}

export interface GHGInventoryRegionSector {
  year: number;
  region_psgc: string;
  region_code: string;
  sector: string;
  emissions_mtco2e: number;
  data_status: string;
  method: string;
}

export interface NDCPAM {
  pam_id: string;
  sector: string;
  policy_action: string;
  action_type: string;
  lead_agency: string;
  period: string;
  target_value: number;
  target_unit: string;
  latest_progress: number;
  progress_pct: number;
  status: string;
  data_status: string;
}

// EMB Types
export interface EmbPodHfcActivity {
  record_id: string;
  year: number;
  region_code: string;
  region_name: string;
  substance: string;
  activity_type: string;
  quantity: number;
  unit: string;
  gwp_ar4: number;
  tco2e_proxy: number;
  source_office: string;
  reporting_entity: string;
  data_status: string;
  ipcc_category: string;
}

export interface EmbEqmdFgasActivity {
  record_id: string;
  year: number;
  region_code: string;
  region_name: string;
  gas: string;
  gas_family: string;
  quantity: number;
  unit: string;
  gwp_ar4: number;
  tco2e_proxy: number;
  application: string;
  source_office: string;
  data_status: string;
  ipcc_category: string;
}

export interface EmbIndustrialProcessActivity {
  record_id: string;
  year: number;
  region_code: string;
  region_name: string;
  facility: string;
  process: string;
  ipcc_category: string;
  activity_value: number;
  activity_unit: string;
  demo_emission_factor: number;
  estimated_emissions: number;
  emission_unit: string;
  source_office: string;
  data_status: string;
}

export interface EmbCementScmActivity {
  record_id: string;
  year: number;
  region_code: string;
  region_name: string;
  facility: string;
  cement_output_t: number;
  clinker_ratio: number;
  scm_type: string;
  scm_use_t: number;
  estimated_clinker_t: number;
  source_office: string;
  data_status: string;
  ipcc_category: string;
}

export interface EmbOdsRecoveryDestruction {
  record_id: string;
  year: number;
  region_code: string;
  region_name: string;
  substance: string;
  management_action: string;
  quantity_kg: number;
  unit: string;
  facility: string;
  source_office: string;
  data_status: string;
}

export interface EmbAqmsFacilityEmissions {
  record_id: string;
  year: number;
  region_code: string;
  region_name: string;
  facility: string;
  fuel_or_source: string;
  activity_value: number;
  activity_unit: string;
  co2_t: number;
  ch4_t: number;
  n2o_t: number;
  source_office: string;
  data_status: string;
}

export interface EmbRegionalFacilityVerification {
  record_id: string;
  year: number;
  region_code: string;
  region_name: string;
  facility: string;
  baseline_tco2e: number;
  reported_reduction_tco2e: number;
  net_tco2e: number;
  verification_status: string;
  source_office: string;
  data_status: string;
}

export interface EmbEiaEccGhgMonitoring {
  record_id: string;
  year: number;
  region_code: string;
  region_name: string;
  project: string;
  sector: string;
  ecc_reference: string;
  estimated_annual_tco2e: number;
  ghg_mitigation_commitment: string;
  cmr_status: string;
  source_office: string;
  data_status: string;
}

export interface EmbGhgInventoryOutput {
  record_id: string;
  year: number;
  region_code: string;
  region_name: string;
  sector: string;
  estimated_tco2e: number;
  unit: string;
  derived_from: string;
  method_note: string;
  source_office: string;
  data_status: string;
}

// MGB Types
export interface MgbOperatingMineQuarry {
  facility_id: string;
  operator: string;
  region_code: string;
  region_name: string;
  commodity: string;
  permit_type: string;
  permit_no: string;
  operating_status: string;
  source_dataset: string;
  data_status: string;
}

export interface MgbMineralProduction {
  record_id: string;
  year: number;
  facility_id: string;
  operator: string;
  region_code: string;
  region_name: string;
  commodity: string;
  production_volume: number;
  unit: string;
  production_value_php: number;
  report_basis: string;
  source_office: string;
  data_status: string;
}

export interface MgbEnergyConsumption2918 {
  record_id: string;
  year: number;
  quarter: number;
  facility_id: string;
  operator: string;
  region_code: string;
  region_name: string;
  commodity: string;
  diesel_l: number;
  gasoline_l: number;
  coal_t: number;
  purchased_electricity_kwh: number;
  report_basis: string;
  source_office: string;
  data_status: string;
}

export interface MgbResourceReserve2919 {
  record_id: string;
  year: number;
  facility_id: string;
  operator: string;
  region_code: string;
  region_name: string;
  commodity: string;
  resource_or_reserve: number;
  unit: string;
  classification: string;
  report_basis: string;
  source_office: string;
  data_status: string;
}

export interface MgbIntegratedAnnualLanduse {
  record_id: string;
  year: number;
  facility_id: string;
  operator: string;
  region_code: string;
  region_name: string;
  commodity: string;
  raw_material_moved_t: number;
  disturbed_area_ha: number;
  rehabilitated_area_ha: number;
  report_basis: string;
  source_office: string;
  data_status: string;
}

export interface MgbEnergyEmissionsProxy {
  record_id: string;
  year: number;
  quarter: number;
  facility_id: string;
  region_code: string;
  region_name: string;
  scope1_proxy_tco2e: number;
  method: string;
  data_status: string;
}

// Metadata Types
export interface DataCatalogItem {
  dataset_id: string;
  title: string;
  domain: string;
  records: number;
  spatial_granularity: string;
  temporal_granularity: string;
  authoritative_owner_candidate: string;
  poc_status: string;
  file: string;
}

export interface SourceDataCatalogItem {
  dataset_id: string;
  agency: string;
  source_unit: string;
  dataset_title: string;
  records: number;
  coverage: string;
  geography: string;
  status: string;
  portal_use: string;
}

export interface SourceCrosswalkItem {
  agency: string;
  source_unit: string;
  source_dataset: string;
  synthetic_table: string;
  record_count: number;
  key_fields: string;
  transformation: string;
  dashboard_use: string;
}

// Section 6 Traceability Contract
export interface MetricTraceability {
  metric_id: string;
  value: number;
  unit: string;
  reporting_period: string;
  geography: {
    region_code: string;
    region_name?: string;
    province?: string;
  };
  source_dataset_ids: string[];
  source_record_count: number;
  method_note: string;
  qa_status: 'UNVERIFIED' | 'SELF_REPORTED' | 'REGIONAL_VALIDATED' | 'OFFICIALLY_VERIFIED' | 'SYNTHETIC_VERIFIED' | string;
  data_status: 'SYNTHETIC_DEMO_DATA' | 'SYNTHETIC' | 'SYNTHETIC_DERIVED';
  upstream_records?: any[];
}
