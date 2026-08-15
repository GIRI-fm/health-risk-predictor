import React from 'react';
import { Zap, Brain } from 'lucide-react';
import { SAMPLE_PRESETS } from '../utils/healthCalculators';
import type { UserHealthData } from '../types/health';

interface HeroBannerProps {
  onSelectPreset: (data: UserHealthData) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onSelectPreset }) => {
  return (
    <section className="relative overflow-hidden rounded-3xl glass-panel border border-indigo-500/20 p-6 md:p-8 mb-8 bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-slate-950">
      
      {/* Subtle Background Glows */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Headline & Value Prop */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Brain className="w-3.5 h-3.5 text-indigo-400" />
            <span>AI-Driven Clinical Risk Prediction Engine</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight tracking-tight">
            Prevent Disease Before It Starts With <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">AI Early Analytics</span>
          </h2>

          <p className="text-slate-300 text-sm md:text-base leading-relaxed">
            Every year, millions develop chronic conditions like <strong className="text-slate-100">Diabetes</strong>, <strong className="text-slate-100">Heart Disease</strong>, and <strong className="text-slate-100">Hypertension</strong> silently. PulseAI uses Machine Learning algorithms to convert your lifestyle & biometrics into actionable health foresight.
          </p>

          {/* Quick Metrics Pills */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
              <div className="text-lg font-bold text-emerald-400">4 Risk Models</div>
              <div className="text-xs text-slate-400">Diabetes, Heart, BP, Obesity</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
              <div className="text-lg font-bold text-indigo-400">0 - 100</div>
              <div className="text-xs text-slate-400">Health Risk Index Score</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
              <div className="text-lg font-bold text-amber-400">XAI Insights</div>
              <div className="text-xs text-slate-400">Feature Impact & Simulation</div>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Sample Preset Cards */}
        <div className="lg:col-span-5 bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Quick Demo Presets
            </span>
            <span className="text-xs text-indigo-400 font-medium">Click to Load Preset</span>
          </div>

          <div className="space-y-2.5">
            {SAMPLE_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => onSelectPreset(preset.data)}
                className="w-full text-left p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/50 transition duration-200 group flex items-center justify-between"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-200 group-hover:text-indigo-300 transition">
                    {preset.name}
                  </div>
                  <div className="text-xs text-slate-400 line-clamp-1">{preset.description}</div>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 text-white transition">
                  Load
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
