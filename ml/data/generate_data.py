import numpy as np
import pandas as pd
from pathlib import Path

DATA_DIR = Path(__file__).parent
OUTPUT = DATA_DIR / "training_data.csv"


def drying_curve(initial_moisture, target, duration_min, k=0.012, noise=0.8):
    n_steps = duration_min // 5
    moisture = initial_moisture
    records = []

    temp = 30.0 + np.random.uniform(-2, 2)
    humidity = 75.0 + np.random.uniform(-3, 3)
    fan_speed = 50
    heater_on = True

    for i in range(n_steps + 1):
        elapsed = i * 5
        frac = elapsed / max(duration_min, 1)

        if elapsed < 15:
            fan_speed = int(40 + elapsed * 2)
        elif humidity > 65:
            fan_speed = 85
        elif humidity > 45:
            fan_speed = 70
        else:
            fan_speed = 55

        if temp < 42:
            heater_on = True
        elif temp > 48:
            heater_on = False
        elif humidity > 60:
            heater_on = True

        solar = max(0, 750 * np.sin(np.pi * frac) + np.random.normal(0, 30))

        rate = k * max(0, (temp - 25) / 25) * max(0, (100 - humidity) / 80) * (0.7 + 0.3 * fan_speed / 100)
        if heater_on:
            rate *= 1.1
        moisture_loss = moisture * rate * 5
        moisture = max(0, moisture - moisture_loss)

        temp += (solar * 0.004 + (45 - temp) * 0.03 + (0.08 * 60 if heater_on else -0.3) - fan_speed * 0.018)
        temp += np.random.normal(0, noise * 0.3)
        temp = np.clip(temp, 25, 58)

        humidity += (moisture - humidity) * 0.04
        humidity += np.random.normal(0, noise * 0.5)
        humidity = np.clip(humidity, 18, 90)

        temp_change = temp - (records[-1]["temperature"] if records else temp)
        hum_change = humidity - (records[-1]["humidity"] if records else humidity)

        remaining = max(0, duration_min - elapsed)

        if moisture <= target + 1:
            stage = "COMPLETE"
        elif moisture <= target + 5:
            stage = "NEAR_COMPLETE"
        elif frac > 0.55:
            stage = "STABILIZING"
        elif elapsed > 8:
            stage = "ACTIVE_DRYING"
        else:
            stage = "INITIAL"

        records.append({
            "temperature": round(temp + np.random.normal(0, 0.3), 1),
            "humidity": round(humidity + np.random.normal(0, 0.5), 1),
            "solar_intensity": round(solar, 0),
            "fan_speed": int(np.clip(fan_speed + np.random.randint(-2, 3), 0, 100)),
            "heater_status": 1 if heater_on else 0,
            "batch_weight": 0,
            "initial_moisture": initial_moisture,
            "elapsed_time": elapsed,
            "temperature_change": round(temp_change + np.random.normal(0, 0.2), 2),
            "humidity_change": round(hum_change + np.random.normal(0, 0.3), 2),
            "remaining_time": remaining,
            "drying_stage": stage,
        })

    return records


def generate_dataset(n_batches=200):
    all_records = []

    for i in range(n_batches):
        init_m = np.random.uniform(25, 40)
        target = np.random.uniform(6, 10)
        duration = int(np.random.uniform(180, 360))
        weight = round(np.random.uniform(1.0, 3.0), 1)
        k = np.random.uniform(0.008, 0.016)

        records = drying_curve(init_m, target, duration, k)
        for r in records:
            r["batch_weight"] = weight

        all_records.extend(records)

        if (i + 1) % 50 == 0:
            print(f"  Generated {i+1}/{n_batches} batches")

    df = pd.DataFrame(all_records)
    df.to_csv(OUTPUT, index=False)
    print(f"\nSaved {len(df)} records from {n_batches} batches to {OUTPUT}")
    return df


if __name__ == "__main__":
    print("IcyDry — Data Generator")
    print("=" * 50)
    df = generate_dataset(200)
    print(f"\nShape: {df.shape}")
    print(f"\nStage distribution:\n{df['drying_stage'].value_counts()}")
    print(f"\nRemaining time range: {df['remaining_time'].min():.0f} - {df['remaining_time'].max():.0f} min")
