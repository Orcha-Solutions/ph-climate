import { 
  csvData, 
  regionMappings, 
  normalizeRegion, 
  mockGetTraceability 
} from '../services/mockApi';

import type {
  Region,
  RegionMapping,
  AdaptationProject,
  ClimateFinanceCCET,
  ClimateRiskRegion,
  ClimateStation,
  EcosystemIndicator,
  GHGInventoryRegionSector,
  NDCPAM,
  EmbPodHfcActivity,
  EmbEqmdFgasActivity,
  EmbIndustrialProcessActivity,
  EmbCementScmActivity,
  EmbOdsRecoveryDestruction,
  EmbAqmsFacilityEmissions,
  EmbRegionalFacilityVerification,
  EmbEiaEccGhgMonitoring,
  EmbGhgInventoryOutput,
  MgbOperatingMineQuarry,
  MgbMineralProduction,
  MgbEnergyConsumption2918,
  MgbResourceReserve2919,
  MgbIntegratedAnnualLanduse,
  MgbEnergyEmissionsProxy,
  DataCatalogItem,
  SourceDataCatalogItem,
  SourceCrosswalkItem,
  MetricTraceability
} from '../types/data';

// ============================================================================
// EXPORT DATASETS (Directly Parsed from CSV Files)
// ============================================================================

export const regions: Region[] = csvData.ref_regions;
export const adaptationProjects: AdaptationProject[] = csvData.adaptation_projects;
export const climateFinance: ClimateFinanceCCET[] = csvData.climate_finance_ccet;
export const climateRisk: ClimateRiskRegion[] = csvData.climate_risk_region;
export const climateStations: ClimateStation[] = csvData.climate_stations;
export const ecosystemIndicators: EcosystemIndicator[] = csvData.ecosystem_indicators;
export const ghgInventory: GHGInventoryRegionSector[] = csvData.ghg_inventory_region_sector;
export const ndcPams: NDCPAM[] = csvData.ndc_pams;
export const dataCatalog: DataCatalogItem[] = csvData.data_catalog;
export const sourceDataCatalog: SourceDataCatalogItem[] = csvData.source_data_catalog;
export const sourceCrosswalk: SourceCrosswalkItem[] = csvData.source_to_poc_crosswalk;

// EMB
export const embPodHfc: EmbPodHfcActivity[] = csvData.emb_pod_hfc_activity;
export const embEqmdFgas: EmbEqmdFgasActivity[] = csvData.emb_eqmd_fgas_activity;
export const embProcess: EmbIndustrialProcessActivity[] = csvData.emb_industrial_process_activity;
export const embCement: EmbCementScmActivity[] = csvData.emb_cement_scm_activity;
export const embOds: EmbOdsRecoveryDestruction[] = csvData.emb_ods_recovery_destruction;
export const embAqms: EmbAqmsFacilityEmissions[] = csvData.emb_aqms_facility_emissions;
export const embVerif: EmbRegionalFacilityVerification[] = csvData.emb_regional_facility_verification;
export const embEia: EmbEiaEccGhgMonitoring[] = csvData.emb_eia_ecc_ghg_monitoring;
export const embGhgOutput: EmbGhgInventoryOutput[] = csvData.emb_ghg_inventory_output;

// MGB
export const mgbMines: MgbOperatingMineQuarry[] = csvData.mgb_operating_mines_quarries;
export const mgbProduction: MgbMineralProduction[] = csvData.mgb_mineral_production;
export const mgbEnergy: MgbEnergyConsumption2918[] = csvData.mgb_energy_consumption_29_18;
export const mgbReserves: MgbResourceReserve2919[] = csvData.mgb_resource_reserve_29_19;
export const mgbLanduse: MgbIntegratedAnnualLanduse[] = csvData.mgb_integrated_annual_landuse;
export const mgbProxy: MgbEnergyEmissionsProxy[] = csvData.mgb_energy_emissions_proxy;

export { regionMappings };
export const normalizeRegionCode = normalizeRegion;

// Traceability Contract implementation (Powered by CSV Mock Engine)
export const getMetricTraceability = mockGetTraceability;

// Omni-search entity finder
export interface SearchResult {
  type: 'Facility' | 'Region' | 'Commodity' | 'ECC Project' | 'Dataset' | 'Substance';
  title: string;
  subtitle: string;
  badge: string;
  category: string;
  id?: string;
  url?: string;
}

export function omniSearch(query: string): SearchResult[] {
  if (!query || query.trim().length < 2) return [];
  const q = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  // 1. Search Regions
  for (const r of regions) {
    if (r.region_name.toLowerCase().includes(q) || r.region_code.toLowerCase().includes(q)) {
      results.push({
        type: 'Region',
        title: r.region_name,
        subtitle: `Code: ${r.region_code} | Pop: ${(Number(r.population_2020) / 1e6).toFixed(2)}M`,
        badge: r.region_code,
        category: 'Geographic Region',
        id: r.region_code
      });
    }
  }

  // 2. Search MGB Facilities
  for (const f of mgbMines) {
    if (f.facility_id.toLowerCase().includes(q) || f.operator.toLowerCase().includes(q) || f.commodity.toLowerCase().includes(q) || f.permit_no.toLowerCase().includes(q)) {
      results.push({
        type: 'Facility',
        title: f.operator,
        subtitle: `${f.commodity} · ${f.region_name} · Permit: ${f.permit_no} (${f.permit_type})`,
        badge: f.operating_status,
        category: 'Mining Operation',
        id: f.facility_id
      });
    }
  }

  // 3. Search ECC Projects
  for (const e of embEia) {
    if (e.project.toLowerCase().includes(q) || e.ecc_reference.toLowerCase().includes(q) || e.sector.toLowerCase().includes(q)) {
      results.push({
        type: 'ECC Project',
        title: e.project,
        subtitle: `ECC Ref: ${e.ecc_reference} · ${e.sector} · Commitment: ${e.ghg_mitigation_commitment}`,
        badge: e.cmr_status,
        category: 'EIA / ECC Permitted Project',
        id: e.ecc_reference
      });
    }
  }

  // 4. Search Datasets
  for (const d of sourceDataCatalog) {
    if (d.dataset_title.toLowerCase().includes(q) || d.dataset_id.toLowerCase().includes(q) || d.agency.toLowerCase().includes(q)) {
      results.push({
        type: 'Dataset',
        title: d.dataset_title,
        subtitle: `Agency: ${d.agency} (${d.source_unit}) · Records: ${d.records}`,
        badge: d.status,
        category: 'Data Catalog',
        id: d.dataset_id
      });
    }
  }

  // 5. Search Commodities
  const commodities = Array.from(new Set(mgbProduction.map(p => p.commodity)));
  for (const c of commodities) {
    if (c.toLowerCase().includes(q)) {
      results.push({
        type: 'Commodity',
        title: c,
        subtitle: `Mineral Commodity tracked in Form 29 Production & Reserves (CSV)`,
        badge: 'MGB Mineral',
        category: 'Mineral Resource',
        id: c
      });
    }
  }

  return results.slice(0, 10);
}
