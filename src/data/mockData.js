// Mock Data for RAKSHAK-Logistics System

export const INITIAL_POSTS = [
  {
    id: "P-01",
    name: "Post Foxtrot-4",
    sector: "Siachen Glacier Sector",
    altitude: "18,400 ft",
    commander: "Maj. R. Sharma",
    troops: 48,
    status: "CRITICAL", // CRITICAL, WARNING, HEALTHY
    stockoutDays: 3,
    weather: { temp: -28, snow: "Heavy", wind: "45 km/h", risk: "HIGH" },
    stock: {
      fuel: { name: "Sub-Zero Kerosene Fuel (SKO)", current: 420, max: 2000, unit: "Liters", burnRate: 140, daysLeft: 3 },
      rations: { name: "MRE Combat Ration Pack", current: 180, max: 1000, unit: "Packs", burnRate: 48, daysLeft: 3.75 },
      energyBars: { name: "High-Altitude Energy & Dry Fruit Bar", current: 120, max: 500, unit: "Boxes", burnRate: 24, daysLeft: 5.0 },
      ammo: { name: "5.56mm Ammunition Crates", current: 8500, max: 15000, unit: "Rounds", burnRate: 200, daysLeft: 42.5 },
      oxygen: { name: "Portable Oxygen Cylinders", current: 15, max: 50, unit: "Cylinders", burnRate: 3, daysLeft: 5.0 }
    },
    dailyLogs: [
      { id: "LOG-109", date: "2026-10-03", fuel: 140, rations: 48, energyBars: 24, ammo: 200, oxygen: 3, troops: 48, temp: -28, patrolKm: 14, heaters: 6 },
      { id: "LOG-108", date: "2026-10-02", fuel: 138, rations: 48, energyBars: 22, ammo: 180, oxygen: 3, troops: 48, temp: -26, patrolKm: 12, heaters: 6 },
      { id: "LOG-107", date: "2026-10-01", fuel: 145, rations: 50, energyBars: 25, ammo: 210, oxygen: 4, troops: 50, temp: -29, patrolKm: 16, heaters: 6 },
      { id: "LOG-106", date: "2026-09-30", fuel: 132, rations: 46, energyBars: 20, ammo: 190, oxygen: 2, troops: 46, temp: -24, patrolKm: 10, heaters: 5 },
      { id: "LOG-105", date: "2026-09-29", fuel: 130, rations: 46, energyBars: 20, ammo: 175, oxygen: 2, troops: 46, temp: -22, patrolKm: 11, heaters: 5 }
    ],
    coords: { x: 38, y: 22 }
  },
  {
    id: "P-02",
    name: "Post Sierra-9",
    sector: "Eastern Ladakh / Chushul",
    altitude: "14,500 ft",
    commander: "Capt. A. Verma",
    troops: 65,
    status: "WARNING",
    stockoutDays: 6,
    weather: { temp: -14, snow: "Moderate", wind: "28 km/h", risk: "MEDIUM" },
    stock: {
      fuel: { name: "Sub-Zero Kerosene Fuel (SKO)", current: 1100, max: 3000, unit: "Liters", burnRate: 180, daysLeft: 6.1 },
      rations: { name: "MRE Combat Ration Pack", current: 520, max: 1500, unit: "Packs", burnRate: 65, daysLeft: 8.0 },
      energyBars: { name: "High-Altitude Energy & Dry Fruit Bar", current: 280, max: 800, unit: "Boxes", burnRate: 32, daysLeft: 8.75 },
      ammo: { name: "5.56mm Ammunition Crates", current: 12000, max: 20000, unit: "Rounds", burnRate: 250, daysLeft: 48.0 },
      oxygen: { name: "Portable Oxygen Cylinders", current: 28, max: 60, unit: "Cylinders", burnRate: 4, daysLeft: 7.0 }
    },
    dailyLogs: [
      { id: "LOG-205", date: "2026-10-03", fuel: 180, rations: 65, energyBars: 32, ammo: 250, oxygen: 4, troops: 65, temp: -14, patrolKm: 18, heaters: 8 },
      { id: "LOG-204", date: "2026-10-02", fuel: 175, rations: 65, energyBars: 30, ammo: 240, oxygen: 4, troops: 65, temp: -12, patrolKm: 16, heaters: 8 },
      { id: "LOG-203", date: "2026-10-01", fuel: 182, rations: 68, energyBars: 34, ammo: 260, oxygen: 5, troops: 68, temp: -15, patrolKm: 20, heaters: 8 }
    ],
    coords: { x: 45, y: 35 }
  },
  {
    id: "P-03",
    name: "Post Kilo-2",
    sector: "Galwan Valley Sector",
    altitude: "15,200 ft",
    commander: "Capt. V. Nair",
    troops: 52,
    status: "CRITICAL",
    stockoutDays: 2,
    weather: { temp: -22, snow: "Severe Storm", wind: "60 km/h", risk: "EXTREME" },
    stock: {
      fuel: { name: "Sub-Zero Kerosene Fuel (SKO)", current: 310, max: 2500, unit: "Liters", burnRate: 155, daysLeft: 2.0 },
      rations: { name: "MRE Combat Ration Pack", current: 210, max: 1200, unit: "Packs", burnRate: 52, daysLeft: 4.0 },
      energyBars: { name: "High-Altitude Energy & Dry Fruit Bar", current: 95, max: 600, unit: "Boxes", burnRate: 26, daysLeft: 3.65 },
      ammo: { name: "5.56mm Ammunition Crates", current: 9800, max: 18000, unit: "Rounds", burnRate: 210, daysLeft: 46.6 },
      oxygen: { name: "Portable Oxygen Cylinders", current: 10, max: 40, unit: "Cylinders", burnRate: 4, daysLeft: 2.5 }
    },
    dailyLogs: [
      { id: "LOG-305", date: "2026-10-03", fuel: 155, rations: 52, energyBars: 26, ammo: 210, oxygen: 4, troops: 52, temp: -22, patrolKm: 12, heaters: 7 },
      { id: "LOG-304", date: "2026-10-02", fuel: 150, rations: 52, energyBars: 25, ammo: 200, oxygen: 4, troops: 52, temp: -20, patrolKm: 10, heaters: 7 }
    ],
    coords: { x: 58, y: 28 }
  },
  {
    id: "P-04",
    name: "Post Alpha-1",
    sector: "Kargil Sector",
    altitude: "11,800 ft",
    commander: "Maj. S. Singh",
    troops: 80,
    status: "HEALTHY",
    stockoutDays: 22,
    weather: { temp: -4, snow: "Clear", wind: "15 km/h", risk: "LOW" },
    stock: {
      fuel: { name: "Sub-Zero Kerosene Fuel (SKO)", current: 3800, max: 5000, unit: "Liters", burnRate: 170, daysLeft: 22.3 },
      rations: { name: "MRE Combat Ration Pack", current: 1760, max: 2400, unit: "Packs", burnRate: 80, daysLeft: 22.0 },
      energyBars: { name: "High-Altitude Energy & Dry Fruit Bar", current: 850, max: 1200, unit: "Boxes", burnRate: 40, daysLeft: 21.25 },
      ammo: { name: "5.56mm Ammunition Crates", current: 28000, max: 35000, unit: "Rounds", burnRate: 300, daysLeft: 93.3 },
      oxygen: { name: "Portable Oxygen Cylinders", current: 45, max: 60, unit: "Cylinders", burnRate: 2, daysLeft: 22.5 }
    },
    coords: { x: 25, y: 48 }
  },
  {
    id: "P-05",
    name: "Post Tango-7",
    sector: "Tawang Sector (Arunachal)",
    altitude: "13,100 ft",
    commander: "Capt. K. Roy",
    troops: 40,
    status: "WARNING",
    stockoutDays: 5,
    weather: { temp: -8, snow: "Light Snow", wind: "20 km/h", risk: "MEDIUM" },
    stock: {
      fuel: { name: "Sub-Zero Kerosene Fuel (SKO)", current: 600, max: 2000, unit: "Liters", burnRate: 120, daysLeft: 5.0 },
      rations: { name: "MRE Combat Ration Pack", current: 400, max: 1000, unit: "Packs", burnRate: 40, daysLeft: 10.0 },
      energyBars: { name: "High-Altitude Energy & Dry Fruit Bar", current: 180, max: 500, unit: "Boxes", burnRate: 20, daysLeft: 9.0 },
      ammo: { name: "5.56mm Ammunition Crates", current: 14000, max: 20000, unit: "Rounds", burnRate: 160, daysLeft: 87.5 },
      oxygen: { name: "Portable Oxygen Cylinders", current: 18, max: 40, unit: "Cylinders", burnRate: 3, daysLeft: 6.0 }
    },
    coords: { x: 78, y: 62 }
  },
  {
    id: "P-06",
    name: "Post Bravo-3",
    sector: "Drass Valley",
    altitude: "10,800 ft",
    commander: "Capt. M. Joshi",
    troops: 60,
    status: "HEALTHY",
    stockoutDays: 18,
    weather: { temp: -6, snow: "Clear", wind: "12 km/h", risk: "LOW" },
    stock: {
      fuel: { name: "Sub-Zero Kerosene Fuel (SKO)", current: 2700, max: 4000, unit: "Liters", burnRate: 150, daysLeft: 18.0 },
      rations: { name: "MRE Combat Ration Pack", current: 1200, max: 1800, unit: "Packs", burnRate: 60, daysLeft: 20.0 },
      energyBars: { name: "High-Altitude Energy & Dry Fruit Bar", current: 600, max: 900, unit: "Boxes", burnRate: 30, daysLeft: 20.0 },
      ammo: { name: "5.56mm Ammunition Crates", current: 22000, max: 30000, unit: "Rounds", burnRate: 220, daysLeft: 100.0 },
      oxygen: { name: "Portable Oxygen Cylinders", current: 35, max: 50, unit: "Cylinders", burnRate: 2, daysLeft: 17.5 }
    },
    coords: { x: 28, y: 42 }
  },
  {
    id: "P-07",
    name: "Post Echo-5",
    sector: "Sub-Sector North (SSN)",
    altitude: "16,800 ft",
    commander: "Maj. P. Deshmukh",
    troops: 35,
    status: "CRITICAL",
    stockoutDays: 1.5,
    weather: { temp: -31, snow: "Blizzard", wind: "70 km/h", risk: "SEVERE" },
    stock: {
      fuel: { name: "Sub-Zero Kerosene Fuel (SKO)", current: 160, max: 1800, unit: "Liters", burnRate: 110, daysLeft: 1.45 },
      rations: { name: "MRE Combat Ration Pack", current: 105, max: 800, unit: "Packs", burnRate: 35, daysLeft: 3.0 },
      energyBars: { name: "High-Altitude Energy & Dry Fruit Bar", current: 40, max: 400, unit: "Boxes", burnRate: 18, daysLeft: 2.2 },
      ammo: { name: "5.56mm Ammunition Crates", current: 7000, max: 12000, unit: "Rounds", burnRate: 140, daysLeft: 50.0 },
      oxygen: { name: "Portable Oxygen Cylinders", current: 6, max: 30, unit: "Cylinders", burnRate: 4, daysLeft: 1.5 }
    },
    coords: { x: 42, y: 15 }
  },
  {
    id: "P-08",
    name: "Post Delta-8",
    sector: "Nathu La Sector (Sikkim)",
    altitude: "14,140 ft",
    commander: "Capt. T. Lepcha",
    troops: 45,
    status: "HEALTHY",
    stockoutDays: 14,
    weather: { temp: -10, snow: "Light Snow", wind: "25 km/h", risk: "LOW" },
    stock: {
      fuel: { name: "Sub-Zero Kerosene Fuel (SKO)", current: 1820, max: 2500, unit: "Liters", burnRate: 130, daysLeft: 14.0 },
      rations: { name: "MRE Combat Ration Pack", current: 675, max: 1000, unit: "Packs", burnRate: 45, daysLeft: 15.0 },
      energyBars: { name: "High-Altitude Energy & Dry Fruit Bar", current: 320, max: 500, unit: "Boxes", burnRate: 22, daysLeft: 14.5 },
      ammo: { name: "5.56mm Ammunition Crates", current: 15000, max: 20000, unit: "Rounds", burnRate: 180, daysLeft: 83.3 },
      oxygen: { name: "Portable Oxygen Cylinders", current: 25, max: 40, unit: "Cylinders", burnRate: 2, daysLeft: 12.5 }
    },
    coords: { x: 70, y: 55 }
  }
];

export const INITIAL_INDENTS = [
  {
    id: "IND-2026-8841",
    postName: "Post Foxtrot-4",
    postId: "P-01",
    generatedBy: "AI Predictive Engine",
    indentType: "AI_GENERATED",
    date: "2026-10-03 08:30",
    item: "Kerosene / Cold Fuel (56-C)",
    quantity: "1,200 Liters",
    urgency: "CRITICAL",
    predictedStockout: "3 Days",
    predictedStockoutDate: "06 Oct 2026",
    suggestedRoute: "Leh ➔ Shyok Bypass ➔ Tangtse ➔ Post Foxtrot-4",
    suggestedVehicle: "Tatra 6x6 Heavy Rig",
    suggestedEta: "5.3 Hours",
    assignedVehicle: "Tatra 6x6 Heavy Rig (LA-02-X-9941)",
    assignedRoute: "Option 1: Primary Safest Reroute (via Shyok Valley)",
    dispatchDate: "2026-10-04 14:00",
    status: "PENDING", // PENDING, APPROVED, REJECTED, DISPATCHED
    reason: "Severe temperature drop (-28°C) expected to spike heating fuel burn rate by 180%."
  },
  {
    id: "IND-2026-8842",
    postName: "Post Kilo-2",
    postId: "P-03",
    generatedBy: "AI Predictive Engine",
    indentType: "AI_GENERATED",
    date: "2026-10-03 09:15",
    item: "High-Altitude Rations (MRE)",
    quantity: "800 Packs",
    urgency: "CRITICAL",
    predictedStockout: "2 Days",
    predictedStockoutDate: "05 Oct 2026",
    suggestedRoute: "Leh ➔ Shyok Bypass ➔ Post Kilo-2",
    suggestedVehicle: "4x4 Logistics Truck",
    suggestedEta: "4.1 Hours",
    assignedVehicle: "4x4 Logistics Truck (LA-02-X-4412)",
    assignedRoute: "Option 1: Primary Safest Reroute",
    dispatchDate: "2026-10-04 15:30",
    status: "PENDING",
    reason: "Road blockade risk on Highway NH-1D threatening standard supply corridor."
  },
  {
    id: "IND-2026-8843",
    postName: "Post Echo-5",
    postId: "P-07",
    generatedBy: "AI Predictive Engine",
    indentType: "AI_GENERATED",
    date: "2026-10-03 07:45",
    item: "Sub-Zero Diesel & Rations",
    quantity: "1,000L Fuel + 500 Rations",
    urgency: "CRITICAL",
    predictedStockout: "1.5 Days",
    predictedStockoutDate: "04 Oct 2026",
    suggestedRoute: "Leh ➔ Air Corridor Sector B-2 ➔ Post Echo-5",
    suggestedVehicle: "Heavy Cargo Drone",
    suggestedEta: "1.4 Hours",
    assignedVehicle: "Heavy Cargo Drone (HLD-800-Alpha)",
    assignedRoute: "Option 3: Air Direct Emergency Drone Corridor",
    dispatchDate: "2026-10-04 11:00",
    status: "PENDING",
    reason: "Blizzard alert triggered emergency stock replenishment order."
  },
  {
    id: "IND-2026-8839",
    postName: "Post Sierra-9",
    postId: "P-02",
    generatedBy: "Capt. V. Sharma (Manual Requisition)",
    indentType: "MANUAL",
    date: "2026-10-02 16:20",
    item: "Winter Clothing & Boots (Spares)",
    quantity: "25 Sets",
    urgency: "WARNING",
    predictedStockout: "6 Days",
    predictedStockoutDate: "09 Oct 2026",
    suggestedRoute: "Leh ➔ Chang La Pass ➔ Post Sierra-9",
    suggestedVehicle: "Tatra 6x6 Heavy Rig",
    suggestedEta: "6.2 Hours",
    assignedVehicle: "Tatra 6x6 Heavy Rig (LA-02-X-9941)",
    assignedRoute: "Option 1: Primary Safest Reroute",
    dispatchDate: "2026-10-05 08:00",
    status: "APPROVED",
    reason: "Troop reinforcement of +15 soldiers arrived at base."
  },
  {
    id: "IND-2026-8835",
    postName: "Post Tango-7",
    postId: "P-05",
    generatedBy: "Capt. K. Roy (Manual Requisition)",
    indentType: "MANUAL",
    date: "2026-10-02 11:10",
    item: "Generator Engine Oil & Filters",
    quantity: "10 Kits",
    urgency: "WARNING",
    predictedStockout: "5 Days",
    predictedStockoutDate: "08 Oct 2026",
    suggestedRoute: "Leh ➔ Tangtse Base ➔ Post Tango-7",
    suggestedVehicle: "4x4 Logistics Truck",
    suggestedEta: "4.8 Hours",
    assignedVehicle: "4x4 Logistics Truck (LA-02-X-4415)",
    assignedRoute: "Option 1: Primary Safest Reroute",
    dispatchDate: "2026-10-05 09:30",
    status: "APPROVED",
    reason: "Scheduled generator preventive maintenance."
  }
];


export const INITIAL_CONVOYS = [
  {
    id: "CNV-4091",
    name: "Thunderbolt Express",
    route: "Leh Depot ➔ Post Sierra-9",
    leader: "Sub. H. Singh",
    vehicle: "Tatra 6x6 Heavy Rig (LA-02-X-9941)",
    transportType: "HEAVY_TRUCK",
    status: "IN_TRANSIT",
    cargo: "1,500L Fuel + 600 Rations",
    cargoQr: "QR-CARGO-CNV4091-S9",
    progressPct: 65,
    eta: "Today 18:30 IST",
    currentCheck: "Checkpoint 3: Chang La Pass (17,590 ft)",
    nextCheck: "Checkpoint 4: Tangtse Post",
    hazardLevel: "MODERATE",
    alerts: ["Light snow at Chang La Pass", "Tire chains mandatory"]
  },
  {
    id: "CNV-4092",
    name: "SkyCourier Drone-4",
    route: "Forward Depot ➔ Post Echo-5",
    leader: "Flight Tech N. Kumar",
    vehicle: "Heavy-Lift Autonomous Drone (HLD-800)",
    transportType: "DRONE",
    status: "DISPATCHED",
    cargo: "Medical Emergency Kits + 150L Emergency Fuel",
    cargoQr: "QR-CARGO-CNV4092-E5",
    progressPct: 30,
    eta: "Today 16:15 IST",
    currentCheck: "Airborne Sector B-2",
    nextCheck: "Post Echo-5 LZ",
    hazardLevel: "HIGH",
    alerts: ["High wind shear at 16,000ft - altitude auto-adjusted"]
  }
];

export const VEHICLES = [
  { id: "V-101", name: "Tatra 6x6 Heavy Rig", plate: "LA-02-X-9941", type: "Tatra 6x6", payload: "10 Tons", subZeroRated: true, status: "ON_MISSION", assignedTo: "CNV-4091" },
  { id: "V-102", name: "4x4 Logistics Truck A", plate: "LA-02-X-4412", type: "4x4 Truck", payload: "3.5 Tons", subZeroRated: true, status: "READY", assignedTo: null },
  { id: "V-103", name: "4x4 Logistics Truck B", plate: "LA-02-X-4415", type: "4x4 Truck", payload: "3.5 Tons", subZeroRated: true, status: "READY", assignedTo: null },
  { id: "V-104", name: "Heavy-Lift Cargo Drone 1", plate: "HLD-800-Alpha", type: "Heavy Drone", payload: "150 kg", subZeroRated: true, status: "ON_MISSION", assignedTo: "CNV-4092" },
  { id: "V-105", name: "Heavy-Lift Cargo Drone 2", plate: "HLD-800-Bravo", type: "Heavy Drone", payload: "150 kg", subZeroRated: true, status: "READY", assignedTo: null },
  { id: "V-106", name: "Mule Transport Team 1", plate: "MULE-SEC-01", type: "Mule Pack", payload: "400 kg", subZeroRated: true, status: "READY", assignedTo: null },
  { id: "V-107", name: "Snowcat Tracked Carrier", plate: "SNW-01-T", type: "Tracked Snowcat", payload: "2 Tons", subZeroRated: true, status: "MAINTENANCE", assignedTo: null }
];
