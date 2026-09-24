import React from 'react';
import { 
  Info, 
  ShieldAlert, 
  FileText, 
  Building2, 
  CheckCircle2, 
  ExternalLink, 
  Clock, 
  Cpu
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-8 w-full">
      
      {/* Hero Banner */}
      <div className="bg-[#121620] border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Developer Handoff Specification v2.0
          </span>
          <span className="text-xs font-mono text-slate-400">
            Provenance, Architecture &amp; Methodology
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
          About the Philippine Climate Data Portal PoC
        </h1>
        <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
          A 3-day proof-of-concept deployment demonstrating institutional source-data expansion for the Department of Environment and Natural Resources (DENR-EMB and DENR-MGB).
        </p>
      </div>

      {/* Mandatory Synthetic Data Notice */}
      <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-800/40 text-xs font-sans text-amber-200/90 space-y-2">
        <div className="flex items-center gap-2 font-mono font-bold text-amber-300 uppercase tracking-wide text-sm">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
          Mandatory Synthetic Data Notice (Section 8 Guardrail)
        </div>
        <p className="leading-relaxed">
          Every EMB and MGB record introduced in this v2.0 revision is <strong>SYNTHETIC DEMO DATA</strong>. No synthetic facility or operator name is presented as a real company. All values are illustrative proxies calibrated to Philippine sectoral profiles and must never be cited or represented as official national GHG inventory submissions.
        </p>
      </div>

      {/* Section 1: Objective & Shift */}
      <div className="bg-[#121620] border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold text-white font-sans flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-400" />
          1. Revision Objective: Output-Shaped vs. Source-Layer Orchestration
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
          The v1 handoff was output-shaped: it contained aggregated regional and sectoral observations suitable for basic charts. v2 adds the institutional source layer. EMB and MGB source and activity datasets are represented separately, then connected to derived GHG outputs through explicit calculation notes and provenance metadata. This allows the portal to demonstrate genuine institutional data orchestration rather than superficial visualization.
        </p>
      </div>

      {/* Section 2: Public-Source Basis */}
      <div className="bg-[#121620] border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold text-white font-sans flex items-center gap-2">
          <Building2 className="w-4 h-4 text-cyan-400" />
          2. Public-Source Basis Used for Synthetic Structures
        </h2>
        <ul className="space-y-3 text-xs sm:text-sm text-slate-300 font-sans">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Climate Change Commission (CCC):</strong> DENR is designated lead sectoral agency for Waste, Industrial Processes and Product Use (IPPU), and Forestry under Executive Order No. 174 (PGHIRMS).</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Philippine 2015/2020 GHGI Executive Brief:</strong> Identifies DENR-EMB among the core sectoral inventory compilers for IPPU and Waste.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>MGB Standard Forms:</strong> Form 29-18 (Quarterly Energy Consumption), Form 29-19 (Annual Mineral Resource/Reserve Inventory), Integrated Annual Report (IAR), and Mineral Production statistics represent official reportorial instruments.</span>
          </li>
        </ul>
      </div>

      {/* Section 3: Production Migration Roadmap */}
      <div className="bg-[#121620] border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-base font-bold text-white font-sans flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-400" />
          3. 90-Day Production Migration Path
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
          The PoC contracts are intentionally source-oriented. During a 90-day pilot, each synthetic table can be replaced one-for-one by an agency-curated extract or direct API feed while preserving the database schema, provenance fields, geographic keys, and UI dashboard components. Real emission factors, confidentiality masks, and validation workflows must be approved by the responsible DENR bureaus prior to official production usage.
        </p>
      </div>

      {/* Civic Tech Colophon (Inspired by dynasties.bettergov.ph) */}
      <div className="pt-6 border-t border-slate-800 text-xs font-mono text-slate-500 space-y-2 text-center">
        <div>
          Design and civic-tech inspiration: <a href="https://dynasties.bettergov.ph" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white underline">Dynasties by BetterGov.ph</a>
        </div>
        <div>
          Philippine Climate Data Portal PoC · Built with React 19, TypeScript, Tailwind CSS, PostgreSQL 16 &amp; Docker
        </div>
      </div>

    </div>
  );
};
