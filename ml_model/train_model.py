"""
AI Health Risk Predictor - Scikit-Learn Model Training Script
Trains Machine Learning Classifiers (RandomForest & Logistic Regression) on Health Datasets
and outputs accuracy metrics and model weight coefficients.
"""

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, roc_auc_score
import json
import os

def generate_synthetic_health_dataset(n_samples=2500, seed=42):
    np.random.seed(seed)
    
    age = np.random.randint(18, 80, n_samples)
    bmi = np.random.normal(27.0, 6.0, n_samples).clip(15, 50)
    exercise_mins = np.random.exponential(30, n_samples).clip(0, 150)
    sleep_hrs = np.random.normal(7.0, 1.2, n_samples).clip(4, 11)
    systolic_bp = np.random.normal(128, 20, n_samples).clip(90, 200)
    diastolic_bp = np.random.normal(82, 14, n_samples).clip(60, 130)
    resting_hr = np.random.normal(72, 10, n_samples).clip(45, 110)
    smoking = np.random.choice([0, 0.5, 1.0], size=n_samples, p=[0.6, 0.2, 0.2])
    alcohol = np.random.choice([0, 0.3, 0.7, 1.0], size=n_samples, p=[0.4, 0.3, 0.2, 0.1])
    diet_quality = np.random.randint(1, 11, n_samples)
    stress_level = np.random.randint(1, 11, n_samples)

    # Label generation based on risk thresholds
    p_diabetes = 1 / (1 + np.exp(-(-3.2 + 0.035*age + 0.12*np.maximum(0, bmi-22) - 0.02*exercise_mins - 0.15*(diet_quality-5))))
    y_diabetes = (np.random.rand(n_samples) < p_diabetes).astype(int)

    p_heart = 1 / (1 + np.exp(-(-3.8 + 0.045*age + 0.02*np.maximum(0, systolic_bp-115) + 1.1*smoking + 0.04*(bmi-24) - 0.02*exercise_mins)))
    y_heart = (np.random.rand(n_samples) < p_heart).astype(int)

    p_hyp = 1 / (1 + np.exp(-(-2.8 + 0.035*(systolic_bp-115) + 0.035*(diastolic_bp-75) + 0.02*age - 0.015*exercise_mins + 0.5*smoking)))
    y_hyp = (np.random.rand(n_samples) < p_hyp).astype(int)

    df = pd.DataFrame({
        'age': age,
        'bmi': bmi,
        'exercise_mins': exercise_mins,
        'sleep_hrs': sleep_hrs,
        'systolic_bp': systolic_bp,
        'diastolic_bp': diastolic_bp,
        'resting_hr': resting_hr,
        'smoking': smoking,
        'alcohol': alcohol,
        'diet_quality': diet_quality,
        'stress_level': stress_level,
        'target_diabetes': y_diabetes,
        'target_heart': y_heart,
        'target_hypertension': y_hyp
    })
    return df

def train_and_evaluate():
    print("[INFO] Training AI Health Risk Predictor Machine Learning Models...")
    df = generate_synthetic_health_dataset()
    
    features = ['age', 'bmi', 'exercise_mins', 'sleep_hrs', 'systolic_bp', 'diastolic_bp', 'resting_hr', 'smoking', 'alcohol', 'diet_quality', 'stress_level']
    X = df[features]
    
    results = {}
    targets = {
        'Diabetes': 'target_diabetes',
        'Heart Disease': 'target_heart',
        'Hypertension': 'target_hypertension'
    }

    for name, target_col in targets.items():
        y = df[target_col]
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

        # Train Random Forest Classifier
        rf = RandomForestClassifier(n_estimators=100, max_depth=6, random_state=42)
        rf.fit(X_train, y_train)
        
        y_pred = rf.predict(X_test)
        y_proba = rf.predict_proba(X_test)[:, 1]
        
        acc = accuracy_score(y_test, y_pred)
        auc = roc_auc_score(y_test, y_proba)
        
        importances = dict(zip(features, [round(float(val), 4) for val in rf.feature_importances_]))
        
        results[name] = {
            "Accuracy": round(float(acc), 4),
            "ROC_AUC": round(float(auc), 4),
            "Top_Feature_Importances": importances
        }
        
        print(f"[MODEL] [{name}]: Accuracy = {acc*100:.2f}%, ROC-AUC = {auc:.4f}")

    os.makedirs('ml_model', exist_ok=True)
    with open('ml_model/model_metrics.json', 'w') as f:
        json.dump(results, f, indent=2)
    print("[SUCCESS] ML Model Training Completed! Metrics saved to ml_model/model_metrics.json")

if __name__ == '__main__':
    train_and_evaluate()
