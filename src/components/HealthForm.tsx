import React from 'react';
import type { UserHealthData, Gender, SmokingStatus, AlcoholStatus } from '../types/health';
import { calculateBMI, getBMICategory, getBmiColor, getBPMetrices } from '../utils/healthCalculators';
import { Heart, User, Dumbbell, Sliders } from 'lucide-react';

interface HealthFormProps {
  data: UserHealthData;
  onChange: (newData: UserHealthData) => void;
}

export const HealthForm: React.FC<HealthFormProps> = ({ data, onChange }) => {
  const bmi = calculateBMI(data.weight, data.height);
  const bmiCat = getBMICategory(bmi);
  const bpInfo = getBPMetrices(data.systolicBP, data.diastolicBP);

  const handleNumChange = (field: keyof UserHealthData, val: number) => {
    onChange({
      ...data,
      [field]: val,
    });
  };

  const handleSelectChange = (field: keyof UserHealthData, val: string) => {
    onChange({
      ...data,
      [field]: val,
    });
  };

  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8 space-y-6 border border-slate-800">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            Health & Lifestyle Parameters
          </h3>
          <p className="text-xs text-slate-400">Enter your biometrics and daily habits to compute your risk profile.</p>
        </div>

        {/* Live BMI Pill */}
        <div className="text-right">
          <div className="text-xs text-slate-400 font-medium">Calculated BMI</div>
          <div className="flex items-center gap-2">
            <span className={`text-xl font-extrabold ${getBmiColor(bmi)}`}>{bmi}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {bmiCat}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* SECTION 1: DEMOGRAPHICS */}
        <div className="space-y-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <User className="w-4 h-4" />
            Demographics & Body
          </h4>

          {/* Age */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
              <span>Age (Years)</span>
              <span className="text-indigo-400 font-bold">{data.age} yrs</span>
            </div>
            <input
              type="range"
              min={18}
              max={95}
              value={data.age}
              onChange={(e) => handleNumChange('age', Number(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="text-xs text-slate-300 font-medium mb-1 block">Biological Gender</label>
            <div className="grid grid-cols-2 gap-2">
              {(['male', 'female'] as Gender[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => handleSelectChange('gender', g)}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold capitalize border transition ${
                    data.gender === g
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Weight & Height */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-300 font-medium mb-1 block">Weight (kg)</label>
              <input
                type="number"
                min={30}
                max={250}
                value={data.weight}
                onChange={(e) => handleNumChange('weight', Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-1.5 px-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 font-medium mb-1 block">Height (cm)</label>
              <input
                type="number"
                min={120}
                max={230}
                value={data.height}
                onChange={(e) => handleNumChange('height', Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-1.5 px-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: CLINICAL VITALS */}
        <div className="space-y-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80">
          <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
            <Heart className="w-4 h-4" />
            Clinical Vitals
          </h4>

          {/* Blood Pressure */}
          <div>
            <div className="flex justify-between items-center text-xs text-slate-300 font-medium mb-1">
              <span>Blood Pressure (mmHg)</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${bpInfo.color}`}>
                {bpInfo.category}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-400">Systolic (Top)</span>
                <input
                  type="number"
                  min={80}
                  max={220}
                  value={data.systolicBP}
                  onChange={(e) => handleNumChange('systolicBP', Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg py-1.5 px-3 text-sm text-white focus:outline-none focus:border-teal-500"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Diastolic (Bottom)</span>
                <input
                  type="number"
                  min={50}
                  max={140}
                  value={data.diastolicBP}
                  onChange={(e) => handleNumChange('diastolicBP', Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg py-1.5 px-3 text-sm text-white focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>
          </div>

          {/* Resting Heart Rate */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
              <span>Resting Heart Rate</span>
              <span className="text-teal-400 font-bold">{data.restingHeartRate} bpm</span>
            </div>
            <input
              type="range"
              min={45}
              max={120}
              value={data.restingHeartRate}
              onChange={(e) => handleNumChange('restingHeartRate', Number(e.target.value))}
              className="w-full accent-teal-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Stress Level */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
              <span>Daily Stress Index (1-10)</span>
              <span className="text-amber-400 font-bold">{data.stressLevel} / 10</span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={data.stressLevel}
              onChange={(e) => handleNumChange('stressLevel', Number(e.target.value))}
              className="w-full accent-amber-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* SECTION 3: LIFESTYLE HABITS */}
        <div className="space-y-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80 md:col-span-2 lg:col-span-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Dumbbell className="w-4 h-4" />
            Daily Lifestyle & Habits
          </h4>

          {/* Exercise Mins */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
              <span>Daily Exercise</span>
              <span className="text-emerald-400 font-bold">{data.exerciseMinsPerDay} mins/day</span>
            </div>
            <input
              type="range"
              min={0}
              max={120}
              step={5}
              value={data.exerciseMinsPerDay}
              onChange={(e) => handleNumChange('exerciseMinsPerDay', Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Sleep Hours */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
              <span>Average Sleep</span>
              <span className="text-indigo-400 font-bold">{data.sleepHours} hrs/night</span>
            </div>
            <input
              type="range"
              min={4}
              max={12}
              step={0.5}
              value={data.sleepHours}
              onChange={(e) => handleNumChange('sleepHours', Number(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Smoking & Alcohol */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-300 font-medium mb-1 block">Smoking Habit</label>
              <select
                value={data.smoking}
                onChange={(e) => handleSelectChange('smoking', e.target.value as SmokingStatus)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-1.5 px-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="never">Never</option>
                <option value="former">Former Smoker</option>
                <option value="occasional">Occasional</option>
                <option value="regular">Regular Smoker</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium mb-1 block">Alcohol Intake</label>
              <select
                value={data.alcohol}
                onChange={(e) => handleSelectChange('alcohol', e.target.value as AlcoholStatus)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-1.5 px-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="none">None</option>
                <option value="occasional">Occasional</option>
                <option value="moderate">Moderate</option>
                <option value="heavy">Heavy</option>
              </select>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
