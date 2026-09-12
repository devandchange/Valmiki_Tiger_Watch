import React, { useState } from 'react';
import {
  Sparkles,
  ExternalLink,
  Bot,
  Save,
  CheckCircle2,
  AlertCircle,
  FormInput,
  KeyRound,
  Plus,
  Trash2,
  RotateCcw,
  Sliders,
  Languages,
  ShieldAlert
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { AppIntegrationSettings, ChatbotAdminSettings } from '../../types';

interface IntegrationsAiTabProps {
  showToast: (msg: string) => void;
}

const DEFAULT_SUGGESTED_QUESTIONS = [
  'What is Valmiki Tiger Reserve?',
  'Where is Valmiki Tiger Reserve located?',
  'What animals are found in VTR?',
  'How can I visit VTR?',
  'What is the best time to visit?',
  'How can I become a volunteer?',
  'How can I support tiger conservation?',
  'Where can I find research publications?',
  'What are the latest tiger conservation news updates?'
];

export const IntegrationsAiTab: React.FC<IntegrationsAiTabProps> = ({ showToast }) => {
  const {
    integrationSettings,
    updateIntegrationSettings,
    chatbotSettings,
    updateChatbotSettings
  } = useData();

  // Local state copies for form editing
  const [volFormUrl, setVolFormUrl] = useState(integrationSettings.volunteerGoogleFormUrl || '');
  const [supFormUrl, setSupFormUrl] = useState(integrationSettings.supporterGoogleFormUrl || '');
  const [contactEmail, setContactEmail] = useState(integrationSettings.contactEmail || '');
  const [isVolEnabled, setIsVolEnabled] = useState(integrationSettings.isVolunteerRegistrationEnabled);
  const [isSupEnabled, setIsSupEnabled] = useState(integrationSettings.isSupporterRegistrationEnabled);
  const [volMessage, setVolMessage] = useState(integrationSettings.volunteerConfirmationMessage);
  const [supMessage, setSupMessage] = useState(integrationSettings.supporterConfirmationMessage);

  // Chatbot settings local state
  const [botEnabled, setBotEnabled] = useState(chatbotSettings.isEnabled);
  const [botModel, setBotModel] = useState(chatbotSettings.modelName || 'gemini-3.8-flash');
  const [botPrompt, setBotPrompt] = useState(chatbotSettings.systemPrompt || '');
  const [botWelcomeEn, setBotWelcomeEn] = useState(chatbotSettings.welcomeMessageEn || '');
  const [botWelcomeHi, setBotWelcomeHi] = useState(chatbotSettings.welcomeMessageHi || '');
  const [botWelcomeUr, setBotWelcomeUr] = useState(chatbotSettings.welcomeMessageUr || '');
  const [botTemperature, setBotTemperature] = useState(chatbotSettings.temperature || 0.3);
  const [botSourceAttr, setBotSourceAttr] = useState(chatbotSettings.enableSourceAttribution);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>(
    chatbotSettings.suggestedQuestions && chatbotSettings.suggestedQuestions.length > 0
      ? chatbotSettings.suggestedQuestions
      : DEFAULT_SUGGESTED_QUESTIONS
  );
  const [newQuestionInput, setNewQuestionInput] = useState('');

  const handleAddQuestion = () => {
    if (!newQuestionInput.trim()) return;
    setSuggestedQuestions((prev) => [...prev, newQuestionInput.trim()]);
    setNewQuestionInput('');
  };

  const handleRemoveQuestion = (index: number) => {
    setSuggestedQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleResetQuestions = () => {
    setSuggestedQuestions(DEFAULT_SUGGESTED_QUESTIONS);
    showToast('Suggested questions reset to defaults.');
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();

    updateIntegrationSettings({
      volunteerGoogleFormUrl: volFormUrl.trim(),
      supporterGoogleFormUrl: supFormUrl.trim(),
      contactEmail: contactEmail.trim(),
      isVolunteerRegistrationEnabled: isVolEnabled,
      isSupporterRegistrationEnabled: isSupEnabled,
      volunteerConfirmationMessage: volMessage.trim(),
      supporterConfirmationMessage: supMessage.trim()
    });

    updateChatbotSettings({
      isEnabled: botEnabled,
      modelName: botModel,
      systemPrompt: botPrompt.trim(),
      welcomeMessageEn: botWelcomeEn.trim(),
      welcomeMessageHi: botWelcomeHi.trim(),
      welcomeMessageUr: botWelcomeUr.trim(),
      temperature: botTemperature,
      enableSourceAttribution: botSourceAttr,
      suggestedQuestions
    });

    showToast('Integration & AI settings saved successfully.');
  };

  return (
    <form onSubmit={handleSaveAll} className="space-y-8 animate-fade-in text-xs">
      {/* Top Banner */}
      <div className="bg-[#07271D] p-4 sm:p-5 rounded-2xl border border-emerald-800 flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Integrations, Google Forms & AI Configuration</span>
          </h3>
          <p className="text-emerald-200/80 leading-relaxed text-[11px]">
            Manage external Google Forms URLs, public volunteer registration toggles, and Gemini AI assistant behavior.
          </p>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold rounded-xl flex items-center gap-1.5 shadow transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save All Settings</span>
        </button>
      </div>

      {/* SECTION 1: GOOGLE FORMS INTEGRATIONS */}
      <div className="bg-[#07271D] p-5 rounded-2xl border border-emerald-800 space-y-5">
        <div className="flex items-center gap-2 border-b border-emerald-800 pb-3">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <FormInput className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">Google Forms Connectors</h4>
            <p className="text-[10px] font-mono text-emerald-300">
              Submissions in the app are automatically recorded locally and can optionally link to your official Google Forms.
            </p>
          </div>
        </div>

        {/* Volunteer Form URL */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="font-mono text-emerald-300 text-[11px] font-bold">
              Volunteer Google Form URL
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isVolEnabled}
                  onChange={(e) => setIsVolEnabled(e.target.checked)}
                  className="rounded text-amber-500 bg-[#051C14] border-emerald-700"
                />
                <span className="text-[10px] font-mono text-emerald-200">
                  {isVolEnabled ? '✓ Registration Active' : 'Registration Paused'}
                </span>
              </label>

              {volFormUrl && (
                <a
                  href={volFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 font-mono text-[10px] underline"
                >
                  <span>Test Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
          <input
            type="url"
            value={volFormUrl}
            onChange={(e) => setVolFormUrl(e.target.value)}
            placeholder="https://docs.google.com/forms/d/e/.../viewform"
            className="w-full p-2.5 bg-[#051C14] border border-emerald-700 rounded-xl text-xs text-white placeholder-emerald-500/50 font-mono focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
          <p className="text-[10px] text-emerald-300/70">
            If provided, a direct link will be displayed inside the "Join Valmiki Tiger Watch as a Volunteer" modal alongside the built-in form.
          </p>
        </div>

        {/* Supporter Form URL */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="font-mono text-emerald-300 text-[11px] font-bold">
              Supporter Google Form URL
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSupEnabled}
                  onChange={(e) => setIsSupEnabled(e.target.checked)}
                  className="rounded text-amber-500 bg-[#051C14] border-emerald-700"
                />
                <span className="text-[10px] font-mono text-emerald-200">
                  {isSupEnabled ? '✓ Registration Active' : 'Registration Paused'}
                </span>
              </label>

              {supFormUrl && (
                <a
                  href={supFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 font-mono text-[10px] underline"
                >
                  <span>Test Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
          <input
            type="url"
            value={supFormUrl}
            onChange={(e) => setSupFormUrl(e.target.value)}
            placeholder="https://docs.google.com/forms/d/e/.../viewform"
            className="w-full p-2.5 bg-[#051C14] border border-emerald-700 rounded-xl text-xs text-white placeholder-emerald-500/50 font-mono focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>

        {/* Official Contact Email */}
        <div className="space-y-2">
          <label className="font-mono text-emerald-300 text-[11px] font-bold">
            Official Coordinator Email
          </label>
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="contact@valmikitigerwatch.org"
            className="w-full p-2.5 bg-[#051C14] border border-emerald-700 rounded-xl text-xs text-white placeholder-emerald-500/50 font-mono focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>

        {/* Confirmation Messages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="font-mono text-emerald-300 text-[11px] block mb-1">
              Volunteer Confirmation Message
            </label>
            <textarea
              value={volMessage}
              onChange={(e) => setVolMessage(e.target.value)}
              rows={3}
              className="w-full p-2.5 bg-[#051C14] border border-emerald-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400 resize-none"
            />
          </div>

          <div>
            <label className="font-mono text-emerald-300 text-[11px] block mb-1">
              Supporter Confirmation Message
            </label>
            <textarea
              value={supMessage}
              onChange={(e) => setSupMessage(e.target.value)}
              rows={3}
              className="w-full p-2.5 bg-[#051C14] border border-emerald-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400 resize-none"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: AI CHATBOT & GEMINI CONFIGURATION */}
      <div className="bg-[#07271D] p-5 rounded-2xl border border-emerald-800 space-y-5">
        <div className="flex items-center justify-between border-b border-emerald-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-white">AI Assistant & Gemini Engine Configuration</h4>
              <p className="text-[10px] font-mono text-emerald-300">
                Server-side powered assistant grounded strictly on VTR census and verified conservation records.
              </p>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer bg-[#051C14] px-3 py-1.5 rounded-xl border border-emerald-700">
            <input
              type="checkbox"
              checked={botEnabled}
              onChange={(e) => setBotEnabled(e.target.checked)}
              className="rounded text-amber-500 bg-[#07271D] border-emerald-600"
            />
            <span className="text-xs font-mono font-bold text-amber-300">
              {botEnabled ? 'Chatbot Enabled' : 'Chatbot Disabled'}
            </span>
          </label>
        </div>

        {/* Server Security Notice */}
        <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-700/60 flex items-start gap-2.5 text-[11px] text-emerald-200">
          <KeyRound className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p>
              <strong>Zero Browser Exposure:</strong> The Gemini API key (<code className="text-amber-300">GEMINI_API_KEY</code>) is stored exclusively on the container backend server and is managed through the AI Studio Settings menu. The client frontend never receives or handles credentials.
            </p>
            <p className="text-emerald-400/80 text-[10px] font-mono">
              When an API key is not configured, the assistant automatically and safely falls back to the internal verified knowledge engine.
            </p>
          </div>
        </div>

        {/* Model & Source Attribution Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-mono text-emerald-300 text-[11px] block mb-1">
              Gemini Model
            </label>
            <select
              value={botModel}
              onChange={(e) => setBotModel(e.target.value)}
              className="w-full p-2.5 bg-[#051C14] border border-emerald-700 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400 font-mono"
            >
              <option value="gemini-3.8-flash">gemini-3.8-flash (Recommended, Fast & Grounded)</option>
              <option value="gemini-2.5-flash">gemini-2.5-flash</option>
              <option value="gemini-2.5-pro">gemini-2.5-pro (Deep Reasoning)</option>
            </select>
          </div>

          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-2 cursor-pointer bg-[#051C14] p-2.5 rounded-xl border border-emerald-700">
              <input
                type="checkbox"
                checked={botSourceAttr}
                onChange={(e) => setBotSourceAttr(e.target.checked)}
                className="rounded text-amber-500 bg-[#07271D] border-emerald-600"
              />
              <span className="text-xs text-emerald-200">
                Show Source Attribution (NTCA & Bihar Forest Records)
              </span>
            </label>
          </div>
        </div>

        {/* Temperature */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-mono text-emerald-300 text-[11px]">
              Response Temperature (Creativity vs Factual Precision): <strong className="text-amber-300">{botTemperature}</strong>
            </label>
            <span className="text-[10px] font-mono text-emerald-400">
              {botTemperature <= 0.3 ? 'Strictly Factual' : botTemperature <= 0.6 ? 'Balanced' : 'Creative'}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={botTemperature}
            onChange={(e) => setBotTemperature(parseFloat(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>

        {/* System Prompt Customization */}
        <div>
          <label className="font-mono text-emerald-300 text-[11px] block mb-1">
            System Instructions / Prompt Guidelines
          </label>
          <textarea
            value={botPrompt}
            onChange={(e) => setBotPrompt(e.target.value)}
            rows={4}
            placeholder="Custom instructions for tone, grounding, or specific directives..."
            className="w-full p-2.5 bg-[#051C14] border border-emerald-700 rounded-xl text-xs text-white placeholder-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-amber-400 font-mono resize-none"
          />
          <p className="text-[10px] text-emerald-300/70 mt-1">
            Leave blank or customize. Strict anti-hallucination rules are enforced automatically by the server service.
          </p>
        </div>

        {/* Welcome Messages (Multilingual) */}
        <div className="space-y-3">
          <label className="font-mono text-emerald-300 text-[11px] block font-bold">
            Welcome Greetings
          </label>
          <div className="space-y-2">
            <div>
              <span className="text-[10px] font-mono text-amber-300">English:</span>
              <input
                type="text"
                value={botWelcomeEn}
                onChange={(e) => setBotWelcomeEn(e.target.value)}
                className="w-full p-2 bg-[#051C14] border border-emerald-700 rounded-xl text-xs text-white"
              />
            </div>
            <div>
              <span className="text-[10px] font-mono text-amber-300">Hindi (हिंदी):</span>
              <input
                type="text"
                value={botWelcomeHi}
                onChange={(e) => setBotWelcomeHi(e.target.value)}
                className="w-full p-2 bg-[#051C14] border border-emerald-700 rounded-xl text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Suggested Quick Questions Editor */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="font-mono text-emerald-300 text-[11px] font-bold">
              Suggested Quick Questions ({suggestedQuestions.length})
            </label>
            <button
              type="button"
              onClick={handleResetQuestions}
              className="text-[10px] font-mono text-amber-300 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to Defaults</span>
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={newQuestionInput}
              onChange={(e) => setNewQuestionInput(e.target.value)}
              placeholder="e.g. Can I take an elephant safari in VTR?"
              className="flex-1 p-2 bg-[#051C14] border border-emerald-700 rounded-xl text-xs text-white placeholder-emerald-500/50"
            />
            <button
              type="button"
              onClick={handleAddQuestion}
              className="px-3 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {suggestedQuestions.map((q, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2 bg-[#051C14] border border-emerald-800 rounded-xl text-xs text-emerald-100"
              >
                <span>{q}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(idx)}
                  className="text-red-400 hover:text-red-300 p-1"
                  title="Remove question"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold rounded-xl text-xs shadow-lg flex items-center gap-1.5 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save All Settings</span>
        </button>
      </div>
    </form>
  );
};
