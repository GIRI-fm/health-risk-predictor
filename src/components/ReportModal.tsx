import React from 'react';
import type { UserHealthData, HealthAssessmentResult } from '../types/health';
import { Printer, X, Activity, FileText } from 'lucide-react';

interface ReportModalProps {
  data: UserHealthData;
  assessment: HealthAssessmentResult;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ data, assessment, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        
        {/* Action Header (No Print) */}
        <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-slate-800 p-4 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Official Health Assessment Summary</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/30"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Content */}
        <div className="p-6 md:p-8 space-y-6 text-slate-200">
          
          {/* Document Header */}
          <div className="border-b border-slate-700/80 pb-4 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <Activity className="w-6 h-6 text-emerald-400" />
                PulseAI Health Risk Report
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">UN SDG 3 Early Disease Prevention Analytics</p>
            </div>
            <div className="text-right text-xs text-slate-400">
              <div>Date: <strong className="text-slate-200">{assessment.timestamp}</strong></div>
              <div>Report ID: <strong className="text-indigo-400">#PULSE-{Math.floor(100000 + Math.random() * 900000)}</strong></div>
            </div>
          </div>

          {/* Biometrics Summary */}
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300">Subject Biometrics</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">Age / Gender</span>
                <span className="font-semibold text-white capitalize">{data.age} yrs / {data.gender}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Height / Weight</span>
                <span className="font-semibold text-white">{data.height} cm / {data.weight} kg</span>
              </div>
              <div>
                <span className="text-slate-400 block">Calculated BMI</span>
                <span className="font-semibold text-emerald-400">{assessment.bmi} ({assessment.bmiCategory})</span>
              </div>
              <div>
                <span className="text-slate-400 block">Blood Pressure</span>
                <span className="font-semibold text-teal-400">{data.systolicBP}/{data.diastolicBP} mmHg</span>
              </div>
            </div>
          </div>

          {/* Health Index & Disease Probabilities */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-semibold">Overall Risk Index</span>
              <div className="text-3xl font-extrabold text-emerald-400 my-1">
                {assessment.overallHealthScore} / 100
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 w-fit">
                {assessment.healthStatus}
              </span>
            </div>

            <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 space-y-2">
              <span className="text-xs text-slate-400 font-semibold">Disease Probabilities</span>
              <div className="space-y-1 text-xs">
                {Object.values(assessment.diseaseRisks).map((d) => (
                  <div key={d.id} className="flex justify-between items-center">
                    <span className="text-slate-300">{d.name}</span>
                    <span className="font-bold text-white">{d.probability}% ({d.level})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Recommendations */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Action Recommendations</h4>
            <div className="space-y-2">
              {assessment.recommendations.slice(0, 4).map((rec) => (
                <div key={rec.id} className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs space-y-1">
                  <div className="font-bold text-white flex items-center justify-between">
                    <span>{rec.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300">{rec.category}</span>
                  </div>
                  <p className="text-slate-300">{rec.actionableStep}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Disclaimer */}
          <div className="border-t border-slate-800 pt-4 text-[10px] text-slate-400 space-y-1 text-center">
            <p><strong>Clinical Disclaimer:</strong> PulseAI is an educational machine learning health risk estimator. It does not replace professional medical diagnosis or clinical laboratory testing.</p>
          </div>

        </div>

      </div>
    </div>
  );
};
