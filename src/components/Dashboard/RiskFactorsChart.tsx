import React from 'react';
import type { FeatureImpact } from '../../types/health';
import { Brain, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface RiskFactorsChartProps {
  impacts: FeatureImpact[];
}

export const RiskFactorsChart: React.FC<RiskFactorsChartProps> = ({ impacts }) => {
  return (
    <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-400" />
            Explainable AI (XAI) Factor Attribution
          </h3>
          <p className="text-xs text-slate-400">Breakdown of specific biometrics and lifestyle parameters impacting your risk score.</p>
        </div>
        
        <span className="text-[11px] px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-semibold">
          Feature Importance
        </span>
      </div>

      <div className="space-y-3 pt-2">
        {impacts.map((item, idx) => {
          const isRiskIncrease = item.impactScore > 0;
          const absScore = Math.abs(item.impactScore);
          const maxScale = 40;
          const percentageWidth = Math.min(100, Math.round((absScore / maxScale) * 100));

          return (
            <div key={idx} className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isRiskIncrease ? (
                    <span className="p-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="p-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <ArrowDownRight className="w-4 h-4" />
                    </span>
                  )}
                  <span className="text-sm font-semibold text-white">{item.feature}</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {item.category}
                  </span>
                </div>

                <span className={`text-xs font-bold ${isRiskIncrease ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {isRiskIncrease ? `+${item.impactScore}% Risk Impact` : `${item.impactScore}% Protective`}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed pl-7">{item.description}</p>

              {/* Progress Bar Visual */}
              <div className="pl-7 pt-1">
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isRiskIncrease ? 'bg-rose-500' : 'bg-emerald-400'
                    }`}
                    style={{ width: `${percentageWidth}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
