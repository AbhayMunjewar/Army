from django.core.management.base import BaseCommand
from api.models import Outpost, RequisitionIndent, Convoy, AuditLog
from api.security import compute_audit_hash
from django.utils import timezone
import json

class Command(BaseCommand):
    help = 'Seeds initial military outposts, indents, convoys, and security audit logs into RAKSHAK database.'

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding RAKSHAK Military Supply Chain Database...")

        # 1. Clear existing records
        Outpost.objects.all().delete()
        RequisitionIndent.objects.all().delete()
        Convoy.objects.all().delete()
        AuditLog.objects.all().delete()

        # 2. Seed Initial Military Outposts
        outposts_data = [
            {
                "post_id": "P-KILO2",
                "name": "Post Kilo-2 (Galwan Valley)",
                "sector": "Northern Ladakh / LAC",
                "altitude_ft": 15200,
                "troops": 55,
                "patrol_distance_km": 18.5,
                "heaters_count": 15,
                "status": "CRITICAL",
                "stockout_days": 2.5,
                "fuel_current": 550.0, "fuel_max": 5000.0, "fuel_burn_rate": 220.0,
                "rations_current": 420.0, "rations_max": 3500.0, "rations_burn_rate": 137.0,
                "ammo_current": 4500.0, "ammo_max": 25000.0, "ammo_burn_rate": 250.0,
                "oxygen_current": 12.0, "oxygen_max": 100.0, "oxygen_burn_rate": 3.5,
                "temp_c": -26.5, "snowfall_cm": 14.2, "wind_speed_kmh": 42.0
            },
            {
                "post_id": "P-ECHO5",
                "name": "Post Echo-5 (Siachen Glacier)",
                "sector": "Siachen Glacier / NJ9842",
                "altitude_ft": 18800,
                "troops": 42,
                "patrol_distance_km": 12.0,
                "heaters_count": 12,
                "status": "CRITICAL",
                "stockout_days": 3.1,
                "fuel_current": 720.0, "fuel_max": 4000.0, "fuel_burn_rate": 230.0,
                "rations_current": 600.0, "rations_max": 3000.0, "rations_burn_rate": 105.0,
                "ammo_current": 8000.0, "ammo_max": 20000.0, "ammo_burn_rate": 180.0,
                "oxygen_current": 8.0, "oxygen_max": 80.0, "oxygen_burn_rate": 4.0,
                "temp_c": -32.0, "snowfall_cm": 22.0, "wind_speed_kmh": 55.0
            },
            {
                "post_id": "P-ALPHA1",
                "name": "Post Alpha-1 (Daulat Beg Oldi)",
                "sector": "Sub-Sector North (DBO)",
                "altitude_ft": 16700,
                "troops": 68,
                "patrol_distance_km": 24.0,
                "heaters_count": 18,
                "status": "WARNING",
                "stockout_days": 5.8,
                "fuel_current": 1800.0, "fuel_max": 6000.0, "fuel_burn_rate": 310.0,
                "rations_current": 1200.0, "rations_max": 4500.0, "rations_burn_rate": 170.0,
                "ammo_current": 15000.0, "ammo_max": 30000.0, "ammo_burn_rate": 300.0,
                "oxygen_current": 25.0, "oxygen_max": 120.0, "oxygen_burn_rate": 4.5,
                "temp_c": -21.0, "snowfall_cm": 8.0, "wind_speed_kmh": 30.0
            },
            {
                "post_id": "P-BRAVO3",
                "name": "Post Bravo-3 (Pangong Tso)",
                "sector": "Chushul-Pangong Sector",
                "altitude_ft": 14200,
                "troops": 38,
                "patrol_distance_km": 15.0,
                "heaters_count": 10,
                "status": "HEALTHY",
                "stockout_days": 11.2,
                "fuel_current": 2200.0, "fuel_max": 4000.0, "fuel_burn_rate": 160.0,
                "rations_current": 1900.0, "rations_max": 3000.0, "rations_burn_rate": 95.0,
                "ammo_current": 12000.0, "ammo_max": 20000.0, "ammo_burn_rate": 150.0,
                "oxygen_current": 35.0, "oxygen_max": 60.0, "oxygen_burn_rate": 2.0,
                "temp_c": -15.0, "snowfall_cm": 2.0, "wind_speed_kmh": 18.0
            },
            {
                "post_id": "P-CHARLIE7",
                "name": "Post Charlie-7 (Demchok)",
                "sector": "Eastern Ladakh",
                "altitude_ft": 13800,
                "troops": 45,
                "patrol_distance_km": 16.0,
                "heaters_count": 11,
                "status": "HEALTHY",
                "stockout_days": 14.5,
                "fuel_current": 2800.0, "fuel_max": 4500.0, "fuel_burn_rate": 180.0,
                "rations_current": 2100.0, "rations_max": 3200.0, "rations_burn_rate": 112.0,
                "ammo_current": 14000.0, "ammo_max": 22000.0, "ammo_burn_rate": 200.0,
                "oxygen_current": 40.0, "oxygen_max": 80.0, "oxygen_burn_rate": 2.2,
                "temp_c": -12.0, "snowfall_cm": 0.0, "wind_speed_kmh": 15.0
            }
        ]

        for p_data in outposts_data:
            Outpost.objects.create(**p_data)
        self.stdout.write(self.style.SUCCESS(f"[+] Created {len(outposts_data)} Military Outposts."))

        # 3. Seed Initial Requisition Indents
        indents_data = [
            {
                "indent_id": "IND-2026-1042",
                "post_name": "Post Kilo-2 (Galwan Valley)",
                "post_id": "P-KILO2",
                "generated_by": "AI Predictive Engine (XGBoost)",
                "item": "Sub-Zero Kerosene Fuel (SKO 56-C) + MRE Rations",
                "quantity": "1,500 Liters Fuel + 400 MRE Pouches",
                "urgency": "CRITICAL",
                "predicted_stockout": "2.5 Days",
                "status": "PENDING",
                "reason": "Automated stockout prevention requisition. Predicted stockout in 2.5 days due to sub-zero temperature surge (-26.5°C)."
            },
            {
                "indent_id": "IND-2026-1043",
                "post_name": "Post Echo-5 (Siachen Glacier)",
                "post_id": "P-ECHO5",
                "generated_by": "AI Predictive Engine (XGBoost)",
                "item": "Portable Oxygen Cylinders + High-Energy Bars",
                "quantity": "20 Oxygen Cylinders + 250 Bar Boxes",
                "urgency": "CRITICAL",
                "predicted_stockout": "3.1 Days",
                "status": "APPROVED",
                "reason": "Extreme altitude oxygen depletion warning. Temperature dropped to -32°C with 22cm snowfall."
            }
        ]

        for i_data in indents_data:
            RequisitionIndent.objects.create(**i_data)
        self.stdout.write(self.style.SUCCESS(f"[+] Created {len(indents_data)} Initial Requisitions."))

        # 4. Seed Initial Convoy
        cargo_items = [
            {"id": "CRG-SKO-01", "name": "Sub-Zero Kerosene Fuel (SKO 56-C)", "qty": 1500, "unit": "Liters", "seal": "SEAL-SKO-9912", "scanned": True},
            {"id": "CRG-MRE-02", "name": "MRE Rajma-Rice Pouches (350g)", "qty": 400, "unit": "Pouches", "seal": "SEAL-MRE-4410", "scanned": True},
            {"id": "CRG-BAR-03", "name": "High-Altitude Energy Bars", "qty": 100, "unit": "Boxes", "seal": "SEAL-BAR-2201", "scanned": True},
            {"id": "CRG-AMO-04", "name": "5.56mm Ammunition Crates", "qty": 2000, "unit": "Rounds", "seal": "SEAL-AMO-8833", "scanned": True},
            {"id": "CRG-OXY-05", "name": "Portable Medical Oxygen Cylinders", "qty": 10, "unit": "Cylinders", "seal": "SEAL-OXY-1102", "scanned": True}
        ]

        checkpoints = [
            {"id": "CP-1", "name": "Leh Central Supply Depot", "status": "COMPLETED", "timestamp": "06:30 IST", "verified": True},
            {"id": "CP-2", "name": "Khardung La Pass (17,582 ft)", "status": "COMPLETED", "timestamp": "09:45 IST", "verified": True},
            {"id": "CP-3", "name": "North Pullu Checkpoint", "status": "IN_PROGRESS", "timestamp": "11:20 IST", "verified": False},
            {"id": "CP-4", "name": "Tangtse Logistics Hub", "status": "PENDING", "timestamp": "Estimated 14:00 IST", "verified": False},
            {"id": "CP-5", "name": "Post Kilo-2 (Galwan Valley)", "status": "PENDING", "timestamp": "Estimated 16:30 IST", "verified": False}
        ]

        convoy = Convoy.objects.create(
            convoy_id="CNV-2026-001",
            name="Operation Rakshak Supply Convoy Alpha-7",
            origin="Leh Central Supply Depot",
            destination="Post Kilo-2 (Galwan Valley)",
            driver_name="Subedar R. Singh",
            driver_rank="Subedar",
            vehicle_number="ALS-7749",
            escort_unit="14 Corp Tactical Escort",
            cargo_manifest_json=json.dumps(cargo_items),
            checkpoints_json=json.dumps(checkpoints),
            status="IN_TRANSIT",
            eta_hours=4.5,
            completed_checkpoints=2
        )
        self.stdout.write(self.style.SUCCESS(f"[+] Created Initial Convoy {convoy.convoy_id}."))

        # 5. Seed Initial Audit Log Chain
        ts_now = timezone.now().isoformat()
        h1 = compute_audit_hash("0"*64, "SYSTEM_INITIALIZED", "SYSTEM", "RAKSHAK Military Backend System Started.", ts_now)
        AuditLog.objects.create(
            event_type="SYSTEM_INITIALIZED",
            user_role="SYSTEM",
            description="RAKSHAK Military Backend System Started.",
            previous_hash="0"*64,
            current_hash=h1
        )
        self.stdout.write(self.style.SUCCESS("[+] Created Audit Log Genesis Record."))

        self.stdout.write(self.style.SUCCESS("RAKSHAK Database Seeding Complete!"))
