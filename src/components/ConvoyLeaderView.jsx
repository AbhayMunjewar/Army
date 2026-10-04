import React, { useState } from 'react';
import {
  Navigation,
  CheckSquare,
  Radio,
  ShieldAlert,
  CheckCircle2,
  AlertOctagon,
  MapPin,
  Truck,
  ArrowRight,
  ShieldCheck,
  Compass,
  QrCode,
  FileText,
  Download,
  AlertTriangle,
  Check,
  PackageCheck,
  WifiOff,
  Clock,
  Edit3,
  Layers,
  Send,
  Camera,
  X,
  FilePlus,
  Zap
} from 'lucide-react';
import TacticalDijkstraMap from './TacticalDijkstraMap';

// Helper SVG QR Code Generator Component for Convoy Leader Testing
function RenderQRCodeSVG({ manifestId = "CNV-4354", postName = "Post Foxtrot-4", size = 180 }) {
  const dataString = `RAKSHAK:MANIFEST=${manifestId}|POST=${postName}|ITEMS=SubZeroSKO_1500L+MRE_600Pks|HASH=AES256-88F9A2B0014`;
  const grid = Array(21).fill(0).map(() => Array(21).fill(0));
  
  const addFinder = (r, c) => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
          grid[r + i][c + j] = 1;
        }
      }
    }
  };

  addFinder(0, 0);
  addFinder(0, 14);
  addFinder(14, 0);

  let seed = 0;
  for (let k = 0; k < dataString.length; k++) seed = (seed * 31 + dataString.charCodeAt(k)) % 1000000007;

  for (let r = 0; r < 21; r++) {
    for (let c = 0; c < 21; c++) {
      if ((r < 8 && c < 8) || (r < 8 && c > 12) || (r > 12 && c < 8)) continue;
      seed = (seed * 16807) % 2147483647;
      grid[r][c] = (seed % 3 === 0 || seed % 5 === 0) ? 1 : 0;
    }
  }

  const cellSize = size / 21;
  const rects = [];
  for (let r = 0; r < 21; r++) {
    for (let c = 0; c < 21; c++) {
      if (grid[r][c] === 1) {
        rects.push(
          <rect
            key={`${r}-${c}`}
            x={c * cellSize}
            y={r * cellSize}
            width={cellSize}
            height={cellSize}
            fill="#0B1F33"
          />
        );
      }
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
      <svg id="convoy-test-qr-code-svg" width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ background: '#ffffff', padding: '10px', borderRadius: '10px', border: '3px solid #D6A23A', boxShadow: '0 0 15px rgba(214, 162, 58, 0.4)' }}>
        {rects}
      </svg>
      <div style={{ fontSize: '0.72rem', color: '#FFF099', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
        AES-256 ENCRYPTED MANIFEST: {manifestId}
      </div>
    </div>
  );
}

export default function ConvoyLeaderView({ convoy, convoys, setConvoys, posts, setPosts, onSupplyDelivered, currentTab, setCurrentTab }) {
  const activeConvoy = convoy || {
    id: "CNV-4091",
    name: "Operation Shield-78 (Post Foxtrot-4)",
    route: "Leh Central Depot ➔ Shyok Valley Bypass ➔ Tangtse Transit Base ➔ Post Foxtrot-4",
    dijkstraPath: ["Leh Central Depot", "Shyok Valley Bypass", "Tangtse Transit Base", "Post Foxtrot-4"],
    leader: "Sub. H. Singh (Assigned Convoy Leader)",
    vehicle: "Tatra 6x6 Heavy Rig (LA-02-X-9941)",
    transportType: "TATRA",
    status: "IN_TRANSIT",
    cargo: "1,500L Kerosene Fuel + 600 MRE Rations for Post Foxtrot-4",
    cargoQr: "QR-CARGO-CNV4091-F4",
    progressPct: 25,
    eta: "5.3 Hours (Safest AI Reroute)",
    distanceKm: "210 km",
    currentCheck: "Shyok Valley Bypass",
    nextCheck: "Tangtse Transit Base",
    hazardLevel: "HIGH",
    alerts: [
      "⚠️ Landslide Active at Chang La Pass — AI Engine routed convoy via Shyok Valley Bypass",
      "❄️ Sub-Zero Black Ice Warning (-28°C) — Tire chains engaged, speed capped at 30 km/h"
    ]
  };

  // Extract Dijkstra Path array from active convoy object
  const rawPath = activeConvoy.dijkstraPath || (activeConvoy.route ? activeConvoy.route.split(' ➔ ') : ["Leh Central Depot", "Shyok Valley Bypass", "Tangtse Transit Base", "Post Foxtrot-4"]);

  // Dynamic Destination Post
  const destName = rawPath[rawPath.length - 1]?.trim() || "Post Foxtrot-4";
  const destPost = posts?.find(p => destName.includes(p.name)) || {
    name: destName,
    sector: "Siachen Glacier Sector",
    commander: "Capt. A. Sharma",
    id: null
  };

  // Dynamic Checkpoint List generated from Dijkstra Path
  const checkpoints = rawPath.map((nodeName, idx) => ({
    name: nodeName,
    elevation: nodeName.includes('Khardung') ? '17,582 ft' : nodeName.includes('Chang') ? '17,590 ft' : nodeName.includes('Depot') ? '11,500 ft' : '14,200 ft',
    status: idx === 0 ? 'PASSED' : idx === 1 ? 'IN_PROGRESS' : 'PENDING',
    time: idx === 0 ? '06:00 AM' : idx === 1 ? '09:45 AM (Current)' : `Est +${idx * 2.5} hrs`
  }));

  // Stepper mapping helper
  const isStep51 = currentTab === '5.1_pre_departure' || currentTab === 'pre_departure' || currentTab === 'mission';
  const isStep52Qr = currentTab === 'qr_scanner' || currentTab === '5.2_qr_scan' || currentTab === 'checkpoint' || currentTab === 'qr';
  const isStep53 = currentTab === '5.3_incidents' || currentTab === 'incidents';
  const isStep54 = currentTab === '5.4_journey' || currentTab === 'journey' || currentTab === 'sos';
  const isStep55 = currentTab === '5.5_arrival' || currentTab === 'arrival';

  // State 5.1: Pre-Departure
  const [routeDownloaded, setRouteDownloaded] = useState(false);

  // State 5.2: Cargo Receipt & QR Scan Page (Dual Mode: LIVE vs UPLOAD)
  const [scanMode, setScanMode] = useState('LIVE'); // 'LIVE' | 'UPLOAD'
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [showTestQrModal, setShowTestQrModal] = useState(false);

  // Navigation & Telemetry HQ Sync
  const [currentCheckpointIdx, setCurrentCheckpointIdx] = useState(1);
  const [scanningQr, setScanningQr] = useState(false);
  const [scanSuccessMsg, setScanSuccessMsg] = useState(null);
  const [checkpointLogsList, setCheckpointLogsList] = useState([
    {
      id: "ACK-8812",
      checkpoint: "Leh Central Depot (Origin)",
      time: "06:00 AM",
      status: "SAFE_AND_ON_SCHEDULE",
      telemetry: "Speed: 0 km/h | Engine: 68°C | SatComm: L-BAND OK",
      hqAck: "ACKNOWLEDGED BY DEPOT HQ"
    }
  ]);

  const handleScanSimulate = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScannedResult({
        manifestId: activeConvoy.id || "CNV-4354",
        sender: "Leh Central Logistics Depot Base",
        destination: destPost.name,
        cargo: activeConvoy.cargo || "1,500L Kerosene Fuel + 600 MRE Rations for Post Foxtrot-4",
        qrHash: "AES256-88F9A2B0014-VERIFIED"
      });
    }, 1200);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setUploadedFileName(file.name);
      setIsScanning(true);
      setTimeout(() => {
        setIsScanning(false);
        setScannedResult({
          manifestId: activeConvoy.id || "CNV-4354",
          sender: "Leh Central Logistics Depot Base",
          destination: destPost.name,
          cargo: activeConvoy.cargo || "1,500L Kerosene Fuel + 600 MRE Rations for Post Foxtrot-4",
          qrHash: "AES256-88F9A2B0014-VERIFIED"
        });
      }, 1200);
    }
  };

  const handleConfirmSupplyReceipt = () => {
    setVerifiedSuccess(true);
    setConvoyStatus('IN_TRANSIT');

    if (setConvoys && convoys) {
      setConvoys(convoys.map(c =>
        c.id === activeConvoy.id ? {
          ...c,
          status: 'IN_TRANSIT',
          progressPct: 50,
          currentCheck: 'Supply Received at Base',
          lastQrScan: { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), status: 'SUPPLY_RECEIVED' }
        } : c
      ));
    }

    if (onSupplyDelivered) {
      onSupplyDelivered({
        manifestId: activeConvoy.id,
        postName: destPost.name,
        item: activeConvoy.cargo,
        qty: "1,500 Liters / 600 MRE Packs",
        role: "CONVOY_LEADER",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
  };

  // Dynamic Dijkstra Rerouting & Disaster Simulation State
  const [activeHazard, setActiveHazard] = useState('NONE'); // 'NONE' | 'LANDSLIDE' | 'AVALANCHE' | 'BRIDGE_WASHOUT'
  const [isRerouting, setIsRerouting] = useState(false);
  const [rerouteAccepted, setRerouteAccepted] = useState(false);

  const getDijkstraPathForHazard = (hazardType) => {
    if (hazardType === 'LANDSLIDE') {
      return {
        path: ["Leh Central Depot", "Shyok Valley Bypass", "Tangtse Transit Base", "Post Foxtrot-4"],
        routeStr: "Leh Central Depot ➔ Shyok Valley Bypass ➔ Tangtse Transit Base ➔ Post Foxtrot-4",
        distanceKm: "224 km",
        eta: "5.3 Hours",
        reason: "⛰️ Landslide active at Chang La Pass (17,590 ft). AI Rerouting Engine bypassed Chang La via Shyok Valley River Corridor.",
        riskLevel: "LOW (Safest Reroute)"
      };
    } else if (hazardType === 'AVALANCHE') {
      return {
        path: ["Leh Central Depot", "Kargil Pass Junction", "Tangtse Transit Base", "Post Foxtrot-4"],
        routeStr: "Leh Central Depot ➔ Kargil Pass Junction ➔ Tangtse Transit Base ➔ Post Foxtrot-4",
        distanceKm: "240 km",
        eta: "6.1 Hours",
        reason: "❄️ Severe Avalanche Warning at Khardung La & Chang La. AI Rerouting Engine selected Western Kargil Valley Highway Corridor.",
        riskLevel: "MODERATE (Low Altitude Bypass)"
      };
    } else if (hazardType === 'BRIDGE_WASHOUT') {
      return {
        path: ["Leh Central Depot", "Khardung La Pass (17,582 ft)", "Nubra Valley Base", "Post Foxtrot-4"],
        routeStr: "Leh Central Depot ➔ Khardung La Pass (17,582 ft) ➔ Nubra Valley Base ➔ Post Foxtrot-4",
        distanceKm: "210 km",
        eta: "5.1 Hours",
        reason: "🌉 Shyok River Bridge Washout. AI Rerouting Engine rerouted convoy over Khardung La High Pass to Nubra Base.",
        riskLevel: "HIGH (High Pass Chains Mandatory)"
      };
    } else {
      return {
        path: ["Leh Central Depot", "Chang La Pass (17,590 ft)", "Tangtse Transit Base", "Post Foxtrot-4"],
        routeStr: "Leh Central Depot ➔ Chang La Pass (17,590 ft) ➔ Tangtse Transit Base ➔ Post Foxtrot-4",
        distanceKm: "195 km",
        eta: "4.5 Hours",
        reason: "🟢 All mountain passes clear. AI Rerouting Engine selected standard Direct Chang La Highway.",
        riskLevel: "OPTIMAL"
      };
    }
  };

  const currentDijkstraInfo = getDijkstraPathForHazard(activeHazard);

  const handleSimulateDisaster = (hazardType) => {
    setIsRerouting(true);
    setActiveHazard(hazardType);
    setRerouteAccepted(false);
    setTimeout(() => {
      setIsRerouting(false);
    }, 800);
  };

  // State 5.3: Incident Logging
  const [incidentType, setIncidentType] = useState('⛰️ Landslide / Rockfall');
  const [incidentLocation, setIncidentLocation] = useState('Km 42 on Shyok Valley Pass');
  const [incidentSeverity, setIncidentSeverity] = useState('HIGH (Caution & Single-File Passage)');
  const [incidentNotes, setIncidentNotes] = useState('Minor rockfall blocking left lane, single file passage available with caution.');
  const [incidentsList, setIncidentsList] = useState([
    { id: "INC-901", type: "⛰️ Landslide Active", loc: "Chang La Pass (Km 31)", severity: "CRITICAL", time: "08:15 AM", status: "STORED OFFLINE (CRDT)" },
    { id: "INC-902", type: "🧊 Sub-Zero Black Ice", loc: "Tangtse Sector (Km 88)", severity: "MEDIUM", time: "09:30 AM", status: "STORED OFFLINE (CRDT)" }
  ]);
  const [incidentLoggedSuccess, setIncidentLoggedSuccess] = useState(false);

  // State 5.4: During Journey & SOS
  const [convoyStatus, setConvoyStatus] = useState(activeConvoy.status || 'IN_TRANSIT');
  const [sosSent, setSosSent] = useState(false);

  // State 5.5: Arrival & Delivery Sign-Off
  const [deliveryComplete, setDeliveryComplete] = useState(false);

  const handleDownloadRoute = () => {
    setRouteDownloaded(true);
  };

  const handleLogIncident = (e) => {
    e.preventDefault();
    const newInc = {
      id: `INC-${Math.floor(100 + Math.random() * 900)}`,
      type: incidentType,
      loc: incidentLocation,
      severity: incidentSeverity.split(' ')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "STORED OFFLINE (CRDT)"
    };
    setIncidentsList([newInc, ...incidentsList]);
    setIncidentLoggedSuccess(true);
    setTimeout(() => setIncidentLoggedSuccess(false), 3000);
  };

  const handleTriggerSOS = () => {
    setSosSent(true);
    setTimeout(() => setSosSent(false), 6000);
  };

  const handleConfirmDelivery = () => {
    setDeliveryComplete(true);
    setConvoyStatus('DELIVERED');

    if (setConvoys && convoys) {
      setConvoys(convoys.map(c =>
        c.id === activeConvoy.id ? { ...c, status: 'DELIVERED', progressPct: 100, currentCheck: 'Arrived', nextCheck: 'None' } : c
      ));
    }

    if (setPosts && posts && destPost.id) {
      setPosts(posts.map(p => {
        if (p.id === destPost.id) {
          return { ...p, status: 'HEALTHY', stockoutDays: 14 };
        }
        return p;
      }));
    }
  };

  const setTab = (tabName) => {
    if (setCurrentTab) setCurrentTab(tabName);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* HEADER MISSION BANNER — FORWARDED BEST ROUTE DISPLAY */}
      <div className="glass-card" style={{ borderLeft: '4px solid var(--color-army-green)', background: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <ShieldCheck size={22} color="var(--color-army-green)" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#1B2026' }}>
                CONVOY MISSION HUD — {activeConvoy.name} ({activeConvoy.id})
              </h2>
            </div>

            {/* FORWARDED BEST ROUTE HIGHLIGHT BANNER */}
            <div style={{
              background: 'rgba(63, 81, 53, 0.12)',
              border: '1px solid rgba(63, 81, 53, 0.3)',
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              marginTop: '0.6rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.82rem',
              fontFamily: 'var(--font-mono)'
            }}>
              <span style={{ color: 'var(--color-army-green)', fontWeight: '700' }}>⚡ FORWARDED BEST AI ROUTE:</span>
              <strong style={{ color: '#1B2026' }}>{activeConvoy.route}</strong>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.4rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <span>Convoy Leader: <strong style={{ color: '#1B2026' }}>{activeConvoy.leader}</strong></span>
              <span>Vehicle: <strong style={{ color: 'var(--color-olive-green)' }}>{activeConvoy.vehicle}</strong></span>
              <span>Distance / ETA: <strong style={{ color: 'var(--color-amber)' }}>{activeConvoy.distanceKm} ({activeConvoy.eta})</strong></span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
            <span className={`badge-status ${deliveryComplete ? 'healthy' : 'warning'}`} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
              {deliveryComplete ? '✅ MISSION DELIVERED' : `TRANSIT STATUS: ${convoyStatus}`}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
              Cargo: {activeConvoy.cargo}
            </span>
          </div>
        </div>
      </div>

      {/* REAL LEAFLET SATELLITE MAP WITH INTERACTIVE AI DISASTER REROUTING ENGINE */}
      {isStep51 && (
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* HEADER & DISASTER SIMULATOR CONTROLS */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ fontWeight: '700', fontSize: '1.05rem', color: '#1B2026', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Navigation size={20} color="var(--color-army-green)" />
                <span>DYNAMIC AI REROUTING & DISASTER SIMULATOR</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                Simulate mountain pass hazards. AI Rerouting Engine re-computes optimal safest bypass in real-time.
              </div>
            </div>

            {/* DISASTER SIMULATION BUTTONS */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleSimulateDisaster('LANDSLIDE')}
                style={{
                  padding: '0.45rem 0.75rem',
                  borderRadius: '6px',
                  border: `1px solid ${activeHazard === 'LANDSLIDE' ? '#C0392B' : 'var(--border-color)'}`,
                  background: activeHazard === 'LANDSLIDE' ? '#FFF5F5' : '#FFFFFF',
                  color: activeHazard === 'LANDSLIDE' ? '#C0392B' : 'var(--text-secondary)',
                  fontWeight: '700',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                ⛰️ Landslide at Chang La
              </button>

              <button
                onClick={() => handleSimulateDisaster('AVALANCHE')}
                style={{
                  padding: '0.45rem 0.75rem',
                  borderRadius: '6px',
                  border: `1px solid ${activeHazard === 'AVALANCHE' ? '#0284c7' : 'var(--border-color)'}`,
                  background: activeHazard === 'AVALANCHE' ? '#F0F9FF' : '#FFFFFF',
                  color: activeHazard === 'AVALANCHE' ? '#0284c7' : 'var(--text-secondary)',
                  fontWeight: '700',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                ❄️ Avalanche at High Passes
              </button>

              <button
                onClick={() => handleSimulateDisaster('BRIDGE_WASHOUT')}
                style={{
                  padding: '0.45rem 0.75rem',
                  borderRadius: '6px',
                  border: `1px solid ${activeHazard === 'BRIDGE_WASHOUT' ? '#B78103' : 'var(--border-color)'}`,
                  background: activeHazard === 'BRIDGE_WASHOUT' ? '#FFFDF5' : '#FFFFFF',
                  color: activeHazard === 'BRIDGE_WASHOUT' ? '#B78103' : 'var(--text-secondary)',
                  fontWeight: '700',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                🌉 Shyok River Washout
              </button>

              <button
                onClick={() => handleSimulateDisaster('NONE')}
                style={{
                  padding: '0.45rem 0.75rem',
                  borderRadius: '6px',
                  border: `1px solid ${activeHazard === 'NONE' ? '#2E7D32' : 'var(--border-color)'}`,
                  background: activeHazard === 'NONE' ? '#E8F5E9' : '#FFFFFF',
                  color: activeHazard === 'NONE' ? '#2E7D32' : 'var(--text-secondary)',
                  fontWeight: '700',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                🟢 Clear Road Hazards
              </button>
            </div>
          </div>

          {/* AI RE-CALCULATED ROUTE BANNER */}
          <div style={{
            background: '#F0F2ED',
            border: '1.5px solid var(--color-olive-green)',
            borderRadius: '8px',
            padding: '0.85rem 1.1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}>
            {isRerouting ? (
              <div style={{ color: 'var(--color-olive-green)', fontWeight: '800', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Zap size={18} className="spin" color="var(--color-olive-green)" />
                <span>⚡ AI REROUTING ENGINE RE-CALCULATING SAFEST BYPASS ROUTE...</span>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#1B2026', fontFamily: 'var(--font-mono)' }}>
                    ⚡ AI OPTIMAL SAFEST ROUTE: {currentDijkstraInfo.routeStr}
                  </div>
                  <span className="badge-status healthy" style={{ fontSize: '0.65rem' }}>
                    SAFETY INDEX: {currentDijkstraInfo.riskLevel}
                  </span>
                </div>

                <div style={{ fontSize: '0.78rem', color: '#1B2026', lineHeight: '1.4', fontWeight: '600' }}>
                  {currentDijkstraInfo.reason}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  <span>Distance: <strong style={{ color: '#1B2026' }}>{currentDijkstraInfo.distanceKm}</strong> | Est. Travel Time: <strong style={{ color: '#B78103' }}>{currentDijkstraInfo.eta}</strong></span>
                  {rerouteAccepted ? (
                    <span style={{ color: 'var(--status-healthy)', fontWeight: '700' }}>✅ SAFEST ROUTE LOCKED IN CACHE</span>
                  ) : (
                    <button
                      className="btn-primary"
                      onClick={() => setRerouteAccepted(true)}
                      style={{ padding: '0.45rem 0.9rem', fontSize: '0.75rem' }}
                    >
                      ✓ Lock & Accept Safest Route
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          <TacticalDijkstraMap
            dijkstraPath={currentDijkstraInfo.path}
            hazards={{ landslide: activeHazard === 'LANDSLIDE', avalanche: activeHazard === 'AVALANCHE', bridge: activeHazard === 'BRIDGE_WASHOUT' }}
            vehicleMode={activeConvoy.transportType}
          />
        </div>
      )}



      {/* STAGE 5.1: PRE-DEPARTURE */}
      {isStep51 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          {/* Dispatch Order & Cargo Manifest */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1rem', color: '#fff' }}>
              <FileText size={20} color="var(--accent-cyan)" />
              <span>5.1 RECEIVE DISPATCH ORDER & FORWARDED BEST ROUTE</span>
            </div>

            <div style={{ background: '#F5F7F2', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Dispatch Order ID:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--color-army-green)' }}>{activeConvoy.id}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Assigned Vehicle:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#1B2026' }}>{activeConvoy.vehicle}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Convoy Commander:</span>
                <span style={{ fontWeight: '700', color: '#1B2026' }}>{activeConvoy.leader}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Forwarded Best Route:</span>
                <span style={{ fontWeight: '700', color: 'var(--color-army-green)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{activeConvoy.route}</span>
              </div>
            </div>

            {/* Cargo Crate Breakdown */}
            <div style={{ background: '#F5F7F2', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-olive-green)' }}>
                📦 LOADED CARGO MANIFEST DETAILS:
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1B2026' }}>
                {activeConvoy.cargo}
              </div>
            </div>
          </div>

          {/* Download Route & Checkpoints */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1rem', color: '#1B2026', marginBottom: '0.75rem' }}>
                <Download size={20} color="var(--color-army-green)" />
                <span>DOWNLOAD ASSIGNED ROUTE & CHECKPOINTS</span>
              </div>

              <div style={{ background: '#F5F7F2', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Forwarded AI Route Path:
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-army-green)', fontFamily: 'var(--font-mono)' }}>
                  {activeConvoy.route}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Total Distance: {activeConvoy.distanceKm} | Estimated Travel Time: {activeConvoy.eta}
                </div>
              </div>

              <div style={{ marginTop: '1rem' }}>
                {routeDownloaded ? (
                  <div style={{ background: 'var(--status-healthy-bg)', color: 'var(--status-healthy)', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--status-healthy-border)', textAlign: 'center', fontWeight: '700', fontSize: '0.85rem' }}>
                    ✅ ASSIGNED ROUTE & CHECKPOINTS DOWNLOADED TO LOCAL ENCRYPTED CACHE!
                  </div>
                ) : (
                  <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }} onClick={handleDownloadRoute}>
                    <Download size={18} /> Download Assigned AI Route & Checkpoints
                  </button>
                )}
              </div>
            </div>

            <button
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', background: 'var(--accent-cyan)', color: '#000', fontWeight: '700' }}
              onClick={() => setTab('5.4_journey')}
            >
              🚀 Proceed to Telemetry & SOS Monitoring <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 5.2: CARGO RECEIPT & QR SCANNER PAGE */}
      {isStep52Qr && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* HEADER BANNER */}
          <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderLeft: '4px solid var(--color-army-green)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: '700', fontSize: '1.1rem', color: '#1B2026' }}>
                <QrCode size={22} color="var(--color-army-green)" />
                <span>CARGO RECEIPT & QR VERIFICATION SCANNER</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Scan cargo QR code plaque upon receiving supplies from Leh Depot. Verifying sends instant confirmation alert to Depot Officer.
              </div>
            </div>
          </div>

          {/* DUAL SCANNING MODES SELECTOR (LIVE CAMERA vs UPLOAD FILE) */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.85rem' }}>
              <button
                onClick={() => { setScanMode('LIVE'); setScannedResult(null); setUploadedFileName(null); }}
                style={{
                  flex: 1,
                  padding: '0.85rem',
                  borderRadius: '8px',
                  border: `2px solid ${scanMode === 'LIVE' ? '#3F5135' : 'var(--border-color)'}`,
                  background: scanMode === 'LIVE' ? 'linear-gradient(135deg, #3F5135 0%, #263620 100%)' : '#FFFFFF',
                  color: scanMode === 'LIVE' ? '#FFFFFF' : '#1B2026',
                  fontWeight: '800',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: scanMode === 'LIVE' ? '0 4px 14px rgba(63, 81, 53, 0.3)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Camera size={18} />
                <span>OPTION A: SCAN LIVE (CAMERA)</span>
              </button>

              <button
                onClick={() => { setScanMode('UPLOAD'); setScannedResult(null); setUploadedFileName(null); }}
                style={{
                  flex: 1,
                  padding: '0.85rem',
                  borderRadius: '8px',
                  border: `2px solid ${scanMode === 'UPLOAD' ? '#C8960E' : 'var(--border-color)'}`,
                  background: scanMode === 'UPLOAD' ? 'linear-gradient(135deg, #C8960E 0%, #8C6707 100%)' : '#FFFFFF',
                  color: scanMode === 'UPLOAD' ? '#FFFFFF' : '#1B2026',
                  fontWeight: '800',
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  boxShadow: scanMode === 'UPLOAD' ? '0 4px 14px rgba(200, 150, 14, 0.3)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <FilePlus size={18} />
                <span>OPTION B: UPLOAD QR PHOTO</span>
              </button>
            </div>

            {/* SCANNER VIEWPORT AREA - HIGH CONTRAST CLEAN THEME */}
            <div style={{
              background: '#FFFFFF',
              padding: '2rem 1.75rem',
              borderRadius: '12px',
              border: '1.5px solid var(--border-color)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.2rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)'
            }}>
              {scanMode === 'LIVE' ? (
                <>
                  <div style={{ fontSize: '0.88rem', color: '#1B2026', fontWeight: '700' }}>
                    Position physical Cargo QR plaque within the optical camera reticle below:
                  </div>

                  {/* TACTICAL CAMERA VIEWFINDER FRAME WITH CORNER RETICLES */}
                  <div style={{
                    width: '240px',
                    height: '240px',
                    border: '2px solid var(--color-olive-green)',
                    borderRadius: '16px',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#F8F9F5',
                    boxShadow: '0 4px 16px rgba(63, 81, 53, 0.1)',
                    overflow: 'hidden'
                  }}>
                    {/* Viewfinder Target Corner Brackets */}
                    <div style={{ position: 'absolute', top: '12px', left: '12px', width: '20px', height: '20px', borderTop: '3px solid var(--color-olive-green)', borderLeft: '3px solid var(--color-olive-green)' }} />
                    <div style={{ position: 'absolute', top: '12px', right: '12px', width: '20px', height: '20px', borderTop: '3px solid var(--color-olive-green)', borderRight: '3px solid var(--color-olive-green)' }} />
                    <div style={{ position: 'absolute', bottom: '12px', left: '12px', width: '20px', height: '20px', borderBottom: '3px solid var(--color-olive-green)', borderLeft: '3px solid var(--color-olive-green)' }} />
                    <div style={{ position: 'absolute', bottom: '12px', right: '12px', width: '20px', height: '20px', borderBottom: '3px solid var(--color-olive-green)', borderRight: '3px solid var(--color-olive-green)' }} />

                    {/* Scanning Laser Beam */}
                    {isScanning ? (
                      <>
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '3px',
                          background: 'var(--color-olive-green)',
                          boxShadow: '0 0 15px var(--color-olive-green)',
                          animation: 'pulse-border 1s infinite alternate'
                        }} />
                        <Camera size={64} className="ping" color="var(--color-olive-green)" />
                        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-olive-green)', marginTop: '0.75rem', fontWeight: '800' }}>
                          SCANNING OPTICAL RETICLE...
                        </span>
                      </>
                    ) : (
                      <>
                        <QrCode size={80} color="var(--color-olive-green)" />
                        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#1B2026', marginTop: '0.5rem', fontWeight: '700' }}>
                          CAMERA READY
                        </span>
                      </>
                    )}
                  </div>

                  <button
                    className="btn-primary"
                    onClick={handleScanSimulate}
                    disabled={isScanning}
                    style={{
                      background: 'linear-gradient(135deg, #3F5135 0%, #263620 100%)',
                      color: '#FFFFFF',
                      border: '1px solid #D6A23A',
                      fontWeight: '800',
                      padding: '0.85rem 2.2rem',
                      fontSize: '0.9rem',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      boxShadow: '0 4px 15px rgba(63, 81, 53, 0.3)',
                      cursor: 'pointer'
                    }}
                  >
                    <Camera size={18} />
                    <span>{isScanning ? 'SCANNING CARGO PLAQUE...' : 'CLICK TO SCAN LIVE CARGO QR CODE'}</span>
                  </button>
                </>
              ) : (
                <>
                  <div style={{ fontSize: '0.88rem', color: '#1B2026', fontWeight: '700' }}>
                    Upload image file of Cargo QR code manifest (.png, .jpg, .svg):
                  </div>

                  <label style={{
                    width: '100%',
                    maxWidth: '480px',
                    padding: '2.2rem',
                    borderRadius: '12px',
                    border: '2px dashed #C8960E',
                    background: '#F8F9F5',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.85rem',
                    transition: 'all 0.2s ease'
                  }}>
                    <FilePlus size={48} color="#C8960E" />
                    <span style={{ fontWeight: '800', color: '#1B2026', fontSize: '0.95rem' }}>
                      {uploadedFileName ? `Selected: ${uploadedFileName}` : 'Choose QR Photo File to Upload'}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                      Supports PNG, JPG, JPEG, SVG QR manifest files
                    </span>
                    <input type="file" accept="image/*,.svg" onChange={handleFileUpload} style={{ display: 'none' }} />
                  </label>
                </>
              )}
            </div>

            {/* VERIFIED MANIFEST RESULT CARD */}
            {scannedResult && (
              <div style={{ background: '#F5F7F2', padding: '1.25rem', borderRadius: '10px', border: '2px solid var(--status-healthy)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--status-healthy)', fontWeight: '800', fontSize: '1rem' }}>
                    <CheckCircle2 size={22} />
                    <span>CARGO MANIFEST CRYPTOGRAPHICALLY VERIFIED</span>
                  </div>
                  <span className="badge-status healthy" style={{ fontSize: '0.7rem' }}>
                    AES-256 SECURE
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', background: '#F0F2ED', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.82rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>Manifest ID: </span>
                    <strong style={{ color: 'var(--color-army-green)', fontFamily: 'var(--font-mono)' }}>{scannedResult.manifestId}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>Logistics Depot Origin: </span>
                    <strong style={{ color: '#1B2026' }}>{scannedResult.sender}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>Destination Outpost: </span>
                    <strong style={{ color: '#1B2026' }}>{scannedResult.destination}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)' }}>Loaded Supply Items: </span>
                    <strong style={{ color: 'var(--color-olive-green)' }}>{scannedResult.cargo}</strong>
                  </div>
                </div>

                {verifiedSuccess ? (
                  <div style={{ background: 'var(--status-healthy-bg)', border: '2px solid var(--status-healthy-border)', color: 'var(--status-healthy)', padding: '1.1rem', borderRadius: '8px', textAlign: 'center', fontWeight: '800', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={32} />
                    <span>✅ SUPPLY RECEIPT VERIFIED & SENT TO LOGISTIC LEADER (DEPOT OFFICER)!</span>
                    <div style={{ fontSize: '0.78rem', color: '#F2F4EF', fontWeight: 'normal' }}>
                      Real-time alert notification broadcasted across Central Command Room dashboard.
                    </div>
                  </div>
                ) : (
                  <button
                    className="btn-primary"
                    onClick={handleConfirmSupplyReceipt}
                    style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '0.95rem', background: 'var(--status-healthy)', borderColor: 'var(--status-healthy)', fontWeight: '800' }}
                  >
                    <CheckCircle2 size={20} /> CONFIRM CARGO RECEIVED & NOTIFY DEPOT LOGISTICS OFFICER
                  </button>
                )}
              </div>
            )}
          </div>

          {/* TEST QR CODE GENERATOR MODAL */}
          {showTestQrModal && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.75)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
              <div style={{ background: '#FFFFFF', border: '2px solid #D6A23A', borderRadius: '12px', padding: '1.5rem', maxWidth: '420px', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem', boxShadow: '0 10px 30px rgba(214, 162, 58, 0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: '800', color: '#C8960E', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <QrCode size={20} color="#D6A23A" />
                    <span>TEST CARGO QR CODE PLAQUE</span>
                  </div>
                  <button onClick={() => setShowTestQrModal(false)} style={{ background: 'transparent', border: 'none', color: '#1B2026', cursor: 'pointer' }}>
                    <X size={20} />
                  </button>
                </div>

                <RenderQRCodeSVG manifestId={activeConvoy.id} postName={destPost.name} size={200} />

                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                  Use your phone camera or upload the test SVG image to simulate cargo verification sign-off.
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <a
                    href="/sih251_test_cargo_qr.svg"
                    download="sih251_test_cargo_qr.svg"
                    className="btn-secondary"
                    style={{ flex: 1, justifyContent: 'center', background: '#F0F2ED', color: '#1B2026', borderColor: '#D6A23A', textDecoration: 'none', fontSize: '0.8rem', padding: '0.65rem' }}
                  >
                    <Download size={16} /> Download QR (SVG)
                  </a>
                  <button
                    className="btn-primary"
                    onClick={() => { setShowTestQrModal(false); handleScanSimulate(); }}
                    style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem', padding: '0.65rem' }}
                  >
                    Auto-Verify Test QR
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STAGE 5.3: INCIDENT LOGGING */}
      {isStep53 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1rem', color: '#1B2026' }}>
              <AlertTriangle size={20} color="var(--status-warning)" />
              <span>5.3 REPORT ROAD HAZARDS & INCIDENTS</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Report landslides, black ice, or road washouts. Data is stored locally in CRDT queue if offline.
            </div>

            <form onSubmit={handleLogIncident} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-olive-green)', display: 'block', marginBottom: '0.25rem' }}>
                  HAZARD TYPE
                </label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', background: '#F0F2ED', color: '#1B2026', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.85rem' }}
                >
                  <option value="⛰️ Landslide / Rockfall">⛰️ Landslide / Rockfall</option>
                  <option value="🧊 Sub-Zero Black Ice">🧊 Sub-Zero Black Ice</option>
                  <option value="❄️ Blizzard / Zero Visibility">❄️ Blizzard / Zero Visibility</option>
                  <option value="🌉 Bridge Damage / Washout">🌉 Bridge Damage / Washout</option>
                  <option value="🚜 Vehicle Breakdown">🚜 Vehicle Breakdown</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-olive-green)', display: 'block', marginBottom: '0.25rem' }}>
                  DISTANCE MARKER / LOCATION
                </label>
                <input
                  type="text"
                  value={incidentLocation}
                  onChange={(e) => setIncidentLocation(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', background: '#F0F2ED', color: '#1B2026', border: '1px solid var(--border-color)', borderRadius: '6px', fontFamily: 'var(--font-mono)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-olive-green)', display: 'block', marginBottom: '0.25rem' }}>
                  SEVERITY & REROUTE ADVISORY
                </label>
                <select
                  value={incidentSeverity}
                  onChange={(e) => setIncidentSeverity(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', background: '#F0F2ED', color: '#1B2026', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.85rem' }}
                >
                  <option value="HIGH (Caution & Single-File Passage)">⚠️ HIGH (Caution Required)</option>
                  <option value="CRITICAL (Pass Blocked - Reroute Required)">🚨 CRITICAL (Reroute Required)</option>
                  <option value="MEDIUM (Tire Chains Mandatory)">ℹ️ MEDIUM (Chains Mandatory)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-olive-green)', display: 'block', marginBottom: '0.25rem' }}>
                  FIELD INCIDENT NOTES
                </label>
                <textarea
                  rows={2}
                  value={incidentNotes}
                  onChange={(e) => setIncidentNotes(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', background: '#F0F2ED', color: '#1B2026', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.8rem' }}
                />
              </div>

              {incidentLoggedSuccess ? (
                <div style={{ background: 'var(--status-healthy-bg)', color: 'var(--status-healthy)', padding: '0.6rem', borderRadius: '6px', textAlign: 'center', fontWeight: '700', fontSize: '0.85rem' }}>
                  ✅ INCIDENT LOGGED LOCALLY (CRDT ENCRYPTED QUEUE)!
                </div>
              ) : (
                <button type="submit" className="btn-primary" style={{ justifyContent: 'center' }}>
                  <Send size={16} /> Log Incident & Store Offline
                </button>
              )}
            </form>
          </div>

          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: '700', fontSize: '1rem', color: '#1B2026', marginBottom: '0.75rem' }}>
                📜 LOGGED ROAD INCIDENTS (STORED OFFLINE)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {incidentsList.map((inc) => (
                  <div key={inc.id} style={{ background: '#F5F7F2', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '700', color: '#1B2026' }}>
                      <span>{inc.type}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{inc.id}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Location: {inc.loc} | Time: {inc.time}</div>
                    <span className="badge-status healthy" style={{ alignSelf: 'flex-start', fontSize: '0.65rem' }}>
                      {inc.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setTab('5.4_journey')}>
              Proceed to Step 5.4: Journey Telemetry <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 5.4: DURING JOURNEY (STATUS & TELEMETRY) */}
      {isStep54 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ fontWeight: '700', fontSize: '1rem', color: '#1B2026', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Radio size={18} color="var(--color-army-green)" />
              <span>5.4 DURING JOURNEY TELEMETRY & STATUS UPDATE</span>
            </div>

            <div style={{ background: 'rgba(45, 122, 58, 0.12)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--status-healthy-border)', fontSize: '0.75rem', color: 'var(--status-healthy)', fontWeight: '700' }}>
              📶 CONTINUING NAVIGATION WITHOUT INTERNET CONNECTION (OFFLINE CRDT ACTIVE)
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ background: '#F5F7F2', padding: '0.85rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ENGINE TEMP</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--status-healthy)', fontFamily: 'var(--font-mono)' }}>
                  82°C (Optimal)
                </div>
              </div>

              <div style={{ background: '#F5F7F2', padding: '0.85rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>FUEL TANK</div>
                <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--color-army-green)', fontFamily: 'var(--font-mono)' }}>
                  78% (380L)
                </div>
              </div>

              <div style={{ background: '#F5F7F2', padding: '0.85rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>SAT COMM STATUS</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--status-healthy)', fontFamily: 'var(--font-mono)' }}>
                  L-BAND ENCRYPTED OK
                </div>
              </div>

              <div style={{ background: '#F5F7F2', padding: '0.85rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CABIN / DECK TEMP</div>
                <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--color-amber)', fontFamily: 'var(--font-mono)' }}>
                  -12°C (Heated Deck)
                </div>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-olive-green)', marginBottom: '0.35rem' }}>
                UPDATE CONVOY TRANSIT STATUS:
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {['EN_ROUTE', 'HALTED_FOR_CHAINS', 'RE_ROUTED', 'APPROACHING_POST'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setConvoyStatus(st)}
                    style={{
                      padding: '0.4rem 0.75rem',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      border: 'none',
                      cursor: 'pointer',
                      background: convoyStatus === st ? 'var(--color-army-green)' : '#F5F7F2',
                      color: convoyStatus === st ? '#FFF' : 'var(--text-secondary)'
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'space-between', textAlign: 'center' }}>
            <div>
              <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--status-critical)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <ShieldAlert size={20} color="var(--status-critical)" />
                <span>EMERGENCY DISTRESS SOS</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0 auto', maxWidth: '350px' }}>
                Triggers instant high-priority emergency broadcast to Leh Sector Command Room & dispatches drone recon.
              </p>

              {sosSent ? (
                <div style={{ background: 'var(--status-critical-bg)', color: 'var(--status-critical)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--status-critical-border)', fontWeight: '700', fontSize: '0.9rem', marginTop: '1rem' }}>
                  🚨 EMERGENCY SOS BROADCAST SENT TO LEH COMMAND ROOM!
                </div>
              ) : (
                <button className="btn-danger" style={{ width: '100%', padding: '0.85rem', justifyContent: 'center', marginTop: '1rem' }} onClick={handleTriggerSOS}>
                  <AlertOctagon size={20} /> TRIGGER EMERGENCY DISTRESS SOS
                </button>
              )}
            </div>

            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setTab('5.5_arrival')}>
              Proceed to Step 5.5: Arrival & Cargo Handover <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STAGE 5.5: ARRIVAL AT POST & HANDOVER */}
      {isStep55 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1rem', color: '#1B2026' }}>
              <CheckSquare size={20} color="var(--status-healthy)" />
              <span>5.5 ARRIVAL AT POST & CARGO HANDOVER</span>
            </div>

            <div style={{ background: '#F5F7F2', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Destination Post:</span>
                <span style={{ fontWeight: '700', color: 'var(--status-healthy)' }}>{destPost.name} ({destPost.sector})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Receiving Post Commander:</span>
                <span style={{ fontWeight: '700', color: '#1B2026' }}>{destPost.commander}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Arrival Odometer & Time:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--color-army-green)' }}>12:45 PM (210 Km Completed)</span>
              </div>
            </div>

            <div style={{ background: '#F5F7F2', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-olive-green)' }}>
                📋 CARGO HANDOVER VERIFICATION CHECKLIST:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1B2026' }}><CheckCircle2 size={16} color="var(--status-healthy)" /> Kerosene Fuel Seals Intact</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1B2026' }}><CheckCircle2 size={16} color="var(--status-healthy)" /> MRE Combat Rations Crates Verified</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1B2026' }}><CheckCircle2 size={16} color="var(--status-healthy)" /> Energy & Dry Fruit Bars Verified</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1B2026' }}><CheckCircle2 size={16} color="var(--status-healthy)" /> 5.56mm Ammo Crates Sealed</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1B2026' }}><CheckCircle2 size={16} color="var(--status-healthy)" /> Portable Oxygen Cylinders Inspected</div>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: '700', fontSize: '1rem', color: '#1B2026', marginBottom: '0.5rem' }}>
                ✍️ DIGITAL DELIVERY SIGN-OFF
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Confirm delivery completion to update convoy status to DELIVERED and sync inventory with Leh Central Depot.
              </p>

              {deliveryComplete ? (
                <div style={{ background: 'var(--status-healthy-bg)', color: 'var(--status-healthy)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--status-healthy-border)', textAlign: 'center', fontWeight: '700', fontSize: '1rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <CheckCircle2 size={40} />
                  <span>CONVOY MISSION COMPLETED & DELIVERED!</span>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>
                    Post Foxtrot-4 local stock updated. Dispatch order status closed.
                  </div>
                </div>
              ) : (
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem', fontSize: '0.95rem', background: 'var(--status-healthy)', borderColor: 'var(--status-healthy)', marginTop: '1rem' }} onClick={handleConfirmDelivery}>
                  <CheckCircle2 size={20} /> Confirm Delivery & Sign-Off Cargo
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
