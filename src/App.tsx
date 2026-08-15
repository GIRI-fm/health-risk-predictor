import { useState } from 'react';
import type { UserHealthData } from './types/health';
import { calculateHealthAssessment } from './utils/riskEngine';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { HealthForm } from './components/HealthForm';
import { ScoreGauge } from './components/Dashboard/ScoreGauge';
import { DiseaseRiskCards } from './components/Dashboard/DiseaseRiskCards';
import { RiskFactorsChart } from './components/Dashboard/RiskFactorsChart';
import { RecommendationsList } from './components/Dashboard/RecommendationsList';
import { Simulator } from './components/Simulator';
import { ReportModal } from './components/ReportModal';
import { Footer } from './components/Footer';
import { FileText, Activity } from 'lucide-react';

const DEFAULT_HEALTH_DATA: UserHealthData = {
  age: 42,
  gender: 'male',
  weight: 82,
  height: 175,
  exerciseMinsPerDay: 20,
  sleepHours: 6.5,
  smoking: 'occasional',
  alcohol: 'moderate',
  restingHeartRate: 76,
  systolicBP: 132,
  diastolicBP: 85,
  dietQuality: 6,
  stressLevel: 6,
};

export function App() {
  const [healthData, setHealthData] = useState<UserHealthData>(DEFAULT_HEALTH_DATA);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  const assessment = calculateHealthAssessment(healthData);

  const handleReset = () => {
    setHealthData(DEFAULT_HEALTH_DATA);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar onReset={handleReset} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-8">
        
        {/* Hero Section */}
        <HeroBanner onSelectPreset={(presetData) => setHealthData(presetData)} />

        {/* Input Parameters Form */}
        <HealthForm data={healthData} onChange={setHealthData} />

        {/* Action Bar for Report Export */}
        <div className="flex items-center justify-between glass-panel p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>AI Risk Assessment Calculated Live</span>
          </div>

          <button
            onClick={() => setShowReportModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/30"
          >
            <FileText className="w-4 h-4" />
            <span>Export Official Health Report</span>
          </button>
        </div>

        {/* DASHBOARD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Health Score Gauge */}
          <div className="lg:col-span-4">
            <ScoreGauge assessment={assessment} />
          </div>

          {/* Right Column: Disease Risk Probability Cards */}
          <div className="lg:col-span-8">
            <DiseaseRiskCards risks={assessment.diseaseRisks} />
          </div>

        </div>

        {/* Explainable AI (XAI) Feature Impact */}
        <RiskFactorsChart impacts={assessment.featureImpacts} />

        {/* Interactive What-If Simulator */}
        <Simulator currentData={healthData} currentAssessment={assessment} />

        {/* Actionable Recommendations */}
        <RecommendationsList recommendations={assessment.recommendations} />

      </main>

      {/* Printable Report Modal */}
      {showReportModal && (
        <ReportModal
          data={healthData}
          assessment={assessment}
          onClose={() => setShowReportModal(false)}
        />
      )}

      {/* Footer */}
      <Footer />

    </div>
  );
}

export default App;
