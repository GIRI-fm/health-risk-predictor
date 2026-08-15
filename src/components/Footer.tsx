import React from 'react';
import { Activity, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-10 px-4 lg:px-8 mt-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Col 1 */}
        <div className="md:col-span-5 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-base font-bold text-white">PulseAI Risk Predictor</span>
          </div>

          <p className="leading-relaxed text-slate-400">
            An open-source Artificial Intelligence & Machine Learning system created to support <strong>UN SDG Goal 3: Good Health & Well-Being</strong>. By estimating chronic disease probabilities early, PulseAI empowers preventative intervention before clinical conditions manifest.
          </p>
        </div>

        {/* Col 2 */}
        <div className="md:col-span-3 space-y-2">
          <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Machine Learning Models</h4>
          <ul className="space-y-1 text-slate-400">
            <li>• Diabetes Risk (Logistic & Random Forest)</li>
            <li>• Framingham Heart Disease Classifier</li>
            <li>• Hypertension BP Progression Model</li>
            <li>• Metabolic Obesity Index Engine</li>
          </ul>
        </div>

        {/* Col 3 */}
        <div className="md:col-span-4 space-y-2">
          <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">Deployment & Integration</h4>
          <p className="text-slate-400 leading-relaxed">
            Ready for Vercel deployment out of the box with Vite SPA static serving and optional Python serverless functions (`api/predict.py`).
          </p>

          <div className="flex items-center gap-2 pt-2 text-indigo-400 font-semibold">
            <Globe className="w-4 h-4" />
            <span>Deployable on Vercel Edge</span>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-900 mt-8 pt-4 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-400">
        <span>© {new Date().getFullYear()} PulseAI Health Predictor — Built for Early Disease Prevention</span>
        <span>Supports UN SDG Goal 3: Good Health & Well-Being</span>
      </div>
    </footer>
  );
};
