import type { UserHealthData, Recommendation, DiseaseRisk, DiseaseType } from '../types/health';

export const generateRecommendations = (
  data: UserHealthData,
  diseaseRisks: Record<DiseaseType, DiseaseRisk>,
  bmi: number
): Recommendation[] => {
  const list: Recommendation[] = [];

  if (data.exerciseMinsPerDay < 30) {
    list.push({
      id: 'rec_exercise_boost',
      title: 'Target 150 Mins Moderate Activity Weekly',
      category: 'Exercise',
      priority: data.exerciseMinsPerDay < 15 ? 'High' : 'Medium',
      actionableStep: `Increase daily activity from ${data.exerciseMinsPerDay} mins to at least 30 mins (brisk walking, cycling, or swimming).`,
      expectedImpact: 'Lowers heart disease risk by ~25% and improves insulin sensitivity.',
      iconName: 'Activity',
    });
  } else {
    list.push({
      id: 'rec_exercise_maint',
      title: 'Incorporate Strength Training 2x/Week',
      category: 'Exercise',
      priority: 'Low',
      actionableStep: 'Add resistance exercises (bodyweight, weights, or resistance bands) twice weekly to build lean muscle mass.',
      expectedImpact: 'Boosts baseline resting metabolic rate and bone density.',
      iconName: 'Dumbbell',
    });
  }

  if (bmi >= 25 || diseaseRisks.diabetes.probability >= 40) {
    list.push({
      id: 'rec_nutrition_glycemic',
      title: 'Adopt Low-Glycemic Whole Foods Diet',
      category: 'Nutrition',
      priority: 'High',
      actionableStep: 'Replace refined carbohydrates (white bread, sugary sodas, snacks) with complex fiber (quinoa, oats, legumes, green vegetables).',
      expectedImpact: 'Prevents blood sugar spikes and lowers diabetes probability by ~30%.',
      iconName: 'Utensils',
    });
  }

  if (data.dietQuality <= 5) {
    list.push({
      id: 'rec_nutrition_mediterranean',
      title: 'Increase Dietary Fiber & Healthy Fats',
      category: 'Nutrition',
      priority: 'Medium',
      actionableStep: 'Consume 30g+ of dietary fiber daily and incorporate omega-3 rich foods (olive oil, walnuts, flaxseeds, salmon).',
      expectedImpact: 'Reduces LDL cholesterol and arterial inflammation.',
      iconName: 'Apple',
    });
  }

  if (data.systolicBP >= 130 || diseaseRisks.hypertension.probability >= 50) {
    list.push({
      id: 'rec_bp_dash',
      title: 'Follow DASH Sodium Reduction Protocol',
      category: 'Nutrition',
      priority: 'High',
      actionableStep: 'Limit daily sodium intake to under 2,000 mg and boost potassium-rich foods (bananas, spinach, avocados).',
      expectedImpact: 'Can reduce systolic blood pressure by 8–14 mmHg within 4 weeks.',
      iconName: 'HeartPulse',
    });
  }

  if (data.sleepHours < 7) {
    list.push({
      id: 'rec_sleep_hygiene',
      title: 'Optimize Sleep Duration (7-8 Hours)',
      category: 'Sleep & Mind',
      priority: data.sleepHours < 6 ? 'High' : 'Medium',
      actionableStep: `Extend sleep schedule from ${data.sleepHours} hrs to 7-8 hrs. Maintain consistent sleep-wake times and avoid screens 1 hour before bedtime.`,
      expectedImpact: 'Regulates cortisol and hunger hormones (ghrelin/leptin).',
      iconName: 'Moon',
    });
  }

  if (data.stressLevel >= 7) {
    list.push({
      id: 'rec_stress_mgmt',
      title: 'Practice Daily Stress Reduction Techniques',
      category: 'Sleep & Mind',
      priority: 'Medium',
      actionableStep: 'Dedicate 10-15 minutes daily to mindfulness meditation, deep breathing exercises (4-7-8 method), or yoga.',
      expectedImpact: 'Lowers sympathetic nervous system activation and resting heart rate.',
      iconName: 'Brain',
    });
  }

  if (data.smoking !== 'never') {
    list.push({
      id: 'rec_smoking_cessation',
      title: 'Initiate Tobacco Cessation Program',
      category: 'Medical Screening',
      priority: 'High',
      actionableStep: 'Consult a healthcare provider for nicotine replacement therapy or cessation behavioral counseling.',
      expectedImpact: 'Cuts cardiovascular event risk by 50% within 1 year of quitting.',
      iconName: 'Flame',
    });
  }

  if (diseaseRisks.heartDisease.probability >= 50 || diseaseRisks.diabetes.probability >= 50 || data.systolicBP >= 140) {
    list.push({
      id: 'rec_medical_checkup',
      title: 'Schedule Comprehensive Clinical Health Panel',
      category: 'Medical Screening',
      priority: 'High',
      actionableStep: 'Schedule a blood test panel including HbA1c (blood sugar), Lipid Profile (cholesterol), and renal function tests.',
      expectedImpact: 'Enables early clinical intervention before organ complications arise.',
      iconName: 'Stethoscope',
    });
  }

  return list;
};
