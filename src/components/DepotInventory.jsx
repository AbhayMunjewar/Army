import React, { useState } from 'react';
import { Search, Filter, Fuel, Package, Disc, Wrench, AlertTriangle, CheckCircle2, ShieldAlert, PlusCircle } from 'lucide-react';

export default function DepotInventory({ posts, selectedPost, setSelectedPost, onCreateIndent }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.sector.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'ALL' || post.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Search & Filter Bar */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '280px' }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Search forward post by name, sector or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#1B2026',
              fontSize: '0.85rem',
              width: '100%',
              fontFamily: 'var(--font-sans)'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={16} color="var(--text-muted)" />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>Filter Status:</span>

          {['ALL', 'CRITICAL', 'WARNING', 'HEALTHY'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: '700',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                background: statusFilter === st ? 'var(--color-olive-green)' : '#F0F2ED',
                color: statusFilter === st ? '#FFFFFF' : 'var(--text-secondary)'
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Post Stock Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {filteredPosts.map(post => {
          const isCritical = post.status === 'CRITICAL';
          const isWarning = post.status === 'WARNING';
          const badgeClass = isCritical ? 'critical' : isWarning ? 'warning' : 'healthy';

          // Safe percentage calculations for all 5 inventory categories
          const fuel = post.stock.fuel || { current: 0, max: 100, unit: 'Liters' };
          const rations = post.stock.rations || { current: 0, max: 100, unit: 'Packs' };
          const energyBars = post.stock.energyBars || { current: 0, max: 100, unit: 'Boxes' };
          const ammo = post.stock.ammo || { current: 0, max: 100, unit: 'Rounds' };
          const oxygen = post.stock.oxygen || { current: 0, max: 100, unit: 'Cylinders' };

          const fuelPct = Math.min(100, Math.round((fuel.current / Math.max(1, fuel.max)) * 100));
          const rationsPct = Math.min(100, Math.round((rations.current / Math.max(1, rations.max)) * 100));
          const energyBarsPct = Math.min(100, Math.round((energyBars.current / Math.max(1, energyBars.max)) * 100));
          const ammoPct = Math.min(100, Math.round((ammo.current / Math.max(1, ammo.max)) * 100));
          const oxygenPct = Math.min(100, Math.round((oxygen.current / Math.max(1, oxygen.max)) * 100));

          return (
            <div key={post.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '1.05rem', fontWeight: '700', color: '#1B2026' }}>{post.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
                    {post.sector} • <span style={{ fontFamily: 'var(--font-mono)' }}>{post.altitude}</span>
                  </div>
                </div>

                <span className={`badge-status ${badgeClass}`}>
                  {isCritical ? <ShieldAlert size={12} /> : isWarning ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
                  {post.stockoutDays}d Stockout
                </span>
              </div>

              {/* Stock Items Breakdown (All 5 Categories) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', background: '#F0F2ED', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                {/* Fuel */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
                      <Fuel size={13} color="#B78103" /> Fuel (Sub-Zero SKO)
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#1B2026' }}>
                      {fuel.current} / {fuel.max} {fuel.unit} ({fuelPct}%)
                    </span>
                  </div>
                  <div className="progress-bar-container">
                    <div
                      className={`progress-bar-fill ${fuelPct < 25 ? 'red' : fuelPct < 50 ? 'yellow' : 'green'}`}
                      style={{ width: `${fuelPct}%` }}
                    />
                  </div>
                </div>

                {/* Rations */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
                      <Package size={13} color="var(--color-olive-green)" /> MRE Combat Rations
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#1B2026' }}>
                      {rations.current} / {rations.max} {rations.unit} ({rationsPct}%)
                    </span>
                  </div>
                  <div className="progress-bar-container">
                    <div
                      className={`progress-bar-fill ${rationsPct < 25 ? 'red' : rationsPct < 50 ? 'yellow' : 'green'}`}
                      style={{ width: `${rationsPct}%` }}
                    />
                  </div>
                </div>

                {/* Energy Bars */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
                      <PlusCircle size={13} color="#B78103" /> High-Altitude Energy Bars
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#1B2026' }}>
                      {energyBars.current} / {energyBars.max} {energyBars.unit} ({energyBarsPct}%)
                    </span>
                  </div>
                  <div className="progress-bar-container">
                    <div
                      className={`progress-bar-fill ${energyBarsPct < 25 ? 'red' : energyBarsPct < 50 ? 'yellow' : 'green'}`}
                      style={{ width: `${energyBarsPct}%` }}
                    />
                  </div>
                </div>

                {/* Ammo */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
                      <Disc size={13} color="#C0392B" /> Ammunition Crates
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#1B2026' }}>
                      {ammo.current} / {ammo.max} {ammo.unit} ({ammoPct}%)
                    </span>
                  </div>
                  <div className="progress-bar-container">
                    <div
                      className={`progress-bar-fill ${ammoPct < 25 ? 'red' : ammoPct < 50 ? 'yellow' : 'green'}`}
                      style={{ width: `${ammoPct}%` }}
                    />
                  </div>
                </div>

                {/* Oxygen */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)' }}>
                      <Wrench size={13} color="var(--color-olive-green)" /> Portable Oxygen Cylinders
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#1B2026' }}>
                      {oxygen.current} / {oxygen.max} {oxygen.unit} ({oxygenPct}%)
                    </span>
                  </div>
                  <div className="progress-bar-container">
                    <div
                      className={`progress-bar-fill ${oxygenPct < 25 ? 'red' : oxygenPct < 50 ? 'yellow' : 'green'}`}
                      style={{ width: `${oxygenPct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.2rem', borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  Troop Strength: <strong style={{ color: '#1B2026' }}>{post.troops} Pax</strong>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Cmdr: <strong style={{ color: '#1B2026' }}>{post.commander}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
