import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  ExternalLink,
  ChevronDown,
  RotateCcw,
  ShieldAlert,
  Loader2,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { ChatMessage } from '../types';

export const ChatbotWidget: React.FC = () => {
  const {
    isChatbotOpen,
    openChatbot,
    closeChatbot,
    chatbotSettings,
    setActiveTab,
    openVolunteerModal,
    openSupporterModal
  } = useData();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [aiStatus, setAiStatus] = useState<{ isConfigured: boolean; modelName: string; provider: string } | null>(null);
  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 1024 : false;
  });
  const [navHeight, setNavHeight] = useState<number>(() => {
    return typeof window !== 'undefined' && window.innerWidth < 1024 ? 64 : 0;
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Dynamically calculate bottom navigation height + safe area insets for mobile
  useEffect(() => {
    const updateDimensions = () => {
      const isMobile = window.innerWidth < 1024;
      setIsMobileScreen(isMobile);
      if (isMobile) {
        const navEl = document.getElementById('mobile-bottom-dock-nav');
        if (navEl) {
          const rect = navEl.getBoundingClientRect();
          setNavHeight(rect.height > 0 ? Math.max(Math.round(rect.height), 60) : 64);
        } else {
          setNavHeight(64);
        }
      } else {
        setNavHeight(0);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    window.addEventListener('orientationchange', updateDimensions);

    const navEl = document.getElementById('mobile-bottom-dock-nav');
    let observer: ResizeObserver | null = null;
    if (navEl && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => updateDimensions());
      observer.observe(navEl);
    }

    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('orientationchange', updateDimensions);
      observer?.disconnect();
    };
  }, []);

  // Ensure Android virtual keyboard doesn't hide input
  useEffect(() => {
    if (!window.visualViewport) return;
    const viewport = window.visualViewport;
    const handleViewportResize = () => {
      if (isChatbotOpen) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    };
    viewport.addEventListener('resize', handleViewportResize);
    return () => viewport.removeEventListener('resize', handleViewportResize);
  }, [isChatbotOpen]);

  // Initialize welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeText = chatbotSettings.welcomeMessageEn ||
        'Welcome to Valmiki Tiger Watch! I am your AI conservation assistant. Ask me anything about Valmiki Tiger Reserve, tigers, wildlife, safaris, research, or volunteer opportunities.';

      setMessages([
        {
          id: 'welcome-1',
          sender: 'assistant',
          text: welcomeText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sourceAttribution: 'Valmiki Tiger Reserve Verified Grounded Registry'
        }
      ]);
    }
  }, [chatbotSettings]);

  // Check backend AI status
  useEffect(() => {
    fetch('/api/chat/status')
      .then((res) => res.json())
      .then((data) => setAiStatus(data))
      .catch(() => {
        setAiStatus({
          isConfigured: false,
          modelName: 'gemini-3.8-flash',
          provider: 'VTW AI Service'
        });
      });
  }, []);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (isChatbotOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatbotOpen, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isChatbotOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isChatbotOpen]);

  if (!chatbotSettings.isEnabled) {
    return null;
  }

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = (textToSend || inputValue).trim();
    if (!messageText || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    try {
      // Build conversation history for context
      const history = messages.map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
        content: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          history,
          customSystemPrompt: chatbotSettings.systemPrompt || undefined
        })
      });

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sourceAttribution: chatbotSettings.enableSourceAttribution ? data.sourceAttribution : undefined,
        suggestedActions: data.suggestedActions
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'VTW AI is temporarily unavailable. Please try again later.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActionClick = (action: { label: string; tab?: string; externalUrl?: string; actionType?: 'open_volunteer' | 'open_supporter' | 'navigate' }) => {
    if (action.actionType === 'open_volunteer') {
      openVolunteerModal();
      return;
    }
    if (action.actionType === 'open_supporter') {
      openSupporterModal();
      return;
    }
    if (action.tab) {
      setActiveTab(action.tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (action.externalUrl) {
      window.open(action.externalUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleClearChat = () => {
    const welcomeText = chatbotSettings.welcomeMessageEn ||
      'Welcome to Valmiki Tiger Watch! I am your AI conservation assistant. Ask me anything about Valmiki Tiger Reserve, tigers, wildlife, safaris, research, or volunteer opportunities.';

    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'assistant',
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sourceAttribution: 'Valmiki Tiger Reserve Verified Grounded Registry'
      }
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button (Position calculated strictly above bottom navigation) */}
      {!isChatbotOpen && (
        <button
          id="open-vtw-chatbot-btn"
          onClick={openChatbot}
          aria-label="Open Valmiki Tiger Watch AI Assistant"
          style={{
            bottom: isMobileScreen
              ? `calc(${Math.max(navHeight, 60)}px + env(safe-area-inset-bottom, 0px) + 16px)`
              : '24px',
            right: isMobileScreen ? '14px' : '24px'
          }}
          className="fixed z-40 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black shadow-2xl flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95 border border-amber-300/40 select-none cursor-pointer"
        >
          <div className="relative">
            <MessageSquare className="w-6 h-6 fill-black/20" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-black animate-pulse" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold leading-none tracking-tight">Tiger Watch AI</div>
            <div className="text-[10px] font-mono text-black/70">Conservation Guide</div>
          </div>
        </button>
      )}

      {/* Chat Window / Drawer (Positioned above bottom navigation; bottom menu remains accessible) */}
      {isChatbotOpen && (
        <div
          id="vtw-chatbot-window"
          style={
            isExpanded
              ? undefined
              : {
                  bottom: isMobileScreen
                    ? `calc(${Math.max(navHeight, 60)}px + env(safe-area-inset-bottom, 0px) + 10px)`
                    : '24px',
                  right: isMobileScreen ? '8px' : '24px',
                  left: isMobileScreen ? '8px' : 'auto',
                  width: isMobileScreen ? 'calc(100vw - 16px)' : '440px',
                  maxWidth: isMobileScreen ? 'calc(100vw - 16px)' : '440px',
                  height: isMobileScreen
                    ? `min(540px, calc(100dvh - ${Math.max(navHeight, 60)}px - env(safe-area-inset-bottom, 0px) - 28px))`
                    : '600px',
                  maxHeight: isMobileScreen
                    ? `calc(100dvh - ${Math.max(navHeight, 60)}px - env(safe-area-inset-bottom, 0px) - env(safe-area-inset-top, 0px) - 20px)`
                    : '85vh'
                }
          }
          className={`fixed z-50 flex flex-col bg-[#051C14] border border-emerald-700/80 shadow-2xl overflow-hidden transition-all duration-200 rounded-2xl ${
            isExpanded ? 'inset-x-2 top-[calc(env(safe-area-inset-top,0px)+8px)] bottom-[calc(env(safe-area-inset-bottom,0px)+8px)] sm:inset-6' : ''
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#07271D] via-[#0B3B2C] to-[#07271D] px-4 py-3 border-b border-emerald-800 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-sm text-amber-300">
                    Valmiki Tiger Watch AI
                  </h3>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                      aiStatus?.isConfigured
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                        : 'bg-emerald-950/70 text-emerald-300/90 border-emerald-800/70'
                    }`}
                  >
                    {aiStatus?.isConfigured ? 'Gemini 3.8 Flash' : 'VTW AI Service'}
                  </span>
                </div>
                <p className="text-[10px] font-mono text-emerald-300/70">
                  Grounded on NTCA & Bihar Forest Dept Records
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={handleClearChat}
                className="p-1.5 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-800/50 transition-colors"
                title="Clear conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsExpanded((prev) => !prev)}
                className="hidden sm:inline-flex p-1.5 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-800/50 transition-colors"
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                id="close-vtw-chatbot-btn"
                onClick={closeChatbot}
                className="p-1.5 rounded-lg text-emerald-400 hover:text-white hover:bg-emerald-800/50 transition-colors"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area (min-h-0 allows shrinking when keyboard opens) */}
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 space-y-3.5 text-xs">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-900/60 border border-emerald-700 flex items-center justify-center text-amber-400 flex-shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div className={`max-w-[85%] space-y-1.5 ${isUser ? 'items-end text-right' : 'items-start text-left'}`}>
                    <div
                      className={`p-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                        isUser
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black font-medium rounded-tr-none shadow'
                          : msg.isError
                          ? 'bg-red-950/70 border border-red-800 text-red-200 rounded-tl-none'
                          : 'bg-[#07271D] border border-emerald-800/90 text-emerald-50 rounded-tl-none shadow-md'
                      }`}
                    >
                      {msg.text}
                    </div>

                    {/* Source Attribution */}
                    {msg.sourceAttribution && (
                      <div className="text-[10px] font-mono text-emerald-400/90 flex items-center gap-1 pl-1">
                        <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                        <span>Source: {msg.sourceAttribution}</span>
                      </div>
                    )}

                    {/* Suggested Smart Action Buttons */}
                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.suggestedActions.map((act, i) => (
                          <button
                            key={i}
                            onClick={() => handleActionClick(act)}
                            className="px-2.5 py-1 bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-lg text-[11px] font-semibold transition-all inline-flex items-center gap-1"
                          >
                            <span>{act.label}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="text-[9px] font-mono text-emerald-400/50 px-1">
                      {msg.timestamp}
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 flex-shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-900/60 border border-emerald-700 flex items-center justify-center text-amber-400 flex-shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="p-3 bg-[#07271D] border border-emerald-800/90 rounded-2xl rounded-tl-none text-emerald-300 flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  <span className="text-[11px] font-mono">Consulting VTR verified records...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Questions Ribbon */}
          {chatbotSettings.suggestedQuestions && chatbotSettings.suggestedQuestions.length > 0 && (
            <div className="px-3 py-2 bg-[#07271D]/90 border-t border-emerald-800/80 overflow-x-auto flex items-center gap-1.5 flex-shrink-0 no-scrollbar">
              <span className="text-[10px] font-mono text-emerald-400 whitespace-nowrap pl-1">
                Suggested:
              </span>
              {chatbotSettings.suggestedQuestions.map((question, i) => (
                <button
                  key={i}
                  disabled={isLoading}
                  onClick={() => handleSendMessage(question)}
                  className="px-2.5 py-1 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 rounded-full text-[11px] text-emerald-200 hover:text-white whitespace-nowrap transition-colors flex-shrink-0 disabled:opacity-50"
                >
                  {question}
                </button>
              ))}
            </div>
          )}

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-[#07271D] border-t border-emerald-800 flex items-center gap-2 flex-shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about tigers, safaris, volunteers, research..."
              disabled={isLoading}
              className="flex-1 p-2.5 bg-[#051C14] border border-emerald-700 rounded-xl text-xs text-white placeholder-emerald-500/60 focus:outline-none focus:ring-1 focus:ring-amber-400 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="p-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-bold rounded-xl shadow transition-all disabled:opacity-40"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
