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
  Copy,
  Check,
  HeartHandshake,
  FileImage,
  FileText,
  Share2,
  Filter,
  Calendar,
  User,
  Hash,
  RotateCcw
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { TigerPledgeCertificate } from '../types';
import { CertificatePreview } from './CertificatePreview';
import {
  downloadCertificateAsJpg,
  downloadCertificateAsPdf,
  downloadCertificateAsPng,
  printCertificate,
  shareCertificate
} from '../utils/certificateExporter';

export const TigerPledgeForm: React.FC = () => {
  const { t, language } = useLanguage();
  const {
    certificateSettings,
    generatePledgeCertificate,
    isCertificateGenerating,
    certificates,
    lastIssuedCertificate,
    clearLastIssuedCertificate
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

  // Active Certificate State (initialized with last issued certificate if present)
  const [generatedCert, setGeneratedCert] = useState<TigerPledgeCertificate | null>(() => {
    return lastIssuedCertificate || null;
  });
  const [alreadyIssuedNotice, setAlreadyIssuedNotice] = useState<boolean>(false);

  // Export & Action State
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportActionName, setExportActionName] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<{
    type: 'loading' | 'success' | 'error';
    message: string;
    filename?: string;
    onRetry?: () => void;
  } | null>(null);

  // Verification & Admin Search State
  const [activeTab, setActiveTab] = useState<'pledge' | 'verify'>('pledge');
  const [verifyQuery, setVerifyQuery] = useState('');
  const [searchField, setSearchField] = useState<'all' | 'number' | 'name' | 'pledgeId' | 'date'>('all');
  const [verifyResult, setVerifyResult] = useState<{
    searched: boolean;
    certificates?: TigerPledgeCertificate[];
    selectedCertificate?: TigerPledgeCertificate;
    notFound?: boolean;
    isRevoked?: boolean;
  }>({ searched: false });
  const [isVerifying, setIsVerifying] = useState(false);

  const certRef = useRef<HTMLDivElement>(null);

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setAlreadyIssuedNotice(false);
    setDownloadStatus(null);

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
      const uniquePledgeId = `pledge_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      const certResult = await generatePledgeCertificate({
        fullName: fullName.trim(),
        cityAndState: cityAndState.trim(),
        country: country.trim() || 'India',
        email: email.trim() || undefined,
        organization: organization.trim() || undefined,
        language: certLanguage,
        pledgeId: uniquePledgeId
      });

      setGeneratedCert(certResult);
      if (certResult.alreadyIssued) {
        setAlreadyIssuedNotice(true);
      } else {
        setAlreadyIssuedNotice(false);
      }

      // Scroll smoothly to generated certificate
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

  // Helper filename generator
  const getSafeFilename = (ext: string) => {
    const num = generatedCert?.certificateNumber ? generatedCert.certificateNumber.replace(/[^a-zA-Z0-9_-]/g, '_') : 'Valmiki';
    return `Valmiki-Tiger-Watch-Pledge-Certificate-${num}.${ext}`;
  };

  // Export Handlers
  const handleDownloadPdf = async () => {
    if (!certRef.current || !generatedCert) return;
    setIsExporting(true);
    setExportActionName('PDF');
    setDownloadStatus({
      type: 'loading',
      message: 'Preparing your certificate…'
    });

    const filename = getSafeFilename('pdf');
    try {
      const res = await downloadCertificateAsPdf(certRef.current, filename);
      if (res.success) {
        setDownloadStatus({
          type: 'success',
          message: res.message || 'Certificate downloaded successfully.',
          filename
        });
      } else {
        setDownloadStatus({
          type: 'error',
          message: res.error || 'Failed to generate PDF certificate.',
          onRetry: handleDownloadPdf
        });
      }
    } catch (e: any) {
      setDownloadStatus({
        type: 'error',
        message: e?.message || 'Unexpected error generating PDF certificate.',
        onRetry: handleDownloadPdf
      });
    } finally {
      setIsExporting(false);
      setExportActionName('');
    }
  };

  const handleDownloadJpg = async () => {
    if (!certRef.current || !generatedCert) return;
    setIsExporting(true);
    setExportActionName('JPG');
    setDownloadStatus({
      type: 'loading',
      message: 'Preparing your certificate…'
    });

    const filename = getSafeFilename('jpg');
    try {
      const res = await downloadCertificateAsJpg(certRef.current, filename, 0.98);
      if (res.success) {
        setDownloadStatus({
          type: 'success',
          message: res.message || 'Certificate downloaded successfully.',
          filename
        });
      } else {
        setDownloadStatus({
          type: 'error',
          message: res.error || 'Failed to generate JPG certificate.',
          onRetry: handleDownloadJpg
        });
      }
    } catch (e: any) {
      setDownloadStatus({
        type: 'error',
        message: e?.message || 'Unexpected error generating JPG certificate.',
        onRetry: handleDownloadJpg
      });
    } finally {
      setIsExporting(false);
      setExportActionName('');
    }
  };

  const handleDownloadPng = async () => {
    if (!certRef.current || !generatedCert) return;
    setIsExporting(true);
    setExportActionName('PNG');
    setDownloadStatus({
      type: 'loading',
      message: 'Preparing your certificate…'
    });

    const filename = getSafeFilename('png');
    try {
      const res = await downloadCertificateAsPng(certRef.current, filename);
      if (res.success) {
        setDownloadStatus({
          type: 'success',
          message: res.message || 'Certificate downloaded successfully.',
          filename
        });
      } else {
        setDownloadStatus({
          type: 'error',
          message: res.error || 'Failed to generate PNG certificate.',
          onRetry: handleDownloadPng
        });
      }
    } catch (e: any) {
      setDownloadStatus({
        type: 'error',
        message: e?.message || 'Unexpected error generating PNG certificate.',
        onRetry: handleDownloadPng
      });
    } finally {
      setIsExporting(false);
      setExportActionName('');
    }
  };

  const handlePrint = async () => {
    if (!certRef.current || !generatedCert) return;
    setIsExporting(true);
    setExportActionName('Print');
    setDownloadStatus({
      type: 'loading',
      message: 'Preparing your certificate for printing…'
    });

    try {
      const res = await printCertificate(certRef.current, `Valmiki Tiger Watch Certificate - ${generatedCert.certificateNumber}`);
      if (res.success) {
        setDownloadStatus({
          type: 'success',
          message: res.message || 'Certificate print action initiated.'
        });
      } else {
        setDownloadStatus({
          type: 'error',
          message: res.error || 'Failed to open certificate printing.',
          onRetry: handlePrint
        });
      }
    } catch (e: any) {
      setDownloadStatus({
        type: 'error',
        message: e?.message || 'Print action could not be completed.',
        onRetry: handlePrint
      });
    } finally {
      setIsExporting(false);
      setExportActionName('');
    }
  };

  const handleShare = async () => {
    if (!certRef.current || !generatedCert) return;
    setIsExporting(true);
    setExportActionName('Share');
    setDownloadStatus({
      type: 'loading',
      message: 'Preparing certificate to share…'
    });

    const filename = getSafeFilename('pdf');
    try {
      const res = await shareCertificate(certRef.current, 'pdf', filename);
      if (res.success) {
        setDownloadStatus({
          type: 'success',
          message: res.message || 'Certificate shared successfully.'
        });
      } else {
        setDownloadStatus({
          type: 'error',
          message: res.error || 'Could not complete sharing.',
          onRetry: handleShare
        });
      }
    } catch (e: any) {
      setDownloadStatus({
        type: 'error',
        message: e?.message || 'Sharing could not be initiated.',
        onRetry: handleShare
      });
    } finally {
      setIsExporting(false);
      setExportActionName('');
    }
  };

  // Copy Verification Link
  const handleCopyVerificationLink = () => {
    if (!generatedCert) return;
    const url = `${window.location.origin}${window.location.pathname}?cert=${encodeURIComponent(generatedCert.certificateNumber)}#verify`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Reset form to issue a new pledge
  const handleResetForm = () => {
    setGeneratedCert(null);
    clearLastIssuedCertificate();
    setFullName('');
    setCityAndState('');
    setEmail('');
    setOrganization('');
    setAgreedToPledge(false);
    setFormError(null);
    setAlreadyIssuedNotice(false);
    setDownloadStatus(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Admin & Verification Search
  const handleVerifySearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = verifyQuery.trim();
    if (!query) return;

    setIsVerifying(true);
    setVerifyResult({ searched: false });

    try {
      const normalizedQuery = query.toLowerCase();

      // Search local registry first
      const localMatches = certificates.filter((c) => {
        const certNum = (c.certificateNumber || '').toLowerCase();
        const partName = (c.participantName || c.fullName || '').toLowerCase();
        const pledgeId = (c.pledgeId || c.id || c.certificateId || '').toLowerCase();
        const date = (c.issueDate || c.pledgeDate || c.createdAt || '').toLowerCase();

        if (searchField === 'number') return certNum.includes(normalizedQuery);
        if (searchField === 'name') return partName.includes(normalizedQuery);
        if (searchField === 'pledgeId') return pledgeId.includes(normalizedQuery);
        if (searchField === 'date') return date.includes(normalizedQuery);

        return (
          certNum.includes(normalizedQuery) ||
          partName.includes(normalizedQuery) ||
          pledgeId.includes(normalizedQuery) ||
          date.includes(normalizedQuery)
        );
      });

      // Try server endpoint if query looks like a certificate number
      let serverMatch: TigerPledgeCertificate | null = null;
      try {
        const res = await fetch(`/api/certificates/verify/${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.valid && data.certificate) {
            serverMatch = data.certificate;
          }
        }
      } catch {
        // ignore server network errors
      }

      const combined: TigerPledgeCertificate[] = [...localMatches];
      if (serverMatch && !combined.some(c => c.certificateNumber === serverMatch!.certificateNumber)) {
        combined.unshift(serverMatch);
      }

      if (combined.length > 0) {
        setVerifyResult({
          searched: true,
          certificates: combined,
          selectedCertificate: combined[0],
          isRevoked: combined[0].status === 'revoked'
        });
      } else {
        setVerifyResult({
          searched: true,
          notFound: true
        });
      }
    } catch {
      setVerifyResult({
        searched: true,
        notFound: true
      });
    } finally {
      setIsVerifying(false);
    }
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
            <span>Search & Verify Certificates</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PLEDGE GENERATION & CERTIFICATE DISPLAY */}
      {activeTab === 'pledge' && (
        <div className="space-y-10">

          {!generatedCert ? (
            /* PLEDGE FORM VIEW */
            <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-stone-200 shadow-xl p-4 sm:p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
                <div className="p-2.5 bg-amber-100 rounded-xl">
                  <Award className="w-6 h-6 text-amber-800" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-stone-900">
                    {t('pledge.form_heading') || 'Tiger Protection Pledge Form'}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500">
                    {t('pledge.form_subheading') ||
                      'Fill out your details accurately. Your name will appear on the official certificate.'}
                  </p>
                </div>
              </div>

              {/* Form Error Banner */}
              {formError && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label htmlFor="pledge-fullname" className="block text-xs sm:text-sm font-bold text-stone-800 mb-1">
                    {t('pledge.label_fullname') || 'Full Name'} <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="pledge-fullname"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Arvind Kumar / अरविंद कुमार"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 text-stone-900 text-sm"
                  />
                </div>

                {/* City & State */}
                <div>
                  <label htmlFor="pledge-location" className="block text-xs sm:text-sm font-bold text-stone-800 mb-1">
                    {t('pledge.label_location') || 'City & State / District'} <span className="text-rose-600">*</span>
                  </label>
                  <input
                    id="pledge-location"
                    type="text"
                    required
                    value={cityAndState}
                    onChange={(e) => setCityAndState(e.target.value)}
                    placeholder="e.g. West Champaran, Bihar"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 text-stone-900 text-sm"
                  />
                </div>

                {/* Country */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="pledge-country" className="block text-xs sm:text-sm font-bold text-stone-800 mb-1">
                      {t('pledge.label_country') || 'Country'}
                    </label>
                    <input
                      id="pledge-country"
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="India"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 text-stone-900 text-sm"
                    />
                  </div>

                  {/* Certificate Language */}
                  <div>
                    <label htmlFor="pledge-language" className="block text-xs sm:text-sm font-bold text-stone-800 mb-1">
                      {t('pledge.label_language') || 'Certificate Language'}
                    </label>
                    <select
                      id="pledge-language"
                      value={certLanguage}
                      onChange={(e) => setCertLanguage(e.target.value as 'en' | 'hi' | 'ur')}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 text-stone-900 text-sm bg-white"
                    >
                      <option value="en">English (Official Standard)</option>
                      <option value="hi">हिंदी (Hindi)</option>
                      <option value="ur">اردو (Urdu)</option>
                    </select>
                  </div>
                </div>

                {/* Email Address (Optional) */}
                <div>
                  <label htmlFor="pledge-email" className="block text-xs sm:text-sm font-bold text-stone-800 mb-1">
                    {t('pledge.label_email') || 'Email Address'} <span className="text-xs font-normal text-stone-500">(Optional - for personal copy)</span>
                  </label>
                  <input
                    id="pledge-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. arvind@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 text-stone-900 text-sm"
                  />
                </div>

                {/* School / College / Organization (Optional) */}
                <div>
                  <label htmlFor="pledge-org" className="block text-xs sm:text-sm font-bold text-stone-800 mb-1">
                    {t('pledge.label_org') || 'School / College / Organization'} <span className="text-xs font-normal text-stone-500">(Optional)</span>
                  </label>
                  <input
                    id="pledge-org"
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="e.g. Bettiah Wildlife Club"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 text-stone-900 text-sm"
                  />
                </div>

                {/* Mandatory Pledge Affirmation Checkbox */}
                <div className="pt-2">
                  <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
                    <input
                      id="pledge-agree-checkbox"
                      type="checkbox"
                      required
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

                {/* Privacy Notice */}
                <div className="text-[11px] text-stone-500 flex items-center gap-1.5 pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>No Aadhaar, PAN, phone number, or sensitive personal data is ever collected.</span>
                </div>

                {/* Generate Button */}
                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isCertificateGenerating || !agreedToPledge || !fullName.trim() || !cityAndState.trim()}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-900 text-white font-bold text-base shadow-lg shadow-emerald-900/20 hover:from-emerald-700 hover:to-emerald-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isCertificateGenerating ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Generating Certificate...</span>
                      </>
                    ) : (
                      <>
                        <Award className="w-5 h-5 text-amber-400" />
                        <span>Generate Certificate</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* CERTIFICATE DISPLAY & DOWNLOAD VIEW */
            <div id="generated-certificate-section" className="space-y-8">
              
              {/* Duplicate Detection Notice OR Success Banner */}
              {alreadyIssuedNotice ? (
                <div className="no-print p-5 rounded-2xl bg-amber-50 border-2 border-amber-400 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-6 h-6 text-amber-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-amber-950">
                        Certificate already issued
                      </h3>
                      <p className="text-xs sm:text-sm text-amber-900">
                        A permanent certificate is already recorded for this participant with Certificate Number{' '}
                        <span className="font-mono font-bold text-emerald-950 bg-amber-200/80 px-1.5 py-0.5 rounded">
                          {generatedCert.certificateNumber}
                        </span>
                        . Your authentic record is displayed below.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="px-4 py-2 rounded-xl bg-white border border-amber-300 text-amber-900 font-bold text-xs sm:text-sm hover:bg-amber-100/50 transition flex items-center gap-1.5 shrink-0 shadow-sm"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Take New Pledge</span>
                  </button>
                </div>
              ) : (
                <div className="no-print p-5 rounded-2xl bg-emerald-50 border border-emerald-300 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-emerald-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-emerald-950">
                        Pledge Recorded & Certificate Ready!
                      </h3>
                      <p className="text-xs sm:text-sm text-emerald-800">
                        Thank you for your commitment to tiger conservation. Assigned Certificate Number:{' '}
                        <span className="font-mono font-bold text-emerald-950 bg-emerald-200/80 px-1.5 py-0.5 rounded">
                          {generatedCert.certificateNumber}
                        </span>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetForm}
                      className="px-3.5 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-900 font-semibold text-xs sm:text-sm hover:bg-emerald-100/40 transition flex items-center gap-1.5 shadow-sm"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Take Another Pledge</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Mobile Orientation / Swipe Helper */}
              <div className="sm:hidden flex items-center justify-between text-[11px] text-stone-500 px-1 py-1 font-mono">
                <span>↔ Swipe horizontally to view full certificate</span>
                <span className="text-emerald-800 font-bold">Landscape supported</span>
              </div>

              {/* High-Resolution Certificate Render Container */}
              <div className="w-full max-w-full overflow-x-auto py-2 px-1 rounded-xl scrollbar-thin flex justify-start sm:justify-center touch-pan-x overscroll-x-contain">
                <div className="min-w-[620px] sm:min-w-[720px] md:min-w-0 w-full max-w-[860px] shrink-0">
                  <CertificatePreview
                    ref={certRef}
                    certificate={generatedCert}
                    settings={certificateSettings}
                  />
                </div>
              </div>

              {/* Status Message (Download Success, In-Progress, or Error Notification) */}
              {downloadStatus && (
                <div
                  id="certificate-download-status"
                  className={`no-print max-w-2xl mx-auto p-4 rounded-xl border flex items-center justify-between gap-3 shadow-sm transition-all ${
                    downloadStatus.type === 'loading'
                      ? 'bg-blue-50 border-blue-300 text-blue-950'
                      : downloadStatus.type === 'success'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-rose-50 border-rose-300 text-rose-950'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {downloadStatus.type === 'loading' ? (
                      <RefreshCw className="w-5 h-5 text-blue-700 animate-spin shrink-0" />
                    ) : downloadStatus.type === 'success' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                    <span className="text-xs sm:text-sm font-bold">
                      {downloadStatus.message}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {downloadStatus.type === 'error' && downloadStatus.onRetry && (
                      <button
                        type="button"
                        onClick={downloadStatus.onRetry}
                        className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Retry</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setDownloadStatus(null)}
                      className="text-stone-400 hover:text-stone-700 text-sm font-bold px-2 py-1"
                      aria-label="Dismiss message"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              {/* DOWNLOAD & ACTION BUTTONS BELOW CERTIFICATE */}
              <div className="no-print max-w-3xl mx-auto space-y-3">
                {/* Primary Download Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Download Certificate as PDF */}
                  <button
                    type="button"
                    id="btn-download-certificate-pdf"
                    onClick={handleDownloadPdf}
                    disabled={isExporting}
                    className="py-3.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isExporting && exportActionName === 'PDF' ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Generating PDF...</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5 text-emerald-200" />
                        <span>Download PDF</span>
                      </>
                    )}
                  </button>

                  {/* Download Certificate as JPG */}
                  <button
                    type="button"
                    id="btn-download-certificate-jpg"
                    onClick={handleDownloadJpg}
                    disabled={isExporting}
                    className="py-3.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isExporting && exportActionName === 'JPG' ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Generating JPG...</span>
                      </>
                    ) : (
                      <>
                        <FileImage className="w-5 h-5 text-amber-200" />
                        <span>Download JPG</span>
                      </>
                    )}
                  </button>

                  {/* Download Certificate as PNG */}
                  <button
                    type="button"
                    id="btn-download-certificate-png"
                    onClick={handleDownloadPng}
                    disabled={isExporting}
                    className="py-3.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-900 active:bg-black text-white font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isExporting && exportActionName === 'PNG' ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Generating PNG...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5 text-stone-300" />
                        <span>Download PNG</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Secondary Utility Controls (Print & Share) */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-1 text-xs sm:text-sm">
                  <button
                    type="button"
                    id="btn-print-certificate"
                    onClick={handlePrint}
                    disabled={isExporting}
                    className="px-5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-700 font-bold hover:bg-stone-50 transition flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    <Printer className="w-4 h-4 text-stone-600" />
                    <span>Print Certificate</span>
                  </button>

                  <button
                    type="button"
                    id="btn-share-certificate"
                    onClick={handleShare}
                    disabled={isExporting}
                    className="px-5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-700 font-bold hover:bg-stone-50 transition flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    <Share2 className="w-4 h-4 text-emerald-700" />
                    <span>Share Certificate</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyVerificationLink}
                    className="px-5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-700 font-bold hover:bg-stone-50 transition flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-stone-600" />}
                    <span>{copiedLink ? 'Copied Link' : 'Copy Verification Link'}</span>
                  </button>
                </div>
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

      {/* TAB 2: CERTIFICATE SEARCH & VERIFICATION PORTAL */}
      {activeTab === 'verify' && (
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xl p-4 sm:p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-emerald-100 rounded-xl">
                <ShieldCheck className="w-6 h-6 text-emerald-800" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-stone-900">
                  {t('pledge.verify_tab') || 'Search & Verify Certificates'}
                </h2>
                <p className="text-xs sm:text-sm text-stone-600">
                  Search genuine Valmiki Tiger Watch certificates by certificate number, participant name, pledge ID, or issue date.
                </p>
              </div>
            </div>

            {/* Filter & Search Form */}
            <form onSubmit={handleVerifySearch} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="sm:w-48">
                  <select
                    value={searchField}
                    onChange={(e) => setSearchField(e.target.value as any)}
                    className="w-full py-3 px-3 rounded-xl border border-stone-300 text-stone-800 text-xs sm:text-sm font-semibold bg-stone-50 focus:ring-2 focus:ring-emerald-700"
                  >
                    <option value="all">All Fields</option>
                    <option value="number">Certificate Number</option>
                    <option value="name">Participant Name</option>
                    <option value="pledgeId">Pledge ID</option>
                    <option value="date">Issue Date</option>
                  </select>
                </div>

                <div className="relative flex-1">
                  <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={verifyQuery}
                    onChange={(e) => setVerifyQuery(e.target.value)}
                    placeholder={
                      searchField === 'number'
                        ? 'e.g. VTW-2026-000001'
                        : searchField === 'name'
                        ? 'e.g. Arvind Kumar'
                        : searchField === 'pledgeId'
                        ? 'e.g. pledge_...'
                        : searchField === 'date'
                        ? 'e.g. 09 Sep 2026'
                        : 'Search by Number, Name, Pledge ID, or Date...'
                    }
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 text-stone-900 text-sm font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isVerifying || !verifyQuery.trim()}
                  className="px-6 py-3 rounded-xl bg-emerald-800 text-white font-bold text-sm hover:bg-emerald-900 transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isVerifying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  <span>Search</span>
                </button>
              </div>
            </form>

            {/* Verification Result Display */}
            {verifyResult.searched && (
              <div className="mt-6 pt-6 border-t border-stone-200">
                {verifyResult.notFound && (
                  <div className="p-5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-sm">
                        No Certificate Found
                      </div>
                      <div className="text-xs text-amber-700 mt-1">
                        No record matching &ldquo;{verifyQuery}&rdquo; was found in the official registry. Please check for spelling mistakes or ensure the correct format was entered.
                      </div>
                    </div>
                  </div>
                )}

                {verifyResult.certificates && verifyResult.certificates.length > 0 && (
                  <div className="space-y-6">
                    {/* If multiple matches, show selector list */}
                    {verifyResult.certificates.length > 1 && (
                      <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                        <div className="text-xs font-bold text-stone-700 mb-2">
                          Found {verifyResult.certificates.length} matching certificates:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {verifyResult.certificates.map((cert) => (
                            <button
                              key={cert.certificateNumber}
                              type="button"
                              onClick={() => setVerifyResult(prev => ({
                                ...prev,
                                selectedCertificate: cert,
                                isRevoked: cert.status === 'revoked'
                              }))}
                              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                                verifyResult.selectedCertificate?.certificateNumber === cert.certificateNumber
                                  ? 'bg-emerald-800 text-white shadow-sm'
                                  : 'bg-white border border-stone-300 text-stone-800 hover:bg-stone-100'
                              }`}
                            >
                              {cert.certificateNumber} ({cert.participantName || cert.fullName})
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {verifyResult.selectedCertificate && (
                      <>
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
                                {verifyResult.selectedCertificate.certificateNumber}
                              </div>
                            </div>
                          </div>

                          <div className="text-right text-xs">
                            <div className="text-stone-500 font-medium">Issue Date</div>
                            <div className="font-bold text-stone-800">
                              {verifyResult.selectedCertificate.issueDate || verifyResult.selectedCertificate.pledgeDate}
                            </div>
                          </div>
                        </div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                          <div>
                            <span className="text-stone-500 font-medium block">Pledged Recipient:</span>
                            <span className="font-bold text-stone-900 text-sm">
                              {verifyResult.selectedCertificate.participantName || verifyResult.selectedCertificate.fullName}
                            </span>
                          </div>

                          <div>
                            <span className="text-stone-500 font-medium block">Location:</span>
                            <span className="font-bold text-stone-900 text-sm">
                              {verifyResult.selectedCertificate.cityAndState}, {verifyResult.selectedCertificate.country || 'India'}
                            </span>
                          </div>

                          {verifyResult.selectedCertificate.pledgeId && (
                            <div>
                              <span className="text-stone-500 font-medium block">Pledge ID:</span>
                              <span className="font-mono font-semibold text-stone-800">
                                {verifyResult.selectedCertificate.pledgeId}
                              </span>
                            </div>
                          )}

                          {verifyResult.selectedCertificate.organization && (
                            <div>
                              <span className="text-stone-500 font-medium block">Organisation:</span>
                              <span className="font-bold text-emerald-800 text-sm">
                                {verifyResult.selectedCertificate.organization}
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
                        <div className="pt-2 w-full max-w-full overflow-hidden">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3 text-center">
                            Registry Certificate Rendering
                          </h4>
                          <div className="w-full max-w-full overflow-x-auto py-2 px-1 rounded-xl scrollbar-thin flex justify-start sm:justify-center touch-pan-x overscroll-x-contain">
                            <div className="min-w-[620px] sm:min-w-[720px] md:min-w-0 w-full max-w-[860px] shrink-0">
                              <CertificatePreview
                                certificate={verifyResult.selectedCertificate}
                                settings={certificateSettings}
                              />
                            </div>
                          </div>
                        </div>
                      </>
                    )}
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
