import joblib
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score, classification_report, accuracy_score
from preprocessing import load_data, preprocess
from config import MODELS_DIR, FEATURES


def train_time_model():
    print("Training Drying Time Model (Random Forest)")
    print("=" * 55)

    df = load_data()
    data = preprocess(df)

    X_train, X_test = data["X_train"], data["X_test"]
    y_train, y_test = data["y_time_train"], data["y_time_test"]
    feature_names = data["feature_names"]

    model = RandomForestRegressor(
        n_estimators=200, max_depth=15, min_samples_split=5,
        min_samples_leaf=2, random_state=42, n_jobs=-1
    )
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)

    print(f"\n  MAE:  {mae:.2f} min")
    print(f"  RMSE: {rmse:.2f} min")
    print(f"  R²:   {r2:.4f}")

    importances = model.feature_importances_
    feat_imp = sorted(zip(feature_names, importances), key=lambda x: x[1], reverse=True)
    print(f"\nFeature importances:")
    for feat, imp in feat_imp:
        print(f"  {feat:25s} {imp:.4f}")

    fig, axes = plt.subplots(1, 2, figsize=(14, 5))

    axes[0].scatter(y_test, y_pred, alpha=0.3, s=10)
    axes[0].plot([y_test.min(), y_test.max()], [y_test.min(), y_test.max()], "r--", lw=2)
    axes[0].set_xlabel("Actual Remaining Time (min)")
    axes[0].set_ylabel("Predicted Remaining Time (min)")
    axes[0].set_title(f"Actual vs Predicted | MAE={mae:.2f} | R²={r2:.4f}")
    axes[0].grid(True, alpha=0.3)

    sorted_imp = sorted(zip(feature_names, importances), key=lambda x: x[1])
    axes[1].barh([f[0] for f in sorted_imp], [f[1] for f in sorted_imp])
    axes[1].set_xlabel("Importance")
    axes[1].set_title("Feature Importances")
    axes[1].grid(True, alpha=0.3)

    plt.tight_layout()
    plot_path = MODELS_DIR / "time_model_evaluation.png"
    plt.savefig(plot_path, dpi=150)
    plt.close()
    print(f"\nSaved evaluation plot to {plot_path}")

    model_path = MODELS_DIR / "drying_time_model.joblib"
    joblib.dump({"model": model, "features": feature_names, "metrics": {"MAE": mae, "RMSE": rmse, "R2": r2}}, model_path)
    print(f"Saved model to {model_path}")

    return {"model": model, "features": feature_names, "metrics": {"MAE": mae, "RMSE": rmse, "R2": r2}}


def train_state_model():
    print("\nTraining Drying State Model (Random Forest)")
    print("=" * 55)

    df = load_data()
    data = preprocess(df)

    X_train, X_test = data["X_train"], data["X_test"]
    y_train, y_test = data["y_stage_train"], data["y_stage_test"]
    feature_names = data["feature_names"]

    model = RandomForestClassifier(
        n_estimators=200, max_depth=15, min_samples_split=5,
        min_samples_leaf=2, random_state=42, n_jobs=-1
    )
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)

    acc = accuracy_score(y_test, y_pred)
    print(f"\n  Accuracy: {acc:.4f}")
    print(f"\n{classification_report(y_test, y_pred, zero_division=0)}")

    model_path = MODELS_DIR / "drying_state_model.joblib"
    joblib.dump({"model": model, "features": feature_names, "classes": list(model.classes_)}, model_path)
    print(f"Saved model to {model_path}")

    return {"model": model, "features": feature_names, "accuracy": acc}


if __name__ == "__main__":
    time_result = train_time_model()
    state_result = train_state_model()
    print(f"\nDone. Time MAE: {time_result['metrics']['MAE']:.2f} min | State Acc: {state_result['accuracy']:.4f}")
