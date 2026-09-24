import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProvenanceDrawer } from './components/ProvenanceDrawer';
import { ExecutiveOverview } from './pages/ExecutiveOverview';
import { MapExplorer } from './components/MapExplorer';
import { EmbExplorer } from './pages/EmbExplorer';
import { MgbExplorer } from './pages/MgbExplorer';
import { DataCatalogPage } from './pages/DataCatalogPage';
import { ApiMcpPage } from './pages/ApiMcpPage';
import { AboutPage } from './pages/AboutPage';
import { getMetricTraceability } from './utils/dataLoader';
import type { SearchResult } from './utils/dataLoader';
import type { MetricTraceability } from './types/data';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Provenance Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [provenanceData, setProvenanceData] = useState<MetricTraceability | null>(null);

  // Sync dark class on html root
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Open Provenance Drawer
  const handleOpenProvenance = (metricId: string, regionCode: string = 'ALL') => {
    const data = getMetricTraceability(metricId, regionCode, selectedYear);
    setProvenanceData(data);
    setIsDrawerOpen(true);
  };

  const handleSelectSearchResult = (result: SearchResult) => {
    if (result.type === 'Region' && result.id) {
      setSelectedRegion(result.id);
      setActiveTab('map');
    } else if (result.type === 'Facility') {
      setActiveTab('mgb');
    } else if (result.type === 'ECC Project') {
      setActiveTab('emb');
    } else if (result.type === 'Dataset') {
      setActiveTab('catalog');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0d12] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      
      {/* Sticky Header with Navigation & Omni-Search */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        theme={theme}
        setTheme={setTheme}
        onSelectSearchResult={handleSelectSearchResult}
      />

      {/* Main Page Body */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'overview' && (
          <ExecutiveOverview
            selectedYear={selectedYear}
            selectedRegion={selectedRegion}
            onNavigateTab={setActiveTab}
            onOpenProvenance={handleOpenProvenance}
          />
        )}

        {activeTab === 'map' && (
          <MapExplorer
            selectedYear={selectedYear}
            selectedRegion={selectedRegion}
            onSelectRegion={setSelectedRegion}
            onOpenProvenance={handleOpenProvenance}
          />
        )}

        {activeTab === 'emb' && (
          <EmbExplorer
            selectedYear={selectedYear}
            selectedRegion={selectedRegion}
            onOpenProvenance={handleOpenProvenance}
          />
        )}

        {activeTab === 'mgb' && (
          <MgbExplorer
            selectedYear={selectedYear}
            selectedRegion={selectedRegion}
            onOpenProvenance={handleOpenProvenance}
          />
        )}

        {activeTab === 'catalog' && (
          <DataCatalogPage
            onNavigateTab={setActiveTab}
            onOpenProvenance={handleOpenProvenance}
          />
        )}

        {activeTab === 'api' && (
          <ApiMcpPage />
        )}

        {activeTab === 'about' && (
          <AboutPage />
        )}
      </main>

      {/* Universal Provenance Slide-Out Drawer */}
      <ProvenanceDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        data={provenanceData}
      />

      {/* Civic Tech Footer (Inspired by dynasties.bettergov.ph) */}
      <footer className="border-t border-slate-800/80 bg-[#0d1017] py-6 px-4 sm:px-6 lg:px-8 text-xs font-mono text-slate-500">
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-slate-300 font-semibold font-sans">ClimatePortal.ph</span>
            <span>·</span>
            <span>DENR-EMB &amp; DENR-MGB Source Expansion PoC v2.0</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <button onClick={() => setActiveTab('catalog')} className="hover:text-white transition-colors">
              Data Catalog
            </button>
            <span>·</span>
            <button onClick={() => setActiveTab('api')} className="hover:text-white transition-colors">
              API &amp; MCP
            </button>
            <span>·</span>
            <button onClick={() => setActiveTab('about')} className="hover:text-white transition-colors">
              Methodology
            </button>
            <span>·</span>
            <a 
              href="https://dynasties.bettergov.ph" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-500 hover:text-slate-300"
            >
              BetterGov.ph UI Style
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
