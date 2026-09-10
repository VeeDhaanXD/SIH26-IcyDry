import joblib
import numpy as np
from pathlib import Path
from config import MODELS_DIR, FEATURES

_time_model = None
_state_model = None


def _load_time():
    global _time_model
    if _time_model is None:
        path = MODELS_DIR / "drying_time_model.joblib"
        if not path.exists():
            raise FileNotFoundError(f"Time model not found at {path}. Run train.py first.")
        _time_model = joblib.load(path)
    return _time_model


def _load_state():
    global _state_model
    if _state_model is None:
        path = MODELS_DIR / "drying_state_model.joblib"
        if not path.exists():
            raise FileNotFoundError(f"State model not found at {path}. Run train.py first.")
        _state_model = joblib.load(path)
    return _state_model


def predict(features: dict) -> dict:
    time_data = _load_time()
    state_data = _load_state()

    x = np.array([[features.get(f, 0) for f in FEATURES]])

    remaining = float(time_data["model"].predict(x)[0])
    remaining = max(0, round(remaining, 1))

    stage = state_data["model"].predict(x)[0]
    probs = state_data["model"].predict_proba(x)[0]
    confidence = round(float(max(probs)), 2)

    tree_preds = np.array([t.predict(x)[0] for t in time_data["model"].estimators_])
    std = tree_preds.std()
    time_confidence = round(max(0.5, min(0.99, 1.0 - std / 60)), 2)

    return {
        "remainingTime": remaining,
        "dryingStage": str(stage),
        "confidence": confidence,
        "timeConfidence": time_confidence,
        "modelMAE": time_data["metrics"]["MAE"],
    }
