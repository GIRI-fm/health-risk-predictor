import React from 'react';
import type { HealthAssessmentResult } from '../../types/health';
import { ShieldCheck, ShieldAlert, AlertTriangle, Activity } from 'lucide-react';

interface ScoreGaugeProps {
  assessment: HealthAssessmentResult;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({ assessment }) => {
  const { overallHealthScore, healthStatus } = assessment;

  const radius = 80;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallHealthScore / 100) * circumference;

  let badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  let Icon = ShieldCheck;

  if (overallHealthScore < 50) {
    badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    Icon = ShieldAlert;
  } else if (overallHealthScore < 80) {
    badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    Icon = AlertTriangle;
  }

  return (
    <div className="glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden text-center">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

      <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
        <Activity className="w-4 h-4 text-indigo-400" />
        Overall Health Risk Index
      </div>

      {/* SVG Radial Arc Dial */}
      <div className="relative w-48 h-48 flex items-center justify-center my-2">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r={radius}
            className="stroke-slate-800"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="url(#scoreGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={overallHealthScore >= 80 ? '#34d399' : overallHealthScore >= 50 ? '#fbbf24' : '#f43f5e'} />
              <stop offset="100%" stopColor={overallHealthScore >= 80 ? '#0d9488' : overallHealthScore >= 50 ? '#f97316' : '#e11d48'} />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Score Text */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold text-white tracking-tight">
            {overallHealthScore}
          </span>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
            out of 100
          </span>
        </div>
      </div>

      {/* Health Status Badge */}
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${badgeColor} mt-2`}>
        <Icon className="w-4 h-4" />
        <span>{healthStatus}</span>
      </div>

      <p className="text-xs text-slate-400 mt-3 max-w-xs leading-relaxed">
        {overallHealthScore >= 80
          ? 'Your overall risk markers are low. Continue maintaining active lifestyle habits.'
          : overallHealthScore >= 50
          ? 'Moderate risk markers detected. Review actionable lifestyle recommendations below.'
          : 'Elevated disease probabilities detected. Medical screening & active habits strongly advised.'}
      </p>
    </div>
  );
};
