import React, { useState } from 'react';
import { 
  X, 
  Database, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Check, 
  Download, 
  ExternalLink,
  Layers,
  Table as TableIcon,
  Code
} from 'lucide-react';
import type { MetricTraceability } from '../types/data';

interface ProvenanceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: MetricTraceability | null;
}

export const ProvenanceDrawer: React.FC<ProvenanceDrawerProps> = ({
  isOpen,
  onClose,
  data
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'records' | 'json'>('details');

  if (!isOpen || !data) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportRecordsCsv = () => {
    if (!data.upstream_records || data.upstream_records.length === 0) return;
    const records = data.upstream_records;
    const headers = Object.keys(records[0]);
    const csvContent = [
      headers.join(','),
      ...records.map(row => 
        headers.map(h => {
          const val = row[h];
          if (val === null || val === undefined) return '';
          const str = String(val).replace(/"/g, '""');
          return `"${str}"`;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${data.metric_id}_${data.reporting_period}_upstream_records.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-[#0f131a] border-l border-slate-800 shadow-2xl flex flex-col text-slate-200">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-800 bg-[#141923] flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-0.5">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white font-mono">
                    {data.metric_id}
                  </h2>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {data.data_status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 font-sans">
                  Institutional Data Lineage &amp; Provenance Inspection (Section 6 Contract)
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-2 px-5 py-2.5 bg-[#12161f] border-b border-slate-800 text-xs font-mono">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'details'
                  ? 'bg-slate-700/60 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Metadata Contract
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'records'
                  ? 'bg-slate-700/60 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" /> Upstream Records ({data.source_record_count})
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`px-3 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                activeTab === 'json'
                  ? 'bg-slate-700/60 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" /> Raw JSON
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-6">

            {activeTab === 'details' && (
              <>
                {/* Primary Metric Value Card */}
                <div className="bg-[#141822] border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                      Reported Aggregate Value
                    </span>
                    <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                      {data.value.toLocaleString()} <span className="text-sm font-normal text-slate-300">{data.unit}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                      Period &amp; Geography
                    </span>
                    <div className="text-sm font-mono text-slate-200 mt-1">
                      {data.reporting_period} · {data.geography.region_name || data.geography.region_code}
                    </div>
                  </div>
                </div>

                {/* Section 6 Contract Fields */}
                <div className="space-y-4">
                  <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-cyan-400" /> Traceability Fields
                  </h3>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="bg-[#12161f] border border-slate-800/80 p-3 rounded-lg">
                      <span className="text-slate-400 block text-[11px]">QA/QC Validation Status</span>
                      <span className="text-slate-200 font-semibold mt-1 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        {data.qa_status}
                      </span>
                    </div>

                    <div className="bg-[#12161f] border border-slate-800/80 p-3 rounded-lg">
                      <span className="text-slate-400 block text-[11px]">Upstream Source Count</span>
                      <span className="text-slate-200 font-semibold mt-1">
                        {data.source_record_count} records contributing
                      </span>
                    </div>
                  </div>

                  {/* Calculation Methodology */}
                  <div className="bg-[#12161f] border border-slate-800/80 p-3.5 rounded-lg space-y-1.5">
                    <span className="text-xs font-mono text-slate-400 block uppercase tracking-wider">
                      Calculation &amp; Estimation Note
                    </span>
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      {data.method_note}
                    </p>
                  </div>

                  {/* Upstream Source Datasets */}
                  <div className="bg-[#12161f] border border-slate-800/80 p-3.5 rounded-lg space-y-2">
                    <span className="text-xs font-mono text-slate-400 block uppercase tracking-wider">
                      Upstream Contributing Datasets
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {data.source_dataset_ids.map((id) => (
                        <div 
                          key={id}
                          className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700 font-mono text-xs flex items-center gap-1.5"
                        >
                          <Database className="w-3 h-3 text-emerald-400" />
                          {id}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Synthetic Data Guardrail Notice */}
                  <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1 font-sans">
                    <div className="font-semibold text-slate-300 flex items-center gap-1 font-mono">
                      <FileText className="w-3.5 h-3.5 text-amber-400" /> Developer Handoff Guardrail (Section 6 &amp; 8)
                    </div>
                    <div>
                      This aggregate is computed directly from synthetic data streams designed to validate institutional flow. Facility names and activity volumes do not represent official DENR/CCC inventory submissions.
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'records' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">
                    Showing {data.upstream_records?.length || 0} raw contributing records
                  </span>
                  {data.upstream_records && data.upstream_records.length > 0 && (
                    <button
                      onClick={exportRecordsCsv}
                      className="px-2.5 py-1 text-xs font-mono rounded bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 flex items-center gap-1 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-emerald-400" /> Export CSV
                    </button>
                  )}
                </div>

                {data.upstream_records && data.upstream_records.length > 0 ? (
                  <div className="border border-slate-800 rounded-lg overflow-x-auto max-h-[500px] custom-scrollbar bg-[#12161f]">
                    <table className="w-full text-left text-xs font-mono whitespace-nowrap">
                      <thead className="bg-[#171c26] text-slate-400 border-b border-slate-800 sticky top-0">
                        <tr>
                          {Object.keys(data.upstream_records[0]).map((col) => (
                            <th key={col} className="px-3 py-2 font-medium">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {data.upstream_records.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                            {Object.keys(data.upstream_records![0]).map((col) => (
                              <td key={col} className="px-3 py-1.5">
                                {typeof row[col] === 'number' 
                                  ? row[col].toLocaleString() 
                                  : String(row[col] ?? '')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500 font-mono text-xs">
                    No individual row records available for this aggregate.
                  </div>
                )}
              </div>
            )}

            {activeTab === 'json' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400">
                    Section 6 Traceability Response Payload
                  </span>
                  <button
                    onClick={handleCopyJson}
                    className="px-2.5 py-1 text-xs font-mono rounded bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 flex items-center gap-1 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy JSON'}
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-[#090b0e] border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto custom-scrollbar max-h-[500px]">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800 bg-[#12161f] flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Schema: Developer Handoff Specification v2.0</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              Close Drawer
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
