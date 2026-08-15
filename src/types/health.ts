export type Gender = 'male' | 'female' | 'other';
export type SmokingStatus = 'never' | 'former' | 'occasional' | 'regular';
export type AlcoholStatus = 'none' | 'occasional' | 'moderate' | 'heavy';

export interface UserHealthData {
  age: number;
  gender: Gender;
  weight: number; // in kg
  height: number; // in cm
  exerciseMinsPerDay: number;
  sleepHours: number;
  smoking: SmokingStatus;
  alcohol: AlcoholStatus;
  restingHeartRate: number; // bpm
  systolicBP: number; // mmHg
  diastolicBP: number; // mmHg
  dietQuality: number; // 1-10 scale
  stressLevel: number; // 1-10 scale
}

export type DiseaseType = 'diabetes' | 'heartDisease' | 'obesity' | 'hypertension';

export interface DiseaseRisk {
  id: DiseaseType;
  name: string;
  probability: number; // 0 - 100 percentage
  level: 'Low' | 'Moderate' | 'High';
  description: string;
  keyDrivers: string[];
}

export interface FeatureImpact {
  feature: string;
  impactScore: number; // positive = increases risk, negative = lowers risk
  description: string;
  category: 'lifestyle' | 'biometric' | 'clinical';
}

export interface Recommendation {
  id: string;
  title: string;
  category: 'Nutrition' | 'Exercise' | 'Sleep & Mind' | 'Medical Screening';
  priority: 'High' | 'Medium' | 'Low';
  actionableStep: string;
  expectedImpact: string;
  iconName: string;
}

export interface HealthAssessmentResult {
  overallHealthScore: number; // 0 - 100 (100 is optimal)
  healthStatus: 'Optimal Healthy' | 'Moderate Risk' | 'High Risk';
  bmi: number;
  bmiCategory: 'Underweight' | 'Normal' | 'Overweight' | 'Obese Class I' | 'Severe Obesity';
  diseaseRisks: Record<DiseaseType, DiseaseRisk>;
  featureImpacts: FeatureImpact[];
  recommendations: Recommendation[];
  timestamp: string;
}

export interface PresetProfile {
  name: string;
  description: string;
  data: UserHealthData;
}
