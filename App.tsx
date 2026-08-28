import React, { useState, useEffect } from 'react';
import { ApplicantProfile, StepId } from './types';
import { DEMO_PROFILES } from './data/mockData';
import { Header } from './components/Header';
import { StepProgressNav } from './components/StepProgressNav';
import { RoadmapOverview } from './components/RoadmapOverview';
import { Step1Auth } from './components/Step1Auth';
import { Step2FormPayment } from './components/Step2FormPayment';
import { Step3Receipt } from './components/Step3Receipt';
import { Step4AdmitCard } from './components/Step4AdmitCard';
import { Step5EntranceTest } from './components/Step5EntranceTest';
import { Step6AdmissionFee } from './components/Step6AdmissionFee';
import { Step7PermanentAllotment } from './components/Step7PermanentAllotment';
import { Step8SectionSwap } from './components/Step8SectionSwap';
import { Step9HostelSwap } from './components/Step9HostelSwap';
import { QrVerificationModal } from './components/QrVerificationModal';
import { AuditLogModal } from './components/AuditLogModal';
import { AdminDeskModal } from './components/AdminDeskModal';
import { ShieldCheck, Sparkles, Building2, MapPin, Phone, Mail, Globe, ArrowRight, ExternalLink } from 'lucide-react';

export default function App() {
  // Load initial state from local storage or default to mid-progress for rich initial experience
  const [profile, setProfile] = useState<ApplicantProfile>(() => {
    const saved = localStorage.getItem('ime_portal_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEMO_PROFILES.midProgressApplicant;
      }
    }
    return DEMO_PROFILES.midProgressApplicant;
  });

  const [viewMode, setViewMode] = useState<'step' | 'roadmap'>('step');
  const [activeStep, setActiveStep] = useState<StepId>(profile.currentStep || 2);
  const [qrModalToken, setQrModalToken] = useState<string | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Sync profile to localStorage on updates
  useEffect(() => {
    localStorage.setItem('ime_portal_profile', JSON.stringify(profile));
  }, [profile]);

  const handleUpdateProfile = (updates: Partial<ApplicantProfile>) => {
    setProfile(prev => {
      const updated = { ...prev, ...updates };
      if (updates.currentStep && updates.currentStep !== activeStep) {
        setActiveStep(updates.currentStep);
      }
      return updated;
    });
  };

  const handleSelectStep = (step: StepId) => {
    setActiveStep(step);
    setViewMode('step');
  };

  const handleNextStep = () => {
    if (activeStep < 9) {
      const next = (activeStep + 1) as StepId;
      setActiveStep(next);
      handleUpdateProfile({
        currentStep: next,
        completedSteps: Array.from(new Set([...profile.completedSteps, activeStep]))
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setViewMode('roadmap');
    }
  };

  const handleResetProfile = () => {
    const initial = DEMO_PROFILES.newApplicant;
    setProfile(initial);
    setActiveStep(1);
    setViewMode('step');
    localStorage.setItem('ime_portal_profile', JSON.stringify(initial));
  };

  const handleLoadPreset = (presetKey: keyof typeof DEMO_PROFILES) => {
    const preset = DEMO_PROFILES[presetKey];
    setProfile(preset);
    setActiveStep(preset.currentStep);
    setViewMode('step');
    localStorage.setItem('ime_portal_profile', JSON.stringify(preset));
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 flex flex-col selection:bg-indigo-600 selection:text-white">
      {/* Global Application Header */}
      <Header
        profile={profile}
        onResetProfile={handleResetProfile}
        onLoadPreset={handleLoadPreset}
        onOpenAuditLogs={() => setIsAuditModalOpen(true)}
        onOpenAdminDesk={() => setIsAdminModalOpen(true)}
        onToggleRoadmapView={() => setViewMode(prev => prev === 'roadmap' ? 'step' : 'roadmap')}
        currentView={viewMode}
      />

      {/* Main Roadmap Progress Navigation Bar */}
      <StepProgressNav
        currentStep={activeStep}
        completedSteps={profile.completedSteps}
        onSelectStep={handleSelectStep}
        viewMode={viewMode}
        onToggleRoadmap={() => setViewMode(prev => prev === 'roadmap' ? 'step' : 'roadmap')}
      />

      {/* Primary Application Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'roadmap' ? (
          <RoadmapOverview
            currentStep={activeStep}
            completedSteps={profile.completedSteps}
            onSelectStep={handleSelectStep}
          />
        ) : (
          <div>
            {activeStep === 1 && (
              <Step1Auth
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
                onNextStep={handleNextStep}
              />
            )}

            {activeStep === 2 && (
              <Step2FormPayment
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
                onNextStep={handleNextStep}
              />
            )}

            {activeStep === 3 && (
              <Step3Receipt
                profile={profile}
                onNextStep={handleNextStep}
              />
            )}

            {activeStep === 4 && (
              <Step4AdmitCard
                profile={profile}
                onNextStep={handleNextStep}
                onOpenVerifier={(tok) => setQrModalToken(tok)}
              />
            )}

            {activeStep === 5 && (
              <Step5EntranceTest
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
                onNextStep={handleNextStep}
              />
            )}

            {activeStep === 6 && (
              <Step6AdmissionFee
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
                onNextStep={handleNextStep}
              />
            )}

            {activeStep === 7 && (
              <Step7PermanentAllotment
                profile={profile}
                onNextStep={handleNextStep}
                onSelectStep={handleSelectStep}
                onOpenVerifier={(tok) => setQrModalToken(tok)}
              />
            )}

            {activeStep === 8 && (
              <Step8SectionSwap
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
                onNextStep={handleNextStep}
              />
            )}

            {activeStep === 9 && (
              <Step9HostelSwap
                profile={profile}
                onUpdateProfile={handleUpdateProfile}
                onGoToOverview={() => setViewMode('roadmap')}
              />
            )}
          </div>
        )}
      </main>

      {/* Global Institutional Footer in Geometric Balance Style */}
      <footer className="border-t border-slate-700 bg-[#1E293B] mt-16 py-8 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs text-slate-400">
            <div className="space-y-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 bg-indigo-500 rounded-xs transform rotate-45 flex items-center justify-center text-white font-mono font-bold">
                  <span className="transform -rotate-45">IME</span>
                </div>
                <span className="text-white font-bold text-sm tracking-tight uppercase">
                  INSTITUTE OF MANAGEMENT & ENGINEERING
                </span>
              </div>
              <p className="text-slate-400 leading-relaxed text-xs">
                Autonomous Premier Technical & Management Institution. Zero-Touch Digital Admission Protocol v4.2.
              </p>
              <div className="flex items-center space-x-2 text-emerald-400 font-mono text-[11px] font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>100% PAPERLESS & CRYPTOGRAPHICALLY AUDITED</span>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-slate-200 font-black uppercase tracking-[0.2em] text-[10px] block">Central Pipeline</span>
              <ul className="space-y-1.5 text-slate-400 font-mono text-[11px]">
                <li>01. OTP Sign Up & Auth</li>
                <li>02. Form & Payment</li>
                <li>03. Instant PDF Receipt</li>
                <li>04. CBT Admit Card</li>
                <li>05. Entrance Test & AIR</li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="text-slate-200 font-black uppercase tracking-[0.2em] text-[10px] block">Post-Admit Swaps</span>
              <ul className="space-y-1.5 text-slate-400 font-mono text-[11px]">
                <li>06. Qualified Admission Fee</li>
                <li>07. Permanent Allotment Order</li>
                <li>08. Online Section Swaps</li>
                <li>09. Digital Hostel Room Swaps</li>
              </ul>
            </div>

            <div className="space-y-2">
              <span className="text-slate-200 font-black uppercase tracking-[0.2em] text-[10px] block">Central Admissions Office</span>
              <div className="space-y-1.5 text-slate-300 font-sans text-xs">
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Tech Knowledge Corridor, Bangalore - 560100</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>Admissions Desk: 1800-425-9090</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>admissions@ime.edu.in</span>
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div className="font-mono text-[11px]">
              © 2026 Institute of Management & Engineering. Zero-Touch Admissions Protocol.
            </div>
            <div className="flex space-x-4 font-mono text-[11px]">
              <button onClick={() => setIsAuditModalOpen(true)} className="hover:text-indigo-400 transition-colors uppercase">
                Audit Ledger
              </button>
              <button onClick={() => setIsAdminModalOpen(true)} className="hover:text-indigo-400 transition-colors uppercase">
                Staff Desk
              </button>
              <button onClick={() => setQrModalToken(profile.admitCardQrToken)} className="hover:text-indigo-400 transition-colors uppercase">
                QR Authenticator
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* High-Precision Geometric Balance Telemetry Footer Bar */}
      <div className="h-10 bg-indigo-600 flex items-center px-4 sm:px-8 justify-between text-[10px] font-mono font-bold text-white uppercase tracking-tighter no-print sticky bottom-0 z-40 shadow-2xl">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          <span>SYSTEM STATUS: OPTIMAL // ZERO-TOUCH ENGINE ACTIVE // UPTIME: 99.999%</span>
        </div>
        <div className="hidden md:flex gap-6">
          <span>DB CLUSTER: BLR-01, DEL-02, HYD-04</span>
          <span>ENCRYPTION: AES-256-GCM</span>
          <span>LAST HEARTBEAT: <span className="animate-pulse">180ms AGO</span></span>
        </div>
      </div>

      {/* Global Verification & Ledger Modals */}
      <QrVerificationModal
        isOpen={Boolean(qrModalToken)}
        onClose={() => setQrModalToken(null)}
        token={qrModalToken || ''}
        profile={profile}
      />

      <AuditLogModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        logs={profile.auditLogs}
      />

      <AdminDeskModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        profile={profile}
        onJumpToStep={handleSelectStep}
      />
    </div>
  );
}
