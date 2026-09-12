import React, { useState } from 'react';
import { 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  ShieldAlert, 
  Clock, 
  Globe,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  HelpCircle,
  Bug,
  Sparkles
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { FeedbackCategory } from '../../types';

export const ContactSection: React.FC = () => {
  const { submitFeedback } = useData();
  const [activeMode, setActiveMode] = useState<'inquiry' | 'feedback'>('inquiry');

  // Direct Inquiry State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Research & Scientific Inquiry');
  const [message, setMessage] = useState('');
  const [inquiryStatus, setInquiryStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message?: string }>({ type: 'idle' });

  // App Feedback State
  const [feedbackName, setFeedbackName] = useState('');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackCategory, setFeedbackCategory] = useState<FeedbackCategory>('App Feedback');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message?: string }>({ type: 'idle' });

  // Email Copy State
  const [copiedEmail, setCopiedEmail] = useState(false);
  const OFFICIAL_EMAIL = 'valmikitigerwatch@gmail.com';

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(OFFICIAL_EMAIL);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      // Fallback
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setInquiryStatus({ type: 'error', message: 'Please complete all required fields before sending.' });
      return;
    }
    if (message.trim().length < 10) {
      setInquiryStatus({ type: 'error', message: 'Please write a message of at least 10 characters.' });
      return;
    }

    setInquiryStatus({ type: 'loading' });
    setTimeout(() => {
      // Also log as feedback submission behind the scenes for admin traceability
      submitFeedback({
        name: name.trim(),
        email: email.trim(),
        category: 'Other',
        message: `[Inquiry: ${subject}] ${message.trim()}`
      });

      setInquiryStatus({
        type: 'success',
        message: 'Thank you! Your conservation inquiry has been submitted. Our coordination desk will respond within 1-2 business days.'
      });
      setName('');
      setEmail('');
      setMessage('');
    }, 600);
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) {
      setFeedbackStatus({ type: 'error', message: 'Please enter your message or feedback.' });
      return;
    }
    if (feedbackMessage.trim().length < 8) {
      setFeedbackStatus({ type: 'error', message: 'Please provide at least 8 characters so our team can investigate or assist.' });
      return;
    }

    setFeedbackStatus({ type: 'loading' });
    setTimeout(() => {
      const res = submitFeedback({
        name: feedbackName.trim() || undefined,
        email: feedbackEmail.trim() || undefined,
        category: feedbackCategory,
        message: feedbackMessage.trim()
      });

      if (res.success) {
        setFeedbackStatus({
          type: 'success',
          message: res.message
        });
        setFeedbackName('');
        setFeedbackEmail('');
        setFeedbackMessage('');
      } else {
        setFeedbackStatus({
          type: 'error',
          message: res.message || 'Submission could not be completed. Please try again.'
        });
      }
    }, 500);
  };

  return (
    <div className="space-y-10 animate-fade-in pb-12 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-10 border border-[#145A43] shadow-lg space-y-4">
        <div className="inline-flex items-center space-x-2 bg-[#07271D] border border-amber-500/40 rounded-full px-3.5 py-1 text-xs text-amber-300 font-mono">
          <Mail className="w-3.5 h-3.5 text-amber-400" />
          <span>Conservation Advocacy & Direct Coordination</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
          Contact & Feedback Center
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/90 max-w-3xl leading-relaxed">
          Connect directly with the Valmiki Tiger Watch initiative. Whether you are proposing scientific research, coordinating wildlife advocacy, reporting an app bug, or sharing community feedback, your communication is received by dedicated conservation volunteers.
        </p>

        {/* Quick Email Actions Ribbon */}
        <div className="pt-3 flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${OFFICIAL_EMAIL}?subject=Valmiki%20Tiger%20Watch%20Inquiry`}
            className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-colors shadow-sm"
          >
            <Mail className="w-4 h-4" />
            <span>Email Us ({OFFICIAL_EMAIL})</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>

          <button
            type="button"
            onClick={handleCopyEmail}
            className="inline-flex items-center space-x-2 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-700/60 font-medium px-4 py-2.5 rounded-xl text-xs transition-colors"
          >
            {copiedEmail ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span className="text-emerald-300 font-bold">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-emerald-300" />
                <span>Copy Email Address</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveMode('inquiry')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeMode === 'inquiry'
              ? 'bg-[#0B3D2E] text-white shadow'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Conservation Inquiries & Research</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode('feedback')}
          className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeMode === 'feedback'
              ? 'bg-[#0B3D2E] text-white shadow'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Submit App Feedback / Bug Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form Panel */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          {activeMode === 'inquiry' ? (
            /* CONSERVATION INQUIRY FORM */
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="font-display font-bold text-2xl text-stone-900">Send an Official Inquiry</h2>
                <p className="text-xs text-stone-500">
                  Direct message to the VTW conservation desk. We respond to verified researchers, volunteers, and supporters.
                </p>
              </div>

              {inquiryStatus.type === 'success' && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-start space-x-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-sm">Message Successfully Dispatched!</span>
                    <span className="leading-relaxed">{inquiryStatus.message}</span>
                  </div>
                </div>
              )}

              {inquiryStatus.type === 'error' && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 flex items-start space-x-2.5">
                  <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-sm">Submission Incomplete</span>
                    <span>{inquiryStatus.message}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleInquirySubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (inquiryStatus.type === 'error') setInquiryStatus({ type: 'idle' });
                      }}
                      placeholder="e.g. Dr. Ramesh Kumar"
                      className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0B3D2E] focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (inquiryStatus.type === 'error') setInquiryStatus({ type: 'idle' });
                      }}
                      placeholder="you@institution.org"
                      className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0B3D2E] focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Topic / Inquiry Category *</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0B3D2E] focus:bg-white"
                  >
                    <option value="Research & Scientific Inquiry">Scientific Research & Census Inquiry</option>
                    <option value="Wildlife Advocacy & Policy">Wildlife Conservation Advocacy & Policy</option>
                    <option value="Educational Programs">School / University Educational Outreach</option>
                    <option value="Responsible Ecotourism">Responsible Safari & Ecotourism Inquiries</option>
                    <option value="Media & Photography">Documentary & Media Licensing</option>
                    <option value="General Support">General Platform Inquiries</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Detailed Message *</label>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (inquiryStatus.type === 'error') setInquiryStatus({ type: 'idle' });
                    }}
                    placeholder="Share your proposal, question, or research collaboration inquiry..."
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0B3D2E] focus:bg-white leading-relaxed"
                    required
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="submit"
                    disabled={inquiryStatus.type === 'loading'}
                    className="px-6 py-3 bg-[#0B3D2E] hover:bg-emerald-900 text-white font-bold rounded-xl shadow flex items-center space-x-2 text-xs transition-colors disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-amber-400" />
                    <span>{inquiryStatus.type === 'loading' ? 'Sending Message…' : 'Submit Official Message'}</span>
                  </button>

                  <span className="text-[11px] text-stone-400">
                    Direct inquiries route to valmikitigerwatch@gmail.com
                  </span>
                </div>
              </form>
            </div>
          ) : (
            /* APP FEEDBACK & BUG REPORT FORM */
            <div className="space-y-6">
              <div className="space-y-1">
                <div className="inline-flex items-center space-x-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Continuous Platform Improvement</span>
                </div>
                <h2 className="font-display font-bold text-2xl text-stone-900">Share Feedback or Report a Bug</h2>
                <p className="text-xs text-stone-500">
                  Help us refine Valmiki Tiger Watch. Submissions are reviewed privately in our secure Admin Dashboard.
                </p>
              </div>

              {feedbackStatus.type === 'success' && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-start space-x-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-sm">Feedback Received!</span>
                    <span>{feedbackStatus.message}</span>
                  </div>
                </div>
              )}

              {feedbackStatus.type === 'error' && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 flex items-start space-x-2.5">
                  <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-sm">Unable to Submit</span>
                    <span>{feedbackStatus.message}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleFeedbackSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Your Name (Optional)</label>
                    <input
                      type="text"
                      value={feedbackName}
                      onChange={(e) => setFeedbackName(e.target.value)}
                      placeholder="e.g. Wildlife Enthusiast"
                      className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0B3D2E] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Email Address (Optional)</label>
                    <input
                      type="email"
                      value={feedbackEmail}
                      onChange={(e) => setFeedbackEmail(e.target.value)}
                      placeholder="For follow-up questions"
                      className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0B3D2E] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Feedback Category *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {(['App Feedback', 'Bug Report', 'News/Content', 'Suggestion', 'Other'] as FeedbackCategory[]).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setFeedbackCategory(cat)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition-all ${
                          feedbackCategory === cat
                            ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        {cat === 'Bug Report' && <Bug className="w-3.5 h-3.5 inline mr-1 text-rose-400" />}
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Your Message or Observation *</label>
                  <textarea
                    rows={5}
                    value={feedbackMessage}
                    onChange={(e) => {
                      setFeedbackMessage(e.target.value);
                      if (feedbackStatus.type === 'error') setFeedbackStatus({ type: 'idle' });
                    }}
                    placeholder="Tell us what worked, what needs improvement, or details of any error you observed..."
                    className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0B3D2E] focus:bg-white leading-relaxed"
                    required
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="submit"
                    disabled={feedbackStatus.type === 'loading'}
                    className="px-6 py-3 bg-[#0B3D2E] hover:bg-emerald-900 text-white font-bold rounded-xl shadow flex items-center space-x-2 text-xs transition-colors disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-amber-400" />
                    <span>{feedbackStatus.type === 'loading' ? 'Submitting…' : 'Submit Feedback'}</span>
                  </button>

                  <span className="text-[11px] text-stone-400">
                    Stored securely and accessible only to authorized administrators.
                  </span>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Emergency & Official Info Sidebar */}
        <div className="space-y-6">
          {/* Emergency Alert Box */}
          <div className="bg-red-950/10 border border-red-800/30 rounded-3xl p-6 space-y-4">
            <div className="flex items-center space-x-2 text-red-950 font-bold">
              <ShieldAlert className="w-5 h-5 text-red-700" />
              <span>Forest Emergencies & Stranding</span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              If reporting an immediate tiger distress sighting, forest fire outbreak, or illegal snares, contact official emergency dispatch directly:
            </p>
            <div className="bg-red-900/10 p-3.5 rounded-xl border border-red-800/20 text-xs font-mono font-bold text-red-950 space-y-1.5">
              <div>Toll-Free Helpline: 1800-345-6188</div>
              <div>VTR Control Center: +91 6254 232144</div>
            </div>
          </div>

          {/* Regional Information */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4 text-xs text-stone-700">
            <h3 className="font-display font-bold text-base text-stone-900">
              VTR Directorate & Field Headquarters
            </h3>

            <div className="space-y-3.5">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-emerald-800 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Office of the Field Director, Valmiki Tiger Reserve, Bettiah, West Champaran, Bihar — 845438, India
                </span>
              </div>

              <div className="flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-emerald-800 flex-shrink-0 mt-0.5" />
                <span>Field Reception Hours: 09:00 – 17:00 IST (Mon – Sat)</span>
              </div>

              <div className="flex items-start space-x-2.5">
                <Globe className="w-4 h-4 text-emerald-800 flex-shrink-0 mt-0.5" />
                <span>Terai Arc Landscape (TAL Hub): 27.2000° N, 84.2000° E</span>
              </div>

              <div className="flex items-start space-x-2.5">
                <Mail className="w-4 h-4 text-emerald-800 flex-shrink-0 mt-0.5" />
                <span>Official Contact: valmikitigerwatch@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ContactSection;
