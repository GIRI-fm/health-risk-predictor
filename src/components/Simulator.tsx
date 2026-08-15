import React, { useState } from 'react';
import type { UserHealthData, HealthAssessmentResult } from '../types/health';
import { calculateHealthAssessment } from '../utils/riskEngine';
import { Sparkles, TrendingDown, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SimulatorProps {
  currentData: UserHealthData;
  currentAssessment: HealthAssessmentResult;
}

export const Simulator: React.FC<SimulatorProps> = ({ currentData, currentAssessment }) => {
  const [simExerciseBonus, setSimExerciseBonus] = useState<number>(20);
  const [simSleepBonus, setSimSleepBonus] = useState<number>(1.5);
  const [simQuitSmoking, setSimQuitSmoking] = useState<boolean>(true);
  const [simBpReduction, setSimBpReduction] = useState<number>(10);

  const simulatedData: UserHealthData = {
    ...currentData,
    exerciseMinsPerDay: Math.min(120, currentData.exerciseMinsPerDay + simExerciseBonus),
    sleepHours: Math.min(10, currentData.sleepHours + simSleepBonus),
    smoking: simQuitSmoking && currentData.smoking !== 'never' ? 'former' : currentData.smoking,
    systolicBP: Math.max(105, currentData.systolicBP - simBpReduction),
    diastolicBP: Math.max(65, currentData.diastolicBP - Math.round(simBpReduction * 0.6)),
    dietQuality: Math.min(10, currentData.dietQuality + 2),
  };

  const simulatedAssessment = calculateHealthAssessment(simulatedData);
  const scoreDiff = simulatedAssessment.overallHealthScore - currentAssessment.overallHealthScore;
  const isImproved = scoreDiff > 0;

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#34d399', '#818cf8', '#fbbf24'],
    });
  };

  return (
    <div className="glass-panel rounded-3xl p-6 md:p-8 border border-indigo-500/20 space-y-6 relative overflow-hidden bg-gradient-to-br from-indigo-950/20 via-slate-900/60 to-slate-950">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Interactive Health Forecasting
          </div>
          <h3 className="text-xl font-bold text-white">"What-If" Lifestyle Risk Simulator</h3>
          <p className="text-xs text-slate-400">Simulate positive habits and preview real-time disease probability reduction.</p>
        </div>

        {/* Dynamic Delta Badge */}
        <div className="flex items-center gap-3 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
          <div className="text-right">
            <div className="text-[11px] text-slate-400">Simulated Health Score</div>
            <div className="text-2xl font-extrabold text-emerald-400 flex items-center gap-1">
              {simulatedAssessment.overallHealthScore}
              {isImproved && <span className="text-xs text-emerald-400 font-bold">(+{scoreDiff})</span>}
            </div>
          </div>

          <button
            onClick={triggerCelebration}
            className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold transition shadow-lg shadow-emerald-500/20 flex items-center gap-1 text-xs"
            title="Celebrate Simulated Improvement"
          >
            <Award className="w-4 h-4" />
            <span>Celebrate</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-4 bg-slate-900/50 p-5 rounded-2xl border border-slate-800">
          
          {/* Exercise Slider */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
              <span>Add Daily Exercise</span>
              <span className="text-emerald-400 font-bold">+{simExerciseBonus} mins/day</span>
            </div>
            <input
              type="range"
              min={0}
              max={60}
              step={5}
              value={simExerciseBonus}
              onChange={(e) => setSimExerciseBonus(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Sleep Slider */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
              <span>Improve Daily Sleep</span>
              <span className="text-indigo-400 font-bold">+{simSleepBonus} hrs/night</span>
            </div>
            <input
              type="range"
              min={0}
              max={3}
              step={0.5}
              value={simSleepBonus}
              onChange={(e) => setSimSleepBonus(Number(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Blood Pressure Improvement */}
          <div>
            <div className="flex justify-between text-xs text-slate-300 font-medium mb-1">
              <span>Lower Systolic BP</span>
              <span className="text-teal-400 font-bold">-{simBpReduction} mmHg</span>
            </div>
            <input
              type="range"
              min={0}
              max={25}
              step={5}
              value={simBpReduction}
              onChange={(e) => setSimBpReduction(Number(e.target.value))}
              className="w-full accent-teal-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Tobacco Cessation Checkbox */}
          {currentData.smoking !== 'never' && (
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-xs font-semibold text-slate-200">Simulate Quitting Smoking</span>
              <input
                type="checkbox"
                checked={simQuitSmoking}
                onChange={(e) => setSimQuitSmoking(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
            </div>
          )}

        </div>

        {/* Comparison Grid */}
        <div className="lg:col-span-6 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <TrendingDown className="w-4 h-4 text-emerald-400" />
            Projected Disease Risk Drop
          </h4>

          <div className="grid grid-cols-2 gap-3">
            {(['diabetes', 'heartDisease', 'hypertension', 'obesity'] as const).map((diseaseKey) => {
              const currentProb = currentAssessment.diseaseRisks[diseaseKey].probability;
              const simProb = simulatedAssessment.diseaseRisks[diseaseKey].probability;
              const drop = currentProb - simProb;

              return (
                <div key={diseaseKey} className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                  <div className="text-xs font-bold text-slate-300 capitalize">
                    {currentAssessment.diseaseRisks[diseaseKey].name}
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs line-through text-slate-500">{currentProb}%</span>
                      <span className="text-lg font-extrabold text-emerald-400">{simProb}%</span>
                    </div>

                    {drop > 0 && (
                      <span className="text-[11px] font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                        -{drop}% Risk
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
