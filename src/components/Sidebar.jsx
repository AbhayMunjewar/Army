import React from 'react';
import {
  LayoutDashboard,
  PackageCheck,
  AlertTriangle,
  TrendingUp,
  FileText,
  MapPin,
  Truck,
  QrCode,
  Edit3,
  RefreshCw,
  Navigation,
  CheckSquare,
  Radio,
  User
} from 'lucide-react';

export default function Sidebar({ role, currentTab, setCurrentTab, pendingIndentsCount, criticalAlertsCount }) {
  const getUserCardForRole = (currentRole) => {
    let name = "Lt. A. Sharma";
    let title = "Logistics Officer / Operator";

    if (currentRole === 'DEPOT_OFFICER') {
      name = "Lt. Col. R. S. Rathore";
      title = "Depot Logistics Officer";
    } else if (currentRole === 'POST_COMMANDER') {
      name = "Capt. A. Sharma";
      title = "Post Commander (Post Foxtrot-4)";
    } else if (currentRole === 'CONVOY_LEADER') {
      name = "Sub. H. Singh";
      title = "Convoy Leader (CNV-4091)";
    }

    return (
      <div className="user-profile-card">
        <div className="user-avatar">
          <User size={18} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--color-off-white)' }}>
            {name}
          </div>
          <div style={{ fontSize: '0.65rem', color: '#A3B899' }}>
            {title}
          </div>
        </div>
      </div>
    );
  };

  if (role === 'DEPOT_OFFICER') {
    return (
      <aside className="app-sidebar">
        <div className="sidebar-label">CENTRAL COMMAND</div>

        <div
          className={`nav-item ${currentTab === 'overview' ? 'active' : ''}`}
          onClick={() => setCurrentTab('overview')}
        >
          <div className="nav-item-left">
            <LayoutDashboard size={16} />
            <span>Dashboard Overview</span>
          </div>
        </div>

        <div
          className={`nav-item ${currentTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setCurrentTab('inventory')}
        >
          <div className="nav-item-left">
            <PackageCheck size={16} />
            <span>Inventory Grid (25 Posts)</span>
          </div>
        </div>

        <div
          className={`nav-item ${currentTab === 'risk' ? 'active' : ''}`}
          onClick={() => setCurrentTab('risk')}
        >
          <div className="nav-item-left">
            <AlertTriangle size={16} />
            <span>Stockout Risk & Alerts</span>
          </div>
          {criticalAlertsCount > 0 && (
            <span className="nav-badge critical">{criticalAlertsCount}</span>
          )}
        </div>

        <div
          className={`nav-item ${currentTab === 'prediction' ? 'active' : ''}`}
          onClick={() => setCurrentTab('prediction')}
        >
          <div className="nav-item-left">
            <TrendingUp size={16} />
            <span>AI Consumption Model</span>
          </div>
          <span className="nav-badge warning" style={{ background: 'rgba(214, 162, 58, 0.2)', color: 'var(--color-amber)', border: '1px solid var(--status-warning-border)' }}>
            ML
          </span>
        </div>

        <div
          className={`nav-item ${currentTab === 'indents' ? 'active' : ''}`}
          onClick={() => setCurrentTab('indents')}
        >
          <div className="nav-item-left">
            <FileText size={16} />
            <span>Auto-Indent Approvals</span>
          </div>
          {pendingIndentsCount > 0 && (
            <span className="nav-badge warning">{pendingIndentsCount}</span>
          )}
        </div>

        <div
          className={`nav-item ${currentTab === 'route' ? 'active' : ''}`}
          onClick={() => setCurrentTab('route')}
        >
          <div className="nav-item-left">
            <MapPin size={16} />
            <span>Hazard Route & Dispatch</span>
          </div>
        </div>

        <div
          className={`nav-item ${currentTab === 'fleet' ? 'active' : ''}`}
          onClick={() => setCurrentTab('fleet')}
        >
          <div className="nav-item-left">
            <Truck size={16} />
            <span>Fleet & Vehicle Status</span>
          </div>
        </div>

        {getUserCardForRole(role)}
      </aside>
    );
  }

  if (role === 'POST_COMMANDER') {
    return (
      <aside className="app-sidebar">
        <div className="sidebar-label">POST COMMANDER (POST FOXTROT-4)</div>

        <div
          className={`nav-item ${currentTab === 'post_stock' ? 'active' : ''}`}
          onClick={() => setCurrentTab('post_stock')}
        >
          <div className="nav-item-left">
            <PackageCheck size={16} />
            <span>Post Stock & Buffer</span>
          </div>
        </div>

        <div
          className={`nav-item ${currentTab === 'burn_logger' ? 'active' : ''}`}
          onClick={() => setCurrentTab('burn_logger')}
        >
          <div className="nav-item-left">
            <Edit3 size={16} />
            <span>Log Daily Consumption</span>
          </div>
        </div>

        <div
          className={`nav-item ${currentTab === 'offline_sync' ? 'active' : ''}`}
          onClick={() => setCurrentTab('offline_sync')}
        >
          <div className="nav-item-left">
            <RefreshCw size={16} />
            <span>Offline Sync Queue</span>
          </div>
          <span className="nav-badge warning">3 PENDING</span>
        </div>

        {getUserCardForRole(role)}
      </aside>
    );
  }

  if (role === 'CONVOY_LEADER') {
    return (
      <aside className="app-sidebar">
        <div className="sidebar-label">CONVOY LEADER (CNV-4091)</div>

        <div
          className={`nav-item ${currentTab === 'mission' || currentTab === '5.1_pre_departure' ? 'active' : ''}`}
          onClick={() => setCurrentTab('mission')}
        >
          <div className="nav-item-left">
            <Navigation size={16} />
            <span>Mission & Route Progress</span>
          </div>
        </div>

        <div
          className={`nav-item ${currentTab === 'qr_scanner' || currentTab === '5.2_qr_scan' ? 'active' : ''}`}
          onClick={() => setCurrentTab('qr_scanner')}
        >
          <div className="nav-item-left">
            <QrCode size={16} />
            <span>Cargo Receipt & QR Scan</span>
          </div>
        </div>

        <div
          className={`nav-item ${currentTab === 'sos' || currentTab === '5.4_journey' || currentTab === '5.3_incidents' || currentTab === '5.5_arrival' ? 'active' : ''}`}
          onClick={() => setCurrentTab('sos')}
        >
          <div className="nav-item-left">
            <Radio size={16} />
            <span>Telemetry & SOS Alert</span>
          </div>
        </div>

        {getUserCardForRole(role)}
      </aside>
    );
  }

  return null;
}
