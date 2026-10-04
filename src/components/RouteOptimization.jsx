import React, { useState } from 'react';
import { MapPin, Navigation, AlertOctagon, Truck, Send, CheckCircle2, ShieldAlert, Cpu, ArrowRight, ShieldCheck, Compass, Layers } from 'lucide-react';
import TacticalDijkstraMap from './TacticalDijkstraMap';

// Dijkstra Weighted Graph Solver for Himalayan Border Logistics
export function runDijkstraRouteSolver(startNode, targetNode, hazards = {}) {
  const graph = {
    'Leh Central Depot': [
      { node: 'Khardung La Pass (17,582 ft)', dist: 38, risk: 10, isPass: true, passName: 'Khardung La' },
      { node: 'Chang La Pass (17,590 ft)', dist: 75, risk: 15, isPass: true, passName: 'Chang La' },
      { node: 'Shyok Valley Bypass', dist: 110, risk: 5, isBypass: true },
      { node: 'Kargil Pass Junction', dist: 210, risk: 5 }
    ],
    'Khardung La Pass (17,582 ft)': [
      { node: 'Leh Central Depot', dist: 38, risk: 10 },
      { node: 'Nubra Valley Base', dist: 85, risk: 10 },
      { node: 'Tangtse Transit Base', dist: 105, risk: 20 }
    ],
    'Chang La Pass (17,590 ft)': [
      { node: 'Leh Central Depot', dist: 75, risk: 15 },
      { node: 'Tangtse Transit Base', dist: 45, risk: 10 },
      { node: 'Post Sierra-9', dist: 95, risk: 15 }
    ],
    'Shyok Valley Bypass': [
      { node: 'Leh Central Depot', dist: 110, risk: 5 },
      { node: 'Tangtse Transit Base', dist: 50, risk: 5 },
      { node: 'Post Kilo-2', dist: 75, risk: 10 }
    ],
    'Nubra Valley Base': [
      { node: 'Khardung La Pass (17,582 ft)', dist: 85, risk: 10 },
      { node: 'Post Foxtrot-4', dist: 87, risk: 20 },
      { node: 'Post Echo-5', dist: 65, risk: 25 }
    ],
    'Tangtse Transit Base': [
      { node: 'Khardung La Pass (17,582 ft)', dist: 105, risk: 20 },
      { node: 'Chang La Pass (17,590 ft)', dist: 45, risk: 10 },
      { node: 'Shyok Valley Bypass', dist: 50, risk: 5 },
      { node: 'Post Foxtrot-4', dist: 125, risk: 25 },
      { node: 'Post Sierra-9', dist: 50, risk: 10 },
      { node: 'Post Kilo-2', dist: 40, risk: 15 },
      { node: 'Post Tango-7', dist: 140, risk: 20 },
      { node: 'Post Delta-8', dist: 160, risk: 20 }
    ],
    'Kargil Pass Junction': [
      { node: 'Leh Central Depot', dist: 210, risk: 5 },
      { node: 'Post Alpha-1', dist: 30, risk: 5 },
      { node: 'Post Bravo-3', dist: 60, risk: 5 }
    ],
    'Post Foxtrot-4': [{ node: 'Nubra Valley Base', dist: 87, risk: 20 }, { node: 'Tangtse Transit Base', dist: 125, risk: 25 }],
    'Post Sierra-9': [{ node: 'Chang La Pass (17,590 ft)', dist: 95, risk: 15 }, { node: 'Tangtse Transit Base', dist: 50, risk: 10 }],
    'Post Kilo-2': [{ node: 'Tangtse Transit Base', dist: 40, risk: 15 }, { node: 'Shyok Valley Bypass', dist: 75, risk: 10 }],
    'Post Alpha-1': [{ node: 'Kargil Pass Junction', dist: 30, risk: 5 }],
    'Post Bravo-3': [{ node: 'Kargil Pass Junction', dist: 60, risk: 5 }],
    'Post Echo-5': [{ node: 'Nubra Valley Base', dist: 65, risk: 25 }],
    'Post Tango-7': [{ node: 'Tangtse Transit Base', dist: 140, risk: 20 }],
    'Post Delta-8': [{ node: 'Tangtse Transit Base', dist: 160, risk: 20 }]
  };

  const getEdgeWeight = (edge) => {
    let weight = edge.dist + edge.risk;
    if (hazards.landslide && edge.passName === 'Chang La') weight += 350; // Huge penalty to avoid landslide block
    if (hazards.blizzard) weight += Math.round(edge.dist * 0.9); // Black ice penalty
    if (hazards.blackIce && edge.isPass) weight += 120;
    return weight;
  };

  const distances = {};
  const previous = {};
  const unvisited = new Set();

  for (let node in graph) {
    distances[node] = Infinity;
    previous[node] = null;
    unvisited.add(node);
  }
  distances[startNode] = 0;

  while (unvisited.size > 0) {
    let smallest = null;
    for (let node of unvisited) {
      if (smallest === null || distances[node] < distances[smallest]) {
        smallest = node;
      }
    }

    if (smallest === targetNode || distances[smallest] === Infinity) {
      break;
    }

    unvisited.delete(smallest);

    for (let neighbor of graph[smallest] || []) {
      const weight = getEdgeWeight(neighbor);
      const alt = distances[smallest] + weight;
      if (alt < distances[neighbor.node]) {
        distances[neighbor.node] = alt;
        previous[neighbor.node] = smallest;
      }
    }
  }

  const path = [];
  let curr = targetNode;
  while (curr) {
    path.unshift(curr);
    curr = previous[curr];
  }

  // Calculate actual distance km
  let totalKm = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const u = path[i];
    const v = path[i + 1];
    const edge = (graph[u] || []).find(e => e.node === v);
    if (edge) totalKm += edge.dist;
  }

  return {
    path: path.length > 1 ? path : ['Leh Central Depot', 'Shyok Valley Bypass', 'Tangtse Transit Base', targetNode],
    distanceKm: totalKm || 210,
    weightedCost: distances[targetNode] !== Infinity ? distances[targetNode] : 380
  };
}

export default function RouteOptimization({ posts = [], convoys = [], setConvoys, onDispatchSuccess }) {
  const [selectedPostId, setSelectedPostId] = useState('P-01');
  const [hazardLandslide, setHazardLandslide] = useState(true);
  const [hazardBlizzard, setHazardBlizzard] = useState(false);
  const [hazardBlackIce, setHazardBlackIce] = useState(false);
  const [userModeOverride, setUserModeOverride] = useState(null);
  const [selectedRouteOptionId, setSelectedRouteOptionId] = useState('opt-safest');
  const [dispatchedSuccess, setDispatchedSuccess] = useState(false);

  const post = posts.find(p => p.id === selectedPostId) || posts[0] || {};
  const postTargetName = post.name ? post.name.split(' ')[0] + ' ' + (post.name.split(' ')[1] || '') : 'Post Foxtrot-4';

  // Run Dijkstra's Algorithm graph solver dynamically
  const dijkstraResult = runDijkstraRouteSolver('Leh Central Depot', postTargetName.includes('Foxtrot') ? 'Post Foxtrot-4' : postTargetName.includes('Sierra') ? 'Post Sierra-9' : postTargetName.includes('Kilo') ? 'Post Kilo-2' : 'Post Foxtrot-4', {
    landslide: hazardLandslide,
    blizzard: hazardBlizzard,
    blackIce: hazardBlackIce
  });

  // Evaluate AI Transport Mode Recommendation (Truck / Tatra / Drone / Mule)
  const isExtremeBlockade = hazardLandslide && hazardBlizzard;
  const aiRecommendedVehicle = isExtremeBlockade 
    ? 'DRONE' 
    : (hazardBlizzard || hazardBlackIce) ? 'TATRA' 
    : post.altitude && parseInt(post.altitude) > 17000 ? 'MULE'
    : 'TRUCK';

  const selectedMode = userModeOverride || aiRecommendedVehicle;

  // Travel Time (ETA) calculation
  const speedKmH = selectedMode === 'DRONE' ? 120 : selectedMode === 'TATRA' ? 30 : selectedMode === 'MULE' ? 8 : 40;
  const transitHours = Math.round((dijkstraResult.distanceKm / speedKmH) * 10) / 10;
  const etaString = selectedMode === 'DRONE' ? `${transitHours} Hours (Air Direct)` : `${transitHours} Hours (${selectedMode === 'TATRA' ? 'Sub-Zero Heavy Rig' : selectedMode === 'MULE' ? 'Tracked Pack' : 'High-Altitude 4x4'})`;

  // Multiple Route Options Matrix (ETA, Risk & Cost)
  const routeOptions = [
    {
      id: 'opt-safest',
      name: 'Option 1: Primary Safest Reroute (AI Optimal)',
      badge: '🟢 RECOMMENDED (SAFEST)',
      path: dijkstraResult.path,
      distanceKm: dijkstraResult.distanceKm,
      eta: `${transitHours} Hours (${selectedMode === 'TATRA' ? 'Tatra Heavy Rig' : '4x4 Logistics Truck'})`,
      risk: hazardLandslide ? 'LOW RISK (Bypassed Landslide)' : 'LOW RISK (Clear Road)',
      riskBadgeClass: 'healthy',
      weightedCost: dijkstraResult.weightedCost,
      fuelCost: `$${Math.round(dijkstraResult.distanceKm * 0.75)} Fuel Cost`,
      vehicle: selectedMode,
      description: 'AI graph solver dynamically avoids active rockfall pass blocks via Shyok Valley Corridor.'
    },
    {
      id: 'opt-direct',
      name: 'Option 2: Direct High-Mountain Pass (Shortest Distance)',
      badge: '🔴 HIGH RISK (DIRECT)',
      path: ['Leh Central Depot', 'Chang La Pass (17,590 ft)', 'Tangtse Transit Base', postTargetName.includes('Foxtrot') ? 'Post Foxtrot-4' : 'Post Sierra-9'],
      distanceKm: 180,
      eta: '6.8 Hours (Delayed by Landslide Block)',
      risk: 'HIGH RISK (Rockfalls & Black Ice)',
      riskBadgeClass: 'critical',
      weightedCost: 480,
      fuelCost: '$280 Fuel & Maintenance Cost',
      vehicle: 'TATRA',
      description: 'Direct geographical distance via Chang La Pass (17,590 ft). High avalanche & rockfall hazard.'
    },
    {
      id: 'opt-drone',
      name: 'Option 3: Air Direct Emergency Drone Corridor',
      badge: '⚡ FASTEST ETA (AIR CORRIDOR)',
      path: ['Leh Central Depot', 'Air Corridor Sector B-2', postTargetName.includes('Foxtrot') ? 'Post Foxtrot-4' : 'Post Sierra-9'],
      distanceKm: 120,
      eta: '1.4 Hours (Air Direct Express)',
      risk: 'MODERATE RISK (Wind Shear > 45 km/h)',
      riskBadgeClass: 'warning',
      weightedCost: 180,
      fuelCost: '$420 Drone Battery & Air Dispatch',
      vehicle: 'DRONE',
      description: 'Autonomous heavy-lift cargo drone air bridge bypassing all mountain pass blockades.'
    }
  ];

  const activeSelectedRouteOption = routeOptions.find(opt => opt.id === selectedRouteOptionId) || routeOptions[0];

  // Handle Forwarding Map & Mission Data to Convoy Leader
  const handleDispatchConvoy = () => {
    const chosenMode = activeSelectedRouteOption.vehicle;
    const vehicleFullName = chosenMode === 'DRONE' 
      ? 'Heavy Cargo Drone (HLD-800-Alpha)' 
      : chosenMode === 'TATRA' 
      ? 'Tatra 6x6 Heavy Rig (LA-02-X-9941)' 
      : chosenMode === 'MULE'
      ? 'Mule Transport Team (MULE-SEC-01)'
      : '4x4 Logistics Truck (LA-02-X-4412)';

    const newConvoyMission = {
      id: `CNV-${Math.floor(4000 + Math.random() * 900)}`,
      name: `Operation Shield-${Math.floor(10 + Math.random() * 90)} (${post.name})`,
      route: activeSelectedRouteOption.path.join(' ➔ '),
      dijkstraPath: activeSelectedRouteOption.path,
      leader: "Sub. H. Singh (Assigned Convoy Leader)",
      vehicle: vehicleFullName,
      transportType: chosenMode,
      status: "IN_TRANSIT",
      cargo: `1,500L Kerosene Fuel + 600 MRE Rations for ${post.name}`,
      cargoQr: `QR-CARGO-CNV${Math.floor(1000 + Math.random() * 9000)}-${post.id}`,
      progressPct: 15,
      eta: activeSelectedRouteOption.eta,
      distanceKm: `${activeSelectedRouteOption.distanceKm} km`,
      currentCheck: `Checkpoint 1: ${activeSelectedRouteOption.path[0]}`,
      nextCheck: `Checkpoint 2: ${activeSelectedRouteOption.path[1] || activeSelectedRouteOption.path[0]}`,
      hazardLevel: isExtremeBlockade ? "EXTREME" : hazardLandslide ? "HIGH" : "MODERATE",
      alerts: [
        hazardLandslide ? "⚠️ Landslide active at Chang La Pass - AI routed via bypass" : "Road clear",
        hazardBlizzard ? "❄️ Sub-zero black ice alert (-30°C) - Heavy tire chains engaged" : "Normal thermal profile"
      ]
    };

    if (setConvoys) {
      setConvoys([newConvoyMission, ...convoys]);
    }

    setDispatchedSuccess(true);
    if (onDispatchSuccess) {
      onDispatchSuccess();
    }
    setTimeout(() => setDispatchedSuccess(false), 5000);
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ borderLeft: '4px solid var(--color-olive-green)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Cpu size={26} color="var(--color-olive-green)" />
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#1B2026' }}>
                AI HAZARD-AWARE ROUTE OPTIMIZATION & DISPATCH PLANNER
              </h2>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Evaluates shortest & safest paths considering weather, landslides, black ice, and altitude. Forwards real-time map route to Convoy Leader.
              </div>
            </div>
          </div>
          <span className="badge-status healthy" style={{ fontSize: '0.65rem' }}>
            ⚡ AI REROUTING ENGINE ACTIVE
          </span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Left: Mission Parameters & Live Hazards */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ fontWeight: '700', fontSize: '1rem', color: '#1B2026', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={18} color="var(--color-olive-green)" />
            <span>1. DISPATCH MISSION PARAMETERS</span>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', color: 'var(--color-olive-green)', fontWeight: '700', display: 'block', marginBottom: '0.35rem' }}>
              DESTINATION FORWARD POST
            </label>
            <select
              value={selectedPostId}
              onChange={(e) => setSelectedPostId(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem',
                background: '#F0F2ED',
                color: '#1B2026',
                border: '1px solid var(--border-color)',
                borderRadius: '6px',
                fontFamily: 'var(--font-mono)',
                fontWeight: '700'
              }}
            >
              {posts.map(p => (
                <option key={p.id} value={p.id}>{p.name} — {p.sector} ({p.stockoutDays}d stock left)</option>
              ))}
            </select>
          </div>

          {/* Simulated Hazards (AI Edge Weight Adjusters) */}
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-olive-green)', marginBottom: '0.5rem', fontWeight: '700' }}>
              ⚠️ SIMULATE MOUNTAIN HAZARDS (AI GRAPH WEIGHT INPUT):
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.8rem', cursor: 'pointer', background: '#F5F7F2', padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <input
                  type="checkbox"
                  checked={hazardLandslide}
                  onChange={(e) => setHazardLandslide(e.target.checked)}
                  style={{ accentColor: 'var(--status-warning)' }}
                />
                <span style={{ color: hazardLandslide ? '#B78103' : 'var(--text-secondary)', fontWeight: '600' }}>
                  ⚠️ Landslide & Rockfall Active at Chang La Pass (KM-42)
                </span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.8rem', cursor: 'pointer', background: '#F5F7F2', padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <input
                  type="checkbox"
                  checked={hazardBlizzard}
                  onChange={(e) => setHazardBlizzard(e.target.checked)}
                  style={{ accentColor: 'var(--status-critical)' }}
                />
                <span style={{ color: hazardBlizzard ? '#C0392B' : 'var(--text-secondary)', fontWeight: '600' }}>
                  ❄️ Heavy Blizzard & Sub-Zero Black Ice Alert (-30°C)
                </span>
              </label>
            </div>
          </div>

          {/* AI Recommended Transport Mode Selection */}
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-olive-green)', marginBottom: '0.5rem', fontWeight: '700' }}>
              🚚 SELECT SUITABLE TRANSPORT VEHICLE:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                onClick={() => setUserModeOverride('TATRA')}
                style={{
                  padding: '0.6rem',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: selectedMode === 'TATRA' ? 'var(--color-army-green)' : '#F0F2ED',
                  color: selectedMode === 'TATRA' ? '#fff' : '#1B2026',
                  cursor: 'pointer'
                }}
              >
                🚛 Tatra 6x6 Heavy Rig
              </button>

              <button
                onClick={() => setUserModeOverride('TRUCK')}
                style={{
                  padding: '0.6rem',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: selectedMode === 'TRUCK' ? 'var(--color-army-green)' : '#F0F2ED',
                  color: selectedMode === 'TRUCK' ? '#fff' : '#1B2026',
                  cursor: 'pointer'
                }}
              >
                🚚 4x4 Logistics Truck
              </button>

              <button
                onClick={() => setUserModeOverride('DRONE')}
                style={{
                  padding: '0.6rem',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: selectedMode === 'DRONE' ? 'var(--color-army-green)' : '#F0F2ED',
                  color: selectedMode === 'DRONE' ? '#fff' : '#1B2026',
                  cursor: 'pointer'
                }}
              >
                🛸 Heavy Cargo Drone
              </button>

              <button
                onClick={() => setUserModeOverride('MULE')}
                style={{
                  padding: '0.6rem',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  background: selectedMode === 'MULE' ? 'var(--color-army-green)' : '#F0F2ED',
                  color: selectedMode === 'MULE' ? '#fff' : '#1B2026',
                  cursor: 'pointer'
                }}
              >
                🐎 Mule Pack Team
              </button>
            </div>
          </div>
        </div>

        {/* Right: AI Algorithmic Route Evaluation & Forward to Convoy Leader */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: '700', fontSize: '1rem', color: '#1B2026', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Compass size={18} color="var(--color-olive-green)" />
            <span>2. AI EVALUATED SAFEST & SHORTEST ROUTE</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: '#F5F7F2', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Calculated Shortest Path Distance:</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#1B2026' }}>{dijkstraResult.distanceKm} km</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Estimated Transit ETA:</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#B78103' }}>{etaString}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>AI Recommended Vehicle:</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--color-olive-green)' }}>
                {aiRecommendedVehicle === 'DRONE' ? '🛸 Heavy Drone (Air Corridor)' : aiRecommendedVehicle === 'TATRA' ? '🚛 Tatra 6x6 Heavy Rig' : aiRecommendedVehicle === 'MULE' ? '🐎 Mule Pack Team' : '🚚 4x4 Logistics Truck'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>AI Graph Safety Cost:</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: dijkstraResult.weightedCost > 300 ? '#C0392B' : 'var(--status-healthy)' }}>
                {dijkstraResult.weightedCost} Weighted Points ({dijkstraResult.weightedCost < 250 ? '🟢 SAFEST PATH' : '🟡 HAZARD BYPASS ACTIVE'})
              </span>
            </div>
          </div>

          {/* Interactive Satellite Route Visual Map Display showing Selected Dijkstra Route */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: 'var(--color-olive-green)', fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '0.8rem' }}>
                🗺️ VISUAL SATELLITE TERRAIN MAP ({activeSelectedRouteOption.name.split(':')[0]} HIGHLIGHTED):
              </div>
              <span className={`badge-status ${activeSelectedRouteOption.riskBadgeClass}`} style={{ fontSize: '0.65rem' }}>
                {activeSelectedRouteOption.badge}
              </span>
            </div>

            <TacticalDijkstraMap
              dijkstraPath={activeSelectedRouteOption.path}
              hazards={{ landslide: hazardLandslide, blizzard: hazardBlizzard, blackIce: hazardBlackIce }}
              vehicleMode={activeSelectedRouteOption.vehicle}
            />

            {/* Waypoint Text Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#1B2026', fontWeight: '600', flexWrap: 'wrap', marginTop: '0.2rem' }}>
              {activeSelectedRouteOption.path.map((segment, idx) => (
                <React.Fragment key={idx}>
                  <span style={{
                    background: idx === 0 ? '#3F5135' : idx === activeSelectedRouteOption.path.length - 1 ? '#C0392B' : '#F5F7F2',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    border: '1px solid var(--border-color)',
                    color: idx === 0 || idx === activeSelectedRouteOption.path.length - 1 ? '#FFFFFF' : '#1B2026',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem'
                  }}>
                    {segment}
                  </span>
                  {idx < activeSelectedRouteOption.path.length - 1 && <ArrowRight size={14} color="var(--color-olive-green)" />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {dispatchedSuccess ? (
            <div style={{
              background: 'rgba(45, 122, 58, 0.12)',
              border: '1px solid var(--status-healthy-border)',
              color: 'var(--status-healthy)',
              padding: '0.9rem',
              borderRadius: '8px',
              textAlign: 'center',
              fontWeight: '700',
              fontSize: '0.88rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.35rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={20} />
                <span>📡 BEST ROUTE, NAVIGATION & MAP SENT TO CONVOY LEADER TERMINAL!</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>
                {activeSelectedRouteOption.name.split(':')[0]} forwarded to Convoy Leader HUD ({activeSelectedRouteOption.path.join(' ➔ ')}).
              </div>
            </div>
          ) : (
            <button
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.8rem', fontSize: '0.95rem' }}
              onClick={handleDispatchConvoy}
            >
              <Send size={18} /> 🚀 DISPATCH CONVOY MISSION NOW (FORWARD {activeSelectedRouteOption.name.split(':')[0]} TO CONVOY LEADER)
            </button>
          )}
        </div>
      </div>

      {/* SECTION 3: MULTIPLE ROUTE OPTIONS EVALUATION MATRIX (ETA, RISK & COST) */}
      <div className="glass-card" style={{ borderLeft: '4px solid var(--color-army-green)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.2rem' }}>
          <div>
            <div style={{ fontWeight: '700', fontSize: '1.05rem', color: '#1B2026', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Layers size={20} color="var(--color-army-green)" />
              <span>3. MULTIPLE ROUTE OPTIONS EVALUATION (ETA, RISK & COST COMPARISON)</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Select and compare dynamic route corridors evaluated by AI Route Optimization Engine. Each option displays exact ETA, risk rating, weighted safety points, and operational cost.
            </div>
          </div>
          <span className="badge-status healthy" style={{ fontSize: '0.7rem' }}>
            3 ROUTE CORRIDORS EVALUATED
          </span>
        </div>

        {/* 3 Selectable Route Option Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.2rem' }}>
          {routeOptions.map((opt) => {
            const isSelected = opt.id === selectedRouteOptionId;

            return (
              <div
                key={opt.id}
                onClick={() => setSelectedRouteOptionId(opt.id)}
                style={{
                  background: isSelected ? 'rgba(63, 81, 53, 0.08)' : '#F5F7F2',
                  border: `2px solid ${isSelected ? 'var(--color-army-green)' : 'var(--border-color)'}`,
                  borderRadius: '10px',
                  padding: '1.1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between',
                  gap: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 6px 20px rgba(63, 81, 53, 0.15)' : 'none'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#1B2026' }}>
                      {opt.name}
                    </div>
                    <span className={`badge-status ${opt.riskBadgeClass}`} style={{ fontSize: '0.65rem', whiteSpace: 'nowrap' }}>
                      {opt.badge}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.35', marginBottom: '0.75rem' }}>
                    {opt.description}
                  </p>

                  {/* Route Corridor Path Text */}
                  <div style={{
                    background: '#F0F2ED',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--color-army-green)',
                    marginBottom: '0.75rem'
                  }}>
                    {opt.path.join(' ➔ ')}
                  </div>
                </div>

                {/* Metrics Breakdown Grid: ETA, Risk Level, Cost */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', background: '#E8EBE4', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>ESTIMATED ETA</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-amber)', fontFamily: 'var(--font-mono)' }}>
                      {opt.eta.split(' ')[0]} {opt.eta.split(' ')[1]}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>RISK LEVEL</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: opt.riskBadgeClass === 'healthy' ? 'var(--status-healthy)' : opt.riskBadgeClass === 'critical' ? '#ff7878' : 'var(--color-amber)' }}>
                      {opt.risk.split(' ')[0]} {opt.risk.split(' ')[1]}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>SAFETY COST</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff', fontFamily: 'var(--font-mono)' }}>
                      {opt.weightedCost} pts
                    </div>
                  </div>
                </div>

                {/* Selection Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRouteOptionId(opt.id);
                  }}
                  className={isSelected ? "btn-primary" : "btn-secondary"}
                  style={{ width: '100%', justifyContent: 'center', padding: '0.55rem', fontSize: '0.8rem' }}
                >
                  {isSelected ? "✓ SELECTED FOR DISPATCH & MAP" : "SELECT ROUTE OPTION"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

