const API_BASE_URL = 'http://127.0.0.1:8000/api';

/**
 * RAKSHAK Django REST API Service Layer
 */
export const apiService = {
  // 1. Fetch Backend System Status
  async getSystemStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/status/`);
      if (!response.ok) throw new Error('Backend status fetch failed');
      return await response.json();
    } catch (err) {
      console.warn('Django backend offline, using local state mode:', err);
      return null;
    }
  },

  // 2. Fetch All Outposts
  async fetchOutposts() {
    try {
      const response = await fetch(`${API_BASE_URL}/outposts/`);
      if (!response.ok) throw new Error('Outposts fetch failed');
      return await response.json();
    } catch (err) {
      return null;
    }
  },

  // 3. Post Commander Consumption Logger -> Django Backend
  async logConsumption(postData) {
    try {
      const response = await fetch(`${API_BASE_URL}/consumption/log/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Military-Role': 'POST_COMMANDER'
        },
        body: JSON.stringify(postData)
      });
      if (!response.ok) throw new Error('Log consumption failed');
      return await response.json();
    } catch (err) {
      console.warn('Django log consumption fallback to local state:', err);
      return null;
    }
  },

  // 4. Run ML Prediction Model
  async predictStockoutRisk(params) {
    try {
      const response = await fetch(`${API_BASE_URL}/predict/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!response.ok) throw new Error('Prediction API failed');
      return await response.json();
    } catch (err) {
      return null;
    }
  },

  // 5. Dijkstra Route Optimizer -> Django Backend
  async calculateDijkstraRoute(origin, destination, blockedNodes = []) {
    try {
      const response = await fetch(`${API_BASE_URL}/route/optimize/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Military-Role': 'DEPOT_OFFICER'
        },
        body: JSON.stringify({ origin, destination, blocked_nodes: blockedNodes })
      });
      if (!response.ok) throw new Error('Route optimization failed');
      return await response.json();
    } catch (err) {
      return null;
    }
  },

  // 6. QR Verification (AES-256 + HMAC-SHA256)
  async verifyQRScan(scanData) {
    try {
      const response = await fetch(`${API_BASE_URL}/qr/verify/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Military-Role': scanData.scanned_by_role || 'CONVOY_LEADER'
        },
        body: JSON.stringify(scanData)
      });
      if (!response.ok) throw new Error('QR verify failed');
      return await response.json();
    } catch (err) {
      return null;
    }
  },

  // 7. Immutable Audit Logs
  async fetchAuditLogs() {
    try {
      const response = await fetch(`${API_BASE_URL}/audit/logs/`);
      if (!response.ok) throw new Error('Audit logs fetch failed');
      return await response.json();
    } catch (err) {
      return null;
    }
  }
};
