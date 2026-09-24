import React, { useState, useMemo } from 'react';
import { 
  Pickaxe, 
  Search, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  Fuel, 
  TrendingUp, 
  Layers, 
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { 
  mgbMines, 
  mgbProduction, 
  mgbEnergy, 
  mgbReserves, 
  mgbLanduse, 
  mgbProxy,
  normalizeRegionCode
} from '../utils/dataLoader';

interface MgbExplorerProps {
  selectedYear: number;
  selectedRegion: string;
  onOpenProvenance: (metricId: string, region: string) => void;
}

export const MgbExplorer: React.FC<MgbExplorerProps> = ({
  selectedYear,
  selectedRegion,
  onOpenProvenance
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'registry' | 'production' | 'energy' | 'proxy' | 'reserves' | 'landuse'
  >('registry');

  const [tableFilter, setTableFilter] = useState('');

  const norm = selectedRegion !== 'ALL' ? normalizeRegionCode(selectedRegion) : null;
  const regCodeV2 = norm ? norm.v2 : 'ALL';

  const subTabs = [
    { id: 'registry', label: 'Mines & Quarries Registry', count: mgbMines.length },
    { id: 'production', label: 'Mineral Production', count: mgbProduction.length },
    { id: 'energy', label: 'Form 29-18 Quarterly Energy', count: mgbEnergy.length },
    { id: 'proxy', label: 'Scope-1 Fuel Emissions Proxy', count: mgbProxy.length },
    { id: 'reserves', label: 'Form 29-19 Reserves', count: mgbReserves.length },
    { id: 'landuse', label: 'IAR Land-Use Footprint', count: mgbLanduse.length },
  ];

  // Aggregate stats for top banner
  const miningStats = useMemo(() => {
    const prodRows = mgbProduction.filter(p => 
      p.year === selectedYear && (regCodeV2 === 'ALL' || p.region_code === regCodeV2)
    );
    const totalValuePhp = prodRows.reduce((sum, p) => sum + p.production_value_php, 0);

    const landRows = mgbLanduse.filter(l => 
      l.year === selectedYear && (regCodeV2 === 'ALL' || l.region_code === regCodeV2)
    );
    const totalDisturbed = landRows.reduce((sum, l) => sum + l.disturbed_area_ha, 0);
    const totalRehab = landRows.reduce((sum, l) => sum + l.rehabilitated_area_ha, 0);

    const proxyRows = mgbProxy.filter(m => 
      m.year === selectedYear && (regCodeV2 === 'ALL' || m.region_code === regCodeV2)
    );
    const totalProxy = proxyRows.reduce((sum, m) => sum + m.scope1_proxy_tco2e, 0);

    return {
      grossValueBillion: (totalValuePhp / 1e9).toFixed(2),
      disturbedHa: Math.round(totalDisturbed).toLocaleString(),
      rehabHa: Math.round(totalRehab).toLocaleString(),
      scope1Proxy: Math.round(totalProxy).toLocaleString()
    };
  }, [selectedYear, regCodeV2]);

  // Filtered rows for active tab
  const filteredData = useMemo(() => {
    const q = tableFilter.toLowerCase().trim();

    if (activeSubTab === 'registry') {
      return mgbMines.filter(m => 
        (regCodeV2 === 'ALL' || m.region_code === regCodeV2) &&
        (!q || m.operator.toLowerCase().includes(q) || m.commodity.toLowerCase().includes(q) || m.permit_no.toLowerCase().includes(q))
      );
    }

    if (activeSubTab === 'production') {
      return mgbProduction.filter(p => 
        p.year === selectedYear &&
        (regCodeV2 === 'ALL' || p.region_code === regCodeV2) &&
        (!q || p.operator.toLowerCase().includes(q) || p.commodity.toLowerCase().includes(q))
      );
    }

    if (activeSubTab === 'energy') {
      return mgbEnergy.filter(e => 
        e.year === selectedYear &&
        (regCodeV2 === 'ALL' || e.region_code === regCodeV2) &&
        (!q || e.operator.toLowerCase().includes(q) || e.commodity.toLowerCase().includes(q))
      );
    }

    if (activeSubTab === 'proxy') {
      return mgbProxy.filter(p => 
        p.year === selectedYear &&
        (regCodeV2 === 'ALL' || p.region_code === regCodeV2) &&
        (!q || p.facility_id.toLowerCase().includes(q) || p.region_name.toLowerCase().includes(q))
      );
    }

    if (activeSubTab === 'reserves') {
      return mgbReserves.filter(r => 
        r.year === selectedYear &&
        (regCodeV2 === 'ALL' || r.region_code === regCodeV2) &&
        (!q || r.operator.toLowerCase().includes(q) || r.commodity.toLowerCase().includes(q))
      );
    }

    // Land-use footprint
    return mgbLanduse.filter(l => 
      l.year === selectedYear &&
      (regCodeV2 === 'ALL' || l.region_code === regCodeV2) &&
      (!q || l.operator.toLowerCase().includes(q) || l.commodity.toLowerCase().includes(q))
    );
  }, [activeSubTab, selectedYear, regCodeV2, tableFilter]);

  const handleExportCsv = () => {
    if (filteredData.length === 0) return;
    const headers = Object.keys(filteredData[0]);
    const csvContent = [
      headers.join(','),
      ...filteredData.map(row => 
        headers.map(h => {
          const val = (row as any)[h];
          if (val === null || val === undefined) return '';
          return `"${String(val).replace(/"/g, '""')}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `mgb_${activeSubTab}_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Domain Header */}
      <div className="bg-[#121620] border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
              DENR-MGB Institutional Domain
            </span>
            <span className="text-xs font-mono text-slate-400">
              Mines, Production &amp; Form 29-18 Reporting
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <Pickaxe className="w-5 h-5 text-purple-400" />
            Mines and Geosciences Bureau Explorer
          </h1>
        </div>

        <button
          onClick={() => onOpenProvenance('MGB_MINING_SCOPE1', selectedRegion)}
          className="px-3.5 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Fuel className="w-4 h-4 text-purple-400" />
          Reconcile Form 29-18 Fuel Proxy
        </button>
      </div>

      {/* High-level Mining KPI Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-mono text-xs">
        <div className="bg-[#121620] border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-slate-400 text-[11px] block">Mineral Gross Value ({selectedYear})</span>
          <div className="text-xl font-bold text-emerald-400">
            ₱{miningStats.grossValueBillion}B
          </div>
          <span className="text-[10px] text-slate-500">MGB Forms 29-1 to 29-16</span>
        </div>

        <div className="bg-[#121620] border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-slate-400 text-[11px] block">Disturbed Land Area</span>
          <div className="text-xl font-bold text-amber-300">
            {miningStats.disturbedHa} <span className="text-xs font-normal text-slate-400">ha</span>
          </div>
          <span className="text-[10px] text-slate-500">Integrated Annual Report</span>
        </div>

        <div className="bg-[#121620] border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-slate-400 text-[11px] block">Rehabilitated Land Area</span>
          <div className="text-xl font-bold text-cyan-300">
            {miningStats.rehabHa} <span className="text-xs font-normal text-slate-400">ha</span>
          </div>
          <span className="text-[10px] text-slate-500">Active Revegetation</span>
        </div>

        <div className="bg-[#121620] border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-slate-400 text-[11px] block">Scope 1 Fuel Proxy</span>
          <div className="text-xl font-bold text-purple-300">
            {miningStats.scope1Proxy} <span className="text-xs font-normal text-slate-400">tCO2e</span>
          </div>
          <span className="text-[10px] text-slate-500">Form 29-18 Combustion</span>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1">
        {subTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveSubTab(tab.id as any); setTableFilter(''); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeSubTab === tab.id
                ? 'bg-slate-700/80 text-white font-semibold border border-slate-600'
                : 'bg-[#121620] text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {tab.label}
            <span className="text-[10px] px-1 py-0.2 rounded bg-slate-900/60 text-slate-400">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div className="bg-[#121620] border border-slate-800 rounded-2xl p-5 space-y-4">
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={tableFilter}
              onChange={(e) => setTableFilter(e.target.value)}
              placeholder="Filter mining records..."
              className="w-full bg-[#0e121a] border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">
              {filteredData.length} records ({selectedYear} · {regCodeV2})
            </span>
            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-purple-400" />
              CSV
            </button>
          </div>
        </div>

        {/* Dynamic Table */}
        <div className="border border-slate-800 rounded-xl overflow-x-auto max-h-[500px] custom-scrollbar bg-[#0e121a]">
          {filteredData.length > 0 ? (
            <table className="w-full text-left text-xs font-mono whitespace-nowrap">
              <thead className="bg-[#151a24] text-slate-400 border-b border-slate-800 sticky top-0 z-10">
                <tr>
                  {Object.keys(filteredData[0]).map(col => (
                    <th key={col} className="px-3.5 py-2.5 font-medium">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {filteredData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    {Object.keys(filteredData[0]).map(col => {
                      const val = (row as any)[col];
                      const isStatus = col === 'data_status';
                      const isNumeric = typeof val === 'number';

                      return (
                        <td key={col} className="px-3.5 py-2">
                          {isStatus ? (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                              {val}
                            </span>
                          ) : isNumeric ? (
                            <span className="text-slate-100 font-semibold">
                              {val.toLocaleString()}
                            </span>
                          ) : (
                            String(val ?? '')
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-slate-500 font-mono text-xs">
              No matching records found for the selected year ({selectedYear}) and region ({regCodeV2}).
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
