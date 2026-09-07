import React, { forwardRef } from 'react';
import { ShieldCheck, Award, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { TigerPledgeCertificate, CertificateAdminSettings } from '../types';

interface CertificatePreviewProps {
  certificate: TigerPledgeCertificate;
  settings?: CertificateAdminSettings;
  className?: string;
  showWatermark?: boolean;
}

/**
 * CertificatePreview Component
 * Renders an authentic, conservation-themed A4 Landscape Certificate of Tiger Protection Pledge.
 * Designed with royal emerald green and warm gold motifs, ornate framing, official seals,
 * and customizable multi-language text (EN, HI, UR).
 */
export const CertificatePreview = forwardRef<HTMLDivElement, CertificatePreviewProps>(
  ({ certificate, settings, className = '', showWatermark = false }, ref) => {
    const lang = certificate.language || 'en';
    const isUrdu = lang === 'ur';

    // Text lookups with fallback to certificateSettings or defaults
    const headerOrg = settings?.headerText?.[lang] || (
      lang === 'hi' ? 'वाल्मीकि टाइगर वॉच' :
      lang === 'ur' ? 'والمیکی ٹائیگر واچ' :
      'VALMIKI TIGER WATCH'
    );

    const certTitle = settings?.titleText?.[lang] || (
      lang === 'hi' ? 'बाघ संरक्षण संकल्प प्रमाण पत्र' :
      lang === 'ur' ? 'تحفظِ شیر عہد نامہ سرٹیفکیٹ' :
      'CERTIFICATE OF TIGER PROTECTION PLEDGE'
    );

    const presentedTo = settings?.presentedToText?.[lang] || (
      lang === 'hi' ? 'यह प्रमाण पत्र गर्व के साथ प्रदान किया जाता है' :
      lang === 'ur' ? 'یہ سرٹیفکیٹ فخر کے ساتھ پیش کیا جاتا ہے بحق' :
      'This is to proudly certify that'
    );

    const pledgeBody = settings?.pledgeBodyText?.[lang] || (
      lang === 'hi' ? 'बाघ संरक्षण का स्वेच्छा से समर्थन करने, वन्यजीवों की रक्षा करने, वन नियमों का सम्मान करने और वाल्मीकि टाइगर रिज़र्व व पूरे भारत में बाघों तथा उनके प्राकृतिक आवास के संरक्षण में योगदान देने के संकल्प हेतु।' :
      lang === 'ur' ? 'شیروں کے تحفظ کی رضاکارانہ حمایت، جنگلی حیات کی بقا، جنگل کے قوانین کے احترام اور والمیکی ٹائیگر ریزرو و پورے بھارت میں شیروں اور ان کے قدرتی مسکن کے تحفظ میں اپنا کردار ادا کرنے کا پختہ عہد کرنے پر۔' :
      'has voluntarily taken the sacred pledge to support tiger conservation, protect wildlife, respect forest laws, and actively champion the survival of wild tigers and their natural forest habitat in Valmiki Tiger Reserve and across India.'
    );

    const disclaimer = settings?.disclaimerText?.[lang] || (
      lang === 'hi' ? 'यह वाल्मीकि टाइगर वॉच द्वारा वन्यजीव संरक्षण के प्रति व्यक्तिगत सामुदायिक प्रतिबद्धता को सम्मानित करने हेतु जारी एक स्वैच्छिक संकल्प प्रमाण पत्र है। यह कोई सरकारी दस्तावेज, रोजगार प्रमाण पत्र या शैक्षणिक उपाधि नहीं है।' :
      lang === 'ur' ? 'یہ والمیکی ٹائیگر واچ کی جانب سے جنگلی حیات کے تحفظ کے لیے انفرادی عزم کو سراہنے کے لیے جاری کردہ ایک رضاکارانہ عہد نامہ سرٹیفکیٹ ہے۔ یہ کوئی سرکاری سند، ملازمت کا پروانہ یا تعلیمی ڈگری نہیں ہے۔' :
      'This is a voluntary conservation pledge certificate issued by Valmiki Tiger Watch to recognize individual community commitment to wildlife protection. It is not an official government certificate, employment credential, or formal academic qualification.'
    );

    const signatureName = settings?.signatureName || 'Nazish Asad';
    const signatureTitle = settings?.signatureTitle || 'President';
    const signatureOrg = settings?.signatureOrg || 'Valmiki Tiger Watch';
    const customSigUrl = settings?.customSignatureUrl;
    const customLogoUrl = settings?.customLogoUrl || '/vtw-logo.png';

    const isRevoked = certificate.status === 'revoked';

    return (
      <div
        ref={ref}
        id={`certificate-${certificate.certificateNumber}`}
        className={`relative w-full max-w-[900px] aspect-[1.414/1] bg-[#FCFAF5] text-stone-900 select-none overflow-hidden shadow-2xl rounded-sm ${isUrdu ? 'rtl' : 'ltr'} ${className}`}
        style={{
          boxSizing: 'border-box',
          fontFamily: isUrdu
            ? "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif"
            : "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
        }}
      >
        {/* Background Subtle Watermark Tiger Motif */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035] flex items-center justify-center overflow-hidden"
          aria-hidden="true"
        >
          <svg className="w-[600px] h-[600px] text-emerald-950 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
        </div>

        {/* Ornate Gold Outer Border Frame */}
        <div className="absolute inset-3 sm:inset-4 border-[2px] border-amber-600/60 rounded-sm pointer-events-none" />
        <div className="absolute inset-4 sm:inset-5 border border-emerald-800/40 rounded-sm pointer-events-none" />
        <div className="absolute inset-[18px] sm:inset-[22px] border-[1px] border-amber-500/30 pointer-events-none" />

        {/* Corner Flourish Motifs */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-600 pointer-events-none" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-600 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-amber-600 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-600 pointer-events-none" />

        {/* Main Certificate Content Container */}
        <div className="relative z-10 h-full flex flex-col justify-between p-6 sm:p-8 md:p-10">
          
          {/* Header Section */}
          <div className="text-center pt-1">
            {/* Crest / Logo & Header Branding */}
            <div className="flex items-center justify-center gap-3 mb-1.5">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-amber-500/70 p-1 bg-amber-50/70 shadow-sm flex items-center justify-center overflow-hidden">
                {customLogoUrl ? (
                  <img
                    src={customLogoUrl}
                    alt="Valmiki Tiger Watch"
                    className="w-full h-full object-contain"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <ShieldCheck className="w-6 h-6 text-emerald-800" />
                )}
              </div>
              <div className="text-left">
                <span className="block text-[13px] sm:text-[15px] font-black tracking-widest text-emerald-900 uppercase">
                  {headerOrg}
                </span>
                <span className="block text-[9px] sm:text-[10px] tracking-wider text-amber-800 font-semibold uppercase">
                  Valmiki Tiger Reserve • Bihar • India
                </span>
              </div>
            </div>

            {/* Decorative Gold Divider with Center Star */}
            <div className="flex items-center justify-center gap-2 my-1">
              <div className="w-16 sm:w-28 h-[1px] bg-gradient-to-r from-transparent via-amber-600/70 to-amber-700" />
              <div className="w-2 h-2 rotate-45 bg-amber-600" />
              <div className="w-16 sm:w-28 h-[1px] bg-gradient-to-l from-transparent via-amber-600/70 to-amber-700" />
            </div>

            {/* Certificate Title */}
            <h1 className="text-lg sm:text-xl md:text-2xl font-black tracking-wide text-stone-900 uppercase mt-1">
              {certTitle}
            </h1>
            <p className="text-[10px] sm:text-[11px] font-medium text-stone-600 tracking-wider uppercase mt-0.5">
              Community Tiger Conservation & Habitat Protection Initiative
            </p>
          </div>

          {/* Recipient & Pledge Statement */}
          <div className="text-center my-auto py-2">
            <p className="text-xs sm:text-sm text-stone-600 font-serif italic mb-1">
              {presentedTo}
            </p>

            {/* Recipient Full Name */}
            <div className="inline-block relative px-6 py-1 my-0.5">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-emerald-950 tracking-wide font-serif">
                {certificate.fullName}
              </h2>
              {/* Elegant underline */}
              <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-amber-600 to-transparent mt-1" />
            </div>

            {/* Location & Organization details */}
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 text-xs sm:text-sm text-stone-700 font-medium mt-1">
              <span>
                {certificate.cityAndState}
                {certificate.country && certificate.country !== 'India' ? `, ${certificate.country}` : ', India'}
              </span>
              {certificate.organization && (
                <>
                  <span className="text-amber-700">•</span>
                  <span className="text-emerald-800 font-semibold">{certificate.organization}</span>
                </>
              )}
            </div>

            {/* Pledge Body Narrative */}
            <p className="max-w-xl mx-auto text-xs sm:text-[13px] md:text-sm text-stone-700 leading-relaxed font-serif mt-3 px-4">
              {pledgeBody}
            </p>
          </div>

          {/* Footer Section: Cert Number, Seal, Signature */}
          <div className="pt-2 border-t border-amber-600/30">
            <div className="grid grid-cols-3 items-end gap-2 text-left">
              
              {/* Left Column: Certificate Identifier & Date */}
              <div className="space-y-0.5">
                <div className="text-[9px] sm:text-[10px] uppercase tracking-wider text-stone-500 font-semibold">
                  Certificate Number
                </div>
                <div className="text-xs sm:text-sm font-mono font-bold text-emerald-950 tracking-tight">
                  {certificate.certificateNumber}
                </div>
                <div className="text-[9px] sm:text-[10px] text-stone-600 font-medium">
                  Issued: <span className="font-semibold text-stone-800">{certificate.pledgeDate}</span>
                </div>
              </div>

              {/* Center Column: Official Golden Seal */}
              <div className="flex flex-col items-center justify-center text-center">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-0.5 shadow-md flex items-center justify-center">
                  <div className="w-full h-full rounded-full border border-amber-200/50 flex flex-col items-center justify-center bg-emerald-950 text-amber-300 p-1">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 mb-0.5" />
                    <span className="text-[6px] sm:text-[7px] font-black tracking-tighter uppercase leading-tight">
                      VTW OFFICIAL
                    </span>
                    <span className="text-[5px] sm:text-[6px] text-amber-200/80 uppercase">
                      VERIFIED SEAL
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Signature Block */}
              <div className="text-right space-y-0.5">
                {customSigUrl ? (
                  <div className="h-8 sm:h-10 flex justify-end">
                    <img
                      src={customSigUrl}
                      alt="Signature"
                      className="h-full object-contain"
                      crossOrigin="anonymous"
                    />
                  </div>
                ) : (
                  <div className="h-8 sm:h-9 flex items-end justify-end">
                    <span className="font-serif italic text-base sm:text-lg text-emerald-900 font-bold pr-1">
                      {signatureName}
                    </span>
                  </div>
                )}
                <div className="w-32 sm:w-40 ml-auto h-[1px] bg-stone-500" />
                <div className="text-xs sm:text-sm font-bold text-stone-900 leading-tight">
                  {signatureName}
                </div>
                <div className="text-[9px] sm:text-[10px] text-stone-600 font-medium leading-tight">
                  {signatureTitle}, {signatureOrg}
                </div>
              </div>

            </div>

            {/* Disclaimer in Fine Print */}
            <div className="mt-2.5 pt-1.5 border-t border-stone-200/70 text-center">
              <p className="text-[7.5px] sm:text-[8.5px] text-stone-500 leading-tight font-sans max-w-2xl mx-auto">
                {disclaimer}
              </p>
            </div>
          </div>

        </div>

        {/* Revocation Overlay (if status is revoked) */}
        {isRevoked && (
          <div className="absolute inset-0 bg-red-950/20 backdrop-blur-[1px] flex flex-col items-center justify-center z-30 pointer-events-none p-6">
            <div className="transform -rotate-12 border-4 border-red-700 bg-red-900/90 text-white px-8 py-3 rounded shadow-2xl text-center">
              <div className="flex items-center justify-center gap-2 text-xl sm:text-2xl font-black uppercase tracking-widest">
                <AlertTriangle className="w-6 h-6" />
                <span>REVOKED / निरस्त</span>
              </div>
              {certificate.revocationReason && (
                <div className="text-xs sm:text-sm mt-1 text-red-100 font-medium">
                  Reason: {certificate.revocationReason}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    );
  }
);

CertificatePreview.displayName = 'CertificatePreview';
export default CertificatePreview;
