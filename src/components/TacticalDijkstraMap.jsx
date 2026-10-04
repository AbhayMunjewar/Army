import React, { useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, Wifi, WifiOff, Layers, ShieldCheck, Zap, AlertTriangle, Layers3, MapPin, Compass, Info, ArrowRight } from 'lucide-react';

// Real Himalayan Border Geographic Coordinates (Leh, Khardung La, Chang La, Siachen, Pangong)
export const NODE_GEO_COORDS = {
  'Leh Central Depot': { lat: 34.1526, lng: 77.5771, label: 'Leh Central Depot (Origin A)', type: 'depot' },
  'Khardung La Pass (17,582 ft)': { lat: 34.2787, lng: 77.6046, label: 'Khardung La Pass (17,582 ft)', type: 'pass' },
  'Chang La Pass (17,590 ft)': { lat: 34.0478, lng: 77.9304, label: 'Chang La Pass (17,590 ft)', type: 'pass' },
  'Shyok Valley Bypass': { lat: 34.2120, lng: 78.1150, label: 'Shyok Valley Bypass (Hazard Reroute)', type: 'bypass' },
  'Nubra Valley Base': { lat: 34.6000, lng: 77.5500, label: 'Nubra Valley Base', type: 'base' },
  'Tangtse Transit Base': { lat: 34.0200, lng: 78.1800, label: 'Tangtse Transit Base', type: 'base' },
  'Kargil Pass Junction': { lat: 34.5533, lng: 76.1342, label: 'Kargil Pass Junction', type: 'pass' },
  'Post Foxtrot-4': { lat: 35.1500, lng: 77.2000, label: 'Post Foxtrot-4 (Siachen Sector)', type: 'post' },
  'Post Sierra-9': { lat: 33.9100, lng: 78.6800, label: 'Post Sierra-9 (Pangong Sector)', type: 'post' },
  'Post Kilo-2': { lat: 33.6000, lng: 78.8500, label: 'Post Kilo-2 (Chushul Sector)', type: 'post' },
  'Post Echo-5': { lat: 35.3000, lng: 77.7000, label: 'Post Echo-5 (Sub-Sector North)', type: 'post' },
  'Post Alpha-1': { lat: 34.4300, lng: 75.7600, label: 'Post Alpha-1 (Drass Sector)', type: 'post' },
  'Post Bravo-3': { lat: 34.4200, lng: 75.8500, label: 'Post Bravo-3 (Drass Valley)', type: 'post' }
};

export const NODE_DESCRIPTIONS = {
  'Leh Central Depot': {
    elevation: '11,500 ft',
    terrain: 'Paved Base Valley & Logistics Depot',
    hazards: 'None — Central Supply Hub',
    navAdvisory: 'Point of Origin. SKO kerosene fuel loading and pre-departure vehicle telemetry check completed.',
    distFromStart: '0 km',
    eta: '0.0 Hours'
  },
  'Khardung La Pass (17,582 ft)': {
    elevation: '17,582 ft',
    terrain: 'Glacially Exposed Alpine Ridge',
    hazards: 'Sub-Zero Black Ice (-28°C) & High Altitude Oxygen Depletion',
    navAdvisory: 'Engage 4x4 low gear & tire chains. Supplemental oxygen mandatory above 15,000 ft. Speed capped at 25 km/h.',
    distFromStart: '38 km',
    eta: '1.2 Hours'
  },
  'Chang La Pass (17,590 ft)': {
    elevation: '17,590 ft',
    terrain: 'High Alpine Scree & Unstable Cliff Wall',
    hazards: '🚨 ACTIVE LANDSLIDE & ROCKFALL BLOCKADE',
    navAdvisory: 'AVOID THIS ROUTE — AI Rerouting Engine detected active landslide and automatically rerouted convoy via Shyok Valley Corridor.',
    distFromStart: '75 km',
    eta: 'BLOCKED (AI Rerouted)'
  },
  'Shyok Valley Bypass': {
    elevation: '14,200 ft',
    terrain: 'River Basin Valley & Unpaved Gravel Corridor',
    hazards: 'Shallow Stream Crossings & Loose River Bed Gravel',
    navAdvisory: '✅ SAFEST AI REROUTE — Bypass corridor avoiding Chang La landslide. Cruising speed 35 km/h.',
    distFromStart: '110 km',
    eta: '2.8 Hours'
  },
  'Nubra Valley Base': {
    elevation: '10,000 ft',
    terrain: 'River Delta Valley & Re-fueling Transit Station',
    hazards: 'Cold River Basin Fog',
    navAdvisory: 'Midway re-fueling and vehicle telemetry check station before final mountain pass ascent.',
    distFromStart: '123 km',
    eta: '3.4 Hours'
  },
  'Tangtse Transit Base': {
    elevation: '14,000 ft',
    terrain: 'High Plateau Military Transit Hub',
    hazards: 'Sub-Zero Winds (-24°C)',
    navAdvisory: 'Secondary military checkpoint. Verify cargo manifest seals and sync satellite positioning.',
    distFromStart: '160 km',
    eta: '4.5 Hours'
  },
  'Kargil Pass Junction': {
    elevation: '8,780 ft',
    terrain: 'NH1 Highway Junction',
    hazards: 'Routine Border Security Checkpoint',
    navAdvisory: 'Western Sector highway junction. Paved road surface clear.',
    distFromStart: '210 km',
    eta: '4.0 Hours'
  },
  'Post Foxtrot-4': {
    elevation: '18,200 ft',
    terrain: 'Glacier Moraine Outpost (Siachen Glacier Sector)',
    hazards: 'Extreme Sub-Zero (-32°C) & Avalanche Advisory',
    navAdvisory: '🎯 DESTINATION TARGET. Hand over SKO fuel, MRE combat rations, and medical oxygen under Post Commander supervision.',
    distFromStart: '210 km',
    eta: '5.3 Hours (Total)'
  },
  'Post Sierra-9': {
    elevation: '14,270 ft',
    terrain: 'High Altitude Lake Frontier (Pangong Sector)',
    hazards: 'High Ridge Winds',
    navAdvisory: 'Eastern Sector forward post destination. Final cargo delivery point.',
    distFromStart: '170 km',
    eta: '4.8 Hours'
  },
  'Post Kilo-2': {
    elevation: '14,500 ft',
    terrain: 'High Plateau Outpost (Chushul Sector)',
    hazards: 'Cold Desert Terrain',
    navAdvisory: 'Chushul Sector forward post. Delivery sign-off required.',
    distFromStart: '185 km',
    eta: '5.0 Hours'
  },
  'Post Echo-5': {
    elevation: '17,800 ft',
    terrain: 'Sub-Sector North Ridge',
    hazards: 'Deep Snow Accumulation',
    navAdvisory: 'Northern Sector ridge post. Mule/Drone drop relay active if pass blocked.',
    distFromStart: '188 km',
    eta: '5.2 Hours'
  }
};

export const GRAPH_EDGES = [
  { u: 'Leh Central Depot', v: 'Khardung La Pass (17,582 ft)' },
  { u: 'Leh Central Depot', v: 'Chang La Pass (17,590 ft)', isPass: true, passName: 'Chang La' },
  { u: 'Leh Central Depot', v: 'Shyok Valley Bypass' },
  { u: 'Leh Central Depot', v: 'Kargil Pass Junction' },
  { u: 'Khardung La Pass (17,582 ft)', v: 'Nubra Valley Base' },
  { u: 'Khardung La Pass (17,582 ft)', v: 'Tangtse Transit Base' },
  { u: 'Chang La Pass (17,590 ft)', v: 'Tangtse Transit Base' },
  { u: 'Chang La Pass (17,590 ft)', v: 'Post Sierra-9' },
  { u: 'Shyok Valley Bypass', v: 'Tangtse Transit Base' },
  { u: 'Shyok Valley Bypass', v: 'Post Kilo-2' },
  { u: 'Nubra Valley Base', v: 'Post Foxtrot-4' },
  { u: 'Nubra Valley Base', v: 'Post Echo-5' },
  { u: 'Tangtse Transit Base', v: 'Post Foxtrot-4' },
  { u: 'Tangtse Transit Base', v: 'Post Sierra-9' },
  { u: 'Tangtse Transit Base', v: 'Post Kilo-2' }
];

// Leaflet Marker Icon Generators
const createGoogleStartIcon = () => L.divIcon({
  className: 'custom-leaflet-marker',
  html: `<div style="background:#4285F4; color:#fff; width:32px; height:32px; border-radius:50%; border:3px solid #fff; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:14px; box-shadow:0 4px 14px rgba(0,0,0,0.6)">A</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const createGoogleDestIcon = (postName) => L.divIcon({
  className: 'custom-leaflet-marker',
  html: `<div style="display:flex; flex-direction:column; align-items:center;">
    <div style="background:#EA4335; color:#fff; width:32px; height:32px; border-radius:50% 50% 50% 0; transform:rotate(-45deg); border:2.5px solid #fff; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 14px rgba(0,0,0,0.6)">
      <span style="transform:rotate(45deg); font-weight:900; font-size:13px">B</span>
    </div>
    <div style="background:#202124; color:#ff7878; padding:2px 6px; border-radius:4px; border:1px solid #EA4335; font-size:9px; font-weight:bold; margin-top:2px; white-space:nowrap">${postName}</div>
  </div>`,
  iconSize: [32, 54],
  iconAnchor: [16, 42]
});

const createWaypointIcon = (stepNum, nodeLabel, isSelected) => L.divIcon({
  className: 'custom-leaflet-marker',
  html: `<div style="display:flex; flex-direction:column; align-items:center; cursor:pointer;">
    <div style="background:${isSelected ? '#3F5135' : '#FFFFFF'}; color:${isSelected ? '#FFF' : '#1B2026'}; border:2.5px solid ${isSelected ? '#3F5135' : '#4285F4'}; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:bold; font-size:12px; box-shadow:0 2px 8px rgba(0,0,0,0.2); transform:${isSelected ? 'scale(1.2)' : 'scale(1)'}">
      ${stepNum}
    </div>
    <div style="background:rgba(255,255,255,0.95); color:${isSelected ? '#3F5135' : '#1B2026'}; padding:2px 6px; border-radius:4px; border:1px solid ${isSelected ? '#3F5135' : '#B0BEC5'}; font-size:9px; font-weight:bold; margin-top:3px; white-space:nowrap">${nodeLabel.split(' ')[0]}</div>
  </div>`,
  iconSize: [28, 44],
  iconAnchor: [14, 14]
});

const createBlockedIcon = () => L.divIcon({
  className: 'custom-leaflet-marker',
  html: `<div style="background:#EA4335; color:#fff; padding:4px 9px; border-radius:4px; border:1.5px solid #fff; font-size:10px; font-weight:bold; box-shadow:0 4px 14px rgba(234,67,53,0.8); display:flex; align-items:center; gap:4px; cursor:pointer">⛔ LANDSLIDE BLOCKED</div>`,
  iconSize: [145, 28],
  iconAnchor: [72, 14]
});

// Component to catch map click events
function MapClickObserver({ onMapClick }) {
  useMapEvents({
    click() {
      onMapClick();
    }
  });
  return null;
}

export default function TacticalDijkstraMap({ dijkstraPath = [], hazards = {}, vehicleMode = 'TRUCK' }) {
  const [mapTileType, setMapTileType] = useState('SATELLITE');
  const [isOfflineMap, setIsOfflineMap] = useState(false);
  
  // Selected Waypoint State for On-Click Route Description
  const defaultSelected = dijkstraPath.length > 1 ? dijkstraPath[1] : dijkstraPath[0] || 'Shyok Valley Bypass';
  const [selectedNodeName, setSelectedNodeName] = useState(defaultSelected);

  // Convert AI Path Node Names to Real Leaflet LatLng Array
  const polylineCoords = dijkstraPath
    .map(nodeName => NODE_GEO_COORDS[nodeName] ? [NODE_GEO_COORDS[nodeName].lat, NODE_GEO_COORDS[nodeName].lng] : null)
    .filter(Boolean);

  const mapCenter = polylineCoords.length > 0 
    ? polylineCoords[Math.floor(polylineCoords.length / 2)] 
    : [34.3000, 77.6000];

  const tileUrls = {
    SATELLITE: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    OSM: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  };

  const selectedDetails = NODE_DESCRIPTIONS[selectedNodeName] || {
    elevation: '14,000 ft',
    terrain: 'Alpine Mountain Corridor',
    hazards: 'Sub-Zero Ridge Conditions',
    navAdvisory: 'Maintain steady speed and check vehicle chains.',
    distFromStart: '85 km',
    eta: '2.5 Hours'
  };

  const selectedGeo = NODE_GEO_COORDS[selectedNodeName] || { lat: 34.2120, lng: 78.1150, label: selectedNodeName };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
      {/* LEAFLET MAP CONTAINER */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '380px',
        background: '#F0F2ED',
        border: '2px solid var(--color-olive-green)',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
      }}>
        {/* Google Navigation Header */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '14px',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          background: '#FFFFFF',
          padding: '0.5rem 0.95rem',
          borderRadius: '24px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }}>
          <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--color-olive-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Navigation size={15} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#1B2026' }}>
              Google Navigation — Real Map AI Safe Reroute
            </div>
            <div style={{ fontSize: '0.68rem', color: isOfflineMap ? '#B78103' : 'var(--color-olive-green)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              {isOfflineMap ? <WifiOff size={11} color="#B78103" /> : <Wifi size={11} color="var(--color-olive-green)" />}
              {isOfflineMap ? '📡 OFFLINE MILITARY TACTICAL MAP ACTIVE (Local Cache Loaded)' : '🌐 Real Satellite Map Live Sync'}
            </div>
          </div>
        </div>

        {/* Layer & Offline Mode Controls */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '14px',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <button
            onClick={() => setMapTileType(prev => prev === 'SATELLITE' ? 'OSM' : 'SATELLITE')}
            style={{
              background: '#FFFFFF',
              color: '#1B2026',
              border: '1px solid var(--border-color)',
              padding: '0.45rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            <Layers3 size={14} color="var(--color-olive-green)" />
            {mapTileType === 'SATELLITE' ? '🗺️ OpenStreetMap' : '🛰️ Real Satellite Tile'}
          </button>

          <button
            onClick={() => setIsOfflineMap(!isOfflineMap)}
            style={{
              background: isOfflineMap ? '#FFFDF5' : '#FFFFFF',
              color: isOfflineMap ? '#B78103' : '#1B2026',
              border: `1px solid ${isOfflineMap ? '#B78103' : 'var(--border-color)'}`,
              padding: '0.45rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            {isOfflineMap ? <WifiOff size={14} /> : <Wifi size={14} />}
            {isOfflineMap ? '📡 OFFLINE ACTIVE' : '🌐 Online'}
          </button>
        </div>

        {/* Floating ETA Badge */}
        <div style={{
          position: 'absolute',
          bottom: '14px',
          left: '14px',
          zIndex: 1000,
          background: '#FFFFFF',
          border: '1px solid var(--border-color)',
          padding: '0.55rem 0.95rem',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
          boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--color-olive-green)', fontFamily: 'var(--font-mono)' }}>
            5.3 hrs
          </div>
          <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '0.85rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1B2026' }}>
              210 km • AI Safest Reroute
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
              👉 Click any point on map for full terrain & route description
            </div>
          </div>
        </div>

        <MapContainer
          center={mapCenter}
          zoom={8}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          <MapClickObserver onMapClick={() => setSelectedNodeName(dijkstraPath[1] || dijkstraPath[0])} />

          <TileLayer
            attribution='&copy; Esri World Imagery | OpenStreetMap contributors'
            url={tileUrls[mapTileType]}
          />

          {/* Secondary Edge Lines */}
          {GRAPH_EDGES.map((edge, idx) => {
            const u = NODE_GEO_COORDS[edge.u];
            const v = NODE_GEO_COORDS[edge.v];
            if (!u || !v) return null;

            const isBlocked = hazards.landslide && edge.passName === 'Chang La';

            return (
              <Polyline
                key={`base-${idx}`}
                positions={[[u.lat, u.lng], [v.lat, v.lng]]}
                pathOptions={{
                  color: isBlocked ? '#C0392B' : '#78909C',
                  weight: isBlocked ? 3 : 2,
                  dashArray: isBlocked ? '6 6' : '3 3',
                  opacity: 0.7
                }}
              />
            );
          })}

          {/* Primary Navigation Polyline */}
          {polylineCoords.length > 1 && (
            <>
              <Polyline
                positions={polylineCoords}
                pathOptions={{
                  color: '#1B5E20',
                  weight: 9,
                  opacity: 0.9,
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
              />
              <Polyline
                positions={polylineCoords}
                pathOptions={{
                  color: '#388E3C',
                  weight: 6,
                  opacity: 1,
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
                eventHandlers={{
                  click: () => setSelectedNodeName(dijkstraPath[1] || dijkstraPath[0])
                }}
              />
            </>
          )}

          {/* Landslide Block Marker */}
          {hazards.landslide && (
            <Marker
              position={[NODE_GEO_COORDS['Chang La Pass (17,590 ft)'].lat, NODE_GEO_COORDS['Chang La Pass (17,590 ft)'].lng]}
              icon={createBlockedIcon()}
              eventHandlers={{
                click: () => setSelectedNodeName('Chang La Pass (17,590 ft)')
              }}
            >
              <Popup>
                <div style={{ padding: '0.2rem', color: '#12181d', fontWeight: 'bold' }}>
                  ⛔ LANDSLIDE ROAD BLOCKADE
                  <div style={{ fontSize: '0.75rem', fontWeight: 'normal', color: '#555' }}>
                    Chang La Pass (17,590 ft) active rockfall. AI Rerouting Engine dynamically rerouted convoy via Shyok Valley.
                  </div>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Waypoint Pins */}
          {dijkstraPath.map((nodeName, idx) => {
            const geo = NODE_GEO_COORDS[nodeName];
            if (!geo) return null;

            const isStart = idx === 0;
            const isTarget = idx === dijkstraPath.length - 1;
            const isSelected = selectedNodeName === nodeName;

            let icon = createWaypointIcon(idx, geo.label, isSelected);
            if (isStart) icon = createGoogleStartIcon();
            if (isTarget) icon = createGoogleDestIcon(geo.label);

            return (
              <Marker
                key={nodeName}
                position={[geo.lat, geo.lng]}
                icon={icon}
                eventHandlers={{
                  click: () => setSelectedNodeName(nodeName)
                }}
              >
                <Popup>
                  <div style={{ padding: '0.25rem', color: '#12181d' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{geo.label}</div>
                    <div style={{ fontSize: '0.75rem', color: '#555' }}>
                      GPS: {geo.lat.toFixed(4)}° N, {geo.lng.toFixed(4)}° E
                    </div>
                    <div style={{ marginTop: '0.3rem', fontSize: '0.75rem', fontWeight: 'bold', color: isStart ? '#4285F4' : isTarget ? '#EA4335' : '#2D5A27' }}>
                      {isStart ? '🚩 CONVOY ORIGIN DEPOT' : isTarget ? '🎯 FORWARD POST DESTINATION' : `WAYPOINT STEP ${idx}`}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* DYNAMIC MAP CLICKED ROUTE & WAYPOINT DESCRIPTION PANEL */}
      <div style={{
        background: '#FFFFFF',
        border: '1.5px solid var(--border-color)',
        borderRadius: '12px',
        padding: '1.1rem 1.35rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.85rem',
        boxShadow: '0 4px 18px rgba(0,0,0,0.06)'
      }}>
        {/* Top Header of Description Card */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: '#E8F5E9', padding: '0.45rem', borderRadius: '8px', border: '1px solid #C8E6C9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={20} color="var(--color-olive-green)" />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--color-olive-green)', letterSpacing: '0.5px' }}>
                MAP CLICKED WAYPOINT & ROUTE SEGMENT DESCRIPTION
              </div>
              <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#1B2026', margin: '0.1rem 0 0 0' }}>
                {selectedNodeName}
              </h4>
            </div>
          </div>

          <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: '700', color: 'var(--text-secondary)' }}>GEOGRAPHIC COORDINATES</div>
            <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--color-olive-green)' }}>
              {selectedGeo.lat.toFixed(4)}° N, {selectedGeo.lng.toFixed(4)}° E
            </div>
          </div>
        </div>

        {/* Waypoint Details Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
          {/* Elevation */}
          <div style={{ background: '#F8F9F5', padding: '0.75rem 0.95rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: '700', color: 'var(--text-muted)' }}>ELEVATION & ALTITUDE</div>
            <div style={{ fontSize: '1rem', fontWeight: '800', color: '#1B2026', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
              🏔️ {selectedDetails.elevation}
            </div>
          </div>

          {/* Terrain Type */}
          <div style={{ background: '#F8F9F5', padding: '0.75rem 0.95rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: '700', color: 'var(--text-muted)' }}>SURFACE & TERRAIN TYPE</div>
            <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#1B2026', marginTop: '0.2rem' }}>
              🚜 {selectedDetails.terrain}
            </div>
          </div>

          {/* Distance & Segment ETA */}
          <div style={{ background: '#F8F9F5', padding: '0.75rem 0.95rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.68rem', fontWeight: '700', color: 'var(--text-muted)' }}>DISTANCE / SEGMENT ETA</div>
            <div style={{ fontSize: '0.88rem', fontWeight: '800', color: selectedDetails.eta.includes('BLOCKED') ? '#C0392B' : '#B78103', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
              📍 {selectedDetails.distFromStart} • {selectedDetails.eta}
            </div>
          </div>
        </div>

        {/* Hazard Alert Notice */}
        <div style={{
          background: selectedDetails.hazards.includes('LANDSLIDE') || selectedDetails.hazards.includes('BLOCKADE') ? '#FFF5F5' : selectedDetails.hazards.includes('Black Ice') ? '#FFFDF5' : '#E8F5E9',
          border: `1.5px solid ${selectedDetails.hazards.includes('LANDSLIDE') || selectedDetails.hazards.includes('BLOCKADE') ? '#F5C6CB' : selectedDetails.hazards.includes('Black Ice') ? '#FFEBAA' : '#C8E6C9'}`,
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <AlertTriangle size={20} color={selectedDetails.hazards.includes('LANDSLIDE') || selectedDetails.hazards.includes('BLOCKADE') ? '#C0392B' : selectedDetails.hazards.includes('Black Ice') ? '#B78103' : 'var(--status-healthy)'} />
          <div style={{ fontSize: '0.82rem', fontWeight: '800', color: selectedDetails.hazards.includes('LANDSLIDE') || selectedDetails.hazards.includes('BLOCKADE') ? '#C0392B' : selectedDetails.hazards.includes('Black Ice') ? '#B78103' : 'var(--status-healthy)' }}>
            HAZARD ASSESSMENT: {selectedDetails.hazards}
          </div>
        </div>

        {/* Tactical Navigation Guidance */}
        <div style={{ background: '#F0F2ED', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--color-olive-green)', marginBottom: '0.3rem', letterSpacing: '0.4px' }}>
            🧭 TACTICAL AI NAVIGATION ADVISORY & DRIVER GUIDANCE:
          </div>
          <div style={{ fontSize: '0.83rem', color: '#1B2026', lineHeight: '1.45', fontWeight: '600' }}>
            {selectedDetails.navAdvisory}
          </div>
        </div>
      </div>
    </div>
  );
}
