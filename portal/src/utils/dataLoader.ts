import refRegionsData from '../data/ref_regions.json';
import adaptationProjectsData from '../data/adaptation_projects.json';
import climateFinanceData from '../data/climate_finance_ccet.json';
import climateRiskData from '../data/climate_risk_region.json';
import climateStationsData from '../data/climate_stations.json';
import ecosystemIndicatorsData from '../data/ecosystem_indicators.json';
import ghgInventoryData from '../data/ghg_inventory_region_sector.json';
import ndcPamsData from '../data/ndc_pams.json';
import dataCatalogData from '../data/data_catalog.json';
import sourceDataCatalogData from '../data/source_data_catalog.json';
import sourceCrosswalkData from '../data/source_to_poc_crosswalk.json';

// EMB Data
import embPodHfcData from '../data/emb_pod_hfc_activity.json';
import embEqmdFgasData from '../data/emb_eqmd_fgas_activity.json';
import embProcessData from '../data/emb_industrial_process_activity.json';
import embCementData from '../data/emb_cement_scm_activity.json';
import embOdsData from '../data/emb_ods_recovery_destruction.json';
import embAqmsData from '../data/emb_aqms_facility_emissions.json';
import embVerifData from '../data/emb_regional_facility_verification.json';
import embEiaData from '../data/emb_eia_ecc_ghg_monitoring.json';
import embGhgOutputData from '../data/emb_ghg_inventory_output.json';

// MGB Data
import mgbMinesData from '../data/mgb_operating_mines_quarries.json';
import mgbProdData from '../data/mgb_mineral_production.json';
import mgbEnergyData from '../data/mgb_energy_consumption_29_18.json';
import mgbReservesData from '../data/mgb_resource_reserve_29_19.json';
import mgbLanduseData from '../data/mgb_integrated_annual_landuse.json';
import mgbProxyData from '../data/mgb_energy_emissions_proxy.json';

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

export const regions: Region[] = refRegionsData as unknown as Region[];
export const adaptationProjects: AdaptationProject[] = adaptationProjectsData as unknown as AdaptationProject[];
export const climateFinance: ClimateFinanceCCET[] = climateFinanceData as unknown as ClimateFinanceCCET[];
export const climateRisk: ClimateRiskRegion[] = climateRiskData as unknown as ClimateRiskRegion[];
export const climateStations: ClimateStation[] = climateStationsData as unknown as ClimateStation[];
export const ecosystemIndicators: EcosystemIndicator[] = ecosystemIndicatorsData as unknown as EcosystemIndicator[];
export const ghgInventory: GHGInventoryRegionSector[] = ghgInventoryData as unknown as GHGInventoryRegionSector[];
export const ndcPams: NDCPAM[] = ndcPamsData as unknown as NDCPAM[];
export const dataCatalog: DataCatalogItem[] = dataCatalogData as unknown as DataCatalogItem[];
export const sourceDataCatalog: SourceDataCatalogItem[] = sourceDataCatalogData as unknown as SourceDataCatalogItem[];
export const sourceCrosswalk: SourceCrosswalkItem[] = sourceCrosswalkData as unknown as SourceCrosswalkItem[];

// EMB
export const embPodHfc: EmbPodHfcActivity[] = embPodHfcData as unknown as EmbPodHfcActivity[];
export const embEqmdFgas: EmbEqmdFgasActivity[] = embEqmdFgasData as unknown as EmbEqmdFgasActivity[];
export const embProcess: EmbIndustrialProcessActivity[] = embProcessData as unknown as EmbIndustrialProcessActivity[];
export const embCement: EmbCementScmActivity[] = embCementData as unknown as EmbCementScmActivity[];
export const embOds: EmbOdsRecoveryDestruction[] = embOdsData as unknown as EmbOdsRecoveryDestruction[];
export const embAqms: EmbAqmsFacilityEmissions[] = embAqmsData as unknown as EmbAqmsFacilityEmissions[];
export const embVerif: EmbRegionalFacilityVerification[] = embVerifData as unknown as EmbRegionalFacilityVerification[];
export const embEia: EmbEiaEccGhgMonitoring[] = embEiaData as unknown as EmbEiaEccGhgMonitoring[];
export const embGhgOutput: EmbGhgInventoryOutput[] = embGhgOutputData as unknown as EmbGhgInventoryOutput[];

// MGB
export const mgbMines: MgbOperatingMineQuarry[] = mgbMinesData as unknown as MgbOperatingMineQuarry[];
export const mgbProduction: MgbMineralProduction[] = mgbProdData as unknown as MgbMineralProduction[];
export const mgbEnergy: MgbEnergyConsumption2918[] = mgbEnergyData as unknown as MgbEnergyConsumption2918[];
export const mgbReserves: MgbResourceReserve2919[] = mgbReservesData as unknown as MgbResourceReserve2919[];
export const mgbLanduse: MgbIntegratedAnnualLanduse[] = mgbLanduseData as unknown as MgbIntegratedAnnualLanduse[];
export const mgbProxy: MgbEnergyEmissionsProxy[] = mgbProxyData as unknown as MgbEnergyEmissionsProxy[];

// Region Mapping Crosswalk
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

// Helper to normalize any region code (handles both 'IV-A' and 'R04A')
export function normalizeRegionCode(code: string): { v1: string; v2: string; name: string; psgc: string } | undefined {
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

// Traceability Contract implementation
export function getMetricTraceability(
  metricId: string,
  regionCode: string = 'ALL',
  year: number = 2024
): MetricTraceability {
  const norm = regionCode !== 'ALL' ? normalizeRegionCode(regionCode) : null;
  const regV1 = norm ? norm.v1 : 'ALL';
  const regV2 = norm ? norm.v2 : 'ALL';

  if (metricId === 'EMB_IPPU_TOTAL') {
    let outputs = embGhgOutput.filter(o => o.year === year);
    if (regV2 !== 'ALL') {
      outputs = outputs.filter(o => o.region_code === regV2);
    }
    const val = outputs.reduce((sum, o) => sum + o.estimated_tco2e, 0);

    // Upstream records
    const podRows = embPodHfc.filter(r => r.year === year && (regV2 === 'ALL' || r.region_code === regV2));
    const fgasRows = embEqmdFgas.filter(r => r.year === year && (regV2 === 'ALL' || r.region_code === regV2));
    const procRows = embProcess.filter(r => r.year === year && (regV2 === 'ALL' || r.region_code === regV2));

    const combinedUpstream = [
      ...podRows.map(r => ({ dataset: 'emb_pod_hfc_activity', ...r })),
      ...fgasRows.map(r => ({ dataset: 'emb_eqmd_fgas_activity', ...r })),
      ...procRows.map(r => ({ dataset: 'emb_industrial_process_activity', ...r }))
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
      method_note: 'Synthesized IPCC Sector 2 (IPPU) consolidation: HFC import warming proxies + EQMD semiconductor/electrical fluorinated gas release + industrial mineral/metal calcination emissions.',
      qa_status: 'SYNTHETIC_VERIFIED',
      data_status: 'SYNTHETIC_DERIVED',
      upstream_records: combinedUpstream
    };
  }

  if (metricId === 'MGB_MINING_SCOPE1') {
    let proxies = mgbProxy.filter(p => p.year === year);
    if (regV2 !== 'ALL') {
      proxies = proxies.filter(p => p.region_code === regV2);
    }
    const val = proxies.reduce((sum, p) => sum + p.scope1_proxy_tco2e, 0);

    const energyRows = mgbEnergy.filter(r => r.year === year && (regV2 === 'ALL' || r.region_code === regV2));
    const combinedUpstream = energyRows.map(e => {
      const p = mgbProxy.find(px => px.record_id === e.record_id);
      return {
        ...e,
        scope1_proxy_tco2e: p ? p.scope1_proxy_tco2e : null,
        dataset: 'mgb_energy_consumption_29_18'
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
      method_note: 'Quarterly Form 29-18 fuel consumption (diesel, gasoline, coal) multiplied by illustrative IPCC stationary/mobile combustion emission factors.',
      qa_status: 'SELF_REPORTED_QUARTERLY',
      data_status: 'SYNTHETIC_DERIVED',
      upstream_records: combinedUpstream
    };
  }

  if (metricId === 'CCET_FINANCE_TOTAL') {
    let financeRows = climateFinance.filter(f => f.fiscal_year === year);
    if (regV1 !== 'ALL') {
      financeRows = financeRows.filter(f => f.region_code === regV1);
    }
    const val = financeRows.reduce((sum, f) => sum + f.tagged_budget_php_m, 0);

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
      method_note: 'National Climate Change Action Plan (NCCAP) tagged expenditure under the Climate Change Expenditure Tagging (CCET) process.',
      qa_status: 'OFFICIALLY_VERIFIED',
      data_status: 'SYNTHETIC',
      upstream_records: financeRows
    };
  }

  // Fallback for general GHG Inventory
  let ghgRows = ghgInventory.filter(g => g.year === year);
  if (regV1 !== 'ALL') {
    ghgRows = ghgRows.filter(g => g.region_code === regV1);
  }
  const totalEmissions = ghgRows.reduce((sum, g) => sum + g.emissions_mtco2e, 0);

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
    method_note: 'Calibrated regional GHG observation model across Energy, Transport, Agriculture, Waste, IPPU, and LULUCF.',
    qa_status: 'SYNTHETIC_VERIFIED',
    data_status: 'SYNTHETIC',
    upstream_records: ghgRows
  };
}

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
        subtitle: `Code: ${r.region_code} | Pop: ${(r.population_2020 / 1e6).toFixed(2)}M`,
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
        subtitle: `Mineral Commodity tracked in Form 29 Production & Reserves`,
        badge: 'MGB Mineral',
        category: 'Mineral Resource',
        id: c
      });
    }
  }

  return results.slice(0, 10);
}
