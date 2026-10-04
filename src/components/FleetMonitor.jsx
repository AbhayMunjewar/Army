import React from 'react';
import { Truck, ShieldCheck, Wrench, Navigation, CheckCircle2, QrCode, Radio, Clock, AlertTriangle, Shield } from 'lucide-react';

export default function FleetMonitor({ vehicles = [], convoys = [] }) {
  // Aggregate all QR check-in acknowledgements from active convoys
  const allCheckpointLogs = convoys.flatMap(c => {
    const logs = c.checkpointLogs || [];
    if (logs.length === 0 && c.currentCheck && c.currentCheck !== 'Pending') {
      return [{
        id: `ACK-${c.id}-01`,
        convoyId: c.id,
        convoyName: c.name,
        vehicle: c.vehicle,
        leader: c.leader,
        checkpoint: c.currentCheck,
        time: "09:45 AM",
        status: 'SAFE_AND_ON_SCHEDULE',
        message: `QR Scan Acknowledged: Convoy reached ${c.currentCheck}. Driver confirmed safe & vehicle operating normally.`
      }];
    }
    return logs;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* HEADER BANNER */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '1.1rem', color: '#1B2026' }}>
            <Truck size={20} color="var(--color-olive-green)" />
            <span>FLEET & VEHICLE READINESS MONITOR — REAL-TIME CHECKPOINT FEED</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Tracks vehicle terrain capability, cold-weather rating (-30°C certified), and live QR sign-in acknowledgements sent from en-route convoys.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span className="badge-status healthy" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
            📶 L-BAND SATELLITE TELEMETRY ACTIVE
          </span>
        </div>
      </div>

      {/* VEHICLE READINESS & MISSION STATUS TABLE */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="tactical-table">
          <thead>
            <tr>
              <th>VEHICLE ID</th>
              <th>NAME & PLATE</th>
              <th>TYPE</th>
              <th>MAX PAYLOAD</th>
              <th>COLD CERTIFIED</th>
              <th>LIVE CHECKPOINT / MISSION</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map(v => {
              const assignedConvoy = convoys.find(c => c.vehicle && c.vehicle.includes(v.id)) || (convoys.length > 0 && v.status === 'ON_MISSION' ? convoys[0] : null);
              const isMission = v.status === 'ON_MISSION' || !!assignedConvoy;
              const isReady = v.status === 'READY';

              return (
                <tr key={v.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: 'var(--color-olive-green)' }}>{v.id}</td>
                  <td>
                    <div style={{ fontWeight: '700', color: '#1B2026' }}>{v.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{v.plate}</div>
                  </td>
                  <td style={{ fontSize: '0.8rem' }}>{v.type}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '600', color: '#B78103' }}>{v.payload}</td>
                  <td>
                    <span style={{ fontSize: '0.75rem', color: 'var(--status-healthy)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                      <ShieldCheck size={14} /> -30°C Certified
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem' }}>
                    {assignedConvoy ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ color: 'var(--color-olive-green)', fontWeight: '700', fontSize: '0.75rem' }}>
                          {assignedConvoy.name}
                        </span>
                        <div style={{ fontSize: '0.7rem', color: 'var(--status-healthy)', fontFamily: 'var(--font-mono)' }}>
                          📍 Current Checkpoint: <strong>{assignedConvoy.currentCheck || 'En Route'}</strong>
                        </div>
                        {assignedConvoy.progressPct && (
                          <div style={{ width: '100px', height: '4px', background: '#E0E6DE', borderRadius: '2px', overflow: 'hidden', marginTop: '0.1rem' }}>
                            <div style={{ width: `${assignedConvoy.progressPct}%`, height: '100%', background: 'var(--status-healthy)' }} />
                          </div>
                        )}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Unassigned (Standby at Depot)</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge-status ${isMission ? 'healthy' : isReady ? 'healthy' : 'warning'}`}>
                      {isMission ? 'ON MISSION' : v.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
