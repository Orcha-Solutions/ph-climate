import Papa from 'papaparse';

// Raw CSV imports directly from the CSV data directory
import refRegionsCsv from '../data/csv/ref_regions.csv?raw';
import adaptationProjectsCsv from '../data/csv/adaptation_projects.csv?raw';
import climateFinanceCsv from '../data/csv/climate_finance_ccet.csv?raw';
import climateRiskCsv from '../data/csv/climate_risk_region.csv?raw';
import climateStationsCsv from '../data/csv/climate_stations.csv?raw';
import ecosystemIndicatorsCsv from '../data/csv/ecosystem_indicators.csv?raw';
import ghgInventoryCsv from '../data/csv/ghg_inventory_region_sector.csv?raw';
import ndcPamsCsv from '../data/csv/ndc_pams.csv?raw';
import dataCatalogCsv from '../data/csv/data_catalog.csv?raw';
import sourceDataCatalogCsv from '../data/csv/source_data_catalog.csv?raw';
import sourceCrosswalkCsv from '../data/csv/source_to_poc_crosswalk.csv?raw';

// EMB CSV imports
import embPodHfcCsv from '../data/csv/emb_pod_hfc_activity.csv?raw';
import embEqmdFgasCsv from '../data/csv/emb_eqmd_fgas_activity.csv?raw';
import embProcessCsv from '../data/csv/emb_industrial_process_activity.csv?raw';
import embCementCsv from '../data/csv/emb_cement_scm_activity.csv?raw';
import embOdsCsv from '../data/csv/emb_ods_recovery_destruction.csv?raw';
import embAqmsCsv from '../data/csv/emb_aqms_facility_emissions.csv?raw';
import embVerifCsv from '../data/csv/emb_regional_facility_verification.csv?raw';
import embEiaCsv from '../data/csv/emb_eia_ecc_ghg_monitoring.csv?raw';
import embGhgOutputCsv from '../data/csv/emb_ghg_inventory_output.csv?raw';

// MGB CSV imports
import mgbMinesCsv from '../data/csv/mgb_operating_mines_quarries.csv?raw';
import mgbProdCsv from '../data/csv/mgb_mineral_production.csv?raw';
import mgbEnergyCsv from '../data/csv/mgb_energy_consumption_29_18.csv?raw';
import mgbReservesCsv from '../data/csv/mgb_resource_reserve_29_19.csv?raw';
import mgbLanduseCsv from '../data/csv/mgb_integrated_annual_landuse.csv?raw';
import mgbProxyCsv from '../data/csv/mgb_energy_emissions_proxy.csv?raw';

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

// Helper to parse CSV raw text with PapaParse
function parseCsv<T>(csvText: string): T[] {
  const result = Papa.parse<T>(csvText.trim(), {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transform: (val: string) => {
      if (typeof val === 'string') {
        const trimmed = val.trim();
        return trimmed === '' ? null : trimmed;
      }
      return val;
    }
  });
  return result.data;
}

// ============================================================================
// PARSED DATASETS FROM CSV (Single Source of Truth)
// ============================================================================

export const csvData = {
  ref_regions: parseCsv<Region>(refRegionsCsv),
  adaptation_projects: parseCsv<AdaptationProject>(adaptationProjectsCsv),
  climate_finance_ccet: parseCsv<ClimateFinanceCCET>(climateFinanceCsv),
  climate_risk_region: parseCsv<ClimateRiskRegion>(climateRiskCsv),
  climate_stations: parseCsv<ClimateStation>(climateStationsCsv),
  ecosystem_indicators: parseCsv<EcosystemIndicator>(ecosystemIndicatorsCsv),
  ghg_inventory_region_sector: parseCsv<GHGInventoryRegionSector>(ghgInventoryCsv),
  ndc_pams: parseCsv<NDCPAM>(ndcPamsCsv),
  data_catalog: parseCsv<DataCatalogItem>(dataCatalogCsv),
  source_data_catalog: parseCsv<SourceDataCatalogItem>(sourceDataCatalogCsv),
  source_to_poc_crosswalk: parseCsv<SourceCrosswalkItem>(sourceCrosswalkCsv),

  // EMB
  emb_pod_hfc_activity: parseCsv<EmbPodHfcActivity>(embPodHfcCsv),
  emb_eqmd_fgas_activity: parseCsv<EmbEqmdFgasActivity>(embEqmdFgasCsv),
  emb_industrial_process_activity: parseCsv<EmbIndustrialProcessActivity>(embProcessCsv),
  emb_cement_scm_activity: parseCsv<EmbCementScmActivity>(embCementCsv),
  emb_ods_recovery_destruction: parseCsv<EmbOdsRecoveryDestruction>(embOdsCsv),
  emb_aqms_facility_emissions: parseCsv<EmbAqmsFacilityEmissions>(embAqmsCsv),
  emb_regional_facility_verification: parseCsv<EmbRegionalFacilityVerification>(embVerifCsv),
  emb_eia_ecc_ghg_monitoring: parseCsv<EmbEiaEccGhgMonitoring>(embEiaCsv),
  emb_ghg_inventory_output: parseCsv<EmbGhgInventoryOutput>(embGhgOutputCsv),

  // MGB
  mgb_operating_mines_quarries: parseCsv<MgbOperatingMineQuarry>(mgbMinesCsv),
  mgb_mineral_production: parseCsv<MgbMineralProduction>(mgbProdCsv),
  mgb_energy_consumption_29_18: parseCsv<MgbEnergyConsumption2918>(mgbEnergyCsv),
  mgb_resource_reserve_29_19: parseCsv<MgbResourceReserve2919>(mgbReservesCsv),
  mgb_integrated_annual_landuse: parseCsv<MgbIntegratedAnnualLanduse>(mgbLanduseCsv),
  mgb_energy_emissions_proxy: parseCsv<MgbEnergyEmissionsProxy>(mgbProxyCsv)
};

// Region Mappings crosswalk (v1 Roman Numerals <-> v2 Prefixed R-codes)
export const regionMappings: RegionMapping[] = [
  { region_code_v1: "NCR", region_code_v2: "NCR", region_psgc: "PH130000000", region_name: "National Capital Region" },
  { region_code_v1: "CAR", region_code_v2: "CAR", region_psgc: "PH140000000", region_name: "Cordillera Administrative Region" },
  { region_code_v1: "I", region_code_v2: "R01", region_psgc: "PH010000000", region_name: "Ilocos Region" },
  { region_code_v1: "II", region_code_v2: "R02", region_psgc: "PH020000000", region_name: "Cagayan Valley" },
  { region_code_v1: "III", region_code_v2: "R03", region_psgc: "PH030000000", region_name: "Central Luzon" },
  { region_code_v1: "IV-A", region_code_v2: "R04A", region_psgc: "PH040000000", region_name: "CALABARZON" },
  { region_code_v1: "MIMAROPA", region_code_v2: "MIMAROPA", region_psgc: "PH170000000", region_name: "MIMAROPA Region" },
  { region_code_v1: "V", region_code_v2: "R05", region_psgc: "PH050000000", region_name: "Bicol Region" },
  { region_code_v1: "VI", region_code_v2: "R06", region_psgc: "PH060000000", region_name: "Western Visayas" },
  { region_code_v1: "VII", region_code_v2: "R07", region_psgc: "PH070000000", region_name: "Central Visayas" },
  { region_code_v1: "VIII", region_code_v2: "R08", region_psgc: "PH080000000", region_name: "Eastern Visayas" },
  { region_code_v1: "IX", region_code_v2: "R09", region_psgc: "PH090000000", region_name: "Zamboanga Peninsula" },
  { region_code_v1: "X", region_code_v2: "R10", region_psgc: "PH100000000", region_name: "Northern Mindanao" },
  { region_code_v1: "XI", region_code_v2: "R11", region_psgc: "PH110000000", region_name: "Davao Region" },
  { region_code_v1: "XII", region_code_v2: "R12", region_psgc: "PH120000000", region_name: "SOCCSKSARGEN" },
  { region_code_v1: "XIII", region_code_v2: "R13", region_psgc: "PH160000000", region_name: "Caraga" },
  { region_code_v1: "BARMM", region_code_v2: "BARMM", region_psgc: "PH190000000", region_name: "Bangsamoro Autonomous Region in Muslim Mindanao" }
];

export function normalizeRegion(code: string): { v1: string; v2: string; name: string; psgc: string } | undefined {
  if (!code) return undefined;
  const match = regionMappings.find(
    m => m.region_code_v1.toLowerCase() === code.toLowerCase() ||
         m.region_code_v2.toLowerCase() === code.toLowerCase() ||
         m.region_psgc.toLowerCase() === code.toLowerCase()
  );
  if (match) {
    return {
      v1: match.region_code_v1,
      v2: match.region_code_v2,
      name: match.region_name,
      psgc: match.region_psgc
    };
  }
  return undefined;
}

// ============================================================================
// MOCK API SERVICE FUNCTIONS (Simulating Backend Endpoints)
// ============================================================================

export interface MockApiResponse<T> {
  status: 'success' | 'error';
  source_type: 'CSV_MOCK_ENGINE';
  data_status: 'SYNTHETIC_DEMO_DATA';
  total_records: number;
  data: T;
  timestamp: string;
}

// 1. Mock API: Query Table by Name with Year & Region Filters
export function mockQueryTable(
  tableName: keyof typeof csvData,
  filters?: { year?: number; region?: string; search?: string }
): MockApiResponse<any[]> {
  let records: any[] = [...(csvData[tableName] || [])];

  if (filters?.year) {
    records = records.filter(r => r.year === filters.year || r.fiscal_year === filters.year || r.start_year === filters.year);
  }

  if (filters?.region && filters.region !== 'ALL') {
    const norm = normalizeRegion(filters.region);
    const v1 = norm ? norm.v1 : filters.region;
    const v2 = norm ? norm.v2 : filters.region;

    records = records.filter(r => r.region_code === v1 || r.region_code === v2);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase().trim();
    records = records.filter(r => 
      Object.values(r).some(val => 
        val !== null && val !== undefined && String(val).toLowerCase().includes(q)
      )
    );
  }

  return {
    status: 'success',
    source_type: 'CSV_MOCK_ENGINE',
    data_status: 'SYNTHETIC_DEMO_DATA',
    total_records: records.length,
    data: records,
    timestamp: new Date().toISOString()
  };
}

// 2. Mock API: Section 6 Traceability Contract Calculator (computed directly from CSVs)
export function mockGetTraceability(
  metricId: string,
  regionCode: string = 'ALL',
  year: number = 2024
): MetricTraceability {
  const norm = regionCode !== 'ALL' ? normalizeRegion(regionCode) : null;
  const regV1 = norm ? norm.v1 : 'ALL';
  const regV2 = norm ? norm.v2 : 'ALL';

  if (metricId === 'EMB_IPPU_TOTAL') {
    let outputs = csvData.emb_ghg_inventory_output.filter(o => o.year === year);
    if (regV2 !== 'ALL') {
      outputs = outputs.filter(o => o.region_code === regV2);
    }
    const val = outputs.reduce((sum, o) => sum + (Number(o.estimated_tco2e) || 0), 0);

    // Upstream raw CSV rows
    const podRows = csvData.emb_pod_hfc_activity.filter(r => r.year === year && (regV2 === 'ALL' || r.region_code === regV2));
    const fgasRows = csvData.emb_eqmd_fgas_activity.filter(r => r.year === year && (regV2 === 'ALL' || r.region_code === regV2));
    const procRows = csvData.emb_industrial_process_activity.filter(r => r.year === year && (regV2 === 'ALL' || r.region_code === regV2));

    const combinedUpstream = [
      ...podRows.map(r => ({ source_csv: 'emb_pod_hfc_activity.csv', ...r })),
      ...fgasRows.map(r => ({ source_csv: 'emb_eqmd_fgas_activity.csv', ...r })),
      ...procRows.map(r => ({ source_csv: 'emb_industrial_process_activity.csv', ...r }))
    ];

    return {
      metric_id: 'EMB_IPPU_TOTAL',
      value: Math.round(val * 100) / 100,
      unit: 'tCO2e proxy',
      reporting_period: year.toString(),
      geography: {
        region_code: regV2,
        region_name: norm ? norm.name : 'National Philippines'
      },
      source_dataset_ids: ['emb_pod_hfc_activity', 'emb_eqmd_fgas_activity', 'emb_industrial_process_activity'],
      source_record_count: combinedUpstream.length,
      method_note: 'Synthesized IPCC Sector 2 (IPPU) calculated from raw CSV streams: HFC import warming proxies (GWP) + EQMD F-gases + industrial process calcination.',
      qa_status: 'SYNTHETIC_VERIFIED',
      data_status: 'SYNTHETIC_DEMO_DATA',
      upstream_records: combinedUpstream
    };
  }

  if (metricId === 'MGB_MINING_SCOPE1') {
    let proxies = csvData.mgb_energy_emissions_proxy.filter(p => p.year === year);
    if (regV2 !== 'ALL') {
      proxies = proxies.filter(p => p.region_code === regV2);
    }
    const val = proxies.reduce((sum, p) => sum + (Number(p.scope1_proxy_tco2e) || 0), 0);

    const energyRows = csvData.mgb_energy_consumption_29_18.filter(r => r.year === year && (regV2 === 'ALL' || r.region_code === regV2));
    const combinedUpstream = energyRows.map(e => {
      const p = csvData.mgb_energy_emissions_proxy.find(px => px.record_id === e.record_id);
      return {
        ...e,
        scope1_proxy_tco2e: p ? p.scope1_proxy_tco2e : null,
        source_csv: 'mgb_energy_consumption_29_18.csv'
      };
    });

    return {
      metric_id: 'MGB_MINING_SCOPE1',
      value: Math.round(val * 100) / 100,
      unit: 'tCO2e proxy',
      reporting_period: year.toString(),
      geography: {
        region_code: regV2,
        region_name: norm ? norm.name : 'National Philippines'
      },
      source_dataset_ids: ['mgb_energy_consumption_29_18', 'mgb_energy_emissions_proxy'],
      source_record_count: combinedUpstream.length,
      method_note: 'Quarterly Form 29-18 fuel consumption from CSV (diesel, gasoline, coal) multiplied by illustrative IPCC emission factors.',
      qa_status: 'SELF_REPORTED_QUARTERLY',
      data_status: 'SYNTHETIC_DEMO_DATA',
      upstream_records: combinedUpstream
    };
  }

  if (metricId === 'CCET_FINANCE_TOTAL') {
    let financeRows = csvData.climate_finance_ccet.filter(f => f.fiscal_year === year);
    if (regV1 !== 'ALL') {
      financeRows = financeRows.filter(f => f.region_code === regV1);
    }
    const val = financeRows.reduce((sum, f) => sum + (Number(f.tagged_budget_php_m) || 0), 0);

    return {
      metric_id: 'CCET_FINANCE_TOTAL',
      value: Math.round(val * 100) / 100,
      unit: 'PHP Millions',
      reporting_period: year.toString(),
      geography: {
        region_code: regV1,
        region_name: norm ? norm.name : 'National Philippines'
      },
      source_dataset_ids: ['climate_finance_ccet'],
      source_record_count: financeRows.length,
      method_note: 'National Climate Change Action Plan (NCCAP) tagged expenditure under the CCET process, loaded from climate_finance_ccet.csv.',
      qa_status: 'OFFICIALLY_VERIFIED',
      data_status: 'SYNTHETIC',
      upstream_records: financeRows
    };
  }

  // Default: Net GHG Inventory
  let ghgRows = csvData.ghg_inventory_region_sector.filter(g => g.year === year);
  if (regV1 !== 'ALL') {
    ghgRows = ghgRows.filter(g => g.region_code === regV1);
  }
  const totalEmissions = ghgRows.reduce((sum, g) => sum + (Number(g.emissions_mtco2e) || 0), 0);

  return {
    metric_id: 'GHG_INVENTORY_NET',
    value: Math.round(totalEmissions * 1000) / 1000,
    unit: 'MtCO2e',
    reporting_period: year.toString(),
    geography: {
      region_code: regV1,
      region_name: norm ? norm.name : 'National Philippines'
    },
    source_dataset_ids: ['ghg_inventory_region_sector'],
    source_record_count: ghgRows.length,
    method_note: 'Calibrated regional GHG observation model across Energy, Transport, Agriculture, Waste, IPPU, and LULUCF loaded from ghg_inventory_region_sector.csv.',
    qa_status: 'SYNTHETIC_VERIFIED',
    data_status: 'SYNTHETIC',
    upstream_records: ghgRows
  };
}

// 3. Mock API: Direct CSV Download URL generator
export function getCsvDownloadUrl(tableId: string): string {
  return `/data/csv/${tableId}.csv`;
}
