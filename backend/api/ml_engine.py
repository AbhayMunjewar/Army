import os
import joblib
import pandas as pd
import numpy as np

MODEL_PATH = "d:/Army/rakshak_master_model.joblib"

class RakshakMLEngine:
    _models = None

    @classmethod
    def load_models(cls):
        if cls._models is None:
            if os.path.exists(MODEL_PATH):
                try:
                    cls._models = joblib.load(MODEL_PATH)
                    print(f"✅ RAKSHAK ML Models loaded successfully from {MODEL_PATH}")
                except Exception as e:
                    print(f"⚠️ Failed to load model file: {e}")
                    cls._models = {}
            else:
                print(f"⚠️ Model file not found at {MODEL_PATH}")
                cls._models = {}
        return cls._models

    @classmethod
    def predict_burn_rates(cls, temp_c, apparent_temp_c, snowfall_cm, wind_speed_kmh, troops, patrol_km, alert_level='NORMAL'):
        """Runs the trained XGBoost / Gradient Boosting ML model to predict daily burn rates for all 8 commodities."""
        models = cls.load_models()
        
        # Calculate engineered features matching train_rakshak_model.py
        alert_mult = 1.5 if alert_level == 'HIGH_ALERT' else 2.2 if alert_level == 'TACTICAL_SURGE' else 1.0
        bukharis = int(troops / 4) + 2
        is_winter = 1 if temp_c < 0 else 0
        freeze_factor = max(0, -temp_c) * (bukharis + 1)
        thermal_load = troops * patrol_km * (1 + snowfall_cm * 0.05)
        
        input_df = pd.DataFrame([{
            'Avg_Temp_C': temp_c,
            'Min_Apparent_Temp_C': apparent_temp_c,
            'Total_Snowfall_cm': snowfall_cm,
            'Avg_Wind_Speed_kmh': wind_speed_kmh,
            'Altitude_ft': 15200,
            'Troop_Count': troops,
            'Patrol_Distance_km': patrol_km,
            'Bukhari_Heater_Count': bukharis,
            'Alert_Multiplier': alert_mult,
            'IsWinter': is_winter,
            'Freeze_Factor': freeze_factor,
            'Patrol_Thermal_Load': thermal_load,
            'Fuel_7d_Avg': 380.0,
            'RajmaRice_7d_Avg': troops * 1.0
        }])

        results = {}

        if models and 'Daily_Fuel_Burn_Liters' in models:
            try:
                results['fuel_burn_liters'] = float(models['Daily_Fuel_Burn_Liters'].predict(input_df)[0])
                results['rations_burn_pouches'] = float(models['Daily_Rajma_Rice_Pouches_350g'].predict(input_df)[0])
                results['halwa_burn_pouches'] = float(models['Daily_Suji_Halwa_Pouches_150g'].predict(input_df)[0])
                results['tea_burn_sachets'] = float(models['Daily_Tea_Gur_Premix_Sachets_25g'].predict(input_df)[0])
                results['ammo_burn_rds'] = float(models['Daily_Ammo_Burn_Rds'].predict(input_df)[0])
                results['oxygen_burn_units'] = float(models['Daily_Oxygen_Burn_Units'].predict(input_df)[0])
            except Exception as e:
                print(f"⚠️ ML Model Inference error: {e}")
                results = cls._heuristic_fallback(temp_c, troops, patrol_km, alert_mult)
        else:
            results = cls._heuristic_fallback(temp_c, troops, patrol_km, alert_mult)

        return results

    @staticmethod
    def _heuristic_fallback(temp_c, troops, patrol_km, alert_mult):
        """High-precision heuristic backup if model artifact is unavailable."""
        cold_multiplier = 1.0 + max(0, -temp_c) * 0.035
        fuel_burn = (troops * 4.2 + patrol_km * 2.5) * cold_multiplier * alert_mult
        rations_burn = (troops * 2.5) * cold_multiplier * alert_mult
        halwa_burn = troops * 1.2
        tea_burn = troops * 3.0
        ammo_burn = (troops * 4.0) * alert_mult
        oxygen_burn = max(1.0, (troops * 0.08) * (1.0 + max(0, -temp_c) * 0.02))

        return {
            'fuel_burn_liters': round(fuel_burn, 1),
            'rations_burn_pouches': round(rations_burn, 1),
            'halwa_burn_pouches': round(halwa_burn, 1),
            'tea_burn_sachets': round(tea_burn, 1),
            'ammo_burn_rds': round(ammo_burn, 1),
            'oxygen_burn_units': round(oxygen_burn, 1)
        }
