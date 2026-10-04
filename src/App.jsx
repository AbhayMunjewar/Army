import React, { useState } from 'react';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import LandingPage from './components/LandingPage';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DepotOverview from './components/DepotOverview';
import DepotInventory from './components/DepotInventory';
import StockoutRisk from './components/StockoutRisk';
import ConsumptionPrediction from './components/ConsumptionPrediction';
import IndentApproval from './components/IndentApproval';
import RouteOptimization from './components/RouteOptimization';
import FleetMonitor from './components/FleetMonitor';
import PostCommanderView from './components/PostCommanderView';
import ConvoyLeaderView from './components/ConvoyLeaderView';

import { INITIAL_POSTS, INITIAL_INDENTS, INITIAL_CONVOYS, VEHICLES } from './data/mockData';

export default function App() {
  const [role, setRole] = useState('LANDING_PAGE');
  const [currentTab, setCurrentTab] = useState('overview');
  const [isOffline, setIsOffline] = useState(false);

  // App Master States
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [indents, setIndents] = useState(INITIAL_INDENTS);
  const [convoys, setConvoys] = useState(INITIAL_CONVOYS);
  const [vehicles] = useState(VEHICLES);
  const [selectedPost, setSelectedPost] = useState(INITIAL_POSTS[0]);

  // Notification & Alert Redirect States
  const [riskNotification, setRiskNotification] = useState(null);
  const [depotDeliveryNotification, setDepotDeliveryNotification] = useState(null);
  const [highlightedPostId, setHighlightedPostId] = useState(null);

  // Helper when Post Commander verifies QR delivery
  const handleSupplyDelivered = (deliveryData) => {
    // 1. Update convoy status to DELIVERED in master convoys list
    setConvoys(prevConvoys => prevConvoys.map(c => {
      if (c.id === deliveryData.manifestId || c.destination === deliveryData.postName || deliveryData.manifestId.includes(c.id)) {
        return { ...c, status: 'DELIVERED', progress: 100, currentStepIndex: 5 };
      }
      return c;
    }));

    // 2. Set Depot Officer real-time delivery notification banner
    setDepotDeliveryNotification({
      manifestId: deliveryData.manifestId || 'CNV-2026-001',
      postName: deliveryData.postName || 'Post Foxtrot-4',
      item: deliveryData.item || 'Sub-Zero Kerosene Fuel & MRE Rations',
      qty: deliveryData.qty || '1,200 Liters / 300 Packs',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    });
  };

  // Handle role switching & portal redirection defaults
  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (newRole === 'DEPOT_OFFICER') setCurrentTab('overview');
    if (newRole === 'POST_COMMANDER') setCurrentTab('post_stock');
    if (newRole === 'CONVOY_LEADER') setCurrentTab('mission');
  };

  // Helper to trigger manual or auto-indent from any screen
  const handleCreateIndentForPost = (postToIndent) => {
    const newInd = {
      id: `IND-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      postName: postToIndent.name,
      postId: postToIndent.id,
      generatedBy: "AI Predictive Engine",
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      item: "Kerosene / Cold Fuel (56-C)",
      quantity: "1,500 Liters",
      urgency: "CRITICAL",
      predictedStockout: `${postToIndent.stockoutDays} Days`,
      status: "PENDING",
      reason: `Automated stockout prevention requisition triggered for ${postToIndent.name}.`
    };
    setIndents([newInd, ...indents]);
    setCurrentTab('indents');
  };

  // Helper to log daily consumption item by item from Post Commander
  const handleLogConsumption = (postId, logEntry) => {
    let triggeredNotif = null;

    setPosts(prevPosts => prevPosts.map(p => {
      if (p.id === postId) {
        const fuelBurn = Number(logEntry.fuel) || p.stock.fuel.burnRate;
        const rationsBurn = Number(logEntry.rations) || p.stock.rations.burnRate;
        const energyBarsBurn = Number(logEntry.energyBars) || (p.stock.energyBars ? p.stock.energyBars.burnRate : 24);
        const ammoBurn = Number(logEntry.ammo) || p.stock.ammo.burnRate;
        const oxygenBurn = Number(logEntry.oxygen) || (p.stock.oxygen ? p.stock.oxygen.burnRate : 3);

        const updatedFuelCurrent = Math.max(0, p.stock.fuel.current - fuelBurn);
        const updatedRationsCurrent = Math.max(0, p.stock.rations.current - rationsBurn);
        const updatedEnergyBarsCurrent = Math.max(0, (p.stock.energyBars ? p.stock.energyBars.current : 120) - energyBarsBurn);
        const updatedAmmoCurrent = Math.max(0, p.stock.ammo.current - ammoBurn);
        const updatedOxygenCurrent = Math.max(0, (p.stock.oxygen ? p.stock.oxygen.current : 15) - oxygenBurn);

        const fuelDaysLeft = Math.round((updatedFuelCurrent / Math.max(1, fuelBurn)) * 10) / 10;
        const rationsDaysLeft = Math.round((updatedRationsCurrent / Math.max(1, rationsBurn)) * 10) / 10;
        const minDaysLeft = Math.min(fuelDaysLeft, rationsDaysLeft);

        const newDailyLogs = [logEntry, ...(p.dailyLogs || [])];

        const updatedPost = {
          ...p,
          troops: Number(logEntry.troops) || p.troops,
          stockoutDays: minDaysLeft,
          status: minDaysLeft <= 3 ? 'CRITICAL' : minDaysLeft <= 7 ? 'WARNING' : 'HEALTHY',
          dailyLogs: newDailyLogs,
          stock: {
            ...p.stock,
            fuel: { ...p.stock.fuel, current: updatedFuelCurrent, burnRate: fuelBurn, daysLeft: fuelDaysLeft },
            rations: { ...p.stock.rations, current: updatedRationsCurrent, burnRate: rationsBurn, daysLeft: rationsDaysLeft },
            energyBars: p.stock.energyBars
              ? { ...p.stock.energyBars, current: updatedEnergyBarsCurrent, burnRate: energyBarsBurn, daysLeft: Math.round((updatedEnergyBarsCurrent / Math.max(1, energyBarsBurn)) * 10) / 10 }
              : { name: "High-Altitude Energy & Dry Fruit Bar", current: updatedEnergyBarsCurrent, max: 500, unit: "Boxes", burnRate: energyBarsBurn, daysLeft: 5.0 },
            ammo: { ...p.stock.ammo, current: updatedAmmoCurrent, burnRate: ammoBurn, daysLeft: Math.round((updatedAmmoCurrent / Math.max(1, ammoBurn)) * 10) / 10 },
            oxygen: p.stock.oxygen
              ? { ...p.stock.oxygen, current: updatedOxygenCurrent, burnRate: oxygenBurn, daysLeft: Math.round((updatedOxygenCurrent / Math.max(1, oxygenBurn)) * 10) / 10 }
              : { name: "Portable Oxygen Cylinders", current: updatedOxygenCurrent, max: 50, unit: "Cylinders", burnRate: oxygenBurn, daysLeft: 5.0 }
          }
        };

        if (selectedPost.id === postId) {
          setSelectedPost(updatedPost);
        }

        // Trigger Popup Notification if predicted stockout is critical (<= 5.0 days)
        if (minDaysLeft <= 5.0) {
          triggeredNotif = {
            postId: p.id,
            postName: p.name,
            sector: p.sector,
            stockoutDays: minDaysLeft,
            fuelDays: fuelDaysLeft,
            rationsDays: rationsDaysLeft,
            temp: logEntry.temp || (p.weather ? p.weather.temp : -28),
            troops: logEntry.troops || p.troops,
            fuelBurn: fuelBurn,
            rationsBurn: rationsBurn
          };
        }

        return updatedPost;
      }
      return p;
    }));

    if (triggeredNotif) {
      setRiskNotification(triggeredNotif);
    }
  };

  const handleNotificationClick = () => {
    if (riskNotification) {
      setHighlightedPostId(riskNotification.postId);
      setRole('DEPOT_OFFICER');
      setCurrentTab('risk');
      setRiskNotification(null);
    }
  };

  // Count pending indents & critical alerts for badges
  const pendingIndentsCount = indents.filter(i => i.status === 'PENDING').length;
  const criticalAlertsCount = posts.filter(p => p.status === 'CRITICAL').length;

  if (role === 'LANDING_PAGE') {
    return <LandingPage onSelectRole={handleRoleChange} />;
  }

  return (
    <div className="app-container" style={{ position: 'relative' }}>
      {/* AI CRITICAL STOCKOUT POPUP NOTIFICATION BANNER (SHOWN ONLY TO DEPOT LOGISTICS OFFICER) */}
      {role === 'DEPOT_OFFICER' && riskNotification && (
        <div
          onClick={handleNotificationClick}
          style={{
            position: 'fixed',
            top: '82px',
            right: '24px',
            zIndex: 9999,
            maxWidth: '520px',
            width: 'calc(100% - 48px)',
            background: 'linear-gradient(135deg, #FFF0F0 0%, #FFE5E5 100%)',
            border: '2px solid #C0392B',
            borderRadius: '10px',
            padding: '1.1rem',
            boxShadow: '0 8px 24px rgba(192, 57, 43, 0.25)',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
            animation: 'pulse-border 2s infinite'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#C0392B', fontWeight: '700', fontSize: '0.95rem' }}>
              <ShieldAlert size={24} color="#C0392B" />
              <span>🚨 AI CRITICAL STOCKOUT ALERT DETECTED!</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setRiskNotification(null); }}
              style={{ background: 'transparent', border: 'none', color: '#5C6B73', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}
            >
              ✕
            </button>
          </div>

          <div style={{ fontSize: '0.85rem', color: '#1B2026', marginTop: '0.6rem', lineHeight: '1.4' }}>
            Post Commander logged daily burn for <strong style={{ color: '#1B2026' }}>{riskNotification.postName}</strong> ({riskNotification.sector}).
            AI Model predicts stockout in <strong style={{ color: '#C0392B', fontFamily: 'var(--font-mono)' }}>{riskNotification.stockoutDays < 1 ? `${Math.round(riskNotification.stockoutDays * 24 * 10) / 10} Hours` : `${riskNotification.stockoutDays} Days`}</strong>!
          </div>

          <div style={{ marginTop: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(192, 57, 43, 0.1)', padding: '0.6rem 0.85rem', borderRadius: '6px', border: '1px solid rgba(192, 57, 43, 0.3)' }}>
            <span style={{ fontSize: '0.8rem', color: '#C0392B', fontWeight: '700' }}>
              👉 CLICK HERE TO OPEN STOCKOUT RISK ALERT ANALYSIS
            </span>
            <ArrowRight size={18} color="#C0392B" />
          </div>
        </div>
      )}

      <Header
        role={role}
        setRole={handleRoleChange}
        isOffline={isOffline}
        setIsOffline={setIsOffline}
        onExitToPortal={() => setRole('LANDING_PAGE')}
      />

      <div className="main-content-layout">
        <Sidebar
          role={role}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          pendingIndentsCount={pendingIndentsCount}
          criticalAlertsCount={criticalAlertsCount}
        />

        <main className="dashboard-viewport">
          {/* DEPOT LOGISTICS OFFICER DASHBOARDS (1.1 - 1.7) */}
          {role === 'DEPOT_OFFICER' && (
            <>
              {/* REAL-TIME SUPPLY DELIVERY NOTIFICATION BANNER */}
              {depotDeliveryNotification && (
                <div style={{
                  background: 'linear-gradient(90deg, #E8F5E9 0%, #C8E6C9 100%)',
                  border: '2px solid #2E7D32',
                  borderRadius: '10px',
                  padding: '1rem 1.25rem',
                  marginBottom: '1.25rem',
                  color: '#1B2026',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 16px rgba(46, 125, 50, 0.2)',
                  animation: 'pulse-border 2s infinite'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{ background: '#2E7D32', color: '#FFFFFF', borderRadius: '50%', padding: '0.35rem', display: 'flex' }}>
                      ✓
                    </div>
                    <div>
                      <div style={{ fontWeight: '900', fontSize: '1.05rem', color: '#2E7D32', letterSpacing: '0.5px' }}>
                        ✅ SUPPLY REACHED SUCCESSFULLY — POST COMMANDER VERIFIED
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#1B2026', marginTop: '0.25rem' }}>
                        Convoy <strong>{depotDeliveryNotification.manifestId}</strong> arrived at <strong>{depotDeliveryNotification.postName}</strong> at {depotDeliveryNotification.time}. Cargo ({depotDeliveryNotification.item}) verified via cryptographic AES-256 QR sign-off.
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setDepotDeliveryNotification(null)}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #2E7D32',
                      color: '#2E7D32',
                      padding: '0.45rem 0.9rem',
                      borderRadius: '6px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      fontSize: '0.78rem'
                    }}
                  >
                    DISMISS ALERT
                  </button>
                </div>
              )}

              {currentTab === 'overview' && (
                <DepotOverview
                  posts={posts}
                  indents={indents}
                  convoys={convoys}
                  setSelectedPost={setSelectedPost}
                  setCurrentTab={setCurrentTab}
                />
              )}

              {currentTab === 'inventory' && (
                <DepotInventory
                  posts={posts}
                  selectedPost={selectedPost}
                  setSelectedPost={setSelectedPost}
                  onCreateIndent={handleCreateIndentForPost}
                />
              )}

              {currentTab === 'risk' && (
                <StockoutRisk
                  posts={posts}
                  highlightedPostId={highlightedPostId}
                  onCreateIndent={handleCreateIndentForPost}
                />
              )}

              {currentTab === 'prediction' && (
                <ConsumptionPrediction
                  posts={posts}
                  onNavigateToRisk={(postId) => {
                    setHighlightedPostId(postId);
                    setCurrentTab('risk');
                  }}
                />
              )}

              {currentTab === 'indents' && (
                <IndentApproval
                  indents={indents}
                  setIndents={setIndents}
                  onDispatchClick={(indent) => {
                    setCurrentTab('route');
                  }}
                />
              )}

              {currentTab === 'route' && (
                <RouteOptimization
                  posts={posts}
                  convoys={convoys}
                  setConvoys={setConvoys}
                  onDispatchSuccess={() => {
                    // Do not redirect; route & map data are sent to Convoy Leader terminal while keeping Depot Officer in place.
                  }}
                />
              )}

              {currentTab === 'fleet' && (
                <FleetMonitor
                  vehicles={vehicles}
                  convoys={convoys}
                />
              )}
            </>
          )}

          {/* POST COMMANDER DASHBOARDS (2.1 - 2.4) */}
          {role === 'POST_COMMANDER' && (
            <PostCommanderView
              post={selectedPost}
              posts={posts}
              setSelectedPost={setSelectedPost}
              onLogConsumption={handleLogConsumption}
              onCreateManualRequisition={(newReq) => setIndents([newReq, ...indents])}
              onSupplyDelivered={handleSupplyDelivered}
              isOffline={isOffline}
              setIsOffline={setIsOffline}
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
            />
          )}

          {/* CONVOY LEADER DASHBOARDS (5.1 - 5.5) */}
          {role === 'CONVOY_LEADER' && (
            <ConvoyLeaderView
              convoy={convoys[0]}
              convoys={convoys}
              setConvoys={setConvoys}
              posts={posts}
              setPosts={setPosts}
              onSupplyDelivered={handleSupplyDelivered}
              currentTab={currentTab}
              setCurrentTab={setCurrentTab}
            />
          )}
        </main>
      </div>
    </div>
  );
}
