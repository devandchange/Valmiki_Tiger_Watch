import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { TigerPledgeCertificate, CertificateAdminSettings } from '../src/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const REGISTRY_FILE = path.join(DATA_DIR, 'certificates_registry.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'certificate_settings.json');

const DEFAULT_SETTINGS: CertificateAdminSettings = {
  numberingPrefix: 'VTW',
  numberingYearFormat: 'YYYY',
  nextSequence: 1,
  customLogoUrl: '/vtw-logo.png',
  customSignatureUrl: '/assets/president-signature.png',
  signatureName: 'Nazish Asad',
  signatureTitle: 'President',
  signatureOrg: 'Valmiki Tiger Watch',
  designTheme: 'royal-emerald-gold',
  borderStyle: 'ornate-double',
  headerText: {
    en: 'VALMIKI TIGER WATCH',
    hi: 'वाल्मीकि टाइगर वॉच',
    ur: 'والمیکی ٹائیگر واچ'
  },
  titleText: {
    en: 'CERTIFICATE OF TIGER PROTECTION PLEDGE',
    hi: 'बाघ संरक्षण संकल्प प्रमाण पत्र',
    ur: 'تحفظِ شیر عہد نامہ سرٹیفکیٹ'
  },
  presentedToText: {
    en: 'This certificate is proudly presented to',
    hi: 'यह प्रमाण पत्र गर्व के साथ प्रदान किया जाता है:',
    ur: 'یہ سرٹیفکیٹ فخر کے ساتھ پیش کیا جاتا ہے بحق:'
  },
  pledgeBodyText: {
    en: 'For voluntarily pledging to support tiger conservation, protect wildlife, respect forest laws, and contribute to the protection of tigers and their natural habitat in Valmiki Tiger Reserve and across India.',
    hi: 'बाघ संरक्षण का स्वेच्छा से समर्थन करने, वन्यजीवों की रक्षा करने, वन नियमों का सम्मान करने और वाल्मीकि टाइगर रिज़र्व व पूरे भारत में बाघों तथा उनके प्राकृतिक आवास के संरक्षण में योगदान देने के संकल्प हेतु।',
    ur: 'شیروں کے تحفظ کی رضاکارانہ حمایت، جنگلی حیات کی بقا، جنگل کے قوانین کے احترام اور والمیکی ٹائیگر ریزرو و پورے بھارت میں شیروں اور ان کے قدرتی مسکن کے تحفظ میں اپنا کردار ادا کرنے کا پختہ عہد کرنے پر۔'
  },
  disclaimerText: {
    en: 'This is a voluntary conservation pledge certificate issued by Valmiki Tiger Watch to recognize individual community commitment to wildlife protection. It is not an official government certificate, employment credential, or formal academic qualification.',
    hi: 'यह वाल्मीकि टाइगर वॉच द्वारा वन्यजीव संरक्षण के प्रति व्यक्तिगत सामुदायिक प्रतिबद्धता को सम्मानित करने हेतु जारी एक स्वैच्छिक संकल्प प्रमाण पत्र है। यह कोई सरकारी दस्तावेज, रोजगार प्रमाण पत्र या शैक्षणिक उपाधि नहीं है।',
    ur: 'یہ والمیکی ٹائیگر واچ کی جانب سے جنگلی حیات کے تحفظ کے لیے انفرادی عزم کو سراہنے کے لیے جاری کردہ ایک رضاکارانہ عہد نامہ سرٹیفکیٹ ہے۔ یہ کوئی سرکاری سند، ملازمت کا پروانہ یا تعلیمی ڈگری نہیں ہے۔'
  },
  lastUpdated: new Date().toISOString()
};

// Initial in-memory state
let certificatesRegistry: TigerPledgeCertificate[] = [];
let certificateSettings: CertificateAdminSettings = { ...DEFAULT_SETTINGS };

function ensureDataDirectory() {
  if (!fs.existsSync(DATA_DIR)) {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (err) {
      console.warn('Could not create data directory:', err);
    }
  }
}

function loadRegistryFromDisk() {
  ensureDataDirectory();
  try {
    if (fs.existsSync(REGISTRY_FILE)) {
      const data = fs.readFileSync(REGISTRY_FILE, 'utf-8');
      certificatesRegistry = JSON.parse(data);
    }
  } catch (err) {
    console.warn('Error reading certificates registry file:', err);
  }

  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      certificateSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    }
  } catch (err) {
    console.warn('Error reading certificate settings file:', err);
  }

  // Update nextSequence to be higher than any existing certificate number
  const maxSeq = certificatesRegistry.reduce((max, c) => {
    const match = c.certificateNumber.match(/-(\d+)$/);
    if (match) {
      const n = parseInt(match[1], 10);
      return Math.max(max, n);
    }
    return max;
  }, 0);

  if (maxSeq >= certificateSettings.nextSequence) {
    certificateSettings.nextSequence = maxSeq + 1;
  }
}

function saveRegistryToDisk() {
  ensureDataDirectory();
  try {
    fs.writeFileSync(REGISTRY_FILE, JSON.stringify(certificatesRegistry, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Error writing certificates registry to disk:', err);
  }
}

function saveSettingsToDisk() {
  ensureDataDirectory();
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(certificateSettings, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Error writing certificate settings to disk:', err);
  }
}

// Initialize on module load
loadRegistryFromDisk();

/**
 * Format certificate date into locale-appropriate human readable string
 */
export function formatPledgeDate(date: Date, lang: 'en' | 'hi' | 'ur' = 'en'): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  if (lang === 'hi') {
    return date.toLocaleDateString('hi-IN', options);
  }
  if (lang === 'ur') {
    return date.toLocaleDateString('ur-PK', options);
  }
  return date.toLocaleDateString('en-US', options);
}

/**
 * Generate a unique, sequential certificate number: VTW-TPP-2026-000001
 */
function generateUniqueCertificateNumber(): string {
  const now = new Date();
  const yearStr = certificateSettings.numberingYearFormat === 'YY'
    ? String(now.getFullYear()).slice(-2)
    : String(now.getFullYear());

  const prefix = certificateSettings.numberingPrefix || 'VTW';
  let seq = certificateSettings.nextSequence;

  while (true) {
    const paddedSeq = String(seq).padStart(6, '0');
    const certNumber = `${prefix}-${yearStr}-${paddedSeq}`;

    // Ensure collision avoidance against any existing records
    const exists = certificatesRegistry.some(c => c.certificateNumber === certNumber);
    if (!exists) {
      certificateSettings.nextSequence = seq + 1;
      saveSettingsToDisk();
      return certNumber;
    }
    seq += 1;
  }
}

export interface CreateCertificateInput {
  pledgeId?: string;
  fullName: string;
  cityAndState: string;
  country?: string;
  email?: string;
  organization?: string;
  language?: 'en' | 'hi' | 'ur';
}

/**
 * Create and register a new Tiger Protection Pledge Certificate with deduplication
 */
export function createTigerPledgeCertificate(input: CreateCertificateInput): TigerPledgeCertificate & { alreadyIssued?: boolean } {
  const trimmedName = input.fullName.trim();
  const trimmedLocation = input.cityAndState.trim();
  const trimmedCountry = (input.country || 'India').trim();
  const trimmedEmail = input.email ? input.email.trim() : undefined;
  const trimmedOrg = input.organization ? input.organization.trim() : undefined;
  const lang = input.language === 'hi' || input.language === 'ur' ? input.language : 'en';

  if (!trimmedName) {
    throw new Error('Participant full name is required.');
  }
  if (!trimmedLocation) {
    throw new Error('City and State is required.');
  }

  // Deduplication check: check if pledgeId matches OR (normalized name + location/email matches)
  const existing = certificatesRegistry.find(c => {
    if (input.pledgeId && c.pledgeId && c.pledgeId === input.pledgeId) {
      return true;
    }
    const sameName = c.fullName.trim().toLowerCase() === trimmedName.toLowerCase();
    const sameLocation = c.cityAndState.trim().toLowerCase() === trimmedLocation.toLowerCase();
    const sameEmail = (trimmedEmail && c.email) ? c.email.trim().toLowerCase() === trimmedEmail.toLowerCase() : false;
    return (sameName && sameLocation) || (sameName && sameEmail);
  });

  if (existing) {
    return {
      ...existing,
      alreadyIssued: true
    };
  }

  const certNumber = generateUniqueCertificateNumber();
  const now = new Date();
  const pledgeFormattedDate = formatPledgeDate(now, lang);
  const certId = `cert_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const pledgeId = input.pledgeId || `pledge_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

  // Generate a non-repudiation cryptographic verification hash
  const hash = crypto
    .createHash('sha256')
    .update(`${certNumber}:${trimmedName}:${trimmedLocation}:${now.toISOString()}`)
    .digest('hex')
    .slice(0, 16);

  const newCert: TigerPledgeCertificate = {
    id: certId,
    certificateId: certId,
    certificateNumber: certNumber,
    pledgeId,
    fullName: trimmedName,
    participantName: trimmedName,
    cityAndState: trimmedLocation,
    country: trimmedCountry,
    email: trimmedEmail,
    organization: trimmedOrg,
    pledgeDate: pledgeFormattedDate,
    issueDate: pledgeFormattedDate,
    pledgeFormattedDate,
    language: lang,
    status: 'valid',
    issuedAt: now.toISOString(),
    createdAt: now.toISOString(),
    verificationHash: hash,
    isLocallyStored: false
  };

  certificatesRegistry.unshift(newCert);
  saveRegistryToDisk();

  return newCert;
}

/**
 * Retrieve all certificates with optional filtering (for Admin Console)
 */
export function getCertificatesList(search?: string, status?: string): TigerPledgeCertificate[] {
  let list = [...certificatesRegistry];

  if (status && status !== 'all') {
    list = list.filter(c => c.status === status);
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter(c => 
      c.certificateNumber.toLowerCase().includes(q) ||
      c.fullName.toLowerCase().includes(q) ||
      (c.participantName && c.participantName.toLowerCase().includes(q)) ||
      (c.pledgeId && c.pledgeId.toLowerCase().includes(q)) ||
      (c.pledgeDate && c.pledgeDate.toLowerCase().includes(q)) ||
      (c.issueDate && c.issueDate.toLowerCase().includes(q)) ||
      c.cityAndState.toLowerCase().includes(q) ||
      (c.organization && c.organization.toLowerCase().includes(q))
    );
  }

  return list;
}

/**
 * Public Verification lookup (sanitizes private fields like email)
 */
export function verifyCertificateByNumber(certNumber: string) {
  const found = certificatesRegistry.find(c => 
    c.certificateNumber.trim().toUpperCase() === certNumber.trim().toUpperCase()
  );

  if (!found) {
    return {
      found: false,
      message: 'Certificate not found in Valmiki Tiger Watch official registry.'
    };
  }

  return {
    found: true,
    certificate: {
      certificateNumber: found.certificateNumber,
      fullName: found.fullName,
      cityAndState: found.cityAndState,
      country: found.country,
      organization: found.organization,
      pledgeFormattedDate: found.pledgeFormattedDate,
      pledgeDate: found.pledgeDate,
      language: found.language,
      status: found.status,
      revokedAt: found.revokedAt,
      revocationReason: found.revocationReason,
      issuedAt: found.issuedAt,
      verificationHash: found.verificationHash,
      isVoluntaryPledge: true,
      issuer: 'Valmiki Tiger Watch'
    }
  };
}

/**
 * Revoke a certificate (Admin action)
 */
export function revokeCertificate(certNumber: string, reason: string) {
  const index = certificatesRegistry.findIndex(c => 
    c.certificateNumber.trim().toUpperCase() === certNumber.trim().toUpperCase()
  );

  if (index === -1) {
    return { success: false, message: 'Certificate number not found.' };
  }

  certificatesRegistry[index].status = 'revoked';
  certificatesRegistry[index].revokedAt = new Date().toISOString();
  certificatesRegistry[index].revocationReason = reason || 'Revoked by authorized administrator.';

  saveRegistryToDisk();
  return {
    success: true,
    certificate: certificatesRegistry[index],
    message: `Certificate ${certNumber} has been revoked.`
  };
}

/**
 * Restore a revoked certificate (Admin action)
 */
export function restoreCertificate(certNumber: string) {
  const index = certificatesRegistry.findIndex(c => 
    c.certificateNumber.trim().toUpperCase() === certNumber.trim().toUpperCase()
  );

  if (index === -1) {
    return { success: false, message: 'Certificate number not found.' };
  }

  certificatesRegistry[index].status = 'valid';
  delete certificatesRegistry[index].revokedAt;
  delete certificatesRegistry[index].revocationReason;

  saveRegistryToDisk();
  return {
    success: true,
    certificate: certificatesRegistry[index],
    message: `Certificate ${certNumber} has been restored to valid status.`
  };
}

/**
 * Get current certificate settings
 */
export function getCertificateSettings(): CertificateAdminSettings {
  return { ...certificateSettings };
}

/**
 * Update certificate settings
 */
export function updateCertificateSettings(updates: Partial<CertificateAdminSettings>): CertificateAdminSettings {
  certificateSettings = {
    ...certificateSettings,
    ...updates,
    lastUpdated: new Date().toISOString()
  };
  saveSettingsToDisk();
  return certificateSettings;
}
