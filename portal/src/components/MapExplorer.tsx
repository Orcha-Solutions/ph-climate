import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  Flame, 
  ShieldAlert, 
  DollarSign, 
  Pickaxe, 
  CloudSun, 
  Filter,
  Check,
  ExternalLink,
  RotateCcw,
  Maximize2
} from 'lucide-react';
import phRegionsGeoJson from '../data/ph_regions.json';
import { 
  regions, 
  ghgInventory, 
  climateRisk, 
  climateFinance, 
  mgbProxy, 
  mgbMines, 
  climateStations,
  normalizeRegionCode
} from '../utils/dataLoader';

interface MapExplorerProps {
  selectedYear: number;
  selectedRegion: string;
  onSelectRegion: (code: string) => void;
  onOpenProvenance?: (metricId: string, region: string) => void;
}

export const MapExplorer: React.FC<MapExplorerProps> = ({
  selectedYear,
  selectedRegion,
  onSelectRegion,
  onOpenProvenance
}) => {
  const [activeMetric, setActiveMetric] = useState<'emissions' | 'risk' | 'finance' | 'mining'>('emissions');
  const [showMinesOverlay, setShowMinesOverlay] = useState(true);
  const [showStationsOverlay, setShowStationsOverlay] = useState(false);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const geojsonLayerRef = useRef<L.GeoJSON | null>(null);
  const minesLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const stationsLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // Regional aggregated stats for choropleth
  const regionStats = useMemo(() => {
    const stats: Record<string, {
      codeV1: string;
      codeV2: string;
      psgc: string;
      name: string;
      emissionsMt: number;
      riskIndex: number;
      financePhpM: number;
      miningScope1: number;
      minesCount: number;
      stationsCount: number;
    }> = {};

    regions.forEach(r => {
      const codeV1 = r.region_code;
      const norm = normalizeRegionCode(codeV1);
      const codeV2 = norm?.v2 || codeV1;

      // Emissions
      const regEmissions = ghgInventory
        .filter(g => g.year === selectedYear && g.region_code === codeV1)
        .reduce((sum, g) => sum + g.emissions_mtco2e, 0);

      // Risk
      const regRisk = climateRisk.find(k => k.year === selectedYear && k.region_code === codeV1);
      const riskVal = regRisk ? regRisk.composite_climate_risk_index : 0;

      // Finance
      const regFin = climateFinance
        .filter(f => f.fiscal_year === selectedYear && f.region_code === codeV1)
        .reduce((sum, f) => sum + f.tagged_budget_php_m, 0);

      // Mining
      const regMining = mgbProxy
        .filter(m => m.year === selectedYear && m.region_code === codeV2)
        .reduce((sum, m) => sum + m.scope1_proxy_tco2e, 0);

      // Counts
      const mines = mgbMines.filter(m => m.region_code === codeV2).length;
      const stns = climateStations.filter(s => s.region_code === codeV1).length;

      stats[codeV1] = {
        codeV1,
        codeV2,
        psgc: r.region_psgc,
        name: r.region_name,
        emissionsMt: Math.round(regEmissions * 100) / 100,
        riskIndex: Math.round(riskVal * 10) / 10,
        financePhpM: Math.round(regFin * 10) / 10,
        miningScope1: Math.round(regMining * 10) / 10,
        minesCount: mines,
        stationsCount: stns
      };
    });

    return stats;
  }, [selectedYear]);

  // Color generator based on metric
  const getFeatureColor = (codeV1: string) => {
    const stat = regionStats[codeV1];
    if (!stat) return '#1e293b';

    if (activeMetric === 'emissions') {
      const val = stat.emissionsMt;
      if (val > 10) return '#ef4444'; // Red
      if (val > 5) return '#f97316';  // Orange
      if (val > 2) return '#eab308';  // Amber
      return '#10b981'; // Emerald
    }

    if (activeMetric === 'risk') {
      const val = stat.riskIndex;
      if (val > 60) return '#dc2626';
      if (val > 48) return '#ea580c';
      if (val > 40) return '#d97706';
      return '#059669';
    }

    if (activeMetric === 'finance') {
      const val = stat.financePhpM;
      if (val > 2500) return '#06b6d4';
      if (val > 1500) return '#0284c7';
      if (val > 800) return '#3b82f6';
      return '#64748b';
    }

    if (activeMetric === 'mining') {
      const val = stat.miningScope1;
      if (val > 15000) return '#a855f7';
      if (val > 8000) return '#8b5cf6';
      if (val > 2000) return '#6366f1';
      return '#334155';
    }

    return '#1e293b';
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Philippines geographic center
      const map = L.map(mapContainerRef.current, {
        center: [12.8797, 121.7740],
        zoom: 6,
        minZoom: 5,
        maxZoom: 14,
        zoomControl: true,
        attributionControl: false
      });

      // CartoDB Dark Matter tile layer (matching dynasties.bettergov.ph civic tech aesthetic)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      mapInstanceRef.current = map;
      minesLayerGroupRef.current = L.layerGroup().addTo(map);
      stationsLayerGroupRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update GeoJSON Layer when metric or selection changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (geojsonLayerRef.current) {
      map.removeLayer(geojsonLayerRef.current);
    }

    // Helper to find region code from GeoJSON properties
    const findRegionCode = (props: any): string => {
      const pcode = props.ADM1_PCODE || '';
      const en = props.ADM1_EN || '';
      const alt1 = props.ADM1ALT1EN || '';

      // Match by PSGC
      const matchPsgc = regions.find(r => r.region_psgc.slice(0, 4) === pcode.slice(0, 4));
      if (matchPsgc) return matchPsgc.region_code;

      // Match by Name/Alt
      const norm = normalizeRegionCode(alt1) || normalizeRegionCode(en);
      if (norm) return norm.v1;

      if (en.includes('National Capital') || alt1 === 'NCR') return 'NCR';
      if (en.includes('Cordillera') || alt1 === 'CAR') return 'CAR';
      if (en.includes('Muslim Mindanao') || alt1 === 'ARMM') return 'BARMM';

      return 'NCR';
    };

    const layer = L.geoJSON(phRegionsGeoJson as any, {
      style: (feature) => {
        if (!feature) return {};
        const codeV1 = findRegionCode(feature.properties);
        const isSelected = selectedRegion === codeV1;
        const color = getFeatureColor(codeV1);

        return {
          fillColor: color,
          weight: isSelected ? 2.5 : 1,
          opacity: 1,
          color: isSelected ? '#10b981' : '#334155',
          fillOpacity: isSelected ? 0.8 : 0.6
        };
      },
      onEachFeature: (feature, layer) => {
        const codeV1 = findRegionCode(feature.properties);
        const stat = regionStats[codeV1];
        const reg = regions.find(r => r.region_code === codeV1);

        // Tooltip popup
        if (stat && reg) {
          const tooltipContent = `
            <div style="font-family: monospace; font-size: 11px; padding: 4px;">
              <strong style="color: #10b981; font-size: 12px;">${reg.region_name} (${codeV1})</strong><br/>
              <span style="color: #94a3b8;">Population: ${(reg.population_2020 / 1e6).toFixed(2)}M</span><br/>
              <span style="color: #e2e8f0;">Net GHG: <b>${stat.emissionsMt} Mt</b></span><br/>
              <span style="color: #fbbf24;">Risk Index: <b>${stat.riskIndex}/100</b></span><br/>
              <span style="color: #38bdf8;">CCET Tagged: <b>₱${stat.financePhpM}M</b></span><br/>
              <span style="color: #c084fc;">Mining Scope-1: <b>${stat.miningScope1} tCO2e</b></span>
            </div>
          `;
          layer.bindTooltip(tooltipContent, { sticky: true, opacity: 0.95 });
        }

        layer.on({
          mouseover: (e) => {
            const target = e.target;
            target.setStyle({
              weight: 2.5,
              color: '#ffffff',
              fillOpacity: 0.85
            });
            setHoveredRegion(codeV1);
          },
          mouseout: (e) => {
            if (geojsonLayerRef.current) {
              geojsonLayerRef.current.resetStyle(e.target);
            }
            setHoveredRegion(null);
          },
          click: () => {
            onSelectRegion(selectedRegion === codeV1 ? 'ALL' : codeV1);
          }
        });
      }
    });

    layer.addTo(map);
    geojsonLayerRef.current = layer;
  }, [activeMetric, selectedYear, selectedRegion, regionStats]);

  // Update MGB Mines Overlay Markers
  useEffect(() => {
    const group = minesLayerGroupRef.current;
    if (!group) return;
    group.clearLayers();

    if (!showMinesOverlay) return;

    mgbMines.forEach((mine) => {
      const norm = normalizeRegionCode(mine.region_code);
      const reg = regions.find(r => r.region_code === norm?.v1);
      if (!reg) return;

      // Slight geographic offset per facility so markers in same region don't overlap
      const idNum = parseInt(mine.facility_id.replace('MGB-FAC-', '')) || 1;
      const angle = (idNum * 137.5) * (Math.PI / 180);
      const radius = 0.15 + (idNum % 4) * 0.08;
      const lat = reg.centroid_lat + Math.sin(angle) * radius;
      const lon = reg.centroid_lon + Math.cos(angle) * radius;

      const marker = L.circleMarker([lat, lon], {
        radius: 6,
        fillColor: '#c084fc',
        color: '#ffffff',
        weight: 1.5,
        opacity: 1,
        fillOpacity: 0.9
      });

      const popupHtml = `
        <div style="font-family: monospace; font-size: 11px; padding: 4px; min-width: 180px;">
          <div style="color: #c084fc; font-weight: bold;">${mine.operator}</div>
          <div style="color: #e2e8f0; margin-top: 2px;">Commodity: <b>${mine.commodity}</b></div>
          <div style="color: #94a3b8;">Permit: ${mine.permit_no} (${mine.permit_type})</div>
          <div style="color: #10b981; margin-top: 2px;">Status: ${mine.operating_status}</div>
          <div style="color: #64748b; font-size: 10px; margin-top: 4px;">ID: ${mine.facility_id} · ${reg.region_name}</div>
        </div>
      `;
      marker.bindPopup(popupHtml);
      group.addLayer(marker);
    });
  }, [showMinesOverlay]);

  // Update Climate Stations Overlay Markers
  useEffect(() => {
    const group = stationsLayerGroupRef.current;
    if (!group) return;
    group.clearLayers();

    if (!showStationsOverlay) return;

    climateStations.forEach((st) => {
      const marker = L.circleMarker([st.latitude, st.longitude], {
        radius: 5,
        fillColor: '#38bdf8',
        color: '#0f172a',
        weight: 1.5,
        opacity: 1,
        fillOpacity: 0.9
      });

      const popupHtml = `
        <div style="font-family: monospace; font-size: 11px; padding: 4px; min-width: 170px;">
          <div style="color: #38bdf8; font-weight: bold;">${st.station_name}</div>
          <div style="color: #e2e8f0; margin-top: 2px;">Type: <b>${st.station_type}</b></div>
          <div style="color: #94a3b8;">Latest Obs: ${st.latest_obs_date}</div>
          <div style="color: #10b981; margin-top: 2px;">Completeness: ${st.completeness_30d_pct}%</div>
        </div>
      `;
      marker.bindPopup(popupHtml);
      group.addLayer(marker);
    });
  }, [showStationsOverlay]);

  // Reset Map View function
  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([12.8797, 121.7740], 6);
      onSelectRegion('ALL');
    }
  };

  const activeRegionObj = regions.find(r => r.region_code === (hoveredRegion || (selectedRegion !== 'ALL' ? selectedRegion : 'NCR')));
  const activeStat = activeRegionObj ? regionStats[activeRegionObj.region_code] : null;

  return (
    <div className="space-y-6">
      
      {/* Top Banner Control */}
      <div className="bg-[#121620] border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            Philippine Climate &amp; Mining Geospatial Map
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-sans">
            Full-archipelago geographic map featuring authentic regional boundaries, MGB operating mines, and observation stations.
          </p>
        </div>

        {/* Metric Layer Selector */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#0a0d12] border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveMetric('emissions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors ${
              activeMetric === 'emissions' 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-400" /> Net GHG
          </button>

          <button
            onClick={() => setActiveMetric('risk')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors ${
              activeMetric === 'risk' 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Climate Risk
          </button>

          <button
            onClick={() => setActiveMetric('finance')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors ${
              activeMetric === 'finance' 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-cyan-400" /> CCET Finance
          </button>

          <button
            onClick={() => setActiveMetric('mining')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors ${
              activeMetric === 'mining' 
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Pickaxe className="w-3.5 h-3.5 text-purple-400" /> Scope-1 Fuel
          </button>
        </div>
      </div>

      {/* Main Map + Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Leaflet Interactive Map Container (7 cols) */}
        <div className="lg:col-span-7 bg-[#121620] border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col relative overflow-hidden min-h-[580px]">
          
          {/* Map Controls Header */}
          <div className="flex flex-wrap items-center justify-between z-10 text-xs font-mono gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">
                Layer: <strong className="text-emerald-400 uppercase">{activeMetric}</strong> ({selectedYear})
              </span>
              <button
                onClick={handleResetView}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] flex items-center gap-1 border border-slate-700 transition-colors"
                title="Reset zoom to full Philippines"
              >
                <RotateCcw className="w-3 h-3" /> Reset View
              </button>
            </div>

            {/* Overlay Toggles */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={showMinesOverlay}
                  onChange={(e) => setShowMinesOverlay(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-purple-500 focus:ring-0"
                />
                <Pickaxe className="w-3.5 h-3.5 text-purple-400" />
                MGB Mines (36)
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white">
                <input
                  type="checkbox"
                  checked={showStationsOverlay}
                  onChange={(e) => setShowStationsOverlay(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
                />
                <CloudSun className="w-3.5 h-3.5 text-cyan-400" />
                Stations (40)
              </label>
            </div>
          </div>

          {/* Leaflet Map DOM Element */}
          <div 
            ref={mapContainerRef} 
            className="w-full flex-1 rounded-xl overflow-hidden min-h-[480px] z-0 border border-slate-800"
          />

          {/* Map Legend */}
          <div className="flex items-center justify-between mt-3 text-[11px] font-mono text-slate-400 px-1">
            <div className="flex items-center gap-2">
              <span>Intensity:</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Low</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Moderate</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> High</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Very High</span>
            </div>
            <span>OpenStreetMap / CartoDB Dark Matter</span>
          </div>
        </div>

        {/* Selected / Hovered Region Inspector (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {activeRegionObj && activeStat ? (
            <div className="bg-[#121620] border border-slate-800 rounded-2xl p-5 space-y-5">
              
              {/* Region Header */}
              <div className="flex items-start justify-between border-b border-slate-800/80 pb-4">
                <div>
                  <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                    Geographic Region
                  </span>
                  <h2 className="text-xl font-bold text-white font-sans mt-0.5">
                    {activeRegionObj.region_name}
                  </h2>
                  <div className="text-xs font-mono text-slate-400 flex items-center gap-2 mt-1">
                    <span>Code: <strong>{activeRegionObj.region_code}</strong></span>
                    <span>·</span>
                    <span>PSGC: {activeRegionObj.region_psgc}</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectRegion(selectedRegion === activeRegionObj.region_code ? 'ALL' : activeRegionObj.region_code)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors flex items-center gap-1 ${
                    selectedRegion === activeRegionObj.region_code
                      ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  {selectedRegion === activeRegionObj.region_code ? <Check className="w-3.5 h-3.5" /> : <Filter className="w-3.5 h-3.5" />}
                  {selectedRegion === activeRegionObj.region_code ? 'Active Filter' : 'Filter by Region'}
                </button>
              </div>

              {/* 4 Metrics Matrix */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                
                {/* Net GHG */}
                <div className="bg-[#0e121a] border border-slate-800 p-3 rounded-xl space-y-1">
                  <span className="text-slate-400 text-[11px] flex items-center gap-1">
                    <Flame className="w-3 h-3 text-orange-400" /> Net GHG ({selectedYear})
                  </span>
                  <div className="text-base font-bold text-white">
                    {activeStat.emissionsMt.toLocaleString()} <span className="text-xs text-slate-400 font-normal">Mt</span>
                  </div>
                  <button
                    onClick={() => onOpenProvenance && onOpenProvenance('GHG_INVENTORY_NET', activeRegionObj.region_code)}
                    className="text-[10px] text-emerald-400 hover:underline flex items-center gap-0.5 mt-1"
                  >
                    Provenance <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </div>

                {/* Risk */}
                <div className="bg-[#0e121a] border border-slate-800 p-3 rounded-xl space-y-1">
                  <span className="text-slate-400 text-[11px] flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-amber-400" /> Composite Risk
                  </span>
                  <div className="text-base font-bold text-amber-300">
                    {activeStat.riskIndex} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    Flood, drought &amp; cyclone
                  </span>
                </div>

                {/* CCET Finance */}
                <div className="bg-[#0e121a] border border-slate-800 p-3 rounded-xl space-y-1">
                  <span className="text-slate-400 text-[11px] flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-cyan-400" /> Tagged CCET
                  </span>
                  <div className="text-base font-bold text-cyan-300">
                    ₱{activeStat.financePhpM.toLocaleString()} <span className="text-xs text-slate-400 font-normal">M</span>
                  </div>
                  <button
                    onClick={() => onOpenProvenance && onOpenProvenance('CCET_FINANCE_TOTAL', activeRegionObj.region_code)}
                    className="text-[10px] text-cyan-400 hover:underline flex items-center gap-0.5 mt-1"
                  >
                    Traceability <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </div>

                {/* Mining Fuel Proxy */}
                <div className="bg-[#0e121a] border border-slate-800 p-3 rounded-xl space-y-1">
                  <span className="text-slate-400 text-[11px] flex items-center gap-1">
                    <Pickaxe className="w-3 h-3 text-purple-400" /> Mining Scope-1
                  </span>
                  <div className="text-base font-bold text-purple-300">
                    {activeStat.miningScope1.toLocaleString()} <span className="text-xs text-slate-400 font-normal">tCO2e</span>
                  </div>
                  <button
                    onClick={() => onOpenProvenance && onOpenProvenance('MGB_MINING_SCOPE1', activeRegionObj.region_code)}
                    className="text-[10px] text-purple-400 hover:underline flex items-center gap-0.5 mt-1"
                  >
                    Form 29-18 Drill <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </div>

              </div>

              {/* Operating Mines List in this Region */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <Pickaxe className="w-3.5 h-3.5 text-purple-400" />
                    MGB Permitted Mines ({activeStat.minesCount})
                  </span>
                  <span className="text-[11px] text-slate-500">MGB Directory</span>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                  {mgbMines.filter(m => {
                    const norm = normalizeRegionCode(m.region_code);
                    return norm?.v1 === activeRegionObj.region_code;
                  }).map(mine => (
                    <div 
                      key={mine.facility_id}
                      className="p-2.5 rounded-lg bg-[#0e121a] border border-slate-800/80 text-xs font-mono flex items-center justify-between"
                    >
                      <div>
                        <div className="text-slate-200 font-medium truncate max-w-[200px]">
                          {mine.operator}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {mine.commodity} · {mine.permit_no} ({mine.permit_type})
                        </div>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-purple-300 border border-slate-700">
                        {mine.operating_status}
                      </span>
                    </div>
                  ))}

                  {activeStat.minesCount === 0 && (
                    <div className="text-xs text-slate-500 font-mono text-center py-4">
                      No large-scale operating mines registered in this region.
                    </div>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="bg-[#121620] border border-slate-800 rounded-2xl p-8 text-center text-slate-500 font-mono text-sm">
              Click any region on the Philippine map to inspect regional data.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
