import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  Search, 
  Download, 
  ExternalLink, 
  ShieldCheck, 
  Flame, 
  Activity, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileSpreadsheet,
  Filter
} from 'lucide-react';
import { 
  embPodHfc, 
  embEqmdFgas, 
  embProcess, 
  embCement, 
  embOds, 
  embAqms, 
  embVerif, 
  embEia, 
  embGhgOutput,
  normalizeRegionCode
} from '../utils/dataLoader';

interface EmbExplorerProps {
  selectedYear: number;
  selectedRegion: string;
  onOpenProvenance: (metricId: string, region: string) => void;
}

export const EmbExplorer: React.FC<EmbExplorerProps> = ({
  selectedYear,
  selectedRegion,
  onOpenProvenance
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'hfc' | 'fgas' | 'process' | 'cement' | 'ods' | 'aqms' | 'verif' | 'eia' | 'derived'
  >('hfc');

  const [tableFilter, setTableFilter] = useState('');

  const norm = selectedRegion !== 'ALL' ? normalizeRegionCode(selectedRegion) : null;
  const regCodeV2 = norm ? norm.v2 : 'ALL';

  const subTabs = [
    { id: 'hfc', label: 'POD HFCs (2.F)', count: embPodHfc.length },
    { id: 'fgas', label: 'EQMD F-Gases', count: embEqmdFgas.length },
    { id: 'process', label: 'Industrial Processes', count: embProcess.length },
    { id: 'cement', label: 'Cement & SCM', count: embCement.length },
    { id: 'ods', label: 'ODS Recovery', count: embOds.length },
    { id: 'aqms', label: 'AQMS Permitted Sources', count: embAqms.length },
    { id: 'verif', label: 'Regional MRV Verification', count: embVerif.length },
    { id: 'eia', label: 'EIA / ECC Commitments', count: embEia.length },
    { id: 'derived', label: 'Derived IPPU Output', count: embGhgOutput.length },
  ];

  // Filtered rows based on year, region and query
  const filteredData = useMemo(() => {
    const q = tableFilter.toLowerCase().trim();

    if (activeSubTab === 'hfc') {
      return embPodHfc.filter(r => 
        r.year === selectedYear &&
        (regCodeV2 === 'ALL' || r.region_code === regCodeV2) &&
        (!q || r.substance.toLowerCase().includes(q) || r.region_name.toLowerCase().includes(q))
      );
    }

    if (activeSubTab === 'fgas') {
      return embEqmdFgas.filter(r => 
        r.year === selectedYear &&
        (regCodeV2 === 'ALL' || r.region_code === regCodeV2) &&
        (!q || r.gas.toLowerCase().includes(q) || r.application.toLowerCase().includes(q))
      );
    }

    if (activeSubTab === 'process') {
      return embProcess.filter(r => 
        r.year === selectedYear &&
        (regCodeV2 === 'ALL' || r.region_code === regCodeV2) &&
        (!q || r.process.toLowerCase().includes(q) || r.facility.toLowerCase().includes(q))
      );
    }

    if (activeSubTab === 'cement') {
      return embCement.filter(r => 
        r.year === selectedYear &&
        (regCodeV2 === 'ALL' || r.region_code === regCodeV2) &&
        (!q || r.facility.toLowerCase().includes(q) || r.scm_type.toLowerCase().includes(q))
      );
    }

    if (activeSubTab === 'ods') {
      return embOds.filter(r => 
        r.year === selectedYear &&
        (regCodeV2 === 'ALL' || r.region_code === regCodeV2) &&
        (!q || r.substance.toLowerCase().includes(q) || r.management_action.toLowerCase().includes(q))
      );
    }

    if (activeSubTab === 'aqms') {
      return embAqms.filter(r => 
        r.year === selectedYear &&
        (regCodeV2 === 'ALL' || r.region_code === regCodeV2) &&
        (!q || r.facility.toLowerCase().includes(q) || r.fuel_or_source.toLowerCase().includes(q))
      );
    }

    if (activeSubTab === 'verif') {
      return embVerif.filter(r => 
        r.year === selectedYear &&
        (regCodeV2 === 'ALL' || r.region_code === regCodeV2) &&
        (!q || r.facility.toLowerCase().includes(q) || r.verification_status.toLowerCase().includes(q))
      );
    }

    if (activeSubTab === 'eia') {
      return embEia.filter(r => 
        r.year === selectedYear &&
        (regCodeV2 === 'ALL' || r.region_code === regCodeV2) &&
        (!q || r.project.toLowerCase().includes(q) || r.ecc_reference.toLowerCase().includes(q) || r.sector.toLowerCase().includes(q))
      );
    }

    // Derived IPPU
    return embGhgOutput.filter(r => 
      r.year === selectedYear &&
      (regCodeV2 === 'ALL' || r.region_code === regCodeV2) &&
      (!q || r.region_name.toLowerCase().includes(q))
    );
  }, [activeSubTab, selectedYear, regCodeV2, tableFilter]);

  // Export current table view as CSV
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
    link.setAttribute('download', `emb_${activeSubTab}_${selectedYear}.csv`);
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
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              DENR-EMB Institutional Domain
            </span>
            <span className="text-xs font-mono text-slate-400">
              IPPU, AQMS &amp; MRV Data Streams
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            Environmental Management Bureau Explorer
          </h1>
        </div>

        <button
          onClick={() => onOpenProvenance('EMB_IPPU_TOTAL', selectedRegion)}
          className="px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Inspect IPPU Provenance Drawer
        </button>
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

      {/* Table Card */}
      <div className="bg-[#121620] border border-slate-800 rounded-2xl p-5 space-y-4">
        
        {/* Table Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={tableFilter}
              onChange={(e) => setTableFilter(e.target.value)}
              placeholder="Filter table rows..."
              className="w-full bg-[#0e121a] border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">
              {filteredData.length} records matching ({selectedYear} · {regCodeV2})
            </span>
            <button
              onClick={handleExportCsv}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
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
                      const isDataStatus = col === 'data_status';
                      const isNumeric = typeof val === 'number';

                      return (
                        <td key={col} className="px-3.5 py-2">
                          {isDataStatus ? (
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
