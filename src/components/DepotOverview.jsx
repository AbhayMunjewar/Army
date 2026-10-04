import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Truck, 
  CloudSnow, 
  MapPin, 
  ArrowUpRight,
  Layers,
  Zap,
  Plus,
  Minus,
  RotateCcw
} from 'lucide-react';

// Real World Coordinates for Border Outposts in Leh / Ladakh / Siachen Sector
const POST_COORDINATES = {
  "P-01": { lat: 35.4211, lng: 77.1090 }, // Siachen Glacier (Foxtrot-4)
  "P-02": { lat: 33.5500, lng: 78.6500 }, // Chushul (Sierra-9)
  "P-03": { lat: 34.7500, lng: 78.1800 }, // Galwan Valley (Kilo-2)
  "P-04": { lat: 34.5539, lng: 76.1344 }, // Kargil Sector (Alpha-1)
  "P-05": { lat: 34.0200, lng: 78.0500 }, // Tangtse Sector (Tango-7)
  "P-06": { lat: 34.4278, lng: 75.7611 }, // Drass Valley (Bravo-3)
  "P-07": { lat: 35.2500, lng: 77.7200 }, // Sub-Sector North (Echo-5)
  "P-08": { lat: 33.9000, lng: 77.8000 }  // Nyoma Sector (Delta-8)
};

// Exact Indian Location / Area Names for Outposts
const POST_AREA_NAMES = {
  "P-01": "Siachen Glacier, Ladakh",
  "P-02": "Chushul, Eastern Ladakh",
  "P-03": "Galwan Valley, Ladakh",
  "P-04": "Kargil, Ladakh",
  "P-05": "Tangtse / Pangong, Ladakh",
  "P-06": "Drass Valley, Kargil",
  "P-07": "Sub-Sector North, Ladakh",
  "P-08": "Nyoma Base, Ladakh"
};

// Supply Route Polyline coordinates
const SUPPLY_ROUTE_1 = [
  [34.1526, 77.5771], // Leh Depot Base
  [34.2787, 77.6047], // Khardung La Pass (17,582 ft)
  [34.7500, 78.1800], // Galwan Valley (Kilo-2)
  [35.4211, 77.1090]  // Siachen Glacier (Foxtrot-4)
];

const SUPPLY_ROUTE_2 = [
  [34.1526, 77.5771], // Leh Depot Base
  [33.9000, 77.8000], // Nyoma
  [33.5500, 78.6500]  // Chushul (Sierra-9)
];

// Helper to generate Leaflet HTML marker icon with Indian Location Area Name
const createCustomMarkerIcon = (status, name, areaName, days) => {
  const color = status === 'CRITICAL' ? '#B83A3A' : status === 'WARNING' ? '#D6A23A' : '#3F5135';
  const html = `
    <div style="display:flex;flex-direction:column;align-items:center;transform:translate(-50%,-50%);">
      <div style="width:18px;height:18px;border-radius:50%;background:${color};border:2px solid #ffffff;box-shadow:0 0 10px ${color};"></div>
      <div style="font-size:11px;font-weight:700;font-family:sans-serif;background:rgba(255,255,255,0.95);color:#1B2026;border:1.5px solid ${color};padding:3px 8px;border-radius:6px;white-space:nowrap;margin-top:3px;box-shadow:0 3px 10px rgba(0,0,0,0.15);display:flex;gap:5px;align-items:center;">
        <span>${name}</span>
        <span style="color:#B78103;font-weight:600;">(${areaName})</span>
        <span style="color:${color};font-weight:bold;">[${days}d left]</span>
      </div>
    </div>
  `;
  return L.divIcon({
    html: html,
    className: 'custom-post-div-icon',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

export default function DepotOverview({ posts, indents, convoys, setSelectedPost, setCurrentTab }) {
  const [viewMode, setViewMode] = useState('MAP'); // MAP or GRID
  const [tileMode, setTileMode] = useState('DARK_GREEN_OSM'); // DARK_GREEN_OSM or SATELLITE
  const [mapInstance, setMapInstance] = useState(null);

  const criticalPostsCount = posts.filter(p => p.status === 'CRITICAL').length;
  const warningPostsCount = posts.filter(p => p.status === 'WARNING').length;
  const healthyPostsCount = posts.filter(p => p.status === 'HEALTHY').length;
  const pendingIndentsCount = indents.filter(i => i.status === 'PENDING').length;

  // Tile Server URLs
  const osmTileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const esriSatelliteUrl = "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";

  const handleResetZoom = () => {
    if (mapInstance) {
      mapInstance.setView([34.5000, 77.5000], 8);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner Notice */}
      <div style={{
        background: 'var(--status-healthy-bg)',
        border: '1px solid var(--status-healthy-border)',
        borderRadius: '8px',
        padding: '0.85rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Zap size={20} color="var(--color-army-green)" />
          <div>
            <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              SECTOR COMMAND MONITOR — VeerSetu MILITARY INTELLIGENCE & LOGISTICS
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Real-time OpenStreetMap integration with Dark Green Tactical Filter (Leh / Ladakh Sector).
            </div>
          </div>
        </div>
        <button 
          className="btn-primary" 
          onClick={() => setCurrentTab('indents')}
          style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem' }}
        >
          Review Auto-Indents ({pendingIndentsCount})
        </button>
      </div>

      {/* KPI Cards Grid matching Section 2 of reference image */}
      <div className="kpi-grid">
        <div className="glass-card kpi-card">
          <div className="kpi-icon-box red">
            <ShieldAlert size={24} />
          </div>
          <div>
            <div className="kpi-value" style={{ color: 'var(--status-critical)' }}>{criticalPostsCount}</div>
            <div className="kpi-title">Critical Alerts (&lt;3d Stock)</div>
          </div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-icon-box yellow">
            <AlertTriangle size={24} />
          </div>
          <div>
            <div className="kpi-value" style={{ color: 'var(--status-warning)' }}>{warningPostsCount}</div>
            <div className="kpi-title">Warning Level (&lt;7d Stock)</div>
          </div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-icon-box green">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="kpi-value" style={{ color: 'var(--color-army-green)' }}>{healthyPostsCount}</div>
            <div className="kpi-title">Healthy Buffer (&gt;15d Stock)</div>
          </div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-icon-box">
            <Truck size={24} />
          </div>
          <div>
            <div className="kpi-value" style={{ color: 'var(--text-primary)' }}>{convoys.length}</div>
            <div className="kpi-title">Active Convoys</div>
          </div>
        </div>
      </div>

      {/* SECTION 3: DARK GREEN OPENSTREETMAP TACTICAL MAP */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1rem' }}>
              <MapPin size={18} color="var(--color-army-green)" />
              <span>LIVE OPENSTREETMAP (DARK GREEN TACTICAL FILTER)</span>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', background: '#E0E6DE', padding: '0.2rem', borderRadius: '6px' }}>
              <button 
                onClick={() => setViewMode('MAP')}
                style={{
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.75rem',
                  border: 'none',
                  borderRadius: '4px',
                  background: viewMode === 'MAP' ? 'var(--color-army-green)' : 'transparent',
                  color: viewMode === 'MAP' ? '#fff' : 'var(--text-secondary)',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                OPENSTREETMAP
              </button>
              <button 
                onClick={() => setViewMode('GRID')}
                style={{
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.75rem',
                  border: 'none',
                  borderRadius: '4px',
                  background: viewMode === 'GRID' ? 'var(--color-army-green)' : 'transparent',
                  color: viewMode === 'GRID' ? '#fff' : 'var(--text-secondary)',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                HEATMAP GRID
              </button>
            </div>
          </div>

          {viewMode === 'MAP' ? (
            <div style={{ position: 'relative', width: '100%', height: '460px', borderRadius: '10px', overflow: 'hidden' }}>
              {/* Left Layers Overlay matching Section 3 in image */}
              <div className="map-left-panel" style={{ zIndex: 1000 }}>
                <div style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Layers size={14} color="var(--color-olive-green)" /> Map Layers
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.75rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: 'var(--color-army-green)' }} /> Troop Outposts
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: 'var(--color-army-green)' }} /> Convoy Activity
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: 'var(--color-army-green)' }} /> Supply Corridors
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked style={{ accentColor: 'var(--color-army-green)' }} /> Hazard Alerts
                  </label>
                </div>

                <div style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                  Filter Threat Level:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
                  <span style={{ color: 'var(--status-critical)' }}>● High Risk (&lt;3d)</span>
                  <span style={{ color: 'var(--status-warning)' }}>● Medium Risk (&lt;7d)</span>
                  <span style={{ color: 'var(--color-army-green)' }}>● Low Risk (&gt;15d)</span>
                </div>
              </div>

              {/* Map Tile Mode Selector & Reset Zoom Controls */}
              <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 1000, display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setTileMode(tileMode === 'LIGHT_GREEN_OSM' ? 'SATELLITE' : 'LIGHT_GREEN_OSM')}
                  style={{
                    background: '#FFFFFF',
                    color: '#1B2026',
                    border: '1px solid var(--border-color)',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {tileMode === 'LIGHT_GREEN_OSM' ? '🗺️ OpenStreetMap (Light Green Terrain)' : '🛰️ Satellite Imagery'}
                </button>

                <button
                  onClick={handleResetZoom}
                  title="Reset Map Center"
                  style={{
                    background: '#FFFFFF',
                    color: '#1B2026',
                    border: '1px solid var(--border-color)',
                    padding: '0.35rem 0.6rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <RotateCcw size={14} /> Center
                </button>
              </div>

              {/* REAL OPENSTREETMAP LEAFLET CONTAINER WITH LIGHT GREEN TACTICAL FILTER */}
              <div className={tileMode === 'LIGHT_GREEN_OSM' ? 'light-green-leaflet-map' : 'light-green-satellite-map'} style={{ width: '100%', height: '100%' }}>
                <MapContainer 
                  center={[34.5000, 77.5000]} 
                  zoom={8} 
                  scrollWheelZoom={true}
                  style={{ width: '100%', height: '100%' }}
                  ref={setMapInstance}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url={tileMode === 'LIGHT_GREEN_OSM' ? osmTileUrl : esriSatelliteUrl}
                  />

                  {/* Supply Corridors Polyline Routes */}
                  <Polyline 
                    positions={SUPPLY_ROUTE_1} 
                    pathOptions={{ color: '#2D5A27', weight: 4, dashArray: '8 6' }} 
                  />
                  <Polyline 
                    positions={SUPPLY_ROUTE_2} 
                    pathOptions={{ color: '#D6A23A', weight: 4, dashArray: '8 6' }} 
                  />

                  {/* Interactive Leaflet Markers for Border Outposts */}
                  {posts.map(post => {
                    const coords = POST_COORDINATES[post.id] || { lat: 34.1526, lng: 77.5771 };
                    const areaName = POST_AREA_NAMES[post.id] || post.sector;
                    const customIcon = createCustomMarkerIcon(post.status, post.name, areaName, post.stockoutDays);

                    return (
                      <Marker 
                        key={post.id} 
                        position={[coords.lat, coords.lng]} 
                        icon={customIcon}
                        eventHandlers={{
                          click: () => {
                            setSelectedPost(post);
                            setCurrentTab('inventory');
                          }
                        }}
                      >
                        <Popup>
                          <div style={{ padding: '0.2rem', fontSize: '0.8rem' }}>
                            <div style={{ fontWeight: '700', color: '#1B2026', fontSize: '0.9rem' }}>{post.name}</div>
                            <div style={{ color: '#5C6B73', fontSize: '0.75rem', marginBottom: '0.4rem' }}>{post.sector} • {post.altitude}</div>
                            <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#5C6B73' }}>
                              Coords: {coords.lat.toFixed(4)} N, {coords.lng.toFixed(4)} E
                            </div>
                            <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span style={{ fontSize: '0.75rem', color: '#1B2026' }}>Stockout Left:</span>
                              <span className={`badge-status ${post.status === 'CRITICAL' ? 'critical' : post.status === 'WARNING' ? 'warning' : 'healthy'}`}>
                                {post.stockoutDays} Days
                              </span>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
              {posts.map(post => {
                const color = post.status === 'CRITICAL' ? 'var(--status-critical)' :
                             post.status === 'WARNING' ? 'var(--color-amber)' : 'var(--color-army-green)';
                const bg = post.status === 'CRITICAL' ? 'var(--status-critical-bg)' :
                           post.status === 'WARNING' ? 'var(--status-warning-bg)' : 'var(--status-healthy-bg)';
                return (
                  <div 
                    key={post.id}
                    style={{
                      background: bg,
                      border: `1px solid ${color}`,
                      borderRadius: '8px',
                      padding: '0.85rem',
                      cursor: 'pointer'
                    }}
                    onClick={() => {
                      setSelectedPost(post);
                      setCurrentTab('inventory');
                    }}
                  >
                    <div style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-primary)' }}>{post.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{post.sector}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                      <span style={{ fontSize: '0.75rem', color: color, fontWeight: '700' }}>
                        {post.stockoutDays} Days Left
                      </span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-primary)' }}>{post.troops} Pax</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Panel: Recent Alerts & Quick Actions matching Section 2 of reference image */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.85rem' }}>
              <ShieldAlert size={18} color="var(--color-amber)" />
              <span>RECENT OPERATIONAL ALERTS</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ background: 'var(--status-critical-bg)', border: '1px solid var(--status-critical-border)', padding: '0.75rem', borderRadius: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', color: 'var(--status-critical)' }}>
                  <span>Stockout Threat Detected</span>
                  <span style={{ fontSize: '0.65rem', background: 'var(--status-critical)', color: '#fff', padding: '0.1rem 0.3rem', borderRadius: '3px' }}>High</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  Post Foxtrot-4 (Siachen Glacier) — 3 days fuel remaining.
                </div>
              </div>

              <div style={{ background: 'var(--status-warning-bg)', border: '1px solid var(--status-warning-border)', padding: '0.75rem', borderRadius: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '700', color: '#9C7210' }}>
                  <span>Road Blockade Warning</span>
                  <span style={{ fontSize: '0.65rem', background: 'var(--color-amber)', color: '#000', padding: '0.1rem 0.3rem', borderRadius: '3px', fontWeight: '700' }}>Medium</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  Galwan Sector KM-42 pass experiencing heavy snow buildup.
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ flex: 1 }}>
            <div style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.85rem', color: 'var(--text-primary)' }}>
              QUICK ACTIONS
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button className="btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={() => setViewMode('MAP')}>
                <MapPin size={14} color="var(--color-army-green)" /> View Live Map
              </button>
              <button className="btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={() => setCurrentTab('indents')}>
                <Zap size={14} color="var(--color-amber)" /> Review Auto-Indents
              </button>
              <button className="btn-secondary" style={{ width: '100%', justifyContent: 'flex-start' }} onClick={() => setCurrentTab('route')}>
                <Truck size={14} color="var(--color-army-green)" /> Dispatch Supply Convoy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
