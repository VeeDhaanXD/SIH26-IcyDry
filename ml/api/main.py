import sys
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime

sys.path.insert(0, str(__import__('pathlib').Path(__file__).parent.parent))

from predict import predict
from recommendation_engine import generate_recommendations, analyze_trends, safety_check

app = FastAPI(title="IcyDry ML API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SensorInput(BaseModel):
    temperature: float
    humidity: float
    solarIntensity: float = 720.0
    fanSpeed: int = 50
    heaterStatus: bool = True
    batchWeight: float = 1.5
    initialMoisture: float = 28.0
    elapsedTime: float = 0.0
    temperatureChange: float = 0.0
    humidityChange: float = 0.0


def _build_features(r: SensorInput) -> dict:
    return {
        "temperature": r.temperature,
        "humidity": r.humidity,
        "solar_intensity": r.solarIntensity,
        "fan_speed": r.fanSpeed,
        "heater_status": 1 if r.heaterStatus else 0,
        "batch_weight": r.batchWeight,
        "initial_moisture": r.initialMoisture,
        "elapsed_time": r.elapsedTime,
        "temperature_change": r.temperatureChange,
        "humidity_change": r.humidityChange,
    }


@app.get("/api/health")
async def health():
    return {"status": "ok", "timestamp": datetime.now().isoformat(), "service": "icydry-ml"}


@app.post("/api/predict")
async def api_predict(reading: SensorInput):
    features = _build_features(reading)
    result = predict(features)
    return result


@app.post("/api/recommendations")
async def api_recommendations(reading: SensorInput):
    features = _build_features(reading)
    result = predict(features)

    current_data = {
        "temperature": reading.temperature,
        "humidity": reading.humidity,
        "fan_speed": reading.fanSpeed,
        "heater_status": 1 if reading.heaterStatus else 0,
        "current_moisture": reading.initialMoisture,
    }
    trends = {"temp_trend": "stable", "hum_trend": "stable", "moisture_trend": "stable"}
    result["stage"] = result["dryingStage"]

    recs = generate_recommendations(current_data, trends, result)
    violations = safety_check(current_data)

    return {
        "prediction": result,
        "recommendations": recs,
        "safetyViolations": violations,
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
