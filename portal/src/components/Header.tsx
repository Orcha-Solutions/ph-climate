import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Sun, 
  Moon, 
  Layers, 
  Database, 
  MapPin, 
  Activity, 
  Pickaxe, 
  Terminal, 
  Info, 
  AlertTriangle,
  X,
  ExternalLink
} from 'lucide-react';
import { omniSearch, regions } from '../utils/dataLoader';
import type { SearchResult } from '../utils/dataLoader';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  onSelectSearchResult?: (result: SearchResult) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedYear,
  setSelectedYear,
  selectedRegion,
  setSelectedRegion,
  theme,
  setTheme,
  onSelectSearchResult
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.trim().length >= 2) {
      const results = omniSearch(q);
      setSearchResults(results);
      setIsSearchOpen(true);
    } else {
      setSearchResults([]);
      setIsSearchOpen(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'map', label: 'Climate Map', icon: MapPin },
    { id: 'emb', label: 'EMB / IPPU', icon: Layers },
    { id: 'mgb', label: 'MGB / Mining', icon: Pickaxe },
    { id: 'catalog', label: 'Data Catalog', icon: Database },
    { id: 'api', label: 'API & MCP', icon: Terminal },
    { id: 'about', label: 'About & Lineage', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0a0d12]/95 backdrop-blur-md">
      {/* Top Synthetic Demo Warning Banner */}
      

      {/* Main Header Container */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Mark (Inspired by dynasties.bettergov.ph) */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveTab('overview')}
              className="flex items-baseline gap-1.5 text-left group"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 group-hover:shadow-[0_0_8px_#10b981] transition-shadow self-center mr-1" />
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                ClimatePortal<span className="text-emerald-400">.ph</span>
              </span>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                by DENR-EMB &amp; MGB
              </span>
            </button>
          </div>

          {/* Omni-Search Field */}
          <div className="relative flex-1 max-w-md hidden md:block" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery.length >= 2 && setIsSearchOpen(true)}
                placeholder="Search facility, permit, region, substance..."
                className="w-full bg-[#12161f] border border-slate-700/60 rounded-full pl-9 pr-8 py-1.5 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 font-sans transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setIsSearchOpen(false); }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Dropdown Results */}
            {isSearchOpen && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-[#12161f] border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 divide-y divide-slate-800">
                <div className="px-3 py-1.5 text-[11px] font-mono text-slate-400 uppercase tracking-wider bg-slate-900/50">
                  Search Results ({searchResults.length})
                </div>
                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                  {searchResults.map((res, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        setIsSearchOpen(false);
                        if (res.type === 'Facility') {
                          setActiveTab('mgb');
                        } else if (res.type === 'ECC Project') {
                          setActiveTab('emb');
                        } else if (res.type === 'Region') {
                          if (res.id) setSelectedRegion(res.id);
                          setActiveTab('map');
                        } else if (res.type === 'Dataset') {
                          setActiveTab('catalog');
                        }
                        if (onSelectSearchResult) onSelectSearchResult(res);
                      }}
                      className="px-3.5 py-2 hover:bg-slate-800/60 cursor-pointer transition-colors flex items-start justify-between gap-2"
                    >
                      <div>
                        <div className="text-sm font-medium text-slate-200 flex items-center gap-2">
                          {res.title}
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {res.type}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {res.subtitle}
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-400 shrink-0">
                        {res.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Context Selectors (Year & Region) */}
          <div className="flex items-center gap-2">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-[#12161f] border border-slate-700 text-slate-200 text-xs font-mono rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              {[2025, 2024, 2023, 2022, 2021, 2020].map((y) => (
                <option key={y} value={y}>Year {y}</option>
              ))}
            </select>

            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-[#12161f] border border-slate-700 text-slate-200 text-xs font-mono rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer max-w-[130px] sm:max-w-none"
            >
              <option value="ALL">All Regions (PH)</option>
              {regions.map((r) => (
                <option key={r.region_code} value={r.region_code}>
                  {r.region_code} - {r.region_name}
                </option>
              ))}
            </select>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 rounded-lg border border-slate-700 bg-[#12161f] text-slate-300 hover:text-white hover:border-slate-600 transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Moon className="w-4 h-4 text-cyan-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
          </div>

        </div>

        {/* Navigation Tabs (Civic-Tech Pill Bar) */}
        <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar py-2 border-t border-slate-800/80 -mx-4 px-4 sm:mx-0 sm:px-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
