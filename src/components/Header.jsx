import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Shield, ShieldAlert, Wifi, WifiOff, Clock, UserCheck, Layers, Search, Bell, LogOut, ChevronRight } from 'lucide-react';

export default function Header({ role, setRole, isOffline, setIsOffline, onExitToPortal }) {
  const [timeStr, setTimeStr] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [showPwaModal, setShowPwaModal] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeStr(now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + ' | ' + now.toLocaleTimeString('en-US', { hour12: false }) + ' IST');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);

    // Listen for PWA BeforeInstallPrompt Event
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsAppInstalled(true);
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const [installStatus, setInstallStatus] = useState(null);

  const handleInstallPWA = async () => {
    setShowPwaModal(true);
  };

  const handleSelectOsInstall = async (osType) => {
    setInstallStatus(`Initializing RAKSHAK installation for ${osType}...`);

    // 1. Trigger native browser PWA prompt if available
    if (deferredPrompt) {
      deferredPrompt.prompt();
      try {
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsAppInstalled(true);
          setInstallStatus(`✅ RAKSHAK PWA Successfully Installed on ${osType}!`);
          setDeferredPrompt(null);
          setTimeout(() => setShowPwaModal(false), 2200);
          return;
        }
      } catch (err) {
        console.warn('Native PWA prompt error:', err);
      }
    }

    // 2. OS-specific Standalone WebApp Package Launcher trigger
    if (osType === 'WINDOWS') {
      const cmdContent = `@echo off
:: Indian Army RAKSHAK PWA Desktop Launcher
echo ====================================================
echo   SIH251 RAKSHAK-LOGISTICS PWA DESKTOP LAUNCHER
echo   INDIAN ARMY MILITARY LOGISTICS PLATFORM
echo ====================================================
start msedge --app=http://localhost:5173 || start chrome --app=http://localhost:5173
exit
`;
      const blob = new Blob([cmdContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'RAKSHAK-Tactical-Windows-App.cmd';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setInstallStatus('✅ Windows Desktop App Launcher Downloaded & Triggered! Look up at browser URL bar ⊕ icon or run the downloaded file.');
    } else if (osType === 'MAC') {
      const macContent = `#!/bin/bash
# Indian Army RAKSHAK PWA Desktop Launcher for macOS
echo "Launching RAKSHAK-LOGISTICS PWA Standalone..."
open -a "Google Chrome" --args --app=http://localhost:5173 || open http://localhost:5173
`;
      const blob = new Blob([macContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'RAKSHAK-Tactical-Mac-App.command';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setInstallStatus('✅ macOS Standalone App Launcher Downloaded & Triggered!');
    } else if (osType === 'PHONE') {
      setInstallStatus('📱 Mobile PWA Package Activated! Tap Chrome/Safari menu (⋮) → select "Add to Home Screen".');
    }
  };

  // Format current role badge title
  const roleDisplayInfo = {
    'DEPOT_OFFICER': { title: 'Depot Logistics Officer', icon: <Layers size={14} color="#4ade80" />, color: '#4ade80', bg: 'rgba(74, 94, 76, 0.3)' },
    'POST_COMMANDER': { title: 'Post Commander', icon: <UserCheck size={14} color="#facc15" />, color: '#facc15', bg: 'rgba(180, 130, 40, 0.3)' },
    'CONVOY_LEADER': { title: 'Convoy Leader / Transit', icon: <ShieldAlert size={14} color="#f87171" />, color: '#f87171', bg: 'rgba(190, 60, 60, 0.3)' }
  }[role] || { title: role, icon: <Shield size={14} />, color: '#ffffff', bg: 'rgba(255, 255, 255, 0.1)' };

  return (
    <header className="app-header">
      <div className="brand-section">
        <div 
          onClick={onExitToPortal} 
          style={{ 
            cursor: 'pointer',
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            overflow: 'hidden',
            border: '2px solid #D6A23A',
            boxShadow: '0 0 15px rgba(214, 162, 58, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            background: '#081F33'
          }} 
          title="Click to return to main portal landing page"
        >
          <img src="/sih251_eagle_logo.svg" alt="SIH251 Eagle Shield Emblem" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <div>
          <div className="brand-title" onClick={onExitToPortal} style={{ cursor: 'pointer', fontSize: '1.35rem', fontWeight: '900', color: '#F2F4EF', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '0.45rem', whiteSpace: 'nowrap' }}>
            <span className="brand-tag" style={{ background: '#3F5135', color: '#FFF099', border: '1px solid #D6A23A', padding: '0.2rem 0.75rem', borderRadius: '4px', fontSize: '1.05rem', fontWeight: '900', letterSpacing: '1.2px' }}>VeerSetu</span>
          </div>
          <div style={{ fontSize: '0.62rem', color: '#D6A23A', fontWeight: '700', letterSpacing: '0.8px', marginTop: '1px', whiteSpace: 'nowrap' }}>
            STRONGER SYSTEMS. SAFER TOMORROW. • VeerSetu MILITARY INTELLIGENCE PLATFORM
          </div>
        </div>
      </div>

      <div className="search-bar-header" style={{ flexShrink: 0 }}>
        <Search size={14} color="var(--text-muted)" />
        <input type="text" placeholder="Search location, unit, or report..." />
      </div>

      {/* ACTIVE ROLE BADGE & PORTAL EXIT BUTTON (REPLACES TOP SWITCHER PILLS) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.45rem 0.9rem',
          borderRadius: '8px',
          background: roleDisplayInfo.bg,
          border: `1px solid ${roleDisplayInfo.color}`,
          color: '#ffffff',
          fontSize: '0.8rem',
          fontWeight: '700',
          whiteSpace: 'nowrap'
        }}>
          {roleDisplayInfo.icon}
          <span style={{ color: roleDisplayInfo.color, whiteSpace: 'nowrap' }}>{roleDisplayInfo.title}</span>
        </div>

        <button
          onClick={onExitToPortal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.45rem 0.85rem',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#cbd5e1',
            fontSize: '0.78rem',
            fontWeight: '700',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'}
          title="Return to Command Portal Landing Page to switch roles"
        >
          <LogOut size={13} />
          <span style={{ whiteSpace: 'nowrap' }}>Switch Role</span>
        </button>
      </div>

      <div className="header-status-controls" style={{ flexShrink: 0 }}>
        {!isAppInstalled && (
          <button
            onClick={handleInstallPWA}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.45rem 0.85rem',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #3F5135 0%, #1e2a18 100%)',
              border: '1px solid #D6A23A',
              color: '#FFF099',
              fontSize: '0.75rem',
              fontWeight: '800',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 0 10px rgba(214, 162, 58, 0.35)',
              fontFamily: 'var(--font-mono)'
            }}
            title="Install RAKSHAK as a standalone Progressive Web App on your tablet or desktop"
          >
            <span style={{ whiteSpace: 'nowrap' }}>📱 Install PWA App</span>
          </button>
        )}

        <div
          className={`offline-toggle ${isOffline ? 'offline' : 'online'}`}
          onClick={() => setIsOffline(!isOffline)}
          style={{ whiteSpace: 'nowrap' }}
          title="Click to simulate offline border post network connection"
        >
          {isOffline ? (
            <>
              <WifiOff size={14} />
              <span style={{ whiteSpace: 'nowrap' }}>ZERO INTERNET (CRDT)</span>
            </>
          ) : (
            <>
              <Wifi size={14} />
              <span style={{ whiteSpace: 'nowrap' }}>● System Online</span>
            </>
          )}
        </div>

        <div style={{ position: 'relative', cursor: 'pointer', color: '#A3B899' }}>
          <Bell size={18} />
          <span style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'var(--color-red)'
          }} />
        </div>

        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#A3B899', whiteSpace: 'nowrap' }}>
          {timeStr}
        </div>
      </div>

      {/* CUSTOM MILITARY TACTICAL PWA INSTALLATION OS SELECTION MODAL */}
      {showPwaModal && createPortal(
        <div style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 999999,
          background: 'rgba(0, 0, 0, 0.88)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          padding: '1.5rem'
        }}>
          <div style={{
            background: 'linear-gradient(180deg, #0B1F33 0%, #182026 100%)',
            border: '2px solid #D6A23A',
            borderRadius: '16px',
            maxWidth: '620px',
            width: '100%',
            padding: '2rem',
            boxShadow: '0 24px 70px rgba(0, 0, 0, 0.95)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '10px',
                overflow: 'hidden',
                border: '2px solid #D6A23A',
                background: '#081F33',
                display: 'flex',
                alignItems: 'center',
                justify: 'center',
                boxShadow: '0 0 14px rgba(214, 162, 58, 0.4)'
              }}>
                <img src="/sih251_eagle_logo.svg" alt="SIH251 Eagle Emblem" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div>
                <h3 style={{ color: '#F2F4EF', fontSize: '1.25rem', fontWeight: '900', letterSpacing: '0.5px' }}>
                  📱 INSTALL RAKSHAK PWA APP
                </h3>
                <span style={{ fontSize: '0.72rem', color: '#D6A23A', fontWeight: '800', letterSpacing: '0.8px' }}>
                  SELECT YOUR DEVICE OPERATING SYSTEM FOR DIRECT INSTALLATION
                </span>
              </div>
            </div>

            {installStatus && (
              <div style={{
                background: 'rgba(74, 222, 128, 0.15)',
                border: '1px solid #4ade80',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                marginBottom: '1.25rem',
                color: '#4ade80',
                fontSize: '0.82rem',
                fontWeight: '700',
                lineHeight: '1.4'
              }}>
                {installStatus}
              </div>
            )}

            <p style={{ fontSize: '0.85rem', color: '#a3b899', lineHeight: '1.5', marginBottom: '1.25rem' }}>
              Choose your operating system below to trigger direct PWA installation & download the standalone tactical application package:
            </p>

            {/* 3 OS SELECTION INSTALLATION CARDS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '1.75rem' }}>
              {/* OPTION 1: WINDOWS */}
              <div 
                onClick={() => handleSelectOsInstall('WINDOWS')}
                style={{
                  background: 'linear-gradient(135deg, #081726 0%, #102436 100%)',
                  padding: '1.1rem 1.25rem',
                  borderRadius: '10px',
                  border: '1px solid #D6A23A',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#FFF099'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#D6A23A'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                  <div style={{ fontSize: '1.8rem' }}>🪟</div>
                  <div>
                    <div style={{ color: '#FFF099', fontWeight: '800', fontSize: '0.95rem' }}>
                      WINDOWS PC / COMMAND LAPTOP
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
                      Click to Install RAKSHAK for Windows (PC/Laptop)
                    </div>
                  </div>
                </div>
                <button className="btn-primary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem', pointerEvents: 'none' }}>
                  INSTALL FOR WINDOWS →
                </button>
              </div>

              {/* OPTION 2: MAC */}
              <div 
                onClick={() => handleSelectOsInstall('MAC')}
                style={{
                  background: 'linear-gradient(135deg, #081726 0%, #102436 100%)',
                  padding: '1.1rem 1.25rem',
                  borderRadius: '10px',
                  border: '1px solid #3F5135',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#D6A23A'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#3F5135'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                  <div style={{ fontSize: '1.8rem' }}>🍎</div>
                  <div>
                    <div style={{ color: '#F2F4EF', fontWeight: '800', fontSize: '0.95rem' }}>
                      MAC OS (APPLE SILICON / INTEL)
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
                      Click to Install RAKSHAK for macOS
                    </div>
                  </div>
                </div>
                <button className="btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem', pointerEvents: 'none' }}>
                  INSTALL FOR MAC →
                </button>
              </div>

              {/* OPTION 3: PHONE */}
              <div 
                onClick={() => handleSelectOsInstall('PHONE')}
                style={{
                  background: 'linear-gradient(135deg, #081726 0%, #102436 100%)',
                  padding: '1.1rem 1.25rem',
                  borderRadius: '10px',
                  border: '1px solid #3F5135',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'space-between',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#D6A23A'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#3F5135'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                  <div style={{ fontSize: '1.8rem' }}>📱</div>
                  <div>
                    <div style={{ color: '#F2F4EF', fontWeight: '800', fontSize: '0.95rem' }}>
                      PHONE / TABLET (ANDROID / iOS)
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
                      Click to Install RAKSHAK on Mobile & Outpost Handhelds
                    </div>
                  </div>
                </div>
                <button className="btn-secondary" style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem', pointerEvents: 'none' }}>
                  INSTALL FOR PHONE →
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowPwaModal(false)}
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '0.88rem' }}
              >
                CLOSE WINDOW
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}
