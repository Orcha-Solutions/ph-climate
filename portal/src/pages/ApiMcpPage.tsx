import React, { useState } from 'react';
import { 
  Terminal, 
  Code, 
  Copy, 
  Check, 
  ShieldCheck, 
  Play, 
  Server, 
  Database, 
  ExternalLink,
  Bot
} from 'lucide-react';
import { getMetricTraceability } from '../utils/dataLoader';

export const ApiMcpPage: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState('EMB_IPPU_TOTAL');
  const [selectedRegion, setSelectedRegion] = useState('R03');
  const [selectedYear, setSelectedYear] = useState(2024);
  const [apiResponse, setApiResponse] = useState<any>(() => 
    getMetricTraceability('EMB_IPPU_TOTAL', 'R03', 2024)
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleTestApi = () => {
    const res = getMetricTraceability(selectedMetric, selectedRegion, selectedYear);
    setApiResponse(res);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const mcpConfigJson = {
    "mcpServers": {
      "ph-climate-database": {
        "command": "npx",
        "args": [
          "-y",
          "@modelcontextprotocol/server-postgres",
          "postgresql://postgres:postgres@localhost:5432/ph_climate_poc"
        ]
      }
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Page Title Hero */}
      <div className="bg-[#121620] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Developer &amp; Integration Hub
          </span>
          <span className="text-xs font-mono text-slate-400">
            Traceability Contract &amp; Model Context Protocol
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <Terminal className="w-6 h-6 text-emerald-400" />
          API, Database &amp; MCP Integration
        </h1>
        <p className="text-sm text-slate-300 font-sans max-w-3xl leading-relaxed">
          The Philippine Climate Data Portal exposes an institutional-first API contract. Every aggregate endpoint returns explicit provenance notes, QA/QC status, and upstream source dataset citations.
        </p>
      </div>

      {/* Section 1: Interactive Traceability Contract Tester */}
      <div className="bg-[#121620] border border-slate-800 rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div>
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-semibold">
              Live API Tester
            </span>
            <h2 className="text-lg font-bold text-white font-sans mt-0.5">
              Section 6 Traceability Contract Endpoint
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            GET /api/v1/metrics/traceability
          </span>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-[#0e121a] border border-slate-800 p-4 rounded-xl font-mono text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Metric ID</label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="w-full bg-[#151a24] border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="EMB_IPPU_TOTAL">EMB_IPPU_TOTAL (IPPU Orchestration)</option>
              <option value="MGB_MINING_SCOPE1">MGB_MINING_SCOPE1 (Form 29-18 Proxy)</option>
              <option value="CCET_FINANCE_TOTAL">CCET_FINANCE_TOTAL (Climate Budget)</option>
              <option value="GHG_INVENTORY_NET">GHG_INVENTORY_NET (Calibrated Net)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Region Code</label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full bg-[#151a24] border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">ALL (National)</option>
              <option value="R01">R01 (Ilocos)</option>
              <option value="R03">R03 (Central Luzon)</option>
              <option value="R04A">R04A (CALABARZON)</option>
              <option value="R07">R07 (Central Visayas)</option>
              <option value="R13">R13 (Caraga)</option>
              <option value="NCR">NCR (Metro Manila)</option>
              <option value="CAR">CAR (Cordillera)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Reporting Period</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full bg-[#151a24] border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {[2025, 2024, 2023, 2022, 2021].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleTestApi}
              className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Execute Query
            </button>
          </div>
        </div>

        {/* Live Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>HTTP Status: <strong className="text-emerald-400">200 OK</strong> · Content-Type: application/json</span>
            <button
              onClick={() => handleCopy(JSON.stringify(apiResponse, null, 2), 'trace-api')}
              className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 flex items-center gap-1"
            >
              {copiedKey === 'trace-api' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === 'trace-api' ? 'Copied' : 'Copy Payload'}
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-[#090b0e] border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto custom-scrollbar max-h-72">
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        </div>
      </div>

      {/* Section 2: PostgreSQL Direct Access & Docker Connectivity */}
      <div className="bg-[#121620] border border-slate-800 rounded-2xl p-6 space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h2 className="text-sm font-bold text-white font-sans flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            Direct PostgreSQL Connection (Docker Container)
          </h2>
          <span className="text-[11px] text-slate-400">Container: ph_climate_postgres:5432</span>
        </div>

        <div className="space-y-2">
          <p className="text-slate-300 font-sans">
            Connect directly to the PostgreSQL database with any SQL client (DBeaver, DataGrip, psql, or Adminer on port 8080):
          </p>

          <div className="p-3 bg-[#090b0e] border border-slate-800 rounded-xl text-slate-200 flex items-center justify-between">
            <code>psql -h localhost -p 5432 -U postgres -d ph_climate_poc</code>
            <button
              onClick={() => handleCopy('psql -h localhost -p 5432 -U postgres -d ph_climate_poc', 'psql')}
              className="p-1 hover:text-white"
            >
              {copiedKey === 'psql' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Sample SQL */}
        <div className="space-y-1.5 pt-2">
          <span className="text-slate-400 block text-[11px]">Reconciliation Query (Form 29-18 vs Scope 1 Proxy):</span>
          <pre className="p-3.5 rounded-xl bg-[#090b0e] border border-slate-800 text-[11px] text-slate-300 overflow-x-auto">
{`SELECT 
    year, 
    region_code, 
    SUM(diesel_l) AS total_diesel_l,
    SUM(coal_t) AS total_coal_t,
    SUM(scope1_proxy_tco2e) AS total_proxy_tco2e
FROM v_mgb_mining_emissions_reconciliation
WHERE year = 2024
GROUP BY year, region_code
ORDER BY total_proxy_tco2e DESC;`}
          </pre>
        </div>
      </div>

      {/* Section 3: Model Context Protocol (MCP) Server Configuration */}
      <div className="bg-[#121620] border border-slate-800 rounded-2xl p-6 space-y-4 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h2 className="text-sm font-bold text-white font-sans flex items-center gap-2">
            <Bot className="w-4 h-4 text-purple-400" />
            Model Context Protocol (MCP) Server Setup
          </h2>
          <span className="text-[11px] text-slate-400">Claude Desktop / Antigravity Agent Configuration</span>
        </div>

        <p className="text-slate-300 font-sans">
          To enable AI coding agents or LLMs to query and reason directly over the 28 climate &amp; mining tables, add this MCP server configuration:
        </p>

        <div className="relative">
          <button
            onClick={() => handleCopy(JSON.stringify(mcpConfigJson, null, 2), 'mcp')}
            className="absolute right-3 top-3 px-2.5 py-1 rounded bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 flex items-center gap-1 text-[11px]"
          >
            {copiedKey === 'mcp' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedKey === 'mcp' ? 'Copied' : 'Copy MCP Config'}
          </button>
          <pre className="p-4 rounded-xl bg-[#090b0e] border border-slate-800 text-[11px] text-purple-300 overflow-x-auto">
            {JSON.stringify(mcpConfigJson, null, 2)}
          </pre>
        </div>
      </div>

    </div>
  );
};
