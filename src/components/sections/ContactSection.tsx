import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  Globe
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Research & Scientific Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert('Please complete all required fields.');
      return;
    }

    setSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
    setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <div className="space-y-10 animate-fade-in pb-8">
      {/* Header Banner */}
      <div className="bg-[#0B3D2E] text-white rounded-3xl p-6 sm:p-10 border border-[#145A43] shadow-lg space-y-4">
        <div className="inline-flex items-center space-x-2 bg-[#07271D] border border-amber-500/40 rounded-full px-3 py-1 text-xs text-amber-300 font-mono">
          <Mail className="w-3.5 h-3.5 text-amber-400" />
          <span>Conservation Advocacy & Inquiries</span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Contact & Conservation Coordination
        </h1>

        <p className="text-sm sm:text-base text-emerald-100/90 max-w-3xl leading-relaxed">
          Connect with the Valmiki Tiger Watch initiative for research collaborations, conservation advocacy inquiries, educational partnerships, or responsible ecotourism guidance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="font-display font-bold text-2xl text-stone-900">Send an Inquiry</h2>
            <p className="text-xs text-stone-500">
              Our conservation volunteers will review your message promptly.
            </p>
          </div>

          {submitted && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Inquiry Received!</span>
                <span>Thank you for reaching out to Valmiki Tiger Watch. We will respond within 2-3 business days.</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Your Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Ramesh Kumar"
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@institution.org"
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Topic / Inquiry Category *</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
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
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your proposal, question, or research interest..."
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0B3D2E]"
                required
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-[#0B3D2E] hover:bg-emerald-900 text-white font-bold rounded-xl shadow flex items-center space-x-2 text-xs transition-colors"
            >
              <Send className="w-4 h-4 text-amber-400" />
              <span>Submit Message</span>
            </button>
          </form>
        </div>

        {/* Emergency & Official Info Sidebar */}
        <div className="space-y-6">
          {/* Emergency Alert Box */}
          <div className="bg-red-950/20 border border-red-800/40 rounded-3xl p-6 space-y-4">
            <div className="flex items-center space-x-2 text-red-900 font-bold">
              <ShieldAlert className="w-5 h-5 text-red-700" />
              <span>Forest Emergencies</span>
            </div>
            <p className="text-xs text-red-950 leading-relaxed">
              If reporting immediate tiger distress, forest fire outbreaks, or illegal poaching snares, contact the emergency hotline directly:
            </p>
            <div className="bg-red-900/10 p-3.5 rounded-xl border border-red-800/30 text-xs font-mono font-bold text-red-900 space-y-1">
              <div>Toll-Free: 1800-345-6188</div>
              <div>VTR Control: +91 6254 232144</div>
            </div>
          </div>

          {/* Regional Information */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4 text-xs text-stone-700">
            <h3 className="font-display font-bold text-base text-stone-900">
              VTR Directorate & Field Headquarters
            </h3>

            <div className="space-y-3">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-emerald-800 flex-shrink-0 mt-0.5" />
                <span>
                  Office of the Field Director, Valmiki Tiger Reserve, Bettiah, West Champaran, Bihar — 845438, India
                </span>
              </div>

              <div className="flex items-start space-x-2.5">
                <Clock className="w-4 h-4 text-emerald-800 flex-shrink-0 mt-0.5" />
                <span>Field Reception Hours: 09:00 – 17:00 IST (Mon – Sat)</span>
              </div>

              <div className="flex items-start space-x-2.5">
                <Globe className="w-4 h-4 text-emerald-800 flex-shrink-0 mt-0.5" />
                <span>Coordinates: 27.2000° N, 84.2000° E (TAL Hub)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
