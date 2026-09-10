from pathlib import Path

BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"
MODELS_DIR = BASE_DIR / "models"

DATA_DIR.mkdir(exist_ok=True)
MODELS_DIR.mkdir(exist_ok=True)

FEATURES = [
    "temperature",
    "humidity",
    "solar_intensity",
    "fan_speed",
    "heater_status",
    "batch_weight",
    "initial_moisture",
    "elapsed_time",
    "temperature_change",
    "humidity_change",
]

STAGES = ["INITIAL", "ACTIVE_DRYING", "STABILIZING", "NEAR_COMPLETE", "COMPLETE"]

SAFETY_LIMITS = {
    "max_temperature": 60.0,
    "min_temperature": 20.0,
    "max_humidity": 95.0,
    "min_humidity": 10.0,
}
