import React from 'react';
import { AlertTriangle, Clock, Flame, ShieldAlert, ArrowRight, Zap, CheckCircle2, Thermometer, Users, AlertOctagon } from 'lucide-react';

export default function StockoutRisk({ posts = [], highlightedPostId, onCreateIndent }) {
  // Helper to compute unified AI Prediction math matching ConsumptionPrediction.jsx exactly
  const getPostAIPrediction = (post) => {
    const troops = post.troops || 48;
    const temp = post.weather ? post.weather.temp : -28;
    const isCritical = post.status === 'CRITICAL';
    const snowCondition = post.weather?.snow || 'Heavy';

    const tempMultiplier = 1 + (Math.abs(temp) * 0.045);
    const readinessMultiplier = isCritical ? 1.35 : 1.0;
    const weatherMultiplier = snowCondition.toLowerCase().includes('storm') || post.weather?.risk === 'EXTREME' || snowCondition.toLowerCase().includes('heavy') ? 1.3 : 1.15;

    const baseFuelPerTroop = 2.2;
    const baseRationsPerTroop = 1.0;

    const aiPredictedFuelBurn = Math.round(troops * baseFuelPerTroop * tempMultiplier * readinessMultiplier * weatherMultiplier);
    const aiPredictedRationsBurn = Math.round(troops * baseRationsPerTroop * readinessMultiplier * weatherMultiplier);

    // If active burn rate is higher than baseline, use the AI predicted burn rate
    const fuelBurnRate = post.stock?.fuel?.burnRate && post.stock.fuel.burnRate > 150 ? post.stock.fuel.burnRate : aiPredictedFuelBurn;
    const currentFuel = post.stock?.fuel?.current ?? 420;
    const fuelDaysLeft = Math.round((currentFuel / Math.max(1, fuelBurnRate)) * 10) / 10;

    const rationsBurnRate = post.stock?.rations?.burnRate && post.stock.rations.burnRate > 60 ? post.stock.rations.burnRate : aiPredictedRationsBurn;
    const currentRations = post.stock?.rations?.current ?? 180;
    const rationsDaysLeft = Math.round((currentRations / Math.max(1, rationsBurnRate)) * 10) / 10;

    const minDaysLeft = Math.min(fuelDaysLeft, rationsDaysLeft);

    return {
      burnRate: fuelBurnRate,
      currentFuel: currentFuel,
      daysLeft: minDaysLeft,
      fuelDaysLeft: fuelDaysLeft,
      rationsDaysLeft: rationsDaysLeft
    };
  };

  // Sort posts: Put highlighted post at the top, then critical posts, then warning posts
  const sortedPosts = [...posts].sort((a, b) => {
    if (a.id === highlightedPostId) return -1;
    if (b.id === highlightedPostId) return 1;
    const statusPriority = { CRITICAL: 1, WARNING: 2, HEALTHY: 3 };
    return (statusPriority[a.status] || 3) - (statusPriority[b.status] || 3);
  });

  const criticalPosts = sortedPosts.filter(p => p.status === 'CRITICAL' || p.status === 'WARNING' || p.id === highlightedPostId);

  // Helper to format decimal days into clean human readable military time
  const formatStockoutTimeHuman = (daysLeft) => {
    if (isNaN(daysLeft) || daysLeft <= 0) return "IMMEDIATE STOCKOUT";
    
    const totalMinutes = Math.round(daysLeft * 24 * 60);
    const totalHours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    
    if (totalHours < 24) {
      if (totalHours === 0) return `${mins} Mins Left`;
      return mins > 0 ? `${totalHours} Hours ${mins} Mins` : `${totalHours} Hours`;
    }
    
    const days = Math.floor(totalHours / 24);
    const remainingHours = totalHours % 24;
    
    if (remainingHours === 0) return `${days} Days Left`;
    return `${days} ${days === 1 ? 'Day' : 'Days'} ${remainingHours} ${remainingHours === 1 ? 'Hour' : 'Hours'}`;
  };

  const getStockoutDateString = (daysLeft) => {
    if (isNaN(daysLeft) || daysLeft <= 0) return "TODAY";
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + Math.ceil(daysLeft));
    return targetDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Risk Alert Overview Header */}
      <div className="glass-card" style={{ borderLeft: '4px solid var(--status-critical)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <ShieldAlert size={24} color="var(--status-critical)" />
          <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#1B2026' }}>
            AI PREDICTIVE STOCKOUT COUNTDOWN & RISK ANALYSIS MATRIX
          </h2>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          AI Demand Prediction Engine dynamically computes stockout risks by combining Post Commander log entries, altitude factors, sub-zero ambient temperatures, and troop headcount.
        </p>
      </div>

      {/* Countdown Timers & Risk Breakdown Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {criticalPosts.map(post => {
          const isHighlighted = post.id === highlightedPostId;
          const isCritical = post.status === 'CRITICAL';
          const borderColor = isHighlighted ? '#C0392B' : isCritical ? 'var(--status-critical)' : 'var(--status-warning)';
          
          // Unified AI prediction calculation
          const aiData = getPostAIPrediction(post);
          const daysLeft = aiData.daysLeft;

          return (
            <div
              key={post.id}
              className="glass-card"
              style={{
                border: `2px solid ${borderColor}`,
                background: isHighlighted 
                  ? '#FFF5F5' 
                  : isCritical ? '#FFF8F8' : '#FFFDF5',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.1rem',
                boxShadow: isHighlighted ? '0 0 16px rgba(192, 57, 43, 0.25)' : 'none',
                position: 'relative'
              }}
            >
              {/* Highlight Badge if redirected from Post Commander notification */}
              {isHighlighted && (
                <div style={{
                  background: '#C0392B',
                  color: '#FFFFFF',
                  fontSize: '0.65rem',
                  fontWeight: '700',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '4px',
                  alignSelf: 'flex-start',
                  letterSpacing: '0.5px'
                }}>
                  🎯 TARGET ALERT TRIGGERED FROM POST COMMANDER LOG
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: '700', color: '#1B2026' }}>{post.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Sector: {post.sector} | Altitude: {post.altitude}
                  </div>
                </div>
                <span className={`badge-status ${isCritical ? 'critical' : 'warning'}`}>
                  {isCritical ? '🚨 CRITICAL RISK' : '⚠️ WARNING'}
                </span>
              </div>

              {/* Stockout Countdown Display Box */}
              <div style={{
                background: '#FFFFFF',
                padding: '1rem',
                borderRadius: '8px',
                border: `1px solid ${isCritical ? 'rgba(192, 57, 43, 0.3)' : 'var(--border-color)'}`,
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.3rem'
              }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', fontWeight: '700' }}>
                  TIME UNTIL FIRST ITEM ZERO STOCKOUT
                </div>
                <div style={{
                  fontSize: '1.8rem',
                  fontWeight: '700',
                  fontFamily: 'var(--font-mono)',
                  color: isCritical ? '#C0392B' : '#B78103',
                  letterSpacing: '0.5px'
                }}>
                  {formatStockoutTimeHuman(daysLeft)}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                  📅 Predicted Stockout Date: <strong style={{ color: '#1B2026' }}>{getStockoutDateString(daysLeft)}</strong>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                  Primary Depletion Item: <strong style={{ color: '#1B2026' }}>Sub-Zero Kerosene Fuel (SKO)</strong>
                </div>
              </div>

              {/* Detailed Risk Cause & Environmental Breakdown */}
              <div style={{ background: '#F0F2ED', padding: '0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.75rem' }}>
                <div style={{ fontWeight: '700', color: 'var(--color-olive-green)', marginBottom: '0.1rem' }}>
                  🔍 AI RISK ALERT CAUSE ANALYSIS:
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                  <Thermometer size={14} color="#C0392B" />
                  <span>Sub-Zero Thermal Surge: <strong style={{ color: '#C0392B' }}>{post.weather ? post.weather.temp : -28}°C ({post.weather ? post.weather.snow : 'Severe Snow'})</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                  <Users size={14} color="var(--color-olive-green)" />
                  <span>Stationed Troop Headcount: <strong style={{ color: '#1B2026' }}>{post.troops} Personnel</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                  <Flame size={14} color="#B78103" />
                  <span>Predicted Daily Fuel Burn: <strong style={{ color: '#B78103', fontFamily: 'var(--font-mono)' }}>{aiData.burnRate} L/day</strong> (Baseline: 80 L/day)</span>
                </div>
              </div>

              <button
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '0.88rem' }}
                onClick={() => onCreateIndent(post)}
              >
                <Zap size={16} /> Trigger Auto-Indent Requisition
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
