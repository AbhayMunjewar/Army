import React, { useState } from 'react';
import { Check, X, FileText, Zap, ShieldAlert, Plus, Clock, Truck, MapPin, Navigation, Calendar, Send, CheckCircle2, UserCheck, Cpu } from 'lucide-react';

export default function IndentApproval({ indents, setIndents, onDispatchClick }) {
  const [filter, setFilter] = useState('PENDING'); // 'PENDING', 'AI_ONLY', 'MANUAL_ONLY', 'ALL'
  const [showManualModal, setShowManualModal] = useState(false);
  const [assigningIndent, setAssigningIndent] = useState(null); // Indent object currently being approved & assigned

  // Form states for manual indent modal
  const [newPost, setNewPost] = useState('Post Foxtrot-4');
  const [newItem, setNewItem] = useState('Sub-Zero Diesel & Rations');
  const [newQty, setNewQty] = useState('1,000 Liters');
  const [newUrgency, setNewUrgency] = useState('CRITICAL');

  // Form states for Assign Vehicle, Route & Dispatch Date Modal
  const [assignVehicle, setAssignVehicle] = useState('Tatra 6x6 Heavy Rig (LA-02-X-9941)');
  const [assignRoute, setAssignRoute] = useState('Option 1: Primary Safest Reroute (via Shyok Valley Corridor)');
  const [assignDispatchDate, setAssignDispatchDate] = useState('2026-10-04 14:00');

  const filteredIndents = indents.filter(ind => {
    if (filter === 'ALL') return true;
    if (filter === 'PENDING') return ind.status === 'PENDING';
    if (filter === 'AI_ONLY') return ind.indentType === 'AI_GENERATED' || ind.generatedBy?.includes('AI');
    if (filter === 'MANUAL_ONLY') return ind.indentType === 'MANUAL' || !ind.generatedBy?.includes('AI');
    return true;
  });

  const handleOpenAssignModal = (indent) => {
    setAssigningIndent(indent);
    setAssignVehicle(indent.assignedVehicle || indent.suggestedVehicle || 'Tatra 6x6 Heavy Rig (LA-02-X-9941)');
    setAssignRoute(indent.assignedRoute || 'Option 1: Primary Safest Reroute (via Shyok Valley Corridor)');
    setAssignDispatchDate(indent.dispatchDate || new Date().toISOString().slice(0, 16).replace('T', ' '));
  };

  const handleConfirmAssignAndApprove = (e) => {
    e.preventDefault();
    if (!assigningIndent) return;

    const updatedIndent = {
      ...assigningIndent,
      status: 'APPROVED',
      assignedVehicle: assignVehicle,
      assignedRoute: assignRoute,
      dispatchDate: assignDispatchDate
    };

    setIndents(prev => prev.map(ind => ind.id === assigningIndent.id ? updatedIndent : ind));
    setAssigningIndent(null);

    if (onDispatchClick) {
      onDispatchClick(updatedIndent);
    }
  };

  const handleReject = (id) => {
    setIndents(prev => prev.map(ind => ind.id === id ? { ...ind, status: 'REJECTED' } : ind));
  };

  const handleCreateManual = (e) => {
    e.preventDefault();
    const newInd = {
      id: `IND-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      postName: newPost,
      generatedBy: "Capt. A. Sharma (Manual Requisition)",
      indentType: "MANUAL",
      date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      item: newItem,
      quantity: newQty,
      urgency: newUrgency,
      predictedStockout: "4 Days",
      predictedStockoutDate: "07 Oct 2026",
      suggestedRoute: "Leh ➔ Shyok Bypass ➔ Destination",
      suggestedVehicle: "4x4 Logistics Truck",
      suggestedEta: "4.5 Hours",
      status: "APPROVED",
      reason: "Manual urgent requisition placed by Sector Depot Officer."
    };
    setIndents([newInd, ...indents]);
    setShowManualModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Banner */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', borderLeft: '4px solid var(--color-olive-green)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: '700', fontSize: '1.15rem', color: '#1B2026' }}>
            <FileText size={22} color="var(--color-olive-green)" />
            <span>DEPOT LOGISTICS OFFICER — INDENT APPROVAL & CONVOY DISPATCH PANEL</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Review AI auto-generated & manual requisitions, check predicted stockout dates, evaluate AI route/vehicle/ETA, and assign dispatch parameters.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Workflow Filter Buttons */}
          <div style={{ display: 'flex', background: '#F0F2ED', padding: '0.25rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
            {[
              { id: 'PENDING', label: 'PENDING APPROVAL' },
              { id: 'AI_ONLY', label: '🤖 AI-GENERATED' },
              { id: 'MANUAL_ONLY', label: '👤 MANUAL' },
              { id: 'ALL', label: 'ALL INDENTS' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  background: filter === tab.id ? 'var(--color-olive-green)' : 'transparent',
                  color: filter === tab.id ? '#FFFFFF' : 'var(--text-secondary)'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <button className="btn-primary" onClick={() => setShowManualModal(true)}>
            <Plus size={16} /> Create Manual Indent
          </button>
        </div>
      </div>

      {/* Indents Review Table */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="tactical-table">
          <thead>
            <tr>
              <th>INDENT & TYPE</th>
              <th>TARGET FORWARD POST</th>
              <th>ITEM & QUANTITY</th>
              <th>PREDICTED STOCKOUT DATE</th>
              <th>SUGGESTED ROUTE, VEHICLE & ETA</th>
              <th>STATUS</th>
              <th style={{ textAlign: 'right' }}>DEPOT OFFICER ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredIndents.map(indent => {
              const isPending = indent.status === 'PENDING';
              const isApproved = indent.status === 'APPROVED';
              const isAi = indent.indentType === 'AI_GENERATED' || indent.generatedBy?.includes('AI');

              return (
                <tr key={indent.id}>
                  {/* INDENT ID & TYPE */}
                  <td>
                    <div style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--color-olive-green)', fontSize: '0.9rem' }}>
                      {indent.id}
                    </div>
                    <div style={{ marginTop: '0.2rem' }}>
                      {isAi ? (
                        <span style={{ fontSize: '0.65rem', background: '#E8F5E9', color: '#2E7D32', padding: '0.15rem 0.5rem', borderRadius: '4px', border: '1px solid #C8E6C9', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Cpu size={11} /> 🤖 AI-GENERATED
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.65rem', background: '#FFF8E1', color: '#B78103', padding: '0.15rem 0.5rem', borderRadius: '4px', border: '1px solid #FFE082', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                          <UserCheck size={11} /> 👤 MANUAL REQUISITION
                        </span>
                      )}
                    </div>
                  </td>

                  {/* TARGET POST */}
                  <td>
                    <div style={{ fontWeight: '700', color: '#1B2026', fontSize: '0.9rem' }}>{indent.postName}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Created: {indent.date}</div>
                  </td>

                  {/* ITEM & QUANTITY */}
                  <td>
                    <div style={{ fontWeight: '600', color: '#1B2026' }}>{indent.item}</div>
                    <div style={{ fontSize: '0.75rem', color: '#B78103', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
                      Qty: {indent.quantity}
                    </div>
                  </td>

                  {/* PREDICTED STOCKOUT DATE */}
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                      <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--status-critical)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={14} /> {indent.predictedStockoutDate || '06 Oct 2026'}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                        ({indent.predictedStockout} Left)
                      </span>
                    </div>
                  </td>

                  {/* SUGGESTED ROUTE, VEHICLE & ETA */}
                  <td style={{ maxWidth: '280px' }}>
                    <div style={{ background: '#F0F2ED', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-olive-green)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Navigation size={12} /> {indent.suggestedRoute || 'Leh ➔ Shyok Bypass ➔ Destination'}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontFamily: 'var(--font-mono)' }}>
                        <span style={{ color: '#1B2026' }}>🚚 {indent.suggestedVehicle || 'Tatra 6x6 Heavy Rig'}</span>
                        <span style={{ color: '#B78103', fontWeight: '700' }}>⏱️ {indent.suggestedEta || '5.3 Hours'}</span>
                      </div>
                    </div>
                  </td>

                  {/* STATUS */}
                  <td>
                    <span className={`badge-status ${isPending ? 'warning' : isApproved ? 'healthy' : 'critical'}`}>
                      {indent.status}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td style={{ textAlign: 'right' }}>
                    {isPending ? (
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => handleOpenAssignModal(indent)}
                          style={{
                            background: 'var(--status-healthy-bg)',
                            color: 'var(--status-healthy)',
                            border: '1px solid var(--status-healthy-border)',
                            padding: '0.4rem 0.75rem',
                            borderRadius: '6px',
                            fontWeight: '700',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            boxShadow: '0 2px 8px rgba(74, 184, 110, 0.2)'
                          }}
                        >
                          <Check size={15} /> Approve & Assign Dispatch
                        </button>
                        <button
                          onClick={() => handleReject(indent.id)}
                          style={{
                            background: 'var(--status-critical-bg)',
                            color: 'var(--status-critical)',
                            border: '1px solid var(--status-critical-border)',
                            padding: '0.4rem 0.6rem',
                            borderRadius: '6px',
                            fontWeight: '700',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.2rem'
                          }}
                        >
                          <X size={15} /> Reject
                        </button>
                      </div>
                    ) : isApproved ? (
                      <button
                        className="btn-primary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                        onClick={() => onDispatchClick(indent)}
                      >
                        <Send size={14} /> View Convoy Map
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rejected</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL 1: DEPOT LOGISTICS OFFICER ASSIGN VEHICLE, ROUTE & DISPATCH DATE MODAL */}
      {assigningIndent && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999
        }}>
          <div className="glass-card" style={{ width: '560px', maxWidth: '90vw', display: 'flex', flexDirection: 'column', gap: '1.2rem', border: '2px solid var(--color-olive-green)', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: '700', fontSize: '1.1rem', color: '#1B2026', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Truck size={22} color="var(--color-olive-green)" />
                <span>ASSIGN VEHICLE, ROUTE & DISPATCH DATE</span>
              </div>
              <X size={20} style={{ cursor: 'pointer', color: '#5C6B73' }} onClick={() => setAssigningIndent(null)} />
            </div>

            {/* Indent Summary Box */}
            <div style={{ background: '#F0F2ED', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Indent ID & Target Post:</span>
                <strong style={{ color: '#1B2026' }}>{assigningIndent.id} — {assigningIndent.postName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Supply Requisition:</span>
                <strong style={{ color: '#B78103' }}>{assigningIndent.item} ({assigningIndent.quantity})</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Predicted Stockout Date:</span>
                <strong style={{ color: 'var(--status-critical)', fontFamily: 'var(--font-mono)' }}>{assigningIndent.predictedStockoutDate || '06 Oct 2026'} ({assigningIndent.predictedStockout} left)</strong>
              </div>
            </div>

            <form onSubmit={handleConfirmAssignAndApprove} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {/* 1. ASSIGN TRANSPORT VEHICLE */}
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--color-olive-green)', fontWeight: '700', display: 'block', marginBottom: '0.35rem' }}>
                  🚚 1. ASSIGN TRANSPORT VEHICLE:
                </label>
                <select
                  value={assignVehicle}
                  onChange={(e) => setAssignVehicle(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', background: '#FFFFFF', color: '#1B2026', border: '1px solid var(--border-color)', borderRadius: '6px', fontWeight: '700', fontFamily: 'var(--font-mono)' }}
                >
                  <option value="Tatra 6x6 Heavy Rig (LA-02-X-9941)">🚛 Tatra 6x6 Heavy Rig (LA-02-X-9941) — Sub-Zero Heavy Duty</option>
                  <option value="4x4 Logistics Truck (LA-02-X-4412)">🚚 4x4 Logistics Truck (LA-02-X-4412) — High-Altitude Standard</option>
                  <option value="Heavy Cargo Drone (HLD-800-Alpha)">🛸 Heavy Cargo Drone (HLD-800-Alpha) — Air Corridor Direct</option>
                  <option value="Mule Transport Team (MULE-SEC-01)">🐎 Mule Pack Transport Team (MULE-SEC-01) — Steep Tracked</option>
                </select>
              </div>

              {/* 2. ASSIGN AI ROUTE OPTION */}
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--color-olive-green)', fontWeight: '700', display: 'block', marginBottom: '0.35rem' }}>
                  🗺️ 2. ASSIGN AI ROUTE CORRIDOR:
                </label>
                <select
                  value={assignRoute}
                  onChange={(e) => setAssignRoute(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', background: '#FFFFFF', color: '#1B2026', border: '1px solid var(--border-color)', borderRadius: '6px', fontWeight: '700', fontFamily: 'var(--font-mono)' }}
                >
                  <option value="Option 1: Primary Safest Reroute (via Shyok Valley Corridor)">🟢 Option 1: Primary Safest Reroute (via Shyok Valley Bypass - 5.3 hrs)</option>
                  <option value="Option 2: Direct High-Mountain Pass (via Chang La Pass)">🔴 Option 2: Direct High-Mountain Pass (via Chang La - 6.8 hrs)</option>
                  <option value="Option 3: Air Direct Emergency Drone Corridor">⚡ Option 3: Air Direct Emergency Drone Corridor (1.4 hrs)</option>
                </select>
              </div>

              {/* 3. ASSIGN PLANNED DISPATCH DATE & TIME */}
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--color-olive-green)', fontWeight: '700', display: 'block', marginBottom: '0.35rem' }}>
                  📅 3. ASSIGN PLANNED DISPATCH DATE & TIME:
                </label>
                <input
                  type="text"
                  value={assignDispatchDate}
                  onChange={(e) => setAssignDispatchDate(e.target.value)}
                  placeholder="YYYY-MM-DD HH:MM"
                  style={{ width: '100%', padding: '0.65rem', background: '#FFFFFF', color: '#1B2026', border: '1px solid var(--border-color)', borderRadius: '6px', fontWeight: '700', fontFamily: 'var(--font-mono)' }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => setAssigningIndent(null)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 2, justifyContent: 'center', padding: '0.75rem', fontSize: '0.9rem' }}
                >
                  <CheckCircle2 size={18} /> CONFIRM APPROVAL & DISPATCH MISSION NOW
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE MANUAL INDENT MODAL */}
      {showManualModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          zIndex: 9999
        }}>
          <div className="glass-card" style={{ width: '450px', display: 'flex', flexDirection: 'column', gap: '1rem', background: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: '700', fontSize: '1rem', color: '#1B2026' }}>CREATE MANUAL SUPPLY REQUISITION</div>
              <X size={18} style={{ cursor: 'pointer', color: '#5C6B73' }} onClick={() => setShowManualModal(false)} />
            </div>

            <form onSubmit={handleCreateManual} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>TARGET FORWARD POST</label>
                <select
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', background: '#FFFFFF', color: '#1B2026', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                >
                  <option value="Post Foxtrot-4">Post Foxtrot-4 (Siachen Glacier)</option>
                  <option value="Post Kilo-2">Post Kilo-2 (Galwan Valley)</option>
                  <option value="Post Echo-5">Post Echo-5 (Sub-Sector North)</option>
                  <option value="Post Sierra-9">Post Sierra-9 (Eastern Ladakh)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>SUPPLY ITEM CATEGORY</label>
                <select
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', background: '#FFFFFF', color: '#1B2026', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                >
                  <option value="Kerosene Fuel (SKO)">⛽ Kerosene Fuel (SKO)</option>
                  <option value="MRE Combat Rations (5-Meal Pack)">🍱 MRE Combat Rations (5-Meal Pack)</option>
                  <option value="Energy & Dry Fruit Bars">🍫 Energy & Dry Fruit Bars</option>
                  <option value="5.56mm Ammunition Crates">🎯 5.56mm Ammunition Crates</option>
                  <option value="Portable Oxygen Cylinders">🫁 Portable Oxygen Cylinders</option>
                  <option value="Bukhari Stove Spare Parts">🛠️ Bukhari Stove Spare Parts</option>
                  <option value="Extreme Cold Weather Clothing">🧥 Extreme Cold Weather Clothing</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>QUANTITY REQUIRED</label>
                <input
                  type="text"
                  value={newQty}
                  onChange={(e) => setNewQty(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', background: '#FFFFFF', color: '#1B2026', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowManualModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Submit Requisition</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
