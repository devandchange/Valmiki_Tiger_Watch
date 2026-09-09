import React, { useState, useRef } from 'react';
import {
  Award,
  Search,
  Filter,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Save,
  Download,
  Eye,
  CheckCircle2,
  XCircle,
  FileText,
  Upload,
  RefreshCw,
  Clock,
  UserCheck,
  Building,
  Globe,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { TigerPledgeCertificate, CertificateAdminSettings } from '../../types';
import { CertificatePreview } from '../CertificatePreview';
import { downloadCertificateAsPdf, downloadCertificateAsPng } from '../../utils/certificateExporter';

interface CertificatesAdminTabProps {
  showToast: (msg: string) => void;
}

export const CertificatesAdminTab: React.FC<CertificatesAdminTabProps> = ({ showToast }) => {
  const {
    certificates,
    certificateSettings,
    updateCertificateSettings,
    revokePledgeCertificate,
    restorePledgeCertificate,
    refreshCertificates
  } = useData();

  // Sub-tab: 'registry' | 'signature' | 'wording'
  const [subTab, setSubTab] = useState<'registry' | 'signature' | 'wording'>('registry');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'revoked'>('all');

  // Modal / Detail view
  const [selectedCert, setSelectedCert] = useState<TigerPledgeCertificate | null>(null);
  const [revokingCert, setRevokingCert] = useState<TigerPledgeCertificate | null>(null);
  const [revocationReason, setRevocationReason] = useState('Violation of wildlife reserve protocols / improper submission');
  const [isProcessingRevocation, setIsProcessingRevocation] = useState(false);

  // Settings State Form
  const [signatureName, setSignatureName] = useState(certificateSettings.signatureName || 'Nazish Asad');
  const [signatureTitle, setSignatureTitle] = useState(certificateSettings.signatureTitle || 'President');
  const [signatureOrg, setSignatureOrg] = useState(certificateSettings.signatureOrg || 'Valmiki Tiger Watch');
  const [customSignatureUrl, setCustomSignatureUrl] = useState(
    certificateSettings.customSignatureUrl || '/assets/president-signature.png'
  );
  const [customLogoUrl, setCustomLogoUrl] = useState(certificateSettings.customLogoUrl || '/vtw-logo.png');
  const [certificatePrefix, setCertificatePrefix] = useState(certificateSettings.numberingPrefix || certificateSettings.certificatePrefix || 'VTW-TPP');

  // Wording state
  const [wordingLang, setWordingLang] = useState<'en' | 'hi' | 'ur'>('en');
  const [headerTexts, setHeaderTexts] = useState(certificateSettings.headerText || {
    en: 'VALMIKI TIGER WATCH',
    hi: 'वाल्मीकि टाइगर वॉच',
    ur: 'والمیکی ٹائیگر واچ'
  });
  const [titleTexts, setTitleTexts] = useState(certificateSettings.titleText || {
    en: 'CERTIFICATE OF TIGER PROTECTION PLEDGE',
    hi: 'बाघ संरक्षण संकल्प प्रमाण पत्र',
    ur: 'تحفظِ شیر عہد نامہ سرٹیفکیٹ'
  });
  const [presentedToTexts, setPresentedToTexts] = useState(certificateSettings.presentedToText || {
    en: 'This is to proudly certify that',
    hi: 'यह प्रमाण पत्र गर्व के साथ प्रदान किया जाता है',
    ur: 'یہ سرٹیفکیٹ فخر کے ساتھ پیش کیا جاتا ہے بحق'
  });
  const [pledgeBodyTexts, setPledgeBodyTexts] = useState(certificateSettings.pledgeBodyText || {
    en: 'has voluntarily taken the sacred pledge to support tiger conservation, protect wildlife, respect forest laws, and actively champion the survival of wild tigers and their natural forest habitat in Valmiki Tiger Reserve and across India.',
    hi: 'बाघ संरक्षण का स्वेच्छा से समर्थन करने, वन्यजीवों की रक्षा करने, वन नियमों का सम्मान करने और वाल्मीकि टाइगर रिज़र्व व पूरे भारत में बाघों तथा उनके प्राकृतिक आवास के संरक्षण में योगदान देने के संकल्प हेतु।',
    ur: 'شیروں کے تحفظ کی رضاکارانہ حمایت، جنگلی حیات کی بقا، جنگل کے قوانین کے احترام اور والمیکی ٹائیگر ریزرو و پورے بھارت میں شیروں اور ان کے قدرتی مسکن کے تحفظ میں اپنا کردار ادا کرنے کا پختہ عہد کرنے پر۔'
  });
  const [disclaimerTexts, setDisclaimerTexts] = useState(certificateSettings.disclaimerText || {
    en: 'This is a voluntary conservation pledge certificate issued by Valmiki Tiger Watch to recognize individual community commitment to wildlife protection. It is not an official government certificate, employment credential, or formal academic qualification.',
    hi: 'यह वाल्मीकि टाइगर वॉच द्वारा वन्यजीव संरक्षण के प्रति व्यक्तिगत सामुदायिक प्रतिबद्धता को सम्मानित करने हेतु जारी एक स्वैच्छिक संकल्प प्रमाण पत्र है। यह कोई सरकारी दस्तावेज, रोजगार प्रमाण पत्र या शैक्षणिक उपाधि नहीं है।',
    ur: 'یہ والمیکی ٹائیگر واچ کی جانب سے جنگلی حیات کے تحفظ کے لیے انفرادی عزم کو سراہنے کے لیے جاری کردہ ایک رضاکارانہ عہد نامہ سرٹیفکیٹ ہے۔ یہ کوئی سرکاری سند، ملازمت کا پروانہ یا تعلیمی ڈگری نہیں ہے۔'
  });

  const previewCertRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  // File upload helper for custom signature
  const handleSignatureFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const dataUrl = uploadEvent.target?.result as string;
        setCustomSignatureUrl(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // File upload helper for logo
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const dataUrl = uploadEvent.target?.result as string;
        setCustomLogoUrl(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Settings
  const handleSaveSettings = async () => {
    const updatedSettings: Partial<CertificateAdminSettings> = {
      signatureName: signatureName.trim(),
      signatureTitle: signatureTitle.trim(),
      signatureOrg: signatureOrg.trim(),
      customSignatureUrl: customSignatureUrl.trim() || undefined,
      customLogoUrl: customLogoUrl.trim() || undefined,
      numberingPrefix: certificatePrefix.trim(),
      certificatePrefix: certificatePrefix.trim(),
      headerText: headerTexts,
      titleText: titleTexts,
      presentedToText: presentedToTexts,
      pledgeBodyText: pledgeBodyTexts,
      disclaimerText: disclaimerTexts,
      lastUpdated: new Date().toISOString()
    };

    await updateCertificateSettings(updatedSettings);
    showToast('Certificate administration settings updated successfully');
  };

  // Reset to Defaults
  const handleResetSettings = () => {
    setSignatureName('Nazish Asad');
    setSignatureTitle('President');
    setSignatureOrg('Valmiki Tiger Watch');
    setCustomSignatureUrl('/assets/president-signature.png');
    setCustomLogoUrl('/vtw-logo.png');
    setCertificatePrefix('VTW-TPP');
    showToast('Reset settings to standard defaults');
  };

  // Confirm Revocation
  const handleConfirmRevoke = async () => {
    if (!revokingCert) return;
    setIsProcessingRevocation(true);
    try {
      const res = await revokePledgeCertificate(revokingCert.certificateNumber, revocationReason);
      showToast(res.message);
      setRevokingCert(null);
    } catch (e: any) {
      showToast(e.message || 'Revocation failed');
    } finally {
      setIsProcessingRevocation(false);
    }
  };

  // Handle Restore
  const handleRestore = async (cert: TigerPledgeCertificate) => {
    try {
      const res = await restorePledgeCertificate(cert.certificateNumber);
      showToast(res.message);
    } catch (e: any) {
      showToast(e.message || 'Restore failed');
    }
  };

  // Filtered Certificates
  const filteredCerts = certificates.filter(c => {
    const matchesStatus =
      statusFilter === 'all' ? true :
      statusFilter === 'active' ? c.status !== 'revoked' :
      c.status === 'revoked';

    if (!matchesStatus) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.certificateNumber.toLowerCase().includes(q) ||
      c.fullName.toLowerCase().includes(q) ||
      c.cityAndState.toLowerCase().includes(q) ||
      (c.organization && c.organization.toLowerCase().includes(q))
    );
  });

  const totalIssued = certificates.length;
  const activeCount = certificates.filter(c => c.status !== 'revoked').length;
  const revokedCount = certificates.filter(c => c.status === 'revoked').length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Overview Metrics */}
      <div className="bg-gradient-to-r from-emerald-900 via-stone-900 to-emerald-950 text-white p-6 rounded-2xl border border-emerald-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 rounded-xl border border-amber-500/30 text-amber-400">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">Tiger Protection Pledge & Certificates</h3>
              <p className="text-xs text-stone-300 mt-0.5">
                Official registry management, signatory authority, wording localization, and revocation controls.
              </p>
            </div>
          </div>

          {/* Quick Counts */}
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 bg-black/30 rounded-xl border border-white/10 text-center">
              <span className="block text-[10px] uppercase font-mono text-stone-400">Total Issued</span>
              <span className="text-lg font-bold text-amber-400 font-mono">{totalIssued}</span>
            </div>
            <div className="px-3.5 py-2 bg-black/30 rounded-xl border border-white/10 text-center">
              <span className="block text-[10px] uppercase font-mono text-stone-400">Active</span>
              <span className="text-lg font-bold text-emerald-400 font-mono">{activeCount}</span>
            </div>
            <div className="px-3.5 py-2 bg-black/30 rounded-xl border border-white/10 text-center">
              <span className="block text-[10px] uppercase font-mono text-stone-400">Revoked</span>
              <span className="text-lg font-bold text-red-400 font-mono">{revokedCount}</span>
            </div>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={() => setSubTab('registry')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              subTab === 'registry'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'bg-white/10 text-stone-300 hover:bg-white/20'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Certificate Registry ({totalIssued})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('signature')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              subTab === 'signature'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'bg-white/10 text-stone-300 hover:bg-white/20'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Signature & Branding</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab('wording')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              subTab === 'wording'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'bg-white/10 text-stone-300 hover:bg-white/20'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Wording & Translations</span>
          </button>
        </div>
      </div>

      {/* SUBTAB 1: CERTIFICATE REGISTRY */}
      {subTab === 'registry' && (
        <div className="space-y-4">
          {/* Controls Bar: Search & Status Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, number, city..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-900 focus:ring-1 focus:ring-emerald-700 bg-white"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-stone-300 text-xs">
                <button
                  type="button"
                  onClick={() => setStatusFilter('all')}
                  className={`px-2.5 py-1 rounded-md font-medium transition ${
                    statusFilter === 'all' ? 'bg-stone-800 text-white' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  All ({totalIssued})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('active')}
                  className={`px-2.5 py-1 rounded-md font-medium transition ${
                    statusFilter === 'active' ? 'bg-emerald-800 text-white' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Active ({activeCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('revoked')}
                  className={`px-2.5 py-1 rounded-md font-medium transition ${
                    statusFilter === 'revoked' ? 'bg-red-800 text-white' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Revoked ({revokedCount})
                </button>
              </div>

              <button
                type="button"
                onClick={refreshCertificates}
                className="p-1.5 rounded-lg border border-stone-300 bg-white text-stone-700 hover:bg-stone-100 transition"
                title="Refresh Registry"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Certificates Table */}
          {filteredCerts.length === 0 ? (
            <div className="p-8 text-center bg-stone-50 rounded-xl border border-stone-200">
              <Award className="w-10 h-10 text-stone-400 mx-auto mb-2" />
              <div className="text-sm font-bold text-stone-700">No certificates found</div>
              <div className="text-xs text-stone-500 mt-0.5">
                {totalIssued === 0
                  ? 'No pledges have been submitted yet. Visitors can take the pledge on the public Pledge page.'
                  : 'No records match your search query or active filter.'}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white shadow-xs">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-100 text-stone-600 font-semibold border-b border-stone-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Certificate ID</th>
                    <th className="py-3 px-4">Recipient Name</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Organisation</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredCerts.map((cert) => {
                    const isRevoked = cert.status === 'revoked';
                    return (
                      <tr key={cert.certificateNumber} className={`hover:bg-stone-50/80 transition ${isRevoked ? 'bg-red-50/40' : ''}`}>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-950">
                          {cert.certificateNumber}
                        </td>
                        <td className="py-3 px-4 font-semibold text-stone-900">
                          {cert.fullName}
                        </td>
                        <td className="py-3 px-4 text-stone-600">
                          {cert.cityAndState}
                        </td>
                        <td className="py-3 px-4 text-stone-600">
                          {cert.organization || '—'}
                        </td>
                        <td className="py-3 px-4 text-stone-500 font-medium">
                          {cert.pledgeDate}
                        </td>
                        <td className="py-3 px-4">
                          {isRevoked ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">
                              <AlertTriangle className="w-3 h-3" />
                              <span>Revoked</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Active</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right space-x-1.5">
                          {/* Preview / View */}
                          <button
                            type="button"
                            onClick={() => setSelectedCert(cert)}
                            className="px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-[11px] transition inline-flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>View</span>
                          </button>

                          {/* Revoke or Restore */}
                          {isRevoked ? (
                            <button
                              type="button"
                              onClick={() => handleRestore(cert)}
                              className="px-2 py-1 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-semibold text-[11px] transition inline-flex items-center gap-1"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Restore</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setRevokingCert(cert)}
                              className="px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-red-800 font-semibold text-[11px] transition inline-flex items-center gap-1"
                            >
                              <XCircle className="w-3 h-3" />
                              <span>Revoke</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: SIGNATURE & BRANDING */}
      {subTab === 'signature' && (
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-6">
          <div className="border-b border-stone-200 pb-3">
            <h4 className="text-base font-bold text-stone-900">Certificate Signatory & Logo Authority</h4>
            <p className="text-xs text-stone-500">
              Customize the authorized signatory block and official emblems rendered on issued certificates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-900 mb-1">
                Signatory Full Name
              </label>
              <input
                type="text"
                value={signatureName}
                onChange={(e) => setSignatureName(e.target.value)}
                placeholder="e.g. Nazish Asad"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 focus:ring-1 focus:ring-emerald-700"
              />
              <span className="text-[10px] text-stone-400">Default: Nazish Asad</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-900 mb-1">
                Signatory Title
              </label>
              <input
                type="text"
                value={signatureTitle}
                onChange={(e) => setSignatureTitle(e.target.value)}
                placeholder="e.g. President"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 focus:ring-1 focus:ring-emerald-700"
              />
              <span className="text-[10px] text-stone-400">Default: President</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-900 mb-1">
                Issuing Organisation
              </label>
              <input
                type="text"
                value={signatureOrg}
                onChange={(e) => setSignatureOrg(e.target.value)}
                placeholder="e.g. Valmiki Tiger Watch"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 focus:ring-1 focus:ring-emerald-700"
              />
              <span className="text-[10px] text-stone-400">Default: Valmiki Tiger Watch</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Custom Signature Image */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
              <label className="block text-xs font-bold text-stone-900">
                Digital Signature Image (Optional)
              </label>
              <p className="text-[11px] text-stone-500">
                Upload a transparent PNG signature scan or specify a web URL. If empty, an elegant calligraphy signature font is used automatically.
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSignatureUrl}
                  onChange={(e) => setCustomSignatureUrl(e.target.value)}
                  placeholder="https://example.com/signature.png"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-900"
                />
                <label className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold rounded-lg cursor-pointer transition flex items-center gap-1 shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml"
                    onChange={handleSignatureFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {customSignatureUrl && (
                <div className="p-2 bg-white rounded-lg border border-stone-200 flex items-center justify-between">
                  <div className="h-10">
                    <img
                      src={customSignatureUrl}
                      alt="Signature Preview"
                      className="h-full object-contain"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setCustomSignatureUrl('')}
                    className="text-red-600 hover:text-red-700 text-xs font-semibold"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Custom Logo */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
              <label className="block text-xs font-bold text-stone-900">
                Official Crest / Logo Image
              </label>
              <p className="text-[11px] text-stone-500">
                Displayed in the top medallion seal of the certificate header. Defaults to Valmiki Tiger Watch emblem.
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customLogoUrl}
                  onChange={(e) => setCustomLogoUrl(e.target.value)}
                  placeholder="/vtw-logo.png"
                  className="flex-1 px-3 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-900"
                />
                <label className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold rounded-lg cursor-pointer transition flex items-center gap-1 shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/svg+xml"
                    onChange={handleLogoFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {customLogoUrl && (
                <div className="p-2 bg-white rounded-lg border border-stone-200 flex items-center justify-between">
                  <div className="h-10 w-10">
                    <img
                      src={customLogoUrl}
                      alt="Logo Preview"
                      className="h-full w-full object-contain"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setCustomLogoUrl('/vtw-logo.png')}
                    className="text-stone-600 hover:text-stone-800 text-xs font-semibold"
                  >
                    Reset to Default
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={handleResetSettings}
              className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-semibold transition"
            >
              Reset to Defaults
            </button>

            <button
              type="button"
              onClick={handleSaveSettings}
              className="px-5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Authority Settings</span>
            </button>
          </div>
        </div>
      )}

      {/* SUBTAB 3: WORDING & TRANSLATIONS */}
      {subTab === 'wording' && (
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h4 className="text-base font-bold text-stone-900">Certificate Wording & Translations</h4>
              <p className="text-xs text-stone-500">
                Customize titles, pledge declarations, and disclaimer language across English, Hindi, and Urdu.
              </p>
            </div>

            {/* Language Selector for editor */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200 text-xs">
              <button
                type="button"
                onClick={() => setWordingLang('en')}
                className={`px-3 py-1 rounded-md font-bold transition ${
                  wordingLang === 'en' ? 'bg-emerald-800 text-white' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setWordingLang('hi')}
                className={`px-3 py-1 rounded-md font-bold transition ${
                  wordingLang === 'hi' ? 'bg-emerald-800 text-white' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setWordingLang('ur')}
                className={`px-3 py-1 rounded-md font-bold transition ${
                  wordingLang === 'ur' ? 'bg-emerald-800 text-white' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                اردو
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-900 mb-1">
                Header Institution Text ({wordingLang.toUpperCase()})
              </label>
              <input
                type="text"
                value={headerTexts[wordingLang] || ''}
                onChange={(e) => setHeaderTexts({ ...headerTexts, [wordingLang]: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 focus:ring-1 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-900 mb-1">
                Certificate Title Text ({wordingLang.toUpperCase()})
              </label>
              <input
                type="text"
                value={titleTexts[wordingLang] || ''}
                onChange={(e) => setTitleTexts({ ...titleTexts, [wordingLang]: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 focus:ring-1 focus:ring-emerald-700 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-900 mb-1">
                Presented To Heading ({wordingLang.toUpperCase()})
              </label>
              <input
                type="text"
                value={presentedToTexts[wordingLang] || ''}
                onChange={(e) => setPresentedToTexts({ ...presentedToTexts, [wordingLang]: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 focus:ring-1 focus:ring-emerald-700 font-serif italic"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-900 mb-1">
                Pledge Declaration Narrative ({wordingLang.toUpperCase()})
              </label>
              <textarea
                rows={3}
                value={pledgeBodyTexts[wordingLang] || ''}
                onChange={(e) => setPledgeBodyTexts({ ...pledgeBodyTexts, [wordingLang]: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 focus:ring-1 focus:ring-emerald-700 leading-relaxed font-serif"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-900 mb-1">
                Legal / Scope Disclaimer ({wordingLang.toUpperCase()})
              </label>
              <textarea
                rows={2}
                value={disclaimerTexts[wordingLang] || ''}
                onChange={(e) => setDisclaimerTexts({ ...disclaimerTexts, [wordingLang]: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 focus:ring-1 focus:ring-emerald-700 text-stone-600"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={handleSaveSettings}
              className="px-5 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Wording for All Languages</span>
            </button>
          </div>
        </div>
      )}

      {/* VIEW / PREVIEW MODAL */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-stone-900 text-base">
                  Certificate Registry Record: {selectedCert.certificateNumber}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCert(null)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-500"
              >
                ✕
              </button>
            </div>

            {/* Live Certificate Preview Frame */}
            <div className="w-full max-w-full overflow-x-auto py-2 px-1 rounded-xl scrollbar-thin flex justify-start sm:justify-center touch-pan-x overscroll-x-contain">
              <div className="min-w-[620px] sm:min-w-[720px] md:min-w-0 w-full max-w-[860px] shrink-0">
                <CertificatePreview
                  ref={previewCertRef}
                  certificate={selectedCert}
                  settings={certificateSettings}
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-stone-200 text-xs">
              <div className="text-stone-500">
                Created on: <span className="font-semibold text-stone-800">{selectedCert.createdAt}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={async () => {
                    if (!previewCertRef.current) return;
                    setIsExporting(true);
                    await downloadCertificateAsPdf(previewCertRef.current, `${selectedCert.certificateNumber}.pdf`);
                    setIsExporting(false);
                  }}
                  className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-lg flex items-center gap-1 transition disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>

                <button
                  type="button"
                  disabled={isExporting}
                  onClick={async () => {
                    if (!previewCertRef.current) return;
                    setIsExporting(true);
                    await downloadCertificateAsPng(previewCertRef.current, `${selectedCert.certificateNumber}.png`);
                    setIsExporting(false);
                  }}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg flex items-center gap-1 transition disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedCert(null)}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REVOCATION MODAL */}
      {revokingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-stone-900 text-base">
                Revoke Tiger Protection Certificate
              </h3>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to revoke certificate{' '}
              <span className="font-mono font-bold text-stone-900">{revokingCert.certificateNumber}</span> issued to{' '}
              <span className="font-bold text-stone-900">{revokingCert.fullName}</span>? The certificate will be stamped as REVOKED on verification lookups and previews.
            </p>

            <div>
              <label className="block text-xs font-bold text-stone-900 mb-1">
                Reason for Revocation
              </label>
              <textarea
                rows={3}
                value={revocationReason}
                onChange={(e) => setRevocationReason(e.target.value)}
                placeholder="Specify the reason..."
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 focus:ring-1 focus:ring-red-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRevokingCert(null)}
                className="px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isProcessingRevocation || !revocationReason.trim()}
                onClick={handleConfirmRevoke}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
              >
                {isProcessingRevocation ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                <span>Confirm Revocation</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CertificatesAdminTab;
