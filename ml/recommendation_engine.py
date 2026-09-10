from config import SAFETY_LIMITS


def analyze_trends(sensor_history):
    if not sensor_history or len(sensor_history) < 2:
        return {"temp_trend": "stable", "hum_trend": "stable", "moisture_trend": "stable"}

    recent = sensor_history[-5:]
    older = sensor_history[-10:-5] if len(sensor_history) >= 10 else sensor_history[:5]

    def trend(values):
        if len(values) < 2:
            return "stable"
        avg = sum(values) / len(values)
        last = values[-1]
        diff = last - avg
        if diff > 1.5:
            return "rising"
        elif diff < -1.5:
            return "falling"
        return "stable"

    return {
        "temp_trend": trend([r.get("temperature", 0) for r in recent]),
        "hum_trend": trend([r.get("humidity", 0) for r in recent]),
        "moisture_trend": trend([r.get("current_moisture", 0) for r in recent]),
    }


def generate_recommendations(current_data, trends, prediction=None):
    recommendations = []
    temp = current_data.get("temperature", 40)
    humidity = current_data.get("humidity", 60)
    fan_speed = current_data.get("fan_speed", 50)
    heater_on = current_data.get("heater_status", 0)
    moisture = current_data.get("current_moisture", 30)
    remaining = prediction.get("remaining_minutes", 0) if prediction else None
    stage = prediction.get("stage", "UNKNOWN") if prediction else "UNKNOWN"

    limits = SAFETY_LIMITS

    if temp > limits["max_temperature"]:
        recommendations.append({
            "priority": "critical",
            "type": "safety",
            "action": "Reduce temperature immediately",
            "detail": f"Temperature {temp}°C exceeds safety limit of {limits['max_temperature']}°C",
            "param": "temperature",
        })
    elif temp > limits["max_temperature"] - 5:
        recommendations.append({
            "priority": "warning",
            "type": "safety",
            "action": "Reduce heater power",
            "detail": f"Temperature approaching safety limit ({temp}°C)",
            "param": "heater_power",
        })

    if humidity < limits["min_humidity"]:
        recommendations.append({
            "priority": "warning",
            "type": "safety",
            "action": "Increase humidity — risk of overdrying",
            "detail": f"Humidity {humidity}% is below minimum {limits['min_humidity']}%",
            "param": "humidity",
        })

    if temp < 35 and heater_on:
        recommendations.append({
            "priority": "medium",
            "type": "efficiency",
            "action": "Increase heater power",
            "detail": f"Temperature {temp}°C is below optimal drying range (35-50°C)",
            "param": "heater_power",
        })

    if trends.get("hum_trend") == "stable" and humidity > 50 and stage in ("ACTIVE_DRYING", "INITIAL"):
        recommendations.append({
            "priority": "medium",
            "type": "efficiency",
            "action": "Increase fan speed to accelerate moisture removal",
            "detail": f"Humidity stable at {humidity}% — airflow may be insufficient",
            "param": "fan_speed",
        })

    if trends.get("temp_trend") == "rising" and temp > 48:
        recommendations.append({
            "priority": "medium",
            "type": "efficiency",
            "action": "Temperature rising above optimal — reduce heater or increase ventilation",
            "detail": f"Temp trending upward at {temp}°C",
            "param": "temperature",
        })

    if trends.get("moisture_trend") == "stable" and stage == "ACTIVE_DRYING" and moisture > 15:
        recommendations.append({
            "priority": "low",
            "type": "efficiency",
            "action": "Moisture loss stalled — consider increasing temperature or airflow",
            "detail": f"Moisture stuck at {moisture:.1f}%",
            "param": "general",
        })

    if remaining is not None and remaining < 15 and stage != "COMPLETE":
        recommendations.append({
            "priority": "info",
            "type": "status",
            "action": f"Batch nearly complete — ~{remaining:.0f} minutes remaining",
            "detail": "Prepare for batch completion",
            "param": "general",
        })

    if stage == "COMPLETE":
        recommendations.append({
            "priority": "info",
            "type": "status",
            "action": "Drying complete — batch ready for packaging",
            "detail": f"Final moisture: {moisture:.1f}%",
            "param": "general",
        })

    if not recommendations:
        recommendations.append({
            "priority": "info",
            "type": "status",
            "action": "System operating within normal parameters",
            "detail": "No action required",
            "param": "general",
        })

    return sorted(recommendations, key=lambda r: {"critical": 0, "warning": 1, "medium": 2, "low": 3, "info": 4}.get(r["priority"], 5))


def safety_check(data):
    violations = []
    limits = SAFETY_LIMITS

    if data.get("temperature", 0) > limits["max_temperature"]:
        violations.append({"param": "heater_status", "action": "OFF", "reason": "Over-temperature"})
        violations.append({"param": "fan_speed", "action": "100", "reason": "Cooling required"})

    if data.get("humidity", 0) > limits["max_humidity"]:
        violations.append({"param": "fan_speed", "action": "100", "reason": "Dehumidify"})

    return violations
