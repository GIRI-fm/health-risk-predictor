import type { UserHealthData, HealthAssessmentResult, DiseaseRisk, DiseaseType, FeatureImpact } from '../types/health';
import { calculateBMI, getBMICategory } from './healthCalculators';
import { generateRecommendations } from './recommendations';

const sigmoid = (z: number): number => {
  return 1 / (1 + Math.exp(-z));
};

export const calculateHealthAssessment = (data: UserHealthData): HealthAssessmentResult => {
  const bmi = calculateBMI(data.weight, data.height);
  const bmiCategory = getBMICategory(bmi);

  const age = data.age;
  const sysBP = data.systolicBP || 120;
  const diaBP = data.diastolicBP || 80;
  const heartRate = data.restingHeartRate || 72;
  const exercise = data.exerciseMinsPerDay || 0;
  const sleep = data.sleepHours || 7;
  const diet = data.dietQuality || 5;
  const stress = data.stressLevel || 5;

  const isSmoker = data.smoking === 'regular' ? 1 : data.smoking === 'occasional' ? 0.5 : data.smoking === 'former' ? 0.2 : 0;
  const isAlcohol = data.alcohol === 'heavy' ? 1 : data.alcohol === 'moderate' ? 0.6 : data.alcohol === 'occasional' ? 0.2 : 0;

  // 1. DIABETES RISK MODEL
  const zDiabetes = -4.0 + (0.038 * age) + (0.13 * Math.max(0, bmi - 22)) + (0.012 * Math.max(0, sysBP - 115)) - (0.022 * exercise) - (0.18 * (diet - 5));
  const diabetesProb = Math.min(95, Math.max(5, Math.round(sigmoid(zDiabetes) * 100)));

  // 2. HEART DISEASE RISK MODEL
  const zHeart = -4.8 + (0.052 * age) + (0.022 * Math.max(0, sysBP - 115)) + (0.018 * Math.max(0, heartRate - 65)) + (1.35 * isSmoker) + (0.4 * isAlcohol) + (0.055 * Math.max(0, bmi - 24)) - (0.024 * exercise) + (0.09 * (stress - 5));
  const heartProb = Math.min(96, Math.max(4, Math.round(sigmoid(zHeart) * 100)));

  // 3. HYPERTENSION RISK MODEL
  const zHypertension = -3.8 + (0.042 * (sysBP - 115)) + (0.045 * (diaBP - 75)) + (0.028 * age) + (0.06 * Math.max(0, bmi - 24)) + (0.7 * isSmoker) + (0.1 * (stress - 5)) - (0.018 * exercise);
  const hypertensionProb = Math.min(98, Math.max(3, Math.round(sigmoid(zHypertension) * 100)));

  // 4. OBESITY & METABOLIC RISK MODEL
  const zObesity = -3.6 + (0.24 * (bmi - 23)) - (0.03 * exercise) - (0.22 * (diet - 5)) + (0.18 * Math.max(0, 7 - sleep));
  const obesityProb = Math.min(99, Math.max(2, Math.round(sigmoid(zObesity) * 100)));

  const getRiskLevel = (prob: number): 'Low' | 'Moderate' | 'High' => {
    if (prob < 35) return 'Low';
    if (prob < 65) return 'Moderate';
    return 'High';
  };

  const diseaseRisks: Record<DiseaseType, DiseaseRisk> = {
    diabetes: {
      id: 'diabetes',
      name: 'Type 2 Diabetes',
      probability: diabetesProb,
      level: getRiskLevel(diabetesProb),
      description: 'Probability of insulin resistance and chronic high blood sugar.',
      keyDrivers: [
        bmi > 25 ? `Elevated BMI (${bmi})` : 'Normal BMI',
        exercise < 30 ? 'Low daily exercise' : 'Active lifestyle',
        diet < 6 ? 'Low dietary quality' : 'Healthy diet score',
      ],
    },
    heartDisease: {
      id: 'heartDisease',
      name: 'Heart & Cardiovascular',
      probability: heartProb,
      level: getRiskLevel(heartProb),
      description: 'Likelihood of coronary artery disease, arrhythmia, or vascular events.',
      keyDrivers: [
        sysBP > 130 ? `Elevated Blood Pressure (${sysBP}/${diaBP})` : 'Optimal Blood Pressure',
        isSmoker > 0 ? 'Tobacco consumption factor' : 'Non-smoker status',
        heartRate > 85 ? `Elevated resting HR (${heartRate} bpm)` : 'Resting HR in normal range',
      ],
    },
    hypertension: {
      id: 'hypertension',
      name: 'Hypertension (High BP)',
      probability: hypertensionProb,
      level: getRiskLevel(hypertensionProb),
      description: 'Risk of persistent high arterial blood pressure.',
      keyDrivers: [
        sysBP >= 130 || diaBP >= 85 ? `Current BP readout (${sysBP}/${diaBP} mmHg)` : 'Controlled BP',
        stress >= 7 ? `High stress index (${stress}/10)` : 'Manageable stress levels',
        age > 45 ? `Age factor (${age} yrs)` : 'Younger demographic',
      ],
    },
    obesity: {
      id: 'obesity',
      name: 'Obesity & Metabolic Risk',
      probability: obesityProb,
      level: getRiskLevel(obesityProb),
      description: 'Risk of excessive body fat accumulation and metabolic syndrome.',
      keyDrivers: [
        `BMI of ${bmi} (${bmiCategory})`,
        exercise < 20 ? 'Inadequate weekly aerobic exercise' : 'Good daily exercise',
        sleep < 6 ? 'Sleep deprivation (<6h/night)' : 'Adequate sleep duration',
      ],
    },
  };

  const weightedRiskSum = (heartProb * 0.35) + (diabetesProb * 0.25) + (hypertensionProb * 0.20) + (obesityProb * 0.20);
  const overallHealthScore = Math.min(99, Math.max(5, Math.round(100 - (weightedRiskSum * 0.85))));

  let healthStatus: 'Optimal Healthy' | 'Moderate Risk' | 'High Risk' = 'Optimal Healthy';
  if (overallHealthScore < 50) {
    healthStatus = 'High Risk';
  } else if (overallHealthScore < 80) {
    healthStatus = 'Moderate Risk';
  }

  const featureImpacts: FeatureImpact[] = [];

  if (sysBP > 130) {
    featureImpacts.push({
      feature: 'Blood Pressure',
      impactScore: Math.round((sysBP - 120) * 0.8),
      description: `Elevated blood pressure (${sysBP}/${diaBP} mmHg) increases vascular strain.`,
      category: 'clinical',
    });
  } else if (sysBP < 120) {
    featureImpacts.push({
      feature: 'Blood Pressure',
      impactScore: -12,
      description: 'Optimal blood pressure provides strong cardiovascular protection.',
      category: 'clinical',
    });
  }

  if (bmi >= 25) {
    featureImpacts.push({
      feature: 'Body Mass Index (BMI)',
      impactScore: Math.round((bmi - 24.9) * 2.5),
      description: `BMI of ${bmi} indicates ${bmiCategory}, increasing diabetes and heart disease risk.`,
      category: 'biometric',
    });
  } else {
    featureImpacts.push({
      feature: 'Body Mass Index (BMI)',
      impactScore: -15,
      description: `BMI of ${bmi} is in the optimal healthy range.`,
      category: 'biometric',
    });
  }

  if (exercise >= 30) {
    featureImpacts.push({
      feature: 'Daily Physical Exercise',
      impactScore: -Math.round(Math.min(30, exercise * 0.5)),
      description: `${exercise} mins of daily exercise significantly improves insulin sensitivity & heart health.`,
      category: 'lifestyle',
    });
  } else {
    featureImpacts.push({
      feature: 'Physical Activity Deficit',
      impactScore: Math.round((30 - exercise) * 0.8),
      description: `Only ${exercise} mins of daily activity increases metabolic & heart risks.`,
      category: 'lifestyle',
    });
  }

  if (isSmoker > 0) {
    featureImpacts.push({
      feature: 'Tobacco Usage',
      impactScore: Math.round(isSmoker * 35),
      description: 'Smoking damages arterial walls and substantially raises overall disease probability.',
      category: 'lifestyle',
    });
  }

  if (sleep < 7) {
    featureImpacts.push({
      feature: 'Sleep Duration Deficit',
      impactScore: Math.round((7 - sleep) * 5),
      description: `${sleep} hours of sleep triggers inflammation and metabolic stress.`,
      category: 'lifestyle',
    });
  } else if (sleep >= 7 && sleep <= 9) {
    featureImpacts.push({
      feature: 'Optimal Sleep',
      impactScore: -10,
      description: `${sleep} hours of restful sleep enhances cellular repair and hormone balance.`,
      category: 'lifestyle',
    });
  }

  const recommendations = generateRecommendations(data, diseaseRisks, bmi);

  return {
    overallHealthScore,
    healthStatus,
    bmi,
    bmiCategory,
    diseaseRisks,
    featureImpacts,
    recommendations,
    timestamp: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
  };
};
