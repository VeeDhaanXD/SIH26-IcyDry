import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from config import FEATURES, DATA_DIR


def load_data(path=None):
    if path is None:
        path = DATA_DIR / "training_data.csv"
    df = pd.read_csv(path)
    print(f"Loaded {len(df)} records")
    return df


def preprocess(df, test_size=0.2, random_state=42):
    available = [f for f in FEATURES if f in df.columns]
    X = df[available].values
    y_time = df["remaining_time"].values
    y_stage = df["drying_stage"].values

    X_train, X_test, y_time_train, y_time_test, y_stage_train, y_stage_test = train_test_split(
        X, y_time, y_stage, test_size=test_size, random_state=random_state
    )

    print(f"Train: {X_train.shape[0]} | Test: {X_test.shape[0]} | Features: {len(available)}")

    return {
        "X_train": X_train, "X_test": X_test,
        "y_time_train": y_time_train, "y_time_test": y_time_test,
        "y_stage_train": y_stage_train, "y_stage_test": y_stage_test,
        "feature_names": available,
    }


if __name__ == "__main__":
    df = load_data()
    data = preprocess(df)
    print(f"Features: {data['feature_names']}")
