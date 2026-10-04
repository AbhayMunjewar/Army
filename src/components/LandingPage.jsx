import React from 'react';
import {
  Shield,
  Layers,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  Activity,
  Cpu,
  Lock,
  WifiOff,
  Truck,
  MapPin,
  Radio,
  CheckCircle2,
  Compass,
  BrainCircuit,
  FileCheck2,
  Server
} from 'lucide-react';

export default function LandingPage({ onSelectRole }) {
  return (
    <div className="landing-page-wrapper" style={{
      minHeight: '100vh',
      backgroundColor: '#F2F4EF',
      color: '#1B2026',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* BACKGROUND GRAPHIC ACCENTS */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '600px',
        backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(63, 81, 53, 0.12) 0%, rgba(242, 244, 239, 0.95) 75%)',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      {/* TOP EMBLEM HEADER */}
      <header style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1.1rem 3rem',
        borderBottom: '2px solid #D6A23A',
        background: 'linear-gradient(180deg, #0B1F33 0%, #071626 100%)',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.6)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '10px',
            overflow: 'hidden',
            border: '2px solid #D6A23A',
            boxShadow: '0 0 15px rgba(214, 162, 58, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            background: '#081F33'
          }}>
            <img src="/sih251_eagle_logo.svg" alt="SIH251 Eagle Shield Emblem" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: '900', letterSpacing: '1px', color: '#F2F4EF', display: 'flex', alignItems: 'center', gap: '0.45rem', whiteSpace: 'nowrap' }}>
              <span style={{ background: '#3F5135', color: '#FFF099', fontSize: '1.05rem', fontWeight: '900', padding: '0.2rem 0.75rem', borderRadius: '4px', border: '1px solid #D6A23A', letterSpacing: '1.2px' }}>VeerSetu</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: '#D6A23A', fontWeight: '700', letterSpacing: '0.8px', marginTop: '2px', whiteSpace: 'nowrap' }}>
              STRONGER SYSTEMS. SAFER TOMORROW. • VeerSetu MILITARY INTELLIGENCE PLATFORM
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.45rem 0.9rem',
            borderRadius: '20px',
            background: 'rgba(74, 94, 76, 0.3)',
            border: '1px solid #4ade80',
            fontSize: '0.75rem',
            color: '#4ade80',
            fontWeight: '700',
            whiteSpace: 'nowrap'
          }}>
            <Server size={14} />
            <span>MOD DEFENCE CLOUD ONLINE</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.45rem 0.9rem',
            borderRadius: '20px',
            background: 'rgba(180, 130, 40, 0.3)',
            border: '1px solid #facc15',
            fontSize: '0.75rem',
            color: '#facc15',
            fontWeight: '700',
            whiteSpace: 'nowrap'
          }}>
            <Lock size={14} />
            <span>CONFIDENTIAL // RESTRICTED ACCESS</span>
          </div>
        </div>
      </header>

      {/* HERO BANNER SECTION */}
      <section style={{
        position: 'relative',
        zIndex: 5,
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '3.5rem 2rem 2rem 2rem',
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: '3rem',
        alignItems: 'center'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.45rem 1.1rem',
            borderRadius: '6px',
            background: 'rgba(63, 81, 53, 0.12)',
            border: '1px solid rgba(63, 81, 53, 0.3)',
            color: '#3F5135',
            fontSize: '0.8rem',
            fontWeight: '800',
            letterSpacing: '0.8px',
            marginBottom: '1.25rem'
          }}>
            <BrainCircuit size={16} color="#2D7A3A" />
            <span>VeerSetu • PREDICTIVE AI & DYNAMIC ROUTE OPTIMIZATION</span>
          </div>

          <h1 style={{
            fontSize: '2.8rem',
            fontWeight: '900',
            lineHeight: '1.15',
            color: '#1B2026',
            letterSpacing: '-0.5px',
            marginBottom: '1.25rem'
          }}>
            Tactical Logistics Intelligence for <span style={{
              background: 'linear-gradient(135deg, #3F5135 0%, #2D7A3A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>High-Altitude Outposts</span>
          </h1>

          <p style={{
            fontSize: '1.05rem',
            color: '#4A5A3F',
            lineHeight: '1.6',
            marginBottom: '2rem',
            maxWidth: '620px'
          }}>
            Predictive stockout prevention, automated supply indents, and satellite-guided AI route optimization built specifically for Leh, Siachen & forward border sectors.
          </p>

          {/* SYSTEM STATS HIGHLIGHTS - PROPER BALANCED SPACING */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0',
            padding: '1.35rem 1.5rem',
            background: '#FFFFFF',
            border: '1.5px solid rgba(63, 81, 53, 0.25)',
            borderRadius: '12px',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.06)'
          }}>
            <div style={{ paddingRight: '1.25rem', borderRight: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#2D7A3A', letterSpacing: '-0.5px' }}>98.42%</div>
              <div style={{ fontSize: '0.78rem', color: '#4A5A3F', fontWeight: '700', marginTop: '0.2rem' }}>ML Burn Rate Accuracy</div>
            </div>
            <div style={{ paddingLeft: '1.25rem', paddingRight: '1.25rem', borderRight: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#0284c7', letterSpacing: '-0.5px' }}>25 Posts</div>
              <div style={{ fontSize: '0.78rem', color: '#4A5A3F', fontWeight: '700', marginTop: '0.2rem' }}>High-Altitude Monitored</div>
            </div>
            <div style={{ paddingLeft: '1.25rem' }}>
              <div style={{ fontSize: '1.75rem', fontWeight: '900', color: '#b45309', letterSpacing: '-0.5px' }}>Zero-Net</div>
              <div style={{ fontSize: '0.78rem', color: '#4A5A3F', fontWeight: '700', marginTop: '0.2rem' }}>Offline CRDT Enabled</div>
            </div>
          </div>
        </div>

        {/* HERO IMAGE CONTAINER */}
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute',
            inset: '-10px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(63, 81, 53, 0.2) 0%, rgba(45, 122, 58, 0.1) 100%)',
            filter: 'blur(20px)',
            zIndex: -1
          }} />

          <div style={{
            borderRadius: '14px',
            overflow: 'hidden',
            border: '2px solid rgba(63, 81, 53, 0.3)',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.12)',
            position: 'relative'
          }}>
            <img
              src="/army_convoy_hero.png"
              alt="Indian Army High Altitude Convoy"
              style={{
                width: '100%',
                height: '340px',
                objectFit: 'cover',
                display: 'block'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '1rem',
              background: 'linear-gradient(to top, rgba(11, 31, 51, 0.95) 0%, transparent 100%)',
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#F2F4EF', fontWeight: '600' }}>
                <Compass size={16} color="#86efac" />
                <span>Kharung La Pass Convoy (17,582 ft)</span>
              </div>
              <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '4px', background: '#166534', color: '#FFFFFF', fontWeight: '700' }}>LIVE TRACKING</span>
            </div>
          </div>
        </div>
      </section>

      {/* PORTAL SELECTION TITLE */}
      <section style={{
        position: 'relative',
        zIndex: 5,
        maxWidth: '1280px',
        margin: '2rem auto 0 auto',
        padding: '0 2rem',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-block',
          fontSize: '0.8rem',
          fontWeight: '800',
          letterSpacing: '2px',
          color: '#2D7A3A',
          textTransform: 'uppercase',
          marginBottom: '0.5rem'
        }}>
          ● COMMAND PORTAL LOGIN SELECTION
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#1B2026' }}>
          Select Role Terminal to Access System
        </h2>
        <p style={{ color: '#4A5A3F', fontSize: '0.95rem', marginTop: '0.3rem' }}>
          Choose your operational authorization level to proceed to the designated dashboard module.
        </p>
      </section>

      {/* THREE DIRECT ROLE LOGIN CARDS */}
      <section style={{
        position: 'relative',
        zIndex: 5,
        maxWidth: '1280px',
        margin: '2rem auto 4rem auto',
        padding: '0 2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '2rem'
      }}>

        {/* CARD 1: DEPOT OFFICER */}
        <div className="role-portal-card" style={{
          background: '#FFFFFF',
          border: '2px solid rgba(63, 81, 53, 0.25)',
          borderRadius: '16px',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          transition: 'all 0.3s ease',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.06)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'rgba(63, 81, 53, 0.1)',
            filter: 'blur(20px)',
            pointerEvents: 'none'
          }} />

          <div>
            <div style={{
              width: '100%',
              height: '140px',
              borderRadius: '10px',
              overflow: 'hidden',
              marginBottom: '1.25rem',
              border: '1px solid rgba(63, 81, 53, 0.25)'
            }}>
              <img
                src="/army_depot_command.png"
                alt="Depot Officer Command Center"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'rgba(63, 81, 53, 0.12)',
                border: '1px solid rgba(63, 81, 53, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justify: 'center'
              }}>
                <Layers size={20} color="#3F5135" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1B2026', margin: 0 }}>
                  Depot Officer
                </h3>
                <span style={{ fontSize: '0.7rem', color: '#2D7A3A', fontWeight: '700', letterSpacing: '0.5px' }}>
                  LEH CENTRAL SUPPLY HQ
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#4A5A3F', lineHeight: '1.5', marginBottom: '1.25rem' }}>
              Master overview of 25 outposts, stockout risk triage, AI ML consumption predictions, auto-indent approvals, AI route planning & vehicle fleet telemetry.
            </p>

            <ul style={{ paddingLeft: '1.2rem', margin: '0 0 1.5rem 0', fontSize: '0.8rem', color: '#1B2026', lineHeight: '1.7', fontWeight: '600' }}>
              <li>25 Outpost Stock Matrix</li>
              <li>XGBoost AI Stockout Predictions</li>
              <li>AI Route & Convoy Dispatch</li>
              <li>Fleet Telemetry & QR Ack Feed</li>
            </ul>
          </div>

          <button
            onClick={() => onSelectRole('DEPOT_OFFICER')}
            style={{
              width: '100%',
              padding: '0.9rem 1.25rem',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #3F5135 0%, #263620 100%)',
              border: '1px solid #D6A23A',
              color: '#FFFFFF',
              fontWeight: '800',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              gap: '0.6rem',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(63, 81, 53, 0.25)',
              transition: 'transform 0.2s ease, boxShadow 0.2s ease'
            }}
          >
            <span>LOGIN AS DEPOT OFFICER</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* CARD 2: POST COMMANDER */}
        <div className="role-portal-card" style={{
          background: '#FFFFFF',
          border: '2px solid rgba(214, 162, 58, 0.4)',
          borderRadius: '16px',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          transition: 'all 0.3s ease',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.06)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'rgba(214, 162, 58, 0.1)',
            filter: 'blur(20px)',
            pointerEvents: 'none'
          }} />

          <div>
            <div style={{
              width: '100%',
              height: '140px',
              borderRadius: '10px',
              overflow: 'hidden',
              marginBottom: '1.25rem',
              border: '1px solid rgba(214, 162, 58, 0.35)'
            }}>
              <img
                src="/army_outpost_guard.png"
                alt="Post Commander Outpost"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'rgba(214, 162, 58, 0.12)',
                border: '1px solid rgba(214, 162, 58, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justify: 'center'
              }}>
                <UserCheck size={20} color="#C8960E" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1B2026', margin: 0 }}>
                  Post Commander
                </h3>
                <span style={{ fontSize: '0.7rem', color: '#C8960E', fontWeight: '700', letterSpacing: '0.5px' }}>
                  FORWARD BORDER OUTPOST
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#4A5A3F', lineHeight: '1.5', marginBottom: '1.25rem' }}>
              Real-time outpost inventory monitor, item-by-item daily consumption logger, manual emergency indents, cargo delivery sign-off & offline CRDT sync.
            </p>

            <ul style={{ paddingLeft: '1.2rem', margin: '0 0 1.5rem 0', fontSize: '0.8rem', color: '#1B2026', lineHeight: '1.7', fontWeight: '600' }}>
              <li>Outpost Stock & Days Countdown</li>
              <li>Daily Consumption Logging</li>
              <li>"I Got It" Cargo Intake Sign-Off</li>
              <li>Offline Border Post CRDT Sync</li>
            </ul>
          </div>

          <button
            onClick={() => onSelectRole('POST_COMMANDER')}
            style={{
              width: '100%',
              padding: '0.9rem 1.25rem',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #3F5135 0%, #263620 100%)',
              border: '1px solid #D6A23A',
              color: '#FFFFFF',
              fontWeight: '800',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              gap: '0.6rem',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(214, 162, 58, 0.25)',
              transition: 'transform 0.2s ease, boxShadow 0.2s ease'
            }}
          >
            <span>LOGIN AS POST COMMANDER</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* CARD 3: CONVOY LEADER */}
        <div className="role-portal-card" style={{
          background: '#FFFFFF',
          border: '2px solid rgba(192, 57, 43, 0.35)',
          borderRadius: '16px',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          justify: 'space-between',
          transition: 'all 0.3s ease',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.06)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'rgba(192, 57, 43, 0.1)',
            filter: 'blur(20px)',
            pointerEvents: 'none'
          }} />

          <div>
            <div style={{
              width: '100%',
              height: '140px',
              borderRadius: '10px',
              overflow: 'hidden',
              marginBottom: '1.25rem',
              border: '1px solid rgba(192, 57, 43, 0.3)'
            }}>
              <img
                src="/army_convoy_hero.png"
                alt="Convoy Leader Terminal"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                background: 'rgba(192, 57, 43, 0.12)',
                border: '1px solid rgba(192, 57, 43, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justify: 'center'
              }}>
                <ShieldAlert size={20} color="#C0392B" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1B2026', margin: 0 }}>
                  Convoy Leader
                </h3>
                <span style={{ fontSize: '0.7rem', color: '#C0392B', fontWeight: '700', letterSpacing: '0.5px' }}>
                  TRANSIT & CHECKPOINT HUD
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#4A5A3F', lineHeight: '1.5', marginBottom: '1.25rem' }}>
              Itemized cargo manifest, pre-departure safety checklist, "I'm Safe" QR checkpoint scan, live telemetry, handover digital sign-off & report export.
            </p>

            <ul style={{ paddingLeft: '1.2rem', margin: '0 0 1.5rem 0', fontSize: '0.8rem', color: '#1B2026', lineHeight: '1.7', fontWeight: '600' }}>
              <li>Itemized Cargo Manifest & Seals</li>
              <li>Pre-Departure Safety Checklist</li>
              <li>"I'm Safe" QR Checkpoint Scan</li>
              <li>Delivery Receipt Report Export</li>
            </ul>
          </div>

          <button
            onClick={() => onSelectRole('CONVOY_LEADER')}
            style={{
              width: '100%',
              padding: '0.9rem 1.25rem',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #3F5135 0%, #263620 100%)',
              border: '1px solid #D6A23A',
              color: '#FFFFFF',
              fontWeight: '800',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              gap: '0.6rem',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(192, 57, 43, 0.2)',
              transition: 'transform 0.2s ease, boxShadow 0.2s ease'
            }}
          >
            <span>LOGIN AS CONVOY LEADER</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </section>

      {/* FOOTER BAR */}
      <footer style={{
        position: 'relative',
        zIndex: 10,
        borderTop: '1px solid rgba(63, 81, 53, 0.2)',
        padding: '1.5rem 2rem',
        textAlign: 'center',
        backgroundColor: '#E8EBE4',
        fontSize: '0.8rem',
        color: '#4A5A3F'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <Shield size={16} color="#3F5135" />
          <span style={{ color: '#1B2026', fontWeight: '700' }}>VeerSetu ARCHITECTURE</span>
          <span>•</span>
          <span>INDIAN ARMY DEFENCE SYSTEM</span>
        </div>
        <div>Ministry of Defence • High-Altitude Predictive Logistics & Route Optimization Platform</div>
      </footer>
    </div>
  );
}
