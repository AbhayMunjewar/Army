import React, { useState } from 'react';
import {
  PackageCheck,
  QrCode,
  Edit3,
  RefreshCw,
  CheckCircle2,
  WifiOff,
  ShieldAlert,
  Camera,
  Plus,
  Save,
  Fuel,
  Package,
  Disc,
  Send,
  AlertTriangle,
  X,
  FilePlus
} from 'lucide-react';

// Helper SVG QR Code Generator Component for Manual Testing
function RenderQRCodeSVG({ manifestId = "CNV-2026-001", postName = "Post Foxtrot-4", size = 180 }) {
  const dataString = `RAKSHAK:MANIFEST=${manifestId}|POST=${postName}|ITEMS=SubZeroSKO_1200L+MRE_300Pks|HASH=AES256-88F9A2B0014`;
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
      <svg id="test-qr-code-svg" width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ background: '#ffffff', padding: '10px', borderRadius: '10px', border: '3px solid #D6A23A', boxShadow: '0 0 15px rgba(214, 162, 58, 0.4)' }}>
        {rects}
      </svg>
      <div style={{ fontSize: '0.72rem', color: '#FFF099', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
        AES-256 ENCRYPTED MANIFEST: {manifestId}
      </div>
    </div>
  );
}

export default function PostCommanderView({ post, posts = [], setSelectedPost, onLogConsumption, onCreateManualRequisition, onSupplyDelivered, isOffline, setIsOffline, currentTab, setCurrentTab }) {
  // Urgent Requisition Modal States (Itemized 5-Item Quantities)
  const [showRequisitionModal, setShowRequisitionModal] = useState(false);
  const [reqFuelQty, setReqFuelQty] = useState('800');
  const [reqRationsQty, setReqRationsQty] = useState('200');
  const [reqEnergyBarsQty, setReqEnergyBarsQty] = useState('50');
  const [reqAmmoQty, setReqAmmoQty] = useState('1000');
  const [reqOxygenQty, setReqOxygenQty] = useState('10');
  const [reqUrgency, setReqUrgency] = useState('CRITICAL (Stockout < 48h)');
  const [reqReason, setReqReason] = useState('Unscheduled blizzard alert - high fuel consumption expected for Bukhari heaters.');
  const [reqSubmittedSuccess, setReqSubmittedSuccess] = useState(false);

  // QR Scan simulation states (Dual Mode: LIVE vs UPLOAD)
  const [scanMode, setScanMode] = useState('LIVE'); // 'LIVE' | 'UPLOAD'
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState(null);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [showTestQrModal, setShowTestQrModal] = useState(false);

  // Itemized Daily Consumption log states
  const [logDate, setLogDate] = useState(new Date().toISOString().slice(0, 10));
  const [logFuel, setLogFuel] = useState('140');
  const [logRations, setLogRations] = useState('48');
  const [logEnergyBars, setLogEnergyBars] = useState('24');
  const [logAmmo, setLogAmmo] = useState('200');
  const [logOxygen, setLogOxygen] = useState('3');
  const [logTroops, setLogTroops] = useState(post ? String(post.troops) : '48');
  const [logTemp, setLogTemp] = useState(post && post.weather ? String(post.weather.temp) : '-28');
  const [logPatrolKm, setLogPatrolKm] = useState('14');
  const [logHeaters, setLogHeaters] = useState('6');
  const [logSuccess, setLogSuccess] = useState(false);

  // Sync Queue state
  const [syncItems, setSyncItems] = useState([
    { id: "TX-901", action: "Daily Burn Logged (140L Fuel, 48 MRE, 200 Ammo, 3 O2)", time: "10:30 AM", status: "PENDING_SYNC" },
    { id: "TX-902", action: "Cargo Verification (Manifest CNV-2026-001)", time: "11:15 AM", status: "PENDING_SYNC" },
    { id: "TX-903", action: "Troop Count Update (+2 Pax)", time: "01:00 PM", status: "PENDING_SYNC" }
  ]);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleScanSimulate = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScannedResult({
        manifestId: "CNV-2026-001",
        sender: "Leh Central Depot Base",
        item: "Sub-Zero Kerosene Fuel & MRE Combat Rations (5-Meal)",
        qtyManifest: "1,200 Liters / 300 Packs",
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
          manifestId: "CNV-2026-001",
          sender: "Leh Central Depot Base",
          item: "Sub-Zero Kerosene Fuel & MRE Combat Rations (5-Meal)",
          qtyManifest: "1,200 Liters / 300 Packs",
          qrHash: "AES256-88F9A2B0014-VERIFIED"
        });
      }, 1200);
    }
  };

  const handleDownloadQrImage = () => {
    const svg = document.getElementById('test-qr-code-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `RAKSHAK-Test-QR-Manifest-CNV-2026-001.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  };

  const handleVerifySignoff = () => {
    setVerifiedSuccess(true);
    const manifestId = scannedResult ? scannedResult.manifestId : "CNV-2026-001";

    setSyncItems(prev => [
      { id: `TX-${Math.floor(900 + Math.random() * 100)}`, action: `QR Delivery Sign-off (${manifestId})`, time: "Just now", status: "PENDING_SYNC" },
      ...prev
    ]);

    // Send real-time supply arrival notification to Depot Officer
    if (onSupplyDelivered) {
      onSupplyDelivered({
        manifestId: manifestId,
        postName: post ? post.name : "Post Foxtrot-4",
        item: scannedResult ? scannedResult.item : "Sub-Zero Kerosene Fuel & MRE Combat Rations",
        qty: scannedResult ? scannedResult.qtyManifest : "1,200 Liters / 300 Packs"
      });
    }

    setTimeout(() => {
      setVerifiedSuccess(false);
      setScannedResult(null);
    }, 4500);
  };

  const handleLogSubmit = (e) => {
    e.preventDefault();
    
    const entry = {
      id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
      date: logDate || new Date().toISOString().slice(0, 10),
      fuel: Number(logFuel) || 0,
      rations: Number(logRations) || 0,
      energyBars: Number(logEnergyBars) || 0,
      ammo: Number(logAmmo) || 0,
      oxygen: Number(logOxygen) || 0,
      troops: Number(logTroops) || (post ? post.troops : 48),
      temp: Number(logTemp) || (post && post.weather ? post.weather.temp : -28),
      patrolKm: Number(logPatrolKm) || 14,
      heaters: Number(logHeaters) || 6
    };

    if (onLogConsumption) {
      onLogConsumption(post.id, entry);
    }

    setLogSuccess(true);
    setSyncItems(prev => [
      { 
        id: `TX-${Math.floor(900 + Math.random() * 100)}`, 
        action: `Daily Usage Logged (${logFuel}L Fuel, ${logRations} MRE, ${logAmmo} Ammo, ${logOxygen} O2)`, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
        status: "PENDING_SYNC" 
      },
      ...prev
    ]);
    setTimeout(() => setLogSuccess(false), 3500);
  };

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncItems(prev => prev.map(item => ({ ...item, status: 'SYNCED' })));
    }, 2000);
  };

  const handleRequisitionSubmit = (e) => {
    e.preventDefault();

    const itemsList = [];
    if (Number(reqFuelQty) > 0) itemsList.push(`${reqFuelQty}L Fuel`);
    if (Number(reqRationsQty) > 0) itemsList.push(`${reqRationsQty} Packs MRE`);
    if (Number(reqEnergyBarsQty) > 0) itemsList.push(`${reqEnergyBarsQty} Boxes Energy Bars`);
    if (Number(reqAmmoQty) > 0) itemsList.push(`${reqAmmoQty} Rds 5.56mm Ammo`);
    if (Number(reqOxygenQty) > 0) itemsList.push(`${reqOxygenQty} O2 Cylinders`);

    const itemSummary = itemsList.length > 0 ? itemsList.join(' + ') : 'Sub-Zero Emergency Buffer Supplies';

    const newReq = {
      id: `IND-MAN-${Math.floor(1000 + Math.random() * 9000)}`,
      postName: post ? post.name : 'Post Foxtrot-4',
      generatedBy: `Post Commander (${post ? post.commander : 'Capt. A. Sharma'})`,
      indentType: 'MANUAL',
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      item: itemSummary,
      quantity: `${itemsList.length} Supply Categories`,
      urgency: reqUrgency.startsWith('CRITICAL') ? 'CRITICAL' : reqUrgency.startsWith('HIGH') ? 'HIGH' : 'MEDIUM',
      predictedStockout: reqUrgency.startsWith('CRITICAL') ? '1.5 Days' : '4 Days',
      predictedStockoutDate: reqUrgency.startsWith('CRITICAL') ? '05 Oct 2026' : '08 Oct 2026',
      suggestedRoute: 'Primary Safest Reroute (via Shyok Valley Corridor)',
      suggestedVehicle: 'Tatra 6x6 Heavy Rig',
      suggestedEta: '4.5 Hours',
      status: 'PENDING',
      reason: reqReason || 'Post Commander Urgent Requisition placed due to operational requirement.'
    };

    if (onCreateManualRequisition) {
      onCreateManualRequisition(newReq);
    }

    setSyncItems(prev => [
      {
        id: newReq.id,
        action: `Urgent Requisition Placed (${itemSummary})`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'PENDING_SYNC'
      },
      ...prev
    ]);

    setReqSubmittedSuccess(true);
    setTimeout(() => {
      setReqSubmittedSuccess(false);
      setShowRequisitionModal(false);
    }, 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Offline Status Top Banner */}
      <div style={{
        background: isOffline ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
        border: `1px solid ${isOffline ? 'var(--status-warning-border)' : 'var(--status-healthy-border)'}`,
        borderRadius: '10px',
        padding: '0.85rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isOffline ? <WifiOff size={22} color="var(--status-warning)" /> : <CheckCircle2 size={22} color="var(--status-healthy)" />}
          <div>
            <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#fff' }}>
              {isOffline ? 'FIELD APP OPERATING IN ZERO-INTERNET OFFLINE MODE (INDEXEDDB CRDT)' : 'ONLINE — SATELLITE CONNECTION ACTIVE'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {isOffline ? 'All QR scans, consumption logs, and sign-offs are saved locally and AES-256 encrypted.' : 'All local changes automatically synced with Leh Central Depot.'}
            </div>
          </div>
        </div>

        <button
          className="btn-secondary"
          onClick={() => setIsOffline(!isOffline)}
          style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
        >
          {isOffline ? 'Simulate Reconnect' : 'Simulate Drop Network'}
        </button>
      </div>

      {/* DASHBOARD 2.1: POST STOCK & BUFFER */}
      {currentTab === 'post_stock' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid var(--color-army-green)', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>{post.name} — LOCAL STOCK MONITOR</h2>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
                Sector: {post.sector} | Altitude: {post.altitude} | Commander: {post.commander} | Troops: {post.troops} Pax
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className="badge-status critical">
                <ShieldAlert size={14} /> Stockout in {post.stockoutDays} Days
              </span>
              <button
                className="btn-primary"
                onClick={() => setShowRequisitionModal(true)}
                style={{ background: '#dc2626', borderColor: '#b91c1c', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}
              >
                <AlertTriangle size={15} /> Submit Urgent Supply Requisition
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {/* Item 1: Sub-Zero Kerosene Fuel */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-navy)' }}>
                <Fuel size={20} />
                <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>1. KEROSENE FUEL (SKO)</span>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                {post.stock.fuel.current} / {post.stock.fuel.max} L
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Daily Burn: {post.stock.fuel.burnRate} L/day ({post.stock.fuel.daysLeft}d left)</div>
            </div>

            {/* Item 2: MRE Combat Rations */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-army-green)' }}>
                <Package size={20} />
                <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>2. MRE COMBAT RATIONS</span>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                {post.stock.rations.current} / {post.stock.rations.max} Packs
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Daily Burn: {post.stock.rations.burnRate} Packs/day ({post.stock.rations.daysLeft}d left)</div>
            </div>

            {/* Item 3: Energy & Dry Fruit Bars */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b45309' }}>
                <PackageCheck size={20} />
                <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>3. ENERGY & DRY FRUIT BARS</span>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                {post.stock.energyBars ? post.stock.energyBars.current : 120} / {post.stock.energyBars ? post.stock.energyBars.max : 500} Boxes
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Daily Burn: {post.stock.energyBars ? post.stock.energyBars.burnRate : 24} Boxes/day</div>
            </div>

            {/* Item 4: Ammunition Crates */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--status-critical)' }}>
                <Disc size={20} />
                <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>4. 5.56MM AMMUNITION</span>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                {post.stock.ammo.current} / {post.stock.ammo.max} Rds
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Daily Burn: {post.stock.ammo.burnRate} Rds/day ({post.stock.ammo.daysLeft}d left)</div>
            </div>

            {/* Item 5: Portable Oxygen Cylinders */}
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#15803d' }}>
                <Plus size={20} />
                <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>5. OXYGEN CYLINDERS</span>
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                {post.stock.oxygen ? post.stock.oxygen.current : 15} / {post.stock.oxygen ? post.stock.oxygen.max : 50} Cylinders
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Daily Burn: {post.stock.oxygen ? post.stock.oxygen.burnRate : 3} Units/day</div>
            </div>
          </div>
        </div>
      )}



      {/* DASHBOARD 2.3: DAILY CONSUMPTION LOGGER */}
      {currentTab === 'burn_logger' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1.1rem', color: '#1B2026' }}>
                <Edit3 size={22} color="var(--color-olive-green)" />
                <span>DAILY OUTPOST CONSUMPTION LOGGING ENTRY</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Target Outpost: <strong style={{ color: '#1B2026' }}>{post ? post.name : 'Post Foxtrot-4'}</strong> ({post ? post.sector : 'Siachen'})
              </div>
            </div>

            <form onSubmit={handleLogSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Row 1: Date, Troops, Temp, Patrol Km, Heaters */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', background: '#F5F7F2', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--color-olive-green)', display: 'block', marginBottom: '0.35rem' }}>
                    LOG DATE
                  </label>
                  <input
                    type="date"
                    value={logDate}
                    onChange={(e) => setLogDate(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', background: '#F0F2ED', color: '#1B2026', border: '1px solid var(--border-color)', borderRadius: '6px', fontFamily: 'var(--font-mono)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--color-olive-green)', display: 'block', marginBottom: '0.35rem' }}>
                    TROOP HEADCOUNT (PAX)
                  </label>
                  <input
                    type="number"
                    value={logTroops}
                    onChange={(e) => setLogTroops(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', background: '#F0F2ED', color: '#1B2026', border: '1px solid var(--border-color)', borderRadius: '6px', fontFamily: 'var(--font-mono)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--color-olive-green)', display: 'block', marginBottom: '0.35rem' }}>
                    AMBIENT TEMP (°C)
                  </label>
                  <input
                    type="number"
                    value={logTemp}
                    onChange={(e) => setLogTemp(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', background: '#F0F2ED', color: logTemp < -20 ? '#C0392B' : '#1B2026', border: '1px solid var(--border-color)', borderRadius: '6px', fontFamily: 'var(--font-mono)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--color-olive-green)', display: 'block', marginBottom: '0.35rem' }}>
                    PATROL DISTANCE (KM)
                  </label>
                  <input
                    type="number"
                    value={logPatrolKm}
                    onChange={(e) => setLogPatrolKm(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', background: '#F0F2ED', color: '#1B2026', border: '1px solid var(--border-color)', borderRadius: '6px', fontFamily: 'var(--font-mono)' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--color-olive-green)', display: 'block', marginBottom: '0.35rem' }}>
                    BUKHARI HEATERS ACTIVE
                  </label>
                  <input
                    type="number"
                    value={logHeaters}
                    onChange={(e) => setLogHeaters(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem', background: '#F0F2ED', color: '#1B2026', border: '1px solid var(--border-color)', borderRadius: '6px', fontFamily: 'var(--font-mono)' }}
                  />
                </div>
              </div>

              {/* Row 2: Itemized Consumption Entries */}
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1B2026', marginTop: '0.25rem' }}>
                📦 ITEM-BY-ITEM DAILY CONSUMPTION AMOUNTS:
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {/* Fuel Input */}
                <div style={{ background: '#F5F7F2', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-navy)' }}>
                    <Fuel size={16} />
                    <span>1. SUB-ZERO KEROSENE FUEL (LITERS)</span>
                  </div>
                  <input
                    type="number"
                    value={logFuel}
                    onChange={(e) => setLogFuel(e.target.value)}
                    placeholder="e.g. 140"
                    style={{ width: '100%', padding: '0.6rem', background: '#F0F2ED', color: '#1B2026', border: '1px solid var(--border-color)', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '1rem' }}
                  />
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Current Stock: {post ? post.stock.fuel.current : 420} L</div>
                </div>

                {/* MRE Rations Input */}
                <div style={{ background: '#F5F7F2', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-army-green)' }}>
                    <Package size={16} />
                    <span>2. MRE COMBAT RATIONS (PACKS)</span>
                  </div>
                  <input
                    type="number"
                    value={logRations}
                    onChange={(e) => setLogRations(e.target.value)}
                    placeholder="e.g. 48"
                    style={{ width: '100%', padding: '0.6rem', background: '#F0F2ED', color: '#1B2026', border: '1px solid var(--border-color)', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '1rem' }}
                  />
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Includes 5-Meal Packs (Rajma Rice, Suji Halwa, Dry Fruits, Tea, O2 tab)</div>
                </div>

                {/* Energy Bars Input */}
                <div style={{ background: '#F5F7F2', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: '700', color: '#b45309' }}>
                    <PackageCheck size={16} />
                    <span>3. ENERGY & DRY FRUIT BARS (BOXES)</span>
                  </div>
                  <input
                    type="number"
                    value={logEnergyBars}
                    onChange={(e) => setLogEnergyBars(e.target.value)}
                    placeholder="e.g. 24"
                    style={{ width: '100%', padding: '0.6rem', background: '#F0F2ED', color: '#1B2026', border: '1px solid var(--border-color)', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '1rem' }}
                  />
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Current Stock: {post && post.stock.energyBars ? post.stock.energyBars.current : 120} Boxes</div>
                </div>

                {/* Ammo Input */}
                <div style={{ background: '#F5F7F2', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: '700', color: '#C0392B' }}>
                    <Disc size={16} />
                    <span>4. 5.56MM AMMUNITION (ROUNDS)</span>
                  </div>
                  <input
                    type="number"
                    value={logAmmo}
                    onChange={(e) => setLogAmmo(e.target.value)}
                    placeholder="e.g. 200"
                    style={{ width: '100%', padding: '0.6rem', background: '#F0F2ED', color: '#1B2026', border: '1px solid var(--border-color)', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '1rem' }}
                  />
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Current Stock: {post ? post.stock.ammo.current : 8500} Rounds</div>
                </div>

                {/* Oxygen Input */}
                <div style={{ background: '#F5F7F2', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', fontWeight: '700', color: '#15803d' }}>
                    <Plus size={16} />
                    <span>5. OXYGEN CYLINDERS (UNITS)</span>
                  </div>
                  <input
                    type="number"
                    value={logOxygen}
                    onChange={(e) => setLogOxygen(e.target.value)}
                    placeholder="e.g. 3"
                    style={{ width: '100%', padding: '0.6rem', background: '#F0F2ED', color: '#1B2026', border: '1px solid var(--border-color)', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '1rem' }}
                  />
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Current Stock: {post && post.stock.oxygen ? post.stock.oxygen.current : 15} Cylinders</div>
                </div>

                {/* 5-Meal MRE Component Breakdown Preview Box */}
                <div style={{ background: '#F5F7F2', padding: '0.85rem', borderRadius: '8px', border: '1px dashed var(--color-olive-green)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-olive-green)', marginBottom: '0.3rem' }}>
                    🍱 AUTOMATIC 5-MEAL MRE COMPONENT DISPATCH:
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.2rem' }}>
                    <div>🍛 {logRations}x Rajma-Rice (350g)</div>
                    <div>🥮 {logRations}x Suji Halwa (150g)</div>
                    <div>🌰 {logRations}x Dry Fruits (75g)</div>
                    <div>☕ {logRations}x Tea/Gur Sachets</div>
                  </div>
                </div>
              </div>

              {logSuccess ? (
                <div style={{ background: 'var(--status-healthy-bg)', color: 'var(--status-healthy)', padding: '0.8rem', borderRadius: '6px', textAlign: 'center', fontWeight: '700', fontSize: '0.9rem', border: '1px solid var(--status-healthy-border)' }}>
                  ✅ DAILY CONSUMPTION RECORDED & SENT TO CENTRAL DEPOT PREDICTIVE MODEL!
                </div>
              ) : (
                <button type="submit" className="btn-primary" style={{ justifyContent: 'center', padding: '0.8rem', fontSize: '0.95rem' }}>
                  <Save size={18} /> Record Daily Consumption Entry
                </button>
              )}
            </form>
          </div>

          {/* Log History Table */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ fontWeight: '700', fontSize: '1rem', color: '#fff' }}>
              📜 LOGGED CONSUMPTION HISTORY ({post ? post.name : 'Post Foxtrot-4'})
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="tactical-table">
                <thead>
                  <tr>
                    <th>ENTRY DATE</th>
                    <th>PAX</th>
                    <th>TEMP (°C)</th>
                    <th>FUEL (L)</th>
                    <th>MRE PACKS</th>
                    <th>ENERGY BARS</th>
                    <th>AMMO (RDS)</th>
                    <th>OXYGEN</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {(post && post.dailyLogs ? post.dailyLogs : [
                    { id: "LOG-109", date: "2026-10-03", fuel: 140, rations: 48, energyBars: 24, ammo: 200, oxygen: 3, troops: 48, temp: -28 },
                    { id: "LOG-108", date: "2026-10-02", fuel: 138, rations: 48, energyBars: 22, ammo: 180, oxygen: 3, troops: 48, temp: -26 },
                    { id: "LOG-107", date: "2026-10-01", fuel: 145, rations: 50, energyBars: 25, ammo: 210, oxygen: 4, troops: 50, temp: -29 }
                  ]).map((log, idx) => (
                    <tr key={log.id || idx}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--color-olive-green)' }}>{log.date}</td>
                      <td>{log.troops} Pax</td>
                      <td style={{ color: log.temp < -20 ? '#ff7878' : 'inherit', fontFamily: 'var(--font-mono)' }}>{log.temp}°C</td>
                      <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700' }}>{log.fuel} L</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{log.rations} Packs</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{log.energyBars || 24} Boxes</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{log.ammo || 200} Rds</td>
                      <td style={{ fontFamily: 'var(--font-mono)' }}>{log.oxygen || 3} Units</td>
                      <td>
                        <span className="badge-status healthy" style={{ fontSize: '0.65rem' }}>
                          ✅ SYNCED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD 2.4: OFFLINE SYNC QUEUE */}
      {currentTab === 'offline_sync' && (
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1.1rem', color: '#fff' }}>
              <RefreshCw size={22} color="var(--accent-cyan)" />
              <span>OFFLINE SYNC QUEUE MANAGER (CRDT ENGINE)</span>
            </div>

            <button
              className="btn-primary"
              disabled={isSyncing}
              onClick={handleTriggerSync}
              style={{ opacity: isSyncing ? 0.6 : 1 }}
            >
              {isSyncing ? 'Syncing with Base...' : 'Force Sync All Transactions'}
            </button>
          </div>

          <div style={{ padding: 0, overflow: 'hidden' }}>
            <table className="tactical-table">
              <thead>
                <tr>
                  <th>TRANSACTION ID</th>
                  <th>ACTION LOGGED</th>
                  <th>LOCAL TIMESTAMP</th>
                  <th>ENCRYPTION</th>
                  <th>SYNC STATUS</th>
                </tr>
              </thead>
              <tbody>
                {syncItems.map(item => (
                  <tr key={item.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--accent-cyan)' }}>{item.id}</td>
                    <td style={{ fontWeight: '600' }}>{item.action}</td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{item.time}</td>
                    <td style={{ fontSize: '0.75rem', color: 'var(--status-healthy)' }}>AES-256 Encrypted</td>
                    <td>
                      <span className={`badge-status ${item.status === 'SYNCED' ? 'healthy' : 'warning'}`}>
                        {item.status === 'SYNCED' ? '✅ SYNCED WITH BASE' : '⏳ PENDING SYNC'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MANUAL URGENT REQUISITION MODAL */}
      {showRequisitionModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 10, 15, 0.8)',
          backdropFilter: 'blur(6px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="glass-card" style={{
            maxWidth: '560px',
            width: '100%',
            background: '#FFFFFF',
            border: '1px solid rgba(192, 57, 43, 0.35)',
            borderRadius: '12px',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.12)'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ background: 'rgba(192, 57, 43, 0.1)', padding: '0.4rem', borderRadius: '8px', border: '1px solid rgba(192, 57, 43, 0.35)' }}>
                  <AlertTriangle size={20} color="#C0392B" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1B2026' }}>
                    SUBMIT URGENT SUPPLY REQUISITION
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Direct dispatch request from {post ? post.name : 'Post Foxtrot-4'} to Leh Depot Logistics Officer
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowRequisitionModal(false)} 
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
              >
                <X size={20} />
              </button>
            </div>

            {reqSubmittedSuccess ? (
              <div style={{
                background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid var(--status-healthy-border)',
                borderRadius: '8px',
                padding: '1.5rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <CheckCircle2 size={42} color="var(--status-healthy)" />
                <div style={{ fontWeight: '700', fontSize: '1.05rem', color: '#fff' }}>
                  URGENT REQUISITION TRANSMITTED!
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Added to Leh Depot Logistics Officer Approval Queue for dispatch authorization.
                </div>
              </div>
            ) : (
              <form onSubmit={handleRequisitionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-olive-green)', display: 'block', marginBottom: '0.5rem' }}>
                    📦 REQUISITION QUANTITIES FOR Core OUTPOST SUPPLIES:
                  </label>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '280px', overflowY: 'auto', paddingRight: '0.3rem' }}>
                    {/* 1. KEROSENE FUEL */}
                    <div style={{ background: '#141c24', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Fuel size={18} color="var(--color-navy)" />
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#fff' }}>1. KEROSENE FUEL (SKO)</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Sub-Zero Heating & Power Fuel</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <input
                          type="number"
                          value={reqFuelQty}
                          onChange={(e) => setReqFuelQty(e.target.value)}
                          placeholder="0"
                          style={{ width: '90px', padding: '0.4rem', background: '#FFFFFF', color: '#1B2026', border: '1px solid var(--border-color)', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontWeight: '700', textAlign: 'right' }}
                        />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', width: '38px' }}>Liters</span>
                      </div>
                    </div>

                    {/* 2. MRE COMBAT RATIONS */}
                    <div style={{ background: '#F5F7F2', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Package size={18} color="var(--color-army-green)" />
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#1B2026' }}>2. MRE COMBAT RATIONS</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>5-Meal Self-Heating Ration Packs</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <input
                          type="number"
                          value={reqRationsQty}
                          onChange={(e) => setReqRationsQty(e.target.value)}
                          placeholder="0"
                          style={{ width: '90px', padding: '0.4rem', background: '#FFFFFF', color: '#1B2026', border: '1px solid var(--border-color)', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontWeight: '700', textAlign: 'right' }}
                        />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', width: '38px' }}>Packs</span>
                      </div>
                    </div>

                    {/* 3. ENERGY BARS */}
                    <div style={{ background: '#F5F7F2', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <PackageCheck size={18} color="#b45309" />
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#1B2026' }}>3. ENERGY & DRY FRUIT BARS</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>High-Calorie Altitude Rations</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <input
                          type="number"
                          value={reqEnergyBarsQty}
                          onChange={(e) => setReqEnergyBarsQty(e.target.value)}
                          placeholder="0"
                          style={{ width: '90px', padding: '0.4rem', background: '#FFFFFF', color: '#1B2026', border: '1px solid var(--border-color)', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontWeight: '700', textAlign: 'right' }}
                        />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', width: '38px' }}>Boxes</span>
                      </div>
                    </div>

                    {/* 4. 5.56MM AMMUNITION */}
                    <div style={{ background: '#F5F7F2', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Disc size={18} color="#C0392B" />
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#1B2026' }}>4. 5.56MM AMMUNITION</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Standard INSAS Rifle Ammo</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <input
                          type="number"
                          value={reqAmmoQty}
                          onChange={(e) => setReqAmmoQty(e.target.value)}
                          placeholder="0"
                          style={{ width: '90px', padding: '0.4rem', background: '#FFFFFF', color: '#1B2026', border: '1px solid var(--border-color)', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontWeight: '700', textAlign: 'right' }}
                        />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', width: '38px' }}>Rds</span>
                      </div>
                    </div>

                    {/* 5. OXYGEN CYLINDERS */}
                    <div style={{ background: '#F5F7F2', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Plus size={18} color="#15803d" />
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#1B2026' }}>5. OXYGEN CYLINDERS</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Medical High-Altitude Cylinders</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <input
                          type="number"
                          value={reqOxygenQty}
                          onChange={(e) => setReqOxygenQty(e.target.value)}
                          placeholder="0"
                          style={{ width: '90px', padding: '0.4rem', background: '#FFFFFF', color: '#1B2026', border: '1px solid var(--border-color)', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontWeight: '700', textAlign: 'right' }}
                        />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', width: '38px' }}>Units</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-olive-green)', display: 'block', marginBottom: '0.35rem' }}>
                    URGENCY LEVEL
                  </label>
                  <select
                    value={reqUrgency}
                    onChange={(e) => setReqUrgency(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem', background: '#F0F2ED', color: reqUrgency.startsWith('CRITICAL') ? '#C0392B' : reqUrgency.startsWith('HIGH') ? '#C8960E' : '#1B2026', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '700' }}
                  >
                    <option value="CRITICAL (Stockout < 48h)">🚨 CRITICAL (Stockout in &lt; 48 Hours)</option>
                    <option value="HIGH (Weather Advisory)">⚠️ HIGH (Severe Weather / Avalanche Warning)</option>
                    <option value="MEDIUM (Scheduled Replenishment)">ℹ️ MEDIUM (Routine Operations Buffer)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-olive-green)', display: 'block', marginBottom: '0.35rem' }}>
                    OPERATIONAL REASON & FIELD JUSTIFICATION
                  </label>
                  <textarea
                    rows={3}
                    value={reqReason}
                    onChange={(e) => setReqReason(e.target.value)}
                    placeholder="Provide operational justification for logistics officer review..."
                    style={{ width: '100%', padding: '0.65rem', background: '#F0F2ED', color: '#1B2026', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.8rem', resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowRequisitionModal(false)}
                    style={{ flex: 1, justifyContent: 'center' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ flex: 2, justifyContent: 'center', background: '#dc2626', borderColor: '#b91c1c' }}
                  >
                    <Send size={16} /> Transmit Requisition to Depot Officer
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
