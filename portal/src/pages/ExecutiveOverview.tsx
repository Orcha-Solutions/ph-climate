import React, { useMemo } from 'react';
import { 
  Flame, 
  DollarSign, 
  Pickaxe, 
  ShieldAlert, 
  Users, 
  Layers, 
  ArrowRight, 
  Database, 
  TrendingUp, 
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  ghgInventory, 
  climateFinance, 
  mgbProxy, 
  adaptationProjects, 
  embGhgOutput,
  sourceDataCatalog,
  normalizeRegionCode
} from '../utils/dataLoader';

interface ExecutiveOverviewProps {
  selectedYear: number;
  selectedRegion: string;
  onNavigateTab: (tab: string) => void;
  onOpenProvenance: (metricId: string, region: string) => void;
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({
  selectedYear,
  selectedRegion,
  onNavigateTab,
  onOpenProvenance
}) => {
  const norm = selectedRegion !== 'ALL' ? normalizeRegionCode(selectedRegion) : null;
  const regV1 = norm ? norm.v1 : 'ALL';
  const regV2 = norm ? norm.v2 : 'ALL';

  // 1. Total Net GHG
  const totalGhgMt = useMemo(() => {
    return ghgInventory
      .filter(g => g.year === selectedYear && (regV1 === 'ALL' || g.region_code === regV1))
      .reduce((sum, g) => sum + g.emissions_mtco2e, 0);
  }, [selectedYear, regV1]);

  // 2. CCET Tagged Budget
  const totalFinancePhpM = useMemo(() => {
    return climateFinance
      .filter(f => f.fiscal_year === selectedYear && (regV1 === 'ALL' || f.region_code === regV1))
      .reduce((sum, f) => sum + f.tagged_budget_php_m, 0);
  }, [selectedYear, regV1]);

  // 3. Mining Fuel Emissions Proxy
  const totalMiningScope1 = useMemo(() => {
    return mgbProxy
      .filter(m => m.year === selectedYear && (regV2 === 'ALL' || m.region_code === regV2))
      .reduce((sum, m) => sum + m.scope1_proxy_tco2e, 0);
  }, [selectedYear, regV2]);

  // 4. IPPU Derived Output
  const totalIppuTco2e = useMemo(() => {
    return embGhgOutput
      .filter(o => o.year === selectedYear && (regV2 === 'ALL' || o.region_code === regV2))
      .reduce((sum, o) => sum + o.estimated_tco2e, 0);
  }, [selectedYear, regV2]);

  // 5. Adaptation Projects Count & Beneficiaries
  const activeProjects = useMemo(() => {
    return adaptationProjects
      .filter(p => regV1 === 'ALL' || p.region_code === regV1);
  }, [regV1]);

  const totalBeneficiaries = activeProjects.reduce((sum, p) => sum + p.beneficiaries_est, 0);

  // Sector breakdown for bar comparison
  const sectorEmissions = useMemo(() => {
    const sectors = ['Energy', 'Transport', 'Agriculture', 'Waste', 'IPPU', 'LULUCF'];
    return sectors.map(sec => {
      const val = ghgInventory
        .filter(g => g.year === selectedYear && g.sector === sec && (regV1 === 'ALL' || g.region_code === regV1))
        .reduce((sum, g) => sum + g.emissions_mtco2e, 0);
      return { sector: sec, value: Math.round(val * 1000) / 1000 };
    });
  }, [selectedYear, regV1]);

  return (
    <div className="space-y-8">
      
      {/* Title & Scope Hero Banner */}
      <div className="bg-[#121620] border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="w-full">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-semibold">
              v2.0 Source Data Orchestration
            </span>
            <span className="text-xs font-mono text-slate-400">
              National GHG &amp; Mining Activity Framework
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight font-sans">
            Philippine Climate Data Portal PoC
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-2 font-sans leading-relaxed">
            Bridging DENR-EMB and DENR-MGB institutional source streams directly into derived GHG inventory outputs, with end-to-end traceability and calculation provenance.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-6 text-xs font-mono text-slate-400">
            <div>Reporting Year: <strong className="text-slate-100">{selectedYear}</strong></div>
            <div>·</div>
            <div>Regional Scope: <strong className="text-emerald-400">{norm ? norm.name : 'All 17 Administrative Regions'}</strong></div>
            <div>·</div>
            <div>Source Datasets: <strong className="text-cyan-400">15 v2 + 8 v1</strong></div>
          </div>
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* KPI 1: Net GHG Emissions */}
        <div className="bg-[#121620] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-400" /> Net GHG Emissions
            </span>
            <button
              onClick={() => onOpenProvenance('GHG_INVENTORY_NET', selectedRegion)}
              className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5"
            >
              Provenance <ExternalLink className="w-2.5 h-2.5" />
            </button>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white">
              {totalGhgMt.toFixed(2)} <span className="text-sm font-normal text-slate-400">MtCO2e</span>
            </div>
            <div className="text-xs text-slate-400 font-sans mt-1">
              Energy, Transport, Agri, Waste, IPPU, LULUCF
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-500 flex justify-between">
            <span>Model: Calibrated Observation</span>
            <span className="text-slate-400 font-semibold">{selectedYear}</span>
          </div>
        </div>

        {/* KPI 2: Tagged Climate Finance */}
        <div className="bg-[#121620] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-cyan-400" /> CCET Tagged Finance
            </span>
            <button
              onClick={() => onOpenProvenance('CCET_FINANCE_TOTAL', selectedRegion)}
              className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5"
            >
              Traceability <ExternalLink className="w-2.5 h-2.5" />
            </button>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-300">
              ₱{(totalFinancePhpM / 1000).toFixed(2)}B
            </div>
            <div className="text-xs text-slate-400 font-sans mt-1">
              Across 8 NCCAP Priority Themes
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-500 flex justify-between">
            <span>Source: CCET-like PoC Feed</span>
            <span className="text-slate-400 font-semibold">{selectedYear}</span>
          </div>
        </div>

        {/* KPI 3: Mining Scope-1 Proxy */}
        <div className="bg-[#121620] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Pickaxe className="w-3.5 h-3.5 text-purple-400" /> Mining Scope-1 Proxy
            </span>
            <button
              onClick={() => onOpenProvenance('MGB_MINING_SCOPE1', selectedRegion)}
              className="text-[11px] font-mono text-purple-400 hover:text-purple-300 flex items-center gap-0.5"
            >
              Form 29-18 <ExternalLink className="w-2.5 h-2.5" />
            </button>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-purple-300">
              {Math.round(totalMiningScope1).toLocaleString()} <span className="text-sm font-normal text-slate-400">tCO2e</span>
            </div>
            <div className="text-xs text-slate-400 font-sans mt-1">
              Quarterly Diesel, Coal &amp; Gas Combustion
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-500 flex justify-between">
            <span>DENR-MGB Derived Proxy</span>
            <span className="text-slate-400 font-semibold">{selectedYear}</span>
          </div>
        </div>

        {/* KPI 4: IPPU Synthetic Output */}
        <div className="bg-[#121620] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" /> IPPU Orchestrated Output
            </span>
            <button
              onClick={() => onOpenProvenance('EMB_IPPU_TOTAL', selectedRegion)}
              className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5"
            >
              Lineage <ExternalLink className="w-2.5 h-2.5" />
            </button>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-300">
              {(totalIppuTco2e / 1e6).toFixed(2)}M <span className="text-sm font-normal text-slate-400">tCO2e</span>
            </div>
            <div className="text-xs text-slate-400 font-sans mt-1">
              POD HFCs + EQMD F-Gases + Clinker/Lime
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-500 flex justify-between">
            <span>DENR-EMB Derived Output</span>
            <span className="text-slate-400 font-semibold">{selectedYear}</span>
          </div>
        </div>

      </div>

      {/* Institutional Data Lineage & Flow Card (v2 Innovation) */}
      <div className="bg-[#121620] border border-slate-800 rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div>
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
              Data Architecture
            </span>
            <h2 className="text-lg font-bold text-white font-sans mt-0.5">
              Institutional Source Coverage &amp; Provenance Pipeline
            </h2>
          </div>
          <button 
            onClick={() => onNavigateTab('catalog')}
            className="text-xs font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            Browse Data Catalog ({sourceDataCatalog.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Visual Pipeline (EMB & MGB -> Orchestration -> Portal) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          
          {/* Column 1: EMB Streams */}
          <div className="bg-[#0e121a] border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-slate-300 font-semibold pb-2 border-b border-slate-800">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Database className="w-3.5 h-3.5" /> DENR-EMB Streams
              </span>
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">8 Tables</span>
            </div>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li className="flex justify-between"><span>• POD HFC Controlled Subs</span> <strong className="text-slate-200">120 rows</strong></li>
              <li className="flex justify-between"><span>• EQMD F-Gas Electronic Acts</span> <strong className="text-slate-200">100 rows</strong></li>
              <li className="flex justify-between"><span>• Industrial Processes (Clinker/Lime)</span> <strong className="text-slate-200">140 rows</strong></li>
              <li className="flex justify-between"><span>• Cement &amp; SCM Substitution</span> <strong className="text-slate-200">80 rows</strong></li>
              <li className="flex justify-between"><span>• ODS Recovery &amp; Destruction</span> <strong className="text-slate-200">90 rows</strong></li>
              <li className="flex justify-between"><span>• AQMS Permitted Stationary Sources</span> <strong className="text-slate-200">170 rows</strong></li>
              <li className="flex justify-between"><span>• Regional MRV Verification</span> <strong className="text-slate-200">210 rows</strong></li>
              <li className="flex justify-between"><span>• EIA / ECC Monitoring Commitments</span> <strong className="text-slate-200">120 rows</strong></li>
            </ul>
          </div>

          {/* Column 2: MGB Streams */}
          <div className="bg-[#0e121a] border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-slate-300 font-semibold pb-2 border-b border-slate-800">
              <span className="flex items-center gap-1.5 text-purple-400">
                <Pickaxe className="w-3.5 h-3.5" /> DENR-MGB Streams
              </span>
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">5 Tables</span>
            </div>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li className="flex justify-between"><span>• Mine &amp; Quarry Registry</span> <strong className="text-slate-200">36 facilities</strong></li>
              <li className="flex justify-between"><span>• Form 29 Mineral Production</span> <strong className="text-slate-200">180 rows</strong></li>
              <li className="flex justify-between"><span>• Form 29-18 Quarterly Energy</span> <strong className="text-slate-200">720 rows</strong></li>
              <li className="flex justify-between"><span>• Form 29-19 Mineral Reserves</span> <strong className="text-slate-200">180 rows</strong></li>
              <li className="flex justify-between"><span>• IAR Land-Use Footprint (FOLU)</span> <strong className="text-slate-200">180 rows</strong></li>
            </ul>
          </div>

          {/* Column 3: Orchestration Layer */}
          <div className="bg-[#0e121a] border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-slate-300 font-semibold pb-2 border-b border-slate-800">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <TrendingUp className="w-3.5 h-3.5" /> Derived Outputs
              </span>
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">PoC Orchestration</span>
            </div>
            <ul className="space-y-2 text-slate-400 text-[11px]">
              <li className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="font-semibold text-slate-200 flex justify-between">
                  <span>emb_ghg_inventory_output</span>
                  <span className="text-emerald-400">85 rows</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  17 regions × 5 yrs consolidating POD HFCs, EQMD F-gases, and process calcs.
                </div>
              </li>

              <li className="p-2 rounded bg-slate-900 border border-slate-800">
                <div className="font-semibold text-slate-200 flex justify-between">
                  <span>mgb_energy_emissions_proxy</span>
                  <span className="text-purple-400">720 rows</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Scope-1 combustion proxy from quarterly diesel, gasoline, and coal fuels.
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Sectoral Observation Breakdown */}
      <div className="bg-[#121620] border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h3 className="text-base font-bold text-white font-sans">
            GHG Inventory by IPCC Sector ({selectedYear})
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Net Total: <strong className="text-emerald-400">{totalGhgMt.toFixed(2)} MtCO2e</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {sectorEmissions.map((item) => (
            <div key={item.sector} className="bg-[#0e121a] border border-slate-800 p-3.5 rounded-xl space-y-1 font-mono">
              <span className="text-slate-400 text-xs block">{item.sector}</span>
              <div className={`text-base font-bold ${item.value < 0 ? 'text-emerald-400' : 'text-slate-100'}`}>
                {item.value > 0 ? `+${item.value}` : item.value} <span className="text-[11px] font-normal text-slate-500">Mt</span>
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                {item.sector === 'LULUCF' ? 'Carbon Sink' : `${((item.value / (totalGhgMt || 1)) * 100).toFixed(1)}% share`}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
