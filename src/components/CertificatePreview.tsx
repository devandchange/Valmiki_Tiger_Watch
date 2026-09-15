import React, { forwardRef, useState, useEffect } from 'react';
import { ShieldCheck, Award, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { TigerPledgeCertificate, CertificateAdminSettings } from '../types';
import { PRESIDENT_SIGNATURE_DATA_URL, VTW_LOGO_DATA_URL, VTW_OFFICIAL_SEAL_DATA_URL } from '../assets/certificateImages';
import { generateCertificateQrCodeDataUrl } from '../utils/qrCodeGenerator';

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
      lang === 'ur' ? 'یہ سرٹیفکیٹ فخر کے ساتھ پیش کیا जाता ہے بحق' :
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
    
    // Use the official original signature image (Data URI guaranteed to work offline and in Android APK)
    const signatureImageUrl = (settings?.customSignatureUrl && settings.customSignatureUrl.trim().length > 0 && settings.customSignatureUrl !== '/assets/president-signature.png')
      ? settings.customSignatureUrl
      : PRESIDENT_SIGNATURE_DATA_URL;

    // Use official VTW logo (Data URI guaranteed to render without cross-origin issues)
    const customLogoUrl = (settings?.customLogoUrl && settings.customLogoUrl.trim().length > 0 && settings.customLogoUrl !== '/vtw-logo.png')
      ? settings.customLogoUrl
      : VTW_LOGO_DATA_URL;

    const isRevoked = certificate.status === 'revoked';
    const recipientName = certificate.participantName || certificate.fullName;
    const issueDateString = certificate.issueDate || certificate.pledgeFormattedDate || certificate.pledgeDate;

    // Load QR Code pointing back to the VTW conservation pledge page
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
    useEffect(() => {
      let isMounted = true;
      generateCertificateQrCodeDataUrl(certificate.certificateNumber, 200).then((url) => {
        if (isMounted && url) {
          setQrCodeUrl(url);
        }
      });
      return () => {
        isMounted = false;
      };
    }, [certificate.certificateNumber]);

    return (
      <div
        ref={ref}
        id={`certificate-${certificate.certificateNumber}`}
        className={`relative w-full max-w-[900px] aspect-[1.414/1] select-none overflow-hidden shadow-2xl rounded-sm ${isUrdu ? 'rtl' : 'ltr'} ${className}`}
        style={{
          boxSizing: 'border-box',
          backgroundColor: '#FCFAF5',
          color: '#1C1917',
          border: '1.5px solid rgba(217, 119, 6, 0.75)',
          fontFamily: isUrdu
            ? "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif"
            : "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
        }}
        data-certificate-number={certificate.certificateNumber}
        data-certificate-json={JSON.stringify(certificate)}
        data-settings-json={settings ? JSON.stringify(settings) : ''}
      >
        {/* Background Subtle Watermark Tiger Motif */}
        <div
          className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden"
          style={{ opacity: 0.035 }}
          aria-hidden="true"
        >
          <svg
            className="w-[600px] h-[600px]"
            style={{ fill: '#022C22', color: '#022C22' }}
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
          </svg>
        </div>

        {/* Ornate Gold Outer Border Frame */}
        <div
          className="absolute inset-3 sm:inset-4 rounded-sm pointer-events-none"
          style={{
            borderStyle: 'solid',
            borderWidth: '2px',
            borderColor: 'rgba(217, 119, 6, 0.7)'
          }}
        />
        <div
          className="absolute inset-4 sm:inset-5 rounded-sm pointer-events-none"
          style={{
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'rgba(6, 95, 70, 0.5)'
          }}
        />
        <div
          className="absolute inset-[18px] sm:inset-[22px] rounded-sm pointer-events-none"
          style={{
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'rgba(245, 158, 11, 0.4)'
          }}
        />

        {/* Corner Flourish Motifs */}
        <div
          className="absolute top-4 left-4 w-6 h-6 pointer-events-none"
          style={{
            borderTop: '2px solid #D97706',
            borderLeft: '2px solid #D97706'
          }}
        />
        <div
          className="absolute top-4 right-4 w-6 h-6 pointer-events-none"
          style={{
            borderTop: '2px solid #D97706',
            borderRight: '2px solid #D97706'
          }}
        />
        <div
          className="absolute bottom-4 left-4 w-6 h-6 pointer-events-none"
          style={{
            borderBottom: '2px solid #D97706',
            borderLeft: '2px solid #D97706'
          }}
        />
        <div
          className="absolute bottom-4 right-4 w-6 h-6 pointer-events-none"
          style={{
            borderBottom: '2px solid #D97706',
            borderRight: '2px solid #D97706'
          }}
        />

        {/* Main Certificate Content Container */}
        <div className="relative z-10 h-full flex flex-col justify-between p-6 sm:p-8 md:p-10">
          
          {/* Header Section */}
          <div className="text-center pt-1">
            {/* Crest / Logo & Header Branding */}
            <div className="flex items-center justify-center gap-3 mb-1.5">
              <div
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border p-1 shadow-sm flex items-center justify-center overflow-hidden"
                style={{
                  borderColor: 'rgba(245, 158, 11, 0.7)',
                  backgroundColor: 'rgba(255, 251, 235, 0.8)'
                }}
              >
                {customLogoUrl ? (
                  <img
                    src={customLogoUrl}
                    alt="Valmiki Tiger Watch"
                    className="w-full h-full object-contain"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <ShieldCheck className="w-6 h-6" style={{ color: '#064E3B' }} />
                )}
              </div>
              <div className="text-left">
                <span
                  className="block text-[13px] sm:text-[15px] font-black tracking-widest uppercase"
                  style={{ color: '#064E3B' }}
                >
                  {headerOrg}
                </span>
                <span
                  className="block text-[9px] sm:text-[10px] tracking-wider font-semibold uppercase"
                  style={{ color: '#92400E' }}
                >
                  Valmiki Tiger Reserve • Bihar • India
                </span>
              </div>
            </div>

            {/* Decorative Gold Divider with Center Star */}
            <div className="flex items-center justify-center gap-2 my-1">
              <div
                className="w-16 sm:w-28 h-[1px]"
                style={{ background: 'linear-gradient(to right, transparent, rgba(217, 119, 6, 0.7), #B45309)' }}
              />
              <div
                className="w-2 h-2 rotate-45"
                style={{ backgroundColor: '#D97706' }}
              />
              <div
                className="w-16 sm:w-28 h-[1px]"
                style={{ background: 'linear-gradient(to left, transparent, rgba(217, 119, 6, 0.7), #B45309)' }}
              />
            </div>

            {/* Certificate Title */}
            <h1
              className="text-lg sm:text-xl md:text-2xl font-black tracking-wide uppercase mt-1"
              style={{ color: '#1C1917' }}
            >
              {certTitle}
            </h1>
            <p
              className="text-[10px] sm:text-[11px] font-medium tracking-wider uppercase mt-0.5"
              style={{ color: '#57534E' }}
            >
              Community Tiger Conservation & Habitat Protection Initiative
            </p>
          </div>

          {/* Recipient & Pledge Statement */}
          <div className="text-center my-auto py-2">
            <p
              className="text-xs sm:text-sm font-serif italic mb-1"
              style={{ color: '#57534E' }}
            >
              {presentedTo}
            </p>

            {/* Recipient Full Name */}
            <div className="inline-block relative px-6 py-1 my-0.5">
              <h2
                className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wide font-serif"
                style={{ color: '#022C22' }}
              >
                {recipientName}
              </h2>
              {/* Elegant underline */}
              <div
                className="w-full h-[2px] mt-1"
                style={{ background: 'linear-gradient(to right, transparent, #D97706, transparent)' }}
              />
            </div>

            {/* Location & Organization details */}
            <div
              className="flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 text-xs sm:text-sm font-medium mt-1"
              style={{ color: '#44403C' }}
            >
              <span>
                {certificate.cityAndState}
                {certificate.country && certificate.country !== 'India' ? `, ${certificate.country}` : ', India'}
              </span>
              {certificate.organization && (
                <>
                  <span style={{ color: '#B45309' }}>•</span>
                  <span className="font-semibold" style={{ color: '#065F46' }}>
                    {certificate.organization}
                  </span>
                </>
              )}
            </div>

            {/* Pledge Body Narrative */}
            <p
              className="max-w-xl mx-auto text-xs sm:text-[13px] md:text-sm leading-relaxed font-serif mt-3 px-4"
              style={{ color: '#44403C' }}
            >
              {pledgeBody}
            </p>
          </div>

          {/* Footer Section: Cert Number, Seal, Signature */}
          <div
            className="pt-2 border-t"
            style={{ borderColor: 'rgba(217, 119, 6, 0.3)' }}
          >
            <div className="grid grid-cols-3 items-end gap-2 text-left">
              
              {/* Left Column: Certificate Identifier, Date & QR Code */}
              <div className="flex items-center gap-2 sm:gap-2.5 overflow-visible">
                {qrCodeUrl && (
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <div
                      className="p-0.5 sm:p-1 rounded shadow-xs"
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid rgba(217, 119, 6, 0.45)'
                      }}
                    >
                      <img
                        src={qrCodeUrl}
                        alt="Scan QR code to visit VTW pledge"
                        className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                        crossOrigin="anonymous"
                      />
                    </div>
                    <span
                      className="text-[6px] sm:text-[7px] font-bold tracking-tight uppercase mt-0.5"
                      style={{ color: '#064E3B' }}
                    >
                      Scan Pledge
                    </span>
                  </div>
                )}
                <div
                  data-certificate-number-container="true"
                  className="space-y-0.5 overflow-visible"
                  style={{
                    minWidth: 'max-content',
                    width: 'auto'
                  }}
                >
                  <div
                    className="text-[8px] sm:text-[9px] uppercase tracking-wider font-semibold whitespace-nowrap"
                    style={{ color: '#78716C' }}
                  >
                    Certificate Number
                  </div>
                  <div
                    data-certificate-number-display="true"
                    className="text-[11px] sm:text-xs font-mono font-bold tracking-tight whitespace-nowrap overflow-visible"
                    style={{
                      color: '#022C22',
                      textOverflow: 'clip',
                      minWidth: 'max-content',
                      width: 'max-content',
                      maxWidth: 'none',
                      display: 'block'
                    }}
                  >
                    {certificate.certificateNumber}
                  </div>
                  <div
                    className="text-[8.5px] sm:text-[9.5px] font-medium whitespace-nowrap"
                    style={{ color: '#57534E' }}
                  >
                    Issued:{' '}
                    <span className="font-semibold" style={{ color: '#292524' }}>
                      {issueDateString}
                    </span>
                  </div>
                  <div
                    className="text-[8px] sm:text-[9px] font-bold whitespace-nowrap"
                    style={{ color: isRevoked ? '#B91C1C' : '#065F46' }}
                  >
                    {isRevoked ? 'Status: Revoked' : 'Status: Verified & Active'}
                  </div>
                </div>
              </div>

              {/* Center Column: Actual Graphic Official VTW Round Seal */}
              <div className="flex flex-col items-center justify-center text-center">
                <div className="relative flex flex-col items-center justify-center">
                  <img
                    src={VTW_OFFICIAL_SEAL_DATA_URL}
                    alt="Official Round Seal — Valmiki Tiger Watch • Watch, Protect, Conserve • Est. 2024"
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-md select-none pointer-events-none"
                    crossOrigin="anonymous"
                    loading="eager"
                  />
                  <div
                    className="text-[6.5px] sm:text-[7.5px] font-mono uppercase tracking-wider font-bold mt-0.5"
                    style={{ color: '#064E3B' }}
                  >
                    Official VTW Seal
                  </div>
                </div>
              </div>

              {/* Right Column: President's Official Signature Block */}
              <div className="text-right space-y-0.5">
                <div className="h-9 sm:h-11 flex items-end justify-end pb-0.5">
                  {signatureImageUrl ? (
                    <img
                      src={signatureImageUrl}
                      alt="Signature of President, Valmiki Tiger Watch"
                      className="h-full max-h-11 w-auto object-contain select-none pointer-events-none"
                      crossOrigin="anonymous"
                      loading="eager"
                    />
                  ) : (
                    <div
                      className="text-[8px] border p-1 rounded text-center"
                      style={{
                        color: '#B91C1C',
                        backgroundColor: '#FEF2F2',
                        borderColor: '#FCA5A5'
                      }}
                    >
                      Authorized signature missing
                    </div>
                  )}
                </div>
                <div
                  className="w-32 sm:w-40 ml-auto h-[1px]"
                  style={{ backgroundColor: '#78716C' }}
                />
                <div
                  className="text-xs sm:text-sm font-bold leading-tight"
                  style={{ color: '#1C1917' }}
                >
                  {signatureName}
                </div>
                <div
                  className="text-[9px] sm:text-[10px] font-medium leading-tight"
                  style={{ color: '#57534E' }}
                >
                  {signatureTitle}, {signatureOrg}
                </div>
              </div>

            </div>

            {/* Disclaimer in Fine Print */}
            <div
              className="mt-2.5 pt-1.5 border-t text-center"
              style={{ borderColor: 'rgba(231, 229, 228, 0.7)' }}
            >
              <p
                className="text-[7.5px] sm:text-[8.5px] leading-tight font-sans max-w-2xl mx-auto"
                style={{ color: '#78716C' }}
              >
                {disclaimer}
              </p>
            </div>
          </div>

        </div>

        {/* Revocation Overlay (if status is revoked) */}
        {isRevoked && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none p-6"
            style={{ backgroundColor: 'rgba(69, 10, 10, 0.3)' }}
          >
            <div
              className="transform -rotate-12 border-4 px-8 py-3 rounded shadow-2xl text-center"
              style={{
                backgroundColor: 'rgba(127, 29, 29, 0.95)',
                borderColor: '#B91C1C',
                color: '#FFFFFF'
              }}
            >
              <div className="flex items-center justify-center gap-2 text-xl sm:text-2xl font-black uppercase tracking-widest text-white">
                <AlertTriangle className="w-6 h-6" style={{ color: '#FFFFFF' }} />
                <span>REVOKED / निरस्त</span>
              </div>
              {certificate.revocationReason && (
                <div
                  className="text-xs sm:text-sm mt-1 font-medium"
                  style={{ color: '#FEE2E2' }}
                >
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
