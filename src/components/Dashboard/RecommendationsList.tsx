import React from 'react';
import type { Recommendation } from '../../types/health';
import { Sparkles, Activity, Dumbbell, Utensils, Moon, HeartPulse, Stethoscope, Flame, Apple, Brain, CheckCircle } from 'lucide-react';

interface RecommendationsListProps {
  recommendations: Recommendation[];
}

export const RecommendationsList: React.FC<RecommendationsListProps> = ({ recommendations }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Activity':
        return Activity;
      case 'Dumbbell':
        return Dumbbell;
      case 'Utensils':
        return Utensils;
      case 'Apple':
        return Apple;
      case 'Moon':
        return Moon;
      case 'Brain':
        return Brain;
      case 'HeartPulse':
        return HeartPulse;
      case 'Stethoscope':
        return Stethoscope;
      case 'Flame':
        return Flame;
      default:
        return Sparkles;
    }
  };

  const getPriorityStyle = (priority: 'High' | 'Medium' | 'Low') => {
    switch (priority) {
      case 'High':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'Medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Low':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            Personalized Preventive Action Plan
          </h3>
          <p className="text-xs text-slate-400">Tailored medical & lifestyle recommendations to reduce disease probability.</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          {recommendations.length} Action Items
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {recommendations.map((rec) => {
          const IconComp = getIcon(rec.iconName);
          const priorityBadge = getPriorityStyle(rec.priority);

          return (
            <div
              key={rec.id}
              className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800/90 hover:border-emerald-500/40 transition space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {rec.category}
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityBadge}`}>
                    {rec.priority} Priority
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white leading-snug">{rec.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{rec.actionableStep}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 mt-2 flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{rec.expectedImpact}</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
