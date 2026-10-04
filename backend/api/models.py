from django.db import models
from django.utils import timezone
import json

class Outpost(models.Model):
    STATUS_CHOICES = (
        ('HEALTHY', 'Healthy (> 7 Days Stock)'),
        ('WARNING', 'Warning (4-7 Days Stock)'),
        ('CRITICAL', 'Critical (<= 3 Days Stock)'),
    )

    post_id = models.CharField(max_length=50, unique=True, primary_key=True)
    name = models.CharField(max_length=150)
    sector = models.CharField(max_length=150)
    altitude_ft = models.IntegerField(default=14000)
    troops = models.IntegerField(default=45)
    patrol_distance_km = models.FloatField(default=12.5)
    heaters_count = models.IntegerField(default=12)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='HEALTHY')
    stockout_days = models.FloatField(default=14.0)

    # Stock Sub-Zero Kerosene Fuel (SKO)
    fuel_current = models.FloatField(default=2400.0)
    fuel_max = models.FloatField(default=5000.0)
    fuel_burn_rate = models.FloatField(default=220.0)

    # Stock Rations MRE
    rations_current = models.FloatField(default=1800.0)
    rations_max = models.FloatField(default=3500.0)
    rations_burn_rate = models.FloatField(default=135.0)

    # Energy & Dry Fruits
    energy_bars_current = models.FloatField(default=450.0)
    energy_bars_max = models.FloatField(default=1000.0)
    energy_bars_burn_rate = models.FloatField(default=45.0)

    # Ammunition
    ammo_current = models.FloatField(default=12000.0)
    ammo_max = models.FloatField(default=25000.0)
    ammo_burn_rate = models.FloatField(default=250.0)

    # Portable Oxygen
    oxygen_current = models.FloatField(default=40.0)
    oxygen_max = models.FloatField(default=100.0)
    oxygen_burn_rate = models.FloatField(default=3.0)

    # Weather Parameters
    temp_c = models.FloatField(default=-22.0)
    snowfall_cm = models.FloatField(default=5.0)
    wind_speed_kmh = models.FloatField(default=28.0)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.post_id}) - {self.status}"


class InventoryLog(models.Model):
    post = models.ForeignKey(Outpost, on_delete=models.CASCADE, related_name='logs')
    date = models.DateField(default=timezone.now)
    temp_c = models.FloatField(default=-22.0)
    troops_count = models.IntegerField(default=45)
    patrol_distance_km = models.FloatField(default=12.5)
    
    fuel_burned_liters = models.FloatField()
    rations_burned_pouches = models.FloatField()
    energy_bars_burned = models.FloatField(default=0)
    ammo_burned_rds = models.FloatField(default=0)
    oxygen_burned_units = models.FloatField(default=0)
    
    logged_by_role = models.CharField(max_length=50, default='POST_COMMANDER')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Log for {self.post.name} on {self.date}"


class RequisitionIndent(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending Approval'),
        ('APPROVED', 'Approved by Depot'),
        ('DISPATCHED', 'Dispatched'),
        ('DELIVERED', 'Delivered'),
        ('REJECTED', 'Rejected'),
    )
    URGENCY_CHOICES = (
        ('CRITICAL', 'Critical'),
        ('HIGH', 'High'),
        ('NORMAL', 'Normal'),
    )

    indent_id = models.CharField(max_length=100, unique=True, primary_key=True)
    post_name = models.CharField(max_length=150)
    post_id = models.CharField(max_length=50)
    generated_by = models.CharField(max_length=100, default='AI Predictive Engine')
    date_created = models.DateTimeField(auto_now_add=True)
    
    item = models.CharField(max_length=200, default='Kerosene / Cold Fuel (56-C)')
    quantity = models.CharField(max_length=100, default='1,500 Liters')
    urgency = models.CharField(max_length=20, choices=URGENCY_CHOICES, default='CRITICAL')
    predicted_stockout = models.CharField(max_length=50, default='3.5 Days')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    reason = models.TextField()

    def __str__(self):
        return f"{self.indent_id} - {self.post_name} ({self.status})"


class Convoy(models.Model):
    convoy_id = models.CharField(max_length=50, unique=True, primary_key=True)
    name = models.CharField(max_length=150)
    origin = models.CharField(max_length=150, default='Leh Central Supply Depot')
    destination = models.CharField(max_length=150)
    driver_name = models.CharField(max_length=150, default='Subedar R. Singh')
    driver_rank = models.CharField(max_length=50, default='Subedar')
    vehicle_number = models.CharField(max_length=50, default='ALS-7749')
    escort_unit = models.CharField(max_length=150, default='14 Corp Tactical Escort')
    
    cargo_manifest_json = models.TextField(default='[]')
    status = models.CharField(max_length=50, default='PRE_DEPARTURE')
    eta_hours = models.FloatField(default=6.5)
    
    checkpoints_json = models.TextField(default='[]')
    completed_checkpoints = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def set_cargo(self, cargo_list):
        self.cargo_manifest_json = json.dumps(cargo_list)

    def get_cargo(self):
        return json.loads(self.cargo_manifest_json) if self.cargo_manifest_json else []

    def set_checkpoints(self, cp_list):
        self.checkpoints_json = json.dumps(cp_list)

    def get_checkpoints(self):
        return json.loads(self.checkpoints_json) if self.checkpoints_json else []

    def __str__(self):
        return f"{self.convoy_id} ({self.name}) -> {self.destination}"


class CheckpointScan(models.Model):
    scan_id = models.CharField(max_length=100, unique=True, primary_key=True)
    convoy_id = models.CharField(max_length=50)
    checkpoint_name = models.CharField(max_length=150)
    scan_type = models.CharField(max_length=50) # 'CHECKPOINT_SAFE' or 'CARGO_INTAKE'
    scanned_by_role = models.CharField(max_length=50) # 'CONVOY_LEADER' or 'POST_COMMANDER'
    timestamp = models.DateTimeField(auto_now_add=True)
    
    payload_hash = models.CharField(max_length=128)
    hmac_signature = models.CharField(max_length=128)
    validated = models.BooleanField(default=True)

    def __str__(self):
        return f"Scan {self.scan_id} - {self.checkpoint_name} ({self.scan_type})"


class AuditLog(models.Model):
    log_id = models.AutoField(primary_key=True)
    event_type = models.CharField(max_length=100)
    user_role = models.CharField(max_length=50)
    description = models.TextField()
    previous_hash = models.CharField(max_length=128, default='0'*64)
    current_hash = models.CharField(max_length=128)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Audit #{self.log_id}: {self.event_type} by {self.user_role}"
