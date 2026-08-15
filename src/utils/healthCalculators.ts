import type { PresetProfile } from '../types/health';

export const calculateBMI = (weightKg: number, heightCm: number): number => {
  if (!heightCm || heightCm <= 0 || !weightKg || weightKg <= 0) return 0;
  const heightMeters = heightCm / 100;
  const bmi = weightKg / (heightMeters * heightMeters);
  return Math.round(bmi * 10) / 10;
};

export const getBMICategory = (bmi: number): 'Underweight' | 'Normal' | 'Overweight' | 'Obese Class I' | 'Severe Obesity' => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  if (bmi < 35) return 'Obese Class I';
  return 'Severe Obesity';
};

export const getBmiColor = (bmi: number): string => {
  if (bmi < 18.5) return 'text-amber-400';
  if (bmi < 25) return 'text-emerald-400';
  if (bmi < 30) return 'text-amber-400';
  if (bmi < 35) return 'text-orange-500';
  return 'text-rose-500';
};

export const getBPMetrices = (systolic: number, diastolic: number) => {
  if (systolic >= 180 || diastolic >= 120) {
    return { category: 'Hypertensive Crisis', severity: 'Critical', color: 'text-rose-600 bg-rose-500/10 border-rose-500/30' };
  }
  if (systolic >= 140 || diastolic >= 90) {
    return { category: 'Stage 2 Hypertension', severity: 'High Risk', color: 'text-rose-500 bg-rose-500/10 border-rose-500/30' };
  }
  if (systolic >= 130 || diastolic >= 80) {
    return { category: 'Stage 1 Hypertension', severity: 'Moderate Risk', color: 'text-amber-500 bg-amber-500/10 border-amber-500/30' };
  }
  if (systolic >= 120 && diastolic < 80) {
    return { category: 'Elevated BP', severity: 'Low Risk', color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30' };
  }
  return { category: 'Normal BP', severity: 'Optimal', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
};

export const SAMPLE_PRESETS: PresetProfile[] = [
  {
    name: '🏅 Active Athlete',
    description: 'Regular physical exercise, balanced diet, optimal blood pressure and sleep.',
    data: {
      age: 26,
      gender: 'male',
      weight: 70,
      height: 178,
      exerciseMinsPerDay: 50,
      sleepHours: 8,
      smoking: 'never',
      alcohol: 'occasional',
      restingHeartRate: 58,
      systolicBP: 115,
      diastolicBP: 75,
      dietQuality: 9,
      stressLevel: 3,
    },
  },
  {
    name: '💻 Office Professional',
    description: 'Moderate screen time, limited daily exercise, occasional elevated stress.',
    data: {
      age: 38,
      gender: 'female',
      weight: 76,
      height: 165,
      exerciseMinsPerDay: 15,
      sleepHours: 6.5,
      smoking: 'never',
      alcohol: 'occasional',
      restingHeartRate: 74,
      systolicBP: 126,
      diastolicBP: 82,
      dietQuality: 5,
      stressLevel: 7,
    },
  },
  {
    name: '⚠️ High Risk Profile',
    description: 'Elevated BMI, high blood pressure, low exercise, smoking, and sleep deficit.',
    data: {
      age: 54,
      gender: 'male',
      weight: 98,
      height: 172,
      exerciseMinsPerDay: 5,
      sleepHours: 5.5,
      smoking: 'regular',
      alcohol: 'moderate',
      restingHeartRate: 86,
      systolicBP: 142,
      diastolicBP: 92,
      dietQuality: 3,
      stressLevel: 8,
    },
  },
];
