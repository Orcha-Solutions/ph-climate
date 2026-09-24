import React, { useState, useMemo } from 'react';
import { 
  Database, 
  Search, 
  Download, 
  ExternalLink, 
  ArrowRight, 
  Layers, 
  Pickaxe, 
  Flame, 
  CheckCircle2, 
  ShieldAlert,
  FileSpreadsheet
} from 'lucide-react';
import { sourceDataCatalog, sourceCrosswalk, dataCatalog } from '../utils/dataLoader';

interface DataCatalogPageProps {
  onNavigateTab: (tab: string) => void;
  onOpenProvenance: (metricId: string, region: string) => void;
}

export const DataCatalogPage: React.FC<DataCatalogPageProps> = ({
  onNavigateTab,
  onOpenProvenance
}) => {
  const [selectedAgency, setSelectedAgency] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCatalogView, setActiveCatalogView] = useState<'v2_source' | 'crosswalk' | 'v1_foundation'>('v2_source');

  const filteredV2 = useMemo(() => {
    return sourceDataCatalog.filter(d => {
      const matchAgency = selectedAgency === 'ALL' || d.agency === selectedAgency;
      const matchQ = !searchQuery || 
        d.dataset_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.dataset_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.source_unit.toLowerCase().includes(searchQuery.toLowerCase());
      return matchAgency && matchQ;
    });
  }, [selectedAgency, searchQuery]);

  return (
    <div className="space-y-6">
      
      {/* Catalog Banner */}
      <div className="bg-[#121620] border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Institutional Data Repository
            </span>
            <span className="text-xs font-mono text-slate-400">
              28 Total Datasets (15 v2 Streams + 8 v1 Observations + Crosswalks)
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            PoC Data Catalog &amp; Institutional Registry
          </h1>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-[#0a0d12] border border-slate-800 rounded-xl text-xs font-mono">
          <button
            onClick={() => setActiveCatalogView('v2_source')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeCatalogView === 'v2_source' 
                ? 'bg-slate-700 text-white font-semibold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            v2 Source Datasets (15)
          </button>
          <button
            onClick={() => setActiveCatalogView('crosswalk')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeCatalogView === 'crosswalk' 
                ? 'bg-slate-700 text-white font-semibold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Source-to-PoC Crosswalk
          </button>
          <button
            onClick={() => setActiveCatalogView('v1_foundation')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeCatalogView === 'v1_foundation' 
                ? 'bg-slate-700 text-white font-semibold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            v1 Core Inventory (8)
          </button>
        </div>
      </div>

      {/* Agency Filter Pills */}
      {activeCatalogView === 'v2_source' && (
        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'EMB', 'MGB', 'DERIVED'].map(agency => (
            <button
              key={agency}
              onClick={() => setSelectedAgency(agency)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                selectedAgency === agency
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'bg-[#121620] text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {agency === 'ALL' ? 'All Agencies (15)' : agency === 'DERIVED' ? 'Derived Orchestration' : `DENR-${agency}`}
            </button>
          ))}

          {/* Quick Search */}
          <div className="relative ml-auto max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search datasets..."
              className="w-full bg-[#121620] border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-mono"
            />
          </div>
        </div>
      )}

      {/* View 1: v2 Source Data Catalog Cards */}
      {activeCatalogView === 'v2_source' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredV2.map(item => {
            const isEmb = item.agency === 'EMB';
            const isMgb = item.agency === 'MGB';
            const isDerived = item.agency === 'DERIVED';

            return (
              <div 
                key={item.dataset_id}
                className="bg-[#121620] border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                      isEmb ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      isMgb ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                      'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                    }`}>
                      {item.agency} · {item.source_unit}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-300">
                      {item.records} rows
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white font-sans leading-snug">
                    {item.dataset_title}
                  </h3>

                  <div className="text-xs font-mono text-slate-400 space-y-1 pt-1">
                    <div className="text-[11px] text-slate-500">Target Table: <code className="text-slate-300 font-mono">{item.dataset_id}</code></div>
                    <div className="text-[11px] text-slate-500">Coverage: <span className="text-slate-300">{item.coverage}</span></div>
                    <div className="text-[11px] text-slate-500">Portal Use: <span className="text-slate-400">{item.portal_use}</span></div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {item.status}
                  </span>

                  <button
                    onClick={() => {
                      if (isEmb) onNavigateTab('emb');
                      else if (isMgb) onNavigateTab('mgb');
                      else onNavigateTab('overview');
                    }}
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    Open View <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View 2: Source-to-PoC Crosswalk Table */}
      {activeCatalogView === 'crosswalk' && (
        <div className="bg-[#121620] border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="text-xs text-slate-400 font-sans">
            Section 2 Crosswalk Table from Developer Handoff Spec v2.0 defining institutional source units, target schemas, transformations, and dashboard utilization.
          </div>

          <div className="border border-slate-800 rounded-xl overflow-x-auto max-h-[500px] custom-scrollbar bg-[#0e121a]">
            <table className="w-full text-left text-xs font-mono whitespace-nowrap">
              <thead className="bg-[#151a24] text-slate-400 border-b border-slate-800 sticky top-0">
                <tr>
                  <th className="px-3.5 py-2.5">Agency</th>
                  <th className="px-3.5 py-2.5">Source Unit</th>
                  <th className="px-3.5 py-2.5">Dataset Stream</th>
                  <th className="px-3.5 py-2.5">PoC Table</th>
                  <th className="px-3.5 py-2.5">Rows</th>
                  <th className="px-3.5 py-2.5">Key Fields</th>
                  <th className="px-3.5 py-2.5">Transformation</th>
                  <th className="px-3.5 py-2.5">Dashboard Use</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {sourceCrosswalk.map((c, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-3.5 py-2 font-bold text-slate-200">{c.agency}</td>
                    <td className="px-3.5 py-2 text-slate-400">{c.source_unit}</td>
                    <td className="px-3.5 py-2 text-slate-100">{c.source_dataset}</td>
                    <td className="px-3.5 py-2 text-cyan-400 font-semibold">{c.synthetic_table}</td>
                    <td className="px-3.5 py-2 text-emerald-400 font-bold">{c.record_count}</td>
                    <td className="px-3.5 py-2 text-slate-400 text-[11px]">{c.key_fields}</td>
                    <td className="px-3.5 py-2 text-slate-300 text-[11px]">{c.transformation}</td>
                    <td className="px-3.5 py-2 text-amber-300 text-[11px]">{c.dashboard_use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 3: v1 Foundation Catalog */}
      {activeCatalogView === 'v1_foundation' && (
        <div className="bg-[#121620] border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="text-xs text-slate-400 font-sans">
            Baseline observation layers representing national &amp; regional GHG emissions, climate finance expenditure tagging (CCET), and adaptation tracking.
          </div>

          <div className="border border-slate-800 rounded-xl overflow-x-auto max-h-[500px] custom-scrollbar bg-[#0e121a]">
            <table className="w-full text-left text-xs font-mono whitespace-nowrap">
              <thead className="bg-[#151a24] text-slate-400 border-b border-slate-800 sticky top-0">
                <tr>
                  <th className="px-3.5 py-2.5">Dataset ID</th>
                  <th className="px-3.5 py-2.5">Title</th>
                  <th className="px-3.5 py-2.5">Domain</th>
                  <th className="px-3.5 py-2.5">Records</th>
                  <th className="px-3.5 py-2.5">Spatial Granularity</th>
                  <th className="px-3.5 py-2.5">Temporal</th>
                  <th className="px-3.5 py-2.5">Authoritative Owner</th>
                  <th className="px-3.5 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {dataCatalog.map((d, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-3.5 py-2 font-bold text-cyan-400">{d.dataset_id}</td>
                    <td className="px-3.5 py-2 text-slate-100">{d.title}</td>
                    <td className="px-3.5 py-2 text-emerald-400">{d.domain}</td>
                    <td className="px-3.5 py-2 font-bold text-slate-200">{d.records}</td>
                    <td className="px-3.5 py-2 text-slate-400">{d.spatial_granularity}</td>
                    <td className="px-3.5 py-2 text-slate-400">{d.temporal_granularity}</td>
                    <td className="px-3.5 py-2 text-slate-400 text-[11px]">{d.authoritative_owner_candidate}</td>
                    <td className="px-3.5 py-2 text-amber-300 text-[10px]">{d.poc_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
