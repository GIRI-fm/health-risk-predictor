"""
Vercel Serverless Function for AI Health Risk Prediction API
Endpoint: POST /api/predict
"""

from http.server import BaseHTTPRequestHandler
import json
import math

def calculate_sigmoid(z):
    return 1 / (1 + math.exp(-z))

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data.decode('utf-8'))
            
            age = float(data.get('age', 30))
            weight = float(data.get('weight', 70))
            height = float(data.get('height', 170))
            exercise = float(data.get('exerciseMinsPerDay', 20))
            sys_bp = float(data.get('systolicBP', 120))
            dia_bp = float(data.get('diastolicBP', 80))
            heart_rate = float(data.get('restingHeartRate', 72))
            smoking = 1.0 if data.get('smoking') == 'regular' else (0.5 if data.get('smoking') == 'occasional' else 0)
            
            bmi = round(weight / ((height / 100) ** 2), 1)
            
            # Risk models
            z_diabetes = -4.0 + (0.038 * age) + (0.13 * max(0, bmi - 22)) + (0.012 * max(0, sys_bp - 115)) - (0.022 * exercise)
            diabetes_prob = min(95, max(5, int(calculate_sigmoid(z_diabetes) * 100)))
            
            z_heart = -4.8 + (0.052 * age) + (0.022 * max(0, sys_bp - 115)) + (0.018 * max(0, heart_rate - 65)) + (1.35 * smoking) + (0.055 * max(0, bmi - 24)) - (0.024 * exercise)
            heart_prob = min(96, max(4, int(calculate_sigmoid(z_heart) * 100)))
            
            z_hypertension = -3.8 + (0.042 * (sys_bp - 115)) + (0.045 * (dia_bp - 75)) + (0.028 * age) + (0.06 * max(0, bmi - 24)) - (0.018 * exercise)
            hypertension_prob = min(98, max(3, int(calculate_sigmoid(z_hypertension) * 100)))
            
            z_obesity = -3.6 + (0.24 * (bmi - 23)) - (0.03 * exercise)
            obesity_prob = min(99, max(2, int(calculate_sigmoid(z_obesity) * 100)))
            
            weighted_risk = (heart_prob * 0.35) + (diabetes_prob * 0.25) + (hypertension_prob * 0.20) + (obesity_prob * 0.20)
            overall_score = min(99, max(5, int(100 - (weighted_risk * 0.85))))
            
            response_payload = {
                "status": "success",
                "bmi": bmi,
                "overallHealthScore": overall_score,
                "risks": {
                    "diabetes": diabetes_prob,
                    "heartDisease": heart_prob,
                    "hypertension": hypertension_prob,
                    "obesity": obesity_prob
                }
            }
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response_payload).encode('utf-8'))
            
        except Exception as e:
            self.send_response(400)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
