import React from 'react';
import type { DiseaseRisk, DiseaseType } from '../../types/health';
import { Heart, Activity, Scale, ShieldAlert, AlertCircle, CheckCircle2 } from 'lucide-react';

interface DiseaseRiskCardsProps {
  risks: Record<DiseaseType, DiseaseRisk>;
}

export const DiseaseRiskCards: React.FC<DiseaseRiskCardsProps> = ({ risks }) => {
  const diseaseList = Object.values(risks);

  const getIcon = (id: DiseaseType) => {
    switch (id) {
      case 'diabetes':
        return Activity;
      case 'heartDisease':
        return Heart;
      case 'hypertension':
        return ShieldAlert;
      case 'obesity':
        return Scale;
      default:
        return Activity;
    }
  };

  const getLevelStyle = (level: 'Low' | 'Moderate' | 'High') => {
    switch (level) {
      case 'Low':
        return {
          badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          bar: 'bg-gradient-to-r from-emerald-500 to-teal-400',
          Icon: CheckCircle2,
        };
      case 'Moderate':
        return {
          badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          bar: 'bg-gradient-to-r from-amber-400 to-orange-500',
          Icon: AlertCircle,
        };
      case 'High':
        return {
          badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          bar: 'bg-gradient-to-r from-rose-500 to-red-600',
          Icon: ShieldAlert,
        };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {diseaseList.map((disease) => {
        const IconComp = getIcon(disease.id);
        const style = getLevelStyle(disease.level);
        const StatusIcon = style.Icon;

        return (
          <div
            key={disease.id}
            className="glass-panel glass-card-hover rounded-2xl p-5 border border-slate-800 space-y-3 relative overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400">
                  <IconComp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{disease.name}</h4>
                  <span className="text-xs text-slate-400">{disease.description}</span>
                </div>
              </div>

              <div className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${style.badge}`}>
                <StatusIcon className="w-3.5 h-3.5" />
                <span>{disease.level}</span>
              </div>
            </div>

            {/* Probability Percent & Visual Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-400">Estimated Risk Probability</span>
                <span className="text-sm font-extrabold text-white">{disease.probability}%</span>
              </div>

              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${style.bar}`}
                  style={{ width: `${disease.probability}%` }}
                ></div>
              </div>
            </div>

            {/* Key Drivers */}
            <div className="pt-2 border-t border-slate-800/80">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Primary Factor Drivers:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {disease.keyDrivers.map((driver, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-800/90 text-slate-300 border border-slate-700/60"
                  >
                    {driver}
                  </span>
                ))}
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
};
