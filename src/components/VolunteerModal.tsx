import React, { useState } from 'react';
import {
  X,
  HeartHandshake,
  CheckCircle2,
  ExternalLink,
  Send,
  User,
  Mail,
  Phone,
  MapPin,
  Languages,
  CheckSquare,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { VolunteerInterestArea } from '../types';

const INTEREST_AREAS: VolunteerInterestArea[] = [
  'Tiger Conservation',
  'Wildlife Awareness',
  'Biodiversity',
  'Environmental Education',
  'Community Outreach',
  'Research & Documentation',
  'Photography / Media',
  'Eco-Tourism Awareness',
  'Social Media / Digital Support',
  'Other'
];

const AVAILABILITY_OPTIONS = [
  'Weekends Only (Saturday / Sunday)',
  'Weekdays (Part-time)',
  'Full-time Field Volunteer (1–3 months)',
  'Seasonal / Winter Safaris (Nov – Feb)',
  'Remote / Digital Support (Flexible hours)',
  'Occasional / Event-Based'
];

const LANGUAGE_OPTIONS = [
  'Hindi (हिंदी)',
  'English',
  'Bhojpuri (भोजपुरी)',
  'Urdu (اردو)',
  'Maithili (मैथिली)',
  'Other'
];

export const VolunteerModal: React.FC = () => {
  const {
    isVolunteerModalOpen,
    closeVolunteerModal,
    addVolunteerSubmission,
    integrationSettings
  } = useData();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [cityDistrict, setCityDistrict] = useState('');
  const [state, setState] = useState('Bihar');
  const [country, setCountry] = useState('India');
  const [preferredLanguage, setPreferredLanguage] = useState('Hindi (हिंदी)');
  const [areasOfInterest, setAreasOfInterest] = useState<VolunteerInterestArea[]>(['Tiger Conservation']);
  const [relevantSkills, setRelevantSkills] = useState('');
  const [availability, setAvailability] = useState(AVAILABILITY_OPTIONS[0]);
  const [whyVolunteer, setWhyVolunteer] = useState('');
  const [consentContact, setConsentContact] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isVolunteerModalOpen) return null;

  const isRegistrationEnabled = integrationSettings.isVolunteerRegistrationEnabled;

  const toggleInterest = (area: VolunteerInterestArea) => {
    setAreasOfInterest((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!fullName.trim()) {
      setValidationError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setValidationError('Please enter a valid email address.');
      return;
    }
    if (!mobile.trim() || mobile.length < 8) {
      setValidationError('Please enter a valid contact mobile number.');
      return;
    }
    if (!cityDistrict.trim()) {
      setValidationError('Please enter your city or district.');
      return;
    }
    if (areasOfInterest.length === 0) {
      setValidationError('Please select at least one area of interest.');
      return;
    }
    if (!whyVolunteer.trim()) {
      setValidationError('Please briefly state why you would like to volunteer.');
      return;
    }
    if (!consentContact) {
      setValidationError('Please agree to be contacted for volunteering coordination.');
      return;
    }

    setIsSubmitting(true);

    try {
      addVolunteerSubmission({
        fullName: fullName.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        cityDistrict: cityDistrict.trim(),
        state: state.trim(),
        country: country.trim(),
        preferredLanguage,
        areasOfInterest,
        relevantSkills: relevantSkills.trim(),
        availability,
        whyVolunteer: whyVolunteer.trim(),
        consentContact
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (err: any) {
      setIsSubmitting(false);
      setValidationError(err?.message || 'Failed to submit registration. Please try again.');
    }
  };

  const resetForm = () => {
    setFullName('');
    setEmail('');
    setMobile('');
    setCityDistrict('');
    setState('Bihar');
    setCountry('India');
    setPreferredLanguage('Hindi (हिंदी)');
    setAreasOfInterest(['Tiger Conservation']);
    setRelevantSkills('');
    setAvailability(AVAILABILITY_OPTIONS[0]);
    setWhyVolunteer('');
    setConsentContact(true);
    setIsSubmitted(false);
    setValidationError(null);
  };

  return (
    <div
      id="volunteer-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeVolunteerModal();
      }}
    >
      <div
        id="volunteer-registration-card"
        className="bg-[#051C14] border border-emerald-700/80 rounded-2xl shadow-2xl max-w-2xl w-full my-8 overflow-hidden text-white flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#07271D] via-[#0B3B2C] to-[#07271D] px-5 sm:px-6 py-4 border-b border-emerald-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-amber-300">
                Join Valmiki Tiger Watch as a Volunteer
              </h2>
              <p className="text-xs text-emerald-300/80 font-mono">
                Community Wildlife Guardians • Field Documentation • Conservation Education
              </p>
            </div>
          </div>
          <button
            id="close-volunteer-modal-btn"
            onClick={closeVolunteerModal}
            className="p-1.5 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-800/60 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          {!isRegistrationEnabled ? (
            <div className="p-6 text-center space-y-4 bg-emerald-950/40 rounded-xl border border-emerald-800/60">
              <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
              <h3 className="font-bold text-base text-white">Volunteer Registration Temporarily Paused</h3>
              <p className="text-xs text-emerald-300/80 max-w-md mx-auto">
                Volunteer onboarding is temporarily paused while our field team completes orientation with the current cohort. Please contact us directly at{' '}
                <a href={`mailto:${integrationSettings.contactEmail}`} className="text-amber-400 underline font-mono">
                  {integrationSettings.contactEmail}
                </a>{' '}
                for urgent inquiries.
              </p>
              <button
                onClick={closeVolunteerModal}
                className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all"
              >
                Close
              </button>
            </div>
          ) : isSubmitted ? (
            <div className="p-6 sm:p-8 text-center space-y-4 bg-emerald-950/50 rounded-2xl border border-amber-500/40 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center mx-auto text-amber-400 shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-display font-bold text-lg sm:text-xl text-amber-300">
                Application Successfully Registered!
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-lg mx-auto">
                {integrationSettings.volunteerConfirmationMessage}
              </p>
              <div className="p-3 bg-[#07271D] rounded-xl border border-emerald-800 text-[11px] text-emerald-300 font-mono space-y-1">
                <div>Applicant: <strong className="text-white">{fullName}</strong></div>
                <div>Contact: <span className="text-amber-300">{email}</span> | <span className="text-amber-300">{mobile}</span></div>
                <div>Status: <span className="text-amber-400 font-bold">Pending Field Review</span></div>
              </div>

              {integrationSettings.volunteerGoogleFormUrl && (
                <div className="p-3 bg-emerald-900/30 rounded-xl border border-emerald-700/60 text-xs text-emerald-200 flex items-center justify-between gap-3">
                  <span>Direct Google Form Record Backup:</span>
                  <a
                    href={integrationSettings.volunteerGoogleFormUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold underline"
                  >
                    <span>View Form</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <button
                  onClick={resetForm}
                  className="px-4 py-2 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 rounded-xl text-xs font-mono transition-all"
                >
                  Submit Another Application
                </button>
                <button
                  onClick={closeVolunteerModal}
                  className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold rounded-xl text-xs shadow-lg transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Integration Google Form Link Banner (if configured) */}
              {integrationSettings.volunteerGoogleFormUrl && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200/90 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span>Official Google Form synced with Valmiki Tiger Watch records.</span>
                  </span>
                  <a
                    href={integrationSettings.volunteerGoogleFormUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-300 hover:text-white font-bold inline-flex items-center gap-1 whitespace-nowrap bg-amber-500/20 px-2 py-1 rounded"
                  >
                    <span>Open in Google Forms</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}

              {/* Validation Error Banner */}
              {validationError && (
                <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-300 flex items-center gap-2 animate-fade-in">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Personal Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-emerald-300 block mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar Verma"
                      required
                      className="w-full p-2.5 pl-8 bg-[#07271D] border border-emerald-700 rounded-xl text-xs text-white placeholder-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                    <User className="w-3.5 h-3.5 text-emerald-400 absolute left-2.5 top-3" />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-emerald-300 block mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. name@example.com"
                      required
                      className="w-full p-2.5 pl-8 bg-[#07271D] border border-emerald-700 rounded-xl text-xs text-white placeholder-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                    <Mail className="w-3.5 h-3.5 text-emerald-400 absolute left-2.5 top-3" />
                  </div>
                </div>
              </div>

              {/* Contact & Location Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-emerald-300 block mb-1">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                      className="w-full p-2.5 pl-8 bg-[#07271D] border border-emerald-700 rounded-xl text-xs text-white placeholder-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                    <Phone className="w-3.5 h-3.5 text-emerald-400 absolute left-2.5 top-3" />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-emerald-300 block mb-1">
                    City / District *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cityDistrict}
                      onChange={(e) => setCityDistrict(e.target.value)}
                      placeholder="e.g. Bettiah / Bagaha"
                      required
                      className="w-full p-2.5 pl-8 bg-[#07271D] border border-emerald-700 rounded-xl text-xs text-white placeholder-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 absolute left-2.5 top-3" />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-mono text-emerald-300 block mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Bihar"
                    className="w-full p-2.5 bg-[#07271D] border border-emerald-700 rounded-xl text-xs text-white placeholder-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* Country & Language */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono text-emerald-300 block mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="India"
                    className="w-full p-2.5 bg-[#07271D] border border-emerald-700 rounded-xl text-xs text-white placeholder-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono text-emerald-300 block mb-1">
                    Preferred Language
                  </label>
                  <div className="relative">
                    <select
                      value={preferredLanguage}
                      onChange={(e) => setPreferredLanguage(e.target.value)}
                      className="w-full p-2.5 pl-8 bg-[#07271D] border border-emerald-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                    >
                      {LANGUAGE_OPTIONS.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                    <Languages className="w-3.5 h-3.5 text-emerald-400 absolute left-2.5 top-3" />
                  </div>
                </div>
              </div>

              {/* Areas of Interest Multi-Selection */}
              <div>
                <label className="text-[11px] font-mono text-emerald-300 block mb-1.5 flex items-center justify-between">
                  <span>Areas of Interest * (Select all that apply)</span>
                  <span className="text-amber-400 font-bold">{areasOfInterest.length} selected</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {INTEREST_AREAS.map((area) => {
                    const isSelected = areasOfInterest.includes(area);
                    return (
                      <button
                        type="button"
                        key={area}
                        onClick={() => toggleInterest(area)}
                        className={`p-2 rounded-xl text-left text-xs transition-all flex items-center gap-1.5 border ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-semibold'
                            : 'bg-[#07271D] border-emerald-800 text-emerald-300/80 hover:bg-emerald-800/40 hover:text-white'
                        }`}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[9px] ${
                            isSelected
                              ? 'bg-amber-400 text-black border-amber-400'
                              : 'border-emerald-700 bg-[#051C14]'
                          }`}
                        >
                          {isSelected && '✓'}
                        </div>
                        <span className="truncate">{area}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="text-[11px] font-mono text-emerald-300 block mb-1">
                  Availability
                </label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full p-2.5 bg-[#07271D] border border-emerald-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                >
                  {AVAILABILITY_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Skills & Experience */}
              <div>
                <label className="text-[11px] font-mono text-emerald-300 block mb-1">
                  Relevant Skills / Experience
                </label>
                <textarea
                  value={relevantSkills}
                  onChange={(e) => setRelevantSkills(e.target.value)}
                  rows={2}
                  placeholder="e.g. Wildlife photography, GIS mapping, teaching, social media, botany, Tharu language fluency..."
                  className="w-full p-2.5 bg-[#07271D] border border-emerald-700 rounded-xl text-xs text-white placeholder-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-amber-400 resize-none"
                />
              </div>

              {/* Why would you like to volunteer? */}
              <div>
                <label className="text-[11px] font-mono text-emerald-300 block mb-1">
                  Why would you like to volunteer? *
                </label>
                <textarea
                  value={whyVolunteer}
                  onChange={(e) => setWhyVolunteer(e.target.value)}
                  rows={3}
                  placeholder="Tell us what motivates you to support tiger conservation and wildlife awareness in Valmiki Tiger Reserve..."
                  required
                  className="w-full p-2.5 bg-[#07271D] border border-emerald-700 rounded-xl text-xs text-white placeholder-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-amber-400 resize-none"
                />
              </div>

              {/* Consent Checkbox */}
              <div className="p-3 bg-[#07271D] border border-emerald-800 rounded-xl">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentContact}
                    onChange={(e) => setConsentContact(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-amber-500 bg-[#051C14] border-emerald-700 focus:ring-0"
                  />
                  <span className="text-[11px] text-emerald-200/90 leading-relaxed">
                    I consent to being contacted by the Valmiki Tiger Watch team regarding volunteer activities, field orientations, and conservation updates. My details will be handled respectfully according to forest ethics.
                  </span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeVolunteerModal}
                  className="px-4 py-2.5 text-xs text-emerald-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold rounded-xl text-xs shadow-lg flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Registering...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Volunteer Registration</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
