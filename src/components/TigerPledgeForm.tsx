import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  Award,
  Download,
  Printer,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Search,
  ExternalLink,
  Copy,
  Check,
  HeartHandshake,
  Lock,
  Globe,
  FileCheck
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { TigerPledgeCertificate } from '../types';
import { CertificatePreview } from './CertificatePreview';
import { downloadCertificateAsPdf, downloadCertificateAsPng } from '../utils/certificateExporter';

export const TigerPledgeForm: React.FC = () => {
  const { t, language } = useLanguage();
  const {
    certificateSettings,
    generatePledgeCertificate,
    isCertificateGenerating,
    certificates
  } = useData();

  // Form State
  const [fullName, setFullName] = useState('');
  const [cityAndState, setCityAndState] = useState('');
  const [country, setCountry] = useState('India');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [certLanguage, setCertLanguage] = useState<'en' | 'hi' | 'ur'>(
    (language as 'en' | 'hi' | 'ur') || 'en'
  );
  const [agreedToPledge, setAgreedToPledge] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Generated Certificate & Export State
  const [generatedCert, setGeneratedCert] = useState<TigerPledgeCertificate | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingPng, setIsExportingPng] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Verification Search State
  const [activeTab, setActiveTab] = useState<'pledge' | 'verify'>('pledge');
  const [verifyQuery, setVerifyQuery] = useState('');
  const [verifyResult, setVerifyResult] = useState<{
    searched: boolean;
    certificate?: TigerPledgeCertificate;
    notFound?: boolean;
    isRevoked?: boolean;
  }>({ searched: false });
  const [isVerifying, setIsVerifying] = useState(false);

  const certRef = useRef<HTMLDivElement>(null);
  const printCertRef = useRef<HTMLDivElement>(null);

  const todayFormatted = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!fullName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!cityAndState.trim()) {
      setFormError('Please enter your city and state.');
      return;
    }
    if (!agreedToPledge) {
      setFormError('You must voluntarily agree to the tiger conservation pledge statement.');
      return;
    }

    try {
      const newCert = await generatePledgeCertificate({
        fullName: fullName.trim(),
        cityAndState: cityAndState.trim(),
        country: country.trim() || 'India',
        email: email.trim() || undefined,
        organization: organization.trim() || undefined,
        language: certLanguage
      });

      setGeneratedCert(newCert);

      // Scroll smoothly to preview
      setTimeout(() => {
        const previewEl = document.getElementById('generated-certificate-section');
        if (previewEl) {
          previewEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    } catch (err: any) {
      setFormError(err?.message || 'Failed to generate certificate. Please try again.');
    }
  };

  // Handle Export to PDF
  const handleDownloadPdf = async () => {
    if (!certRef.current || !generatedCert) return;
    setIsExportingPdf(true);
    const filename = `Valmiki_Tiger_Pledge_${generatedCert.certificateNumber}.pdf`;
    try {
      await downloadCertificateAsPdf(certRef.current, filename, 'landscape');
    } catch (e) {
      console.error('PDF export failed:', e);
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Handle Export to PNG
  const handleDownloadPng = async () => {
    if (!certRef.current || !generatedCert) return;
    setIsExportingPng(true);
    const filename = `Valmiki_Tiger_Pledge_${generatedCert.certificateNumber}.png`;
    try {
      await downloadCertificateAsPng(certRef.current, filename);
    } catch (e) {
      console.error('PNG export failed:', e);
    } finally {
      setIsExportingPng(false);
    }
  };

  // Handle Browser Native Print
  const handlePrint = () => {
    window.print();
  };

  // Copy Verification Link
  const handleCopyVerificationLink = () => {
    if (!generatedCert) return;
    const url = `${window.location.origin}${window.location.pathname}?cert=${encodeURIComponent(generatedCert.certificateNumber)}#verify`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Handle Verification Search
  const handleVerifySearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = verifyQuery.trim();
    if (!query) return;

    setIsVerifying(true);
    setVerifyResult({ searched: false });

    try {
      // First check server endpoint
      const res = await fetch(`/api/certificates/verify/${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.valid && data.certificate) {
          setVerifyResult({
            searched: true,
            certificate: data.certificate,
            isRevoked: data.certificate.status === 'revoked'
          });
          setIsVerifying(false);
          return;
        }
      }

      // Fallback: check local certificates registry in context
      const normalizedQuery = query.toUpperCase();
      const match = certificates.find(
        c => c.certificateNumber.toUpperCase() === normalizedQuery || c.id === query
      );

      if (match) {
        setVerifyResult({
          searched: true,
          certificate: match,
          isRevoked: match.status === 'revoked'
        });
      } else {
        setVerifyResult({
          searched: true,
          notFound: true
        });
      }
    } catch (e) {
      // Offline fallback search
      const normalizedQuery = query.toUpperCase();
      const match = certificates.find(
        c => c.certificateNumber.toUpperCase() === normalizedQuery
      );
      if (match) {
        setVerifyResult({
          searched: true,
          certificate: match,
          isRevoked: match.status === 'revoked'
        });
      } else {
        setVerifyResult({
          searched: true,
          notFound: true
        });
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResetForm = () => {
    setGeneratedCert(null);
    setFullName('');
    setCityAndState('');
    setEmail('');
    setOrganization('');
    setAgreedToPledge(false);
    setFormError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 text-emerald-900 border border-emerald-300/80 text-xs sm:text-sm font-semibold mb-4 shadow-sm">
          <HeartHandshake className="w-4 h-4 text-emerald-700" />
          <span>{t('pledge.page_badge') || 'Voluntary Conservation Pledge'}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-stone-900 tracking-tight mb-4">
          {t('pledge.title') || 'Pledge to Protect Tigers'}
        </h1>

        <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
          {t('pledge.subtitle') ||
            'Take a voluntary pledge to support tiger conservation, protect wildlife, respect forest laws, and encourage others to protect tigers. Receive your personalized Certificate of Tiger Protection Pledge.'}
        </p>

        {/* Tab Switcher: Pledge Form vs Verification */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            type="button"
            onClick={() => setActiveTab('pledge')}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm flex items-center gap-2 ${
              activeTab === 'pledge'
                ? 'bg-emerald-800 text-white shadow-emerald-900/20'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Take Pledge & Get Certificate</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('verify')}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm flex items-center gap-2 ${
              activeTab === 'verify'
                ? 'bg-emerald-800 text-white shadow-emerald-900/20'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{t('pledge.verify_tab') || 'Verify Authenticity'}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PLEDGE FORM & GENERATOR */}
      {activeTab === 'pledge' && (
        <div className="space-y-12">
          
          {/* Pledge Form Section (if not yet generated or if editing) */}
          {!generatedCert ? (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden max-w-2xl mx-auto">
              {/* Form Title bar */}
              <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 text-white p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-emerald-700/60 rounded-xl border border-emerald-500/30">
                    <Award className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                      {t('pledge.form_title') || 'Tiger Protection Pledge Form'}
                    </h2>
                    <p className="text-xs sm:text-sm text-emerald-100/90 mt-0.5">
                      {t('pledge.form_subtitle') ||
                        'Fill in your details below to pledge your support and receive your official Certificate.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
                {formError && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div>{formError}</div>
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-stone-900 mb-1.5">
                    {t('pledge.full_name') || 'Full Name'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={t('pledge.full_name_placeholder') || 'e.g. Rajesh Kumar Verma'}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 text-stone-900 text-sm font-medium transition"
                  />
                </div>

                {/* City and State */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-stone-900 mb-1.5">
                      {t('pledge.city_state') || 'City and State'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={cityAndState}
                      onChange={(e) => setCityAndState(e.target.value)}
                      placeholder={t('pledge.city_state_placeholder') || 'e.g. Bettiah, West Champaran, Bihar'}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 text-stone-900 text-sm font-medium transition"
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-stone-900 mb-1.5">
                      {t('pledge.country') || 'Country'}
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. India"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 text-stone-900 text-sm font-medium transition"
                    />
                  </div>
                </div>

                {/* Email Address (Optional) & Privacy Guarantee */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs sm:text-sm font-bold text-stone-900">
                      {t('pledge.email') || 'Email Address (Optional)'}
                    </label>
                    <span className="text-[11px] text-stone-500 font-medium flex items-center gap-1">
                      <Lock className="w-3 h-3 text-stone-400" /> Never shown publicly
                    </span>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('pledge.email_placeholder') || 'e.g. contact@example.com (kept private)'}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 text-stone-900 text-sm font-medium transition"
                  />
                  <p className="text-[11px] text-stone-500 mt-1">
                    {t('pledge.email_privacy_note') ||
                      'Privacy Note: Email is strictly confidential and is never displayed on the certificate or shared.'}
                  </p>
                </div>

                {/* Organization / Institution (Optional) */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-stone-900 mb-1.5">
                    {t('pledge.organization') || 'Organisation / Institution Name (Optional)'}
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder={t('pledge.organization_placeholder') || 'e.g. Wildlife Nature Club / Patna University'}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 text-stone-900 text-sm font-medium transition"
                  />
                </div>

                {/* Certificate Language & Auto Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-stone-900 mb-1.5 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Certificate Language</span>
                    </label>
                    <select
                      value={certLanguage}
                      onChange={(e) => setCertLanguage(e.target.value as 'en' | 'hi' | 'ur')}
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 text-stone-900 text-sm font-medium bg-white"
                    >
                      <option value="en">English (Official)</option>
                      <option value="hi">हिन्दी (Hindi)</option>
                      <option value="ur">اردو (Urdu)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-stone-900 mb-1.5">
                      {t('pledge.pledge_date') || 'Date of Pledge'}
                    </label>
                    <div className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 text-sm font-semibold">
                      {todayFormatted} (Automated)
                    </div>
                  </div>
                </div>

                {/* Required Checkbox Pledge Statement */}
                <div className="pt-2">
                  <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/90 flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="pledge-agree-checkbox"
                      checked={agreedToPledge}
                      onChange={(e) => setAgreedToPledge(e.target.checked)}
                      className="w-5 h-5 mt-0.5 rounded border-amber-400 text-emerald-800 focus:ring-emerald-700 shrink-0 cursor-pointer"
                    />
                    <label htmlFor="pledge-agree-checkbox" className="text-xs sm:text-sm text-stone-800 font-semibold cursor-pointer leading-relaxed">
                      {t('pledge.required_statement') ||
                        'I voluntarily pledge to support tiger conservation, protect wildlife, respect forest laws, and encourage others to protect tigers.'}
                    </label>
                  </div>
                </div>

                {/* Privacy Safeguard Notice */}
                <div className="text-[11px] text-stone-500 flex items-center gap-1.5 pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    No Aadhaar, PAN, phone number, or sensitive personal data is ever collected.
                  </span>
                </div>

                {/* Generate Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isCertificateGenerating || !agreedToPledge || !fullName.trim() || !cityAndState.trim()}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900 text-white font-bold text-base shadow-lg shadow-emerald-900/20 hover:from-emerald-700 hover:to-emerald-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isCertificateGenerating ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>{t('pledge.btn_generating') || 'Generating Certificate...'}</span>
                      </>
                    ) : (
                      <>
                        <Award className="w-5 h-5 text-amber-400" />
                        <span>{t('pledge.btn_generate') || 'Generate Certificate'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* SUCCESS & CERTIFICATE DISPLAY VIEW */
            <div id="generated-certificate-section" className="space-y-8">
              
              {/* Success Alert Banner */}
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-emerald-950">
                      {t('pledge.success_heading') || 'Pledge Recorded & Certificate Ready!'}
                    </h3>
                    <p className="text-xs sm:text-sm text-emerald-800">
                      {t('pledge.success_message') ||
                        'Thank you for your commitment to tiger conservation. Your certificate has been assigned number '}{' '}
                      <span className="font-mono font-bold">{generatedCert.certificateNumber}</span>.
                    </p>
                  </div>
                </div>

                {/* Actions Toolbar */}
                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    disabled={isExportingPdf}
                    className="px-4 py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-xs sm:text-sm hover:bg-emerald-900 transition flex items-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    {isExportingPdf ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    <span>{t('pledge.btn_download_pdf') || 'Download PDF (A4)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadPng}
                    disabled={isExportingPng}
                    className="px-4 py-2.5 rounded-xl bg-amber-600 text-white font-bold text-xs sm:text-sm hover:bg-amber-700 transition flex items-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    {isExportingPng ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    <span>{t('pledge.btn_download_png') || 'Download PNG'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-700 font-semibold text-xs sm:text-sm hover:bg-stone-50 transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyVerificationLink}
                    className="px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-700 font-semibold text-xs sm:text-sm hover:bg-stone-50 transition flex items-center gap-1.5 shadow-sm"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Copied Link' : 'Share / Link'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="px-3.5 py-2.5 rounded-xl bg-stone-100 text-stone-700 font-semibold text-xs sm:text-sm hover:bg-stone-200 transition flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>{t('pledge.btn_another') || 'New Certificate'}</span>
                  </button>
                </div>
              </div>

              {/* High-Resolution Certificate Render Container */}
              <div className="flex justify-center overflow-x-auto py-2">
                <CertificatePreview
                  ref={certRef}
                  certificate={generatedCert}
                  settings={certificateSettings}
                />
              </div>

              {/* Disclaimer Notice Box */}
              <div className="max-w-3xl mx-auto p-4 rounded-xl bg-stone-100 border border-stone-200/80 text-center">
                <div className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-1">
                  {t('pledge.disclaimer_title') || 'Important Notice'}
                </div>
                <p className="text-xs text-stone-500 leading-relaxed font-normal">
                  {t('pledge.disclaimer_text') ||
                    'This is a voluntary conservation pledge certificate issued by Valmiki Tiger Watch to recognize individual community commitment to wildlife protection. It is not an official government certificate, employment credential, or formal academic qualification.'}
                </p>
              </div>

            </div>
          )}

        </div>
      )}

      {/* TAB 2: CERTIFICATE VERIFICATION PORTAL */}
      {activeTab === 'verify' && (
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-emerald-100 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-emerald-800" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-stone-900">
                  {t('pledge.verify_tab') || 'Verify Authenticity'}
                </h2>
                <p className="text-xs sm:text-sm text-stone-600">
                  {t('pledge.verify_tab_desc') ||
                    'Enter any Valmiki Tiger Watch certificate number to verify its authenticity in the official registry.'}
                </p>
              </div>
            </div>

            {/* Search Input Box */}
            <form onSubmit={handleVerifySearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={verifyQuery}
                  onChange={(e) => setVerifyQuery(e.target.value)}
                  placeholder={t('pledge.verify_input_placeholder') || 'e.g. VTW-TPP-2026-000001'}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 text-stone-900 text-sm font-mono font-medium uppercase"
                />
              </div>
              <button
                type="submit"
                disabled={isVerifying || !verifyQuery.trim()}
                className="px-6 py-3 rounded-xl bg-emerald-800 text-white font-bold text-sm hover:bg-emerald-900 transition flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                {isVerifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                <span>{t('pledge.verify_btn') || 'Verify Certificate'}</span>
              </button>
            </form>

            {/* Verification Result Display */}
            {verifyResult.searched && (
              <div className="mt-6 pt-6 border-t border-stone-200">
                {verifyResult.notFound && (
                  <div className="p-5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-sm">
                        {t('pledge.verify_not_found') || 'Certificate Not Found in Official Registry'}
                      </div>
                      <div className="text-xs text-amber-700 mt-1">
                        No record matching certificate number &ldquo;{verifyQuery}&rdquo; was found. Please check for typos or ensure the full identifier format (e.g. VTW-TPP-2026-000001) was entered.
                      </div>
                    </div>
                  </div>
                )}

                {verifyResult.certificate && (
                  <div className="space-y-6">
                    {/* Status Badge Card */}
                    <div
                      className={`p-5 rounded-xl border flex items-center justify-between gap-4 ${
                        verifyResult.isRevoked
                          ? 'bg-red-50 border-red-200 text-red-900'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {verifyResult.isRevoked ? (
                          <AlertTriangle className="w-7 h-7 text-red-600 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-7 h-7 text-emerald-700 shrink-0" />
                        )}
                        <div>
                          <div className="font-black text-base">
                            {verifyResult.isRevoked
                              ? 'Certificate Status: REVOKED'
                              : 'Official Certificate Verified (AUTHENTIC & ACTIVE)'}
                          </div>
                          <div className="text-xs font-mono font-bold mt-0.5">
                            {verifyResult.certificate.certificateNumber}
                          </div>
                        </div>
                      </div>

                      <div className="text-right text-xs">
                        <div className="text-stone-500 font-medium">Issue Date</div>
                        <div className="font-bold text-stone-800">{verifyResult.certificate.pledgeDate}</div>
                      </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                      <div>
                        <span className="text-stone-500 font-medium block">Pledged Recipient:</span>
                        <span className="font-bold text-stone-900 text-sm">{verifyResult.certificate.fullName}</span>
                      </div>

                      <div>
                        <span className="text-stone-500 font-medium block">Location:</span>
                        <span className="font-bold text-stone-900 text-sm">
                          {verifyResult.certificate.cityAndState}, {verifyResult.certificate.country || 'India'}
                        </span>
                      </div>

                      {verifyResult.certificate.organization && (
                        <div>
                          <span className="text-stone-500 font-medium block">Organisation:</span>
                          <span className="font-bold text-emerald-800 text-sm">
                            {verifyResult.certificate.organization}
                          </span>
                        </div>
                      )}

                      <div>
                        <span className="text-stone-500 font-medium block">Issuing Authority:</span>
                        <span className="font-bold text-stone-900 text-sm">
                          Valmiki Tiger Watch (President: Nazish Asad)
                        </span>
                      </div>
                    </div>

                    {/* Certificate Preview rendering */}
                    <div className="pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3 text-center">
                        Registry Certificate Rendering
                      </h4>
                      <div className="flex justify-center overflow-x-auto">
                        <CertificatePreview
                          certificate={verifyResult.certificate}
                          settings={certificateSettings}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Verification Disclaimer */}
          <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 text-center">
            <p className="text-xs text-stone-500 leading-relaxed">
              Public Verification Notice: In compliance with privacy standards, recipient email addresses are strictly protected and never shown on public verification lookups.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default TigerPledgeForm;
