import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  ShoppingCart,
  Zap,
  HelpCircle,
  ChevronDown,
  Settings,
  Key,
  Eye,
  EyeOff,
  Cpu,
  Database,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Trash2,
} from 'lucide-react';
import {
  type ChatMode,
  type ServiceMessage,
  findKBAnswer,
  callGeminiAPI,
} from '../services/chatService';


interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  text: string;
  timestamp: string;
  mode?: ChatMode;
  isError?: boolean;
}

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  prompt: string;
}


function uid(): string {
  return Math.random().toString(36).substring(2, 10);
}
function nowTime(): string {
  return new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

const STORAGE_KEY_APIKEY = 'aether-gemini-api-key';
const STORAGE_KEY_MODE   = 'aether-chat-mode';


export const Chatbot: React.FC = () => {
  const { addLog } = useApp();


  const [isOpen, setIsOpen]               = useState(false);
  const [messages, setMessages]           = useState<ChatMessage[]>([]);
  const [input, setInput]                 = useState('');
  const [isTyping, setIsTyping]           = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);


  const [mode, setMode] = useState<ChatMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MODE);
    return (saved === 'gemini' ? 'gemini' : 'kb') as ChatMode;
  });
  const [geminiKey, setGeminiKey] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY_APIKEY) ?? '';
  });
  const [apiStatus, setApiStatus] = useState<'idle' | 'ok' | 'error'>('idle');
  const [apiError, setApiError]   = useState('');


  const [showSettings, setShowSettings]     = useState(false);
  const [keyDraft, setKeyDraft]             = useState('');
  const [showKey, setShowKey]               = useState(false);
  const [isTestingKey, setIsTestingKey]     = useState(false);

  const historyRef = useRef<ServiceMessage[]>([]);

 
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef       = useRef<HTMLInputElement>(null);
  const greetingShown  = useRef(false);


  const quickActions: QuickAction[] = [
    { label: 'Báo giá',    icon: <ShoppingCart size={13} />, prompt: 'Giá các phiên bản Aether Aura là bao nhiêu?' },
    { label: 'Thông số',   icon: <Zap size={13} />,          prompt: 'Thông số kỹ thuật chính của Aether Aura Smart?' },
    { label: 'Đặt hàng',  icon: <ShoppingCart size={13} />, prompt: 'Hướng dẫn tôi cách đặt hàng pre-order' },
    { label: 'So sánh',   icon: <Cpu size={13} />,           prompt: 'So sánh các phiên bản Standard, Special và Premium' },
    { label: 'Hỗ trợ',    icon: <HelpCircle size={13} />,   prompt: 'Tôi cần hỗ trợ về sản phẩm Aether Aura' },
  ];


  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MODE, mode);
  }, [mode]);

 
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  
  useEffect(() => {
    if (isOpen && !showSettings) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, showSettings]);


  useEffect(() => {
    if (isOpen && !greetingShown.current) {
      greetingShown.current = true;
      setIsTyping(true);
      const modeLabel = mode === 'gemini' && geminiKey
        ? '✨ Chế độ **Gemini AI** đang hoạt động'
        : '📚 Chế độ **Tư vấn nhanh** (KB)';
      setTimeout(() => {
        const greeting: ChatMessage = {
          id: uid(),
          role: 'bot',
          text: `Xin chào! 👋 Tôi là **AetherBot** — trợ lý AI tư vấn sản phẩm Aether Aura.\n\n${modeLabel}\n\nTôi có thể giúp bạn:\n• Báo giá & so sánh phiên bản\n• Thông số kỹ thuật chi tiết\n• Hướng dẫn đặt hàng\n• Tư vấn lựa chọn phù hợp\n\nBạn cần hỗ trợ gì? 😊`,
          timestamp: nowTime(),
          mode,
        };
        setMessages([greeting]);
        setIsTyping(false);
      }, 900);
    }
  }, [isOpen, mode, geminiKey]);


  const botReply = useCallback(
    async (userText: string) => {
      setIsTyping(true);

      const addBotMsg = (text: string, isError = false) => {
        setMessages((prev) => [
          ...prev,
          { id: uid(), role: 'bot', text, timestamp: nowTime(), mode, isError },
        ]);
        setIsTyping(false);
        if (!isOpen) setHasNewMessage(true);
      };

      if (mode === 'gemini' && geminiKey) {
        try {
          const answer = await callGeminiAPI(geminiKey, historyRef.current, userText);
       
          const updatedHistory: ServiceMessage[] = [
            ...historyRef.current,
            { role: 'user', text: userText },
            { role: 'model', text: answer },
          ];
          historyRef.current = updatedHistory.slice(-20); // Keep last 10 turns
          addBotMsg(answer);
        } catch (err) {
          const msg = err instanceof Error ? err.message : 'Lỗi không xác định.';
          addBotMsg(
            `⚠️ **Lỗi kết nối Gemini AI:**\n${msg}\n\nĐang chuyển sang chế độ KB để trả lời bạn...\n\n---\n\n${findKBAnswer(userText)}`,
            true
          );
        }
      } else {
       
        await new Promise((r) => setTimeout(r, 600 + Math.random() * 600));
        addBotMsg(findKBAnswer(userText));
      }
    },
    [mode, geminiKey, isOpen]
  );


  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;
    const userMsg: ChatMessage = { id: uid(), role: 'user', text: trimmed, timestamp: nowTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    addLog('click', `Chatbot: Người dùng gửi "${trimmed.substring(0, 40)}${trimmed.length > 40 ? '…' : ''}"`);
    botReply(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleQuickAction = (qa: QuickAction) => {
    if (isTyping) return;
    const userMsg: ChatMessage = { id: uid(), role: 'user', text: qa.prompt, timestamp: nowTime() };
    setMessages((prev) => [...prev, userMsg]);
    addLog('click', `Chatbot: Quick action "${qa.label}"`);
    botReply(qa.prompt);
  };

 
  const toggleChat = () => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) { setHasNewMessage(false); addLog('click', 'Mở Chatbot'); }
      else { setShowSettings(false); addLog('click', 'Đóng Chatbot'); }
      return next;
    });
  };

  
  const openSettings = () => {
    setKeyDraft(geminiKey);
    setApiStatus('idle');
    setApiError('');
    setShowSettings(true);
  };

  const handleSaveKey = () => {
    const trimmedKey = keyDraft.trim();
    setGeminiKey(trimmedKey);
    localStorage.setItem(STORAGE_KEY_APIKEY, trimmedKey);
    if (trimmedKey) {
      setMode('gemini');
      setApiStatus('ok');
    } else {
      setMode('kb');
      setApiStatus('idle');
    }
    setShowSettings(false);

    greetingShown.current = false;
    setMessages([]);
    historyRef.current = [];
    addLog('click', trimmedKey ? 'Chatbot: Kết nối Gemini AI' : 'Chatbot: Chuyển về KB mode');
  };

  const handleTestKey = async () => {
    const trimmedKey = keyDraft.trim();
    if (!trimmedKey) return;
    setIsTestingKey(true);
    setApiStatus('idle');
    setApiError('');
    try {
      await callGeminiAPI(trimmedKey, [], 'Xin chào! Bạn có thể trả lời ngắn gọn không?');
      setApiStatus('ok');
    } catch (err) {
      setApiStatus('error');
      setApiError(err instanceof Error ? err.message : 'Lỗi không xác định.');
    } finally {
      setIsTestingKey(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([]);
    historyRef.current = [];
    greetingShown.current = false;
    setShowSettings(false);
    addLog('click', 'Chatbot: Xóa lịch sử hội thoại');
  };

  const switchToKB = () => {
    setMode('kb');
    setGeminiKey('');
    localStorage.removeItem(STORAGE_KEY_APIKEY);
    setShowSettings(false);
    greetingShown.current = false;
    setMessages([]);
    historyRef.current = [];
    addLog('click', 'Chatbot: Chuyển về KB mode');
  };


  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j}>{part.slice(2, -2)}</strong>;
        }
        return <span key={j}>{part}</span>;
      });
      return (
        <React.Fragment key={i}>
          {i > 0 && <br />}
          {parts}
        </React.Fragment>
      );
    });
  };

  const isGeminiActive = mode === 'gemini' && !!geminiKey;


  return (
    <>
      {/* ═══ Chat Window ═══ */}
      <div
        className={`chatbot-window ${isOpen ? 'open' : ''}`}
        id="chatbot-window"
        role="dialog"
        aria-label="Chatbot hỗ trợ AetherBot"
      >
        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <div className="chatbot-avatar">
              <Bot size={20} />
              <span className="chatbot-status-dot" />
            </div>
            <div>
              <h4>AetherBot</h4>
              <p className="chatbot-mode-badge">
                {isGeminiActive ? (
                  <><Sparkles size={10} /> Gemini AI</>
                ) : (
                  <><Database size={10} /> Tư vấn nhanh</>
                )}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <button
              className="chatbot-icon-btn"
              onClick={openSettings}
              aria-label="Cài đặt chatbot"
              title="Cài đặt AI & API Key"
            >
              <Settings size={16} />
            </button>
            <button className="chatbot-icon-btn" onClick={toggleChat} aria-label="Đóng chatbot">
              <ChevronDown size={18} />
            </button>
          </div>
        </div>

        {/* ═══ Settings Panel (slide-down) ═══ */}
        {showSettings && (
          <div className="chatbot-settings-panel">
            <div className="settings-section">
              <h5 className="settings-title">
                <Cpu size={14} /> Chế độ trả lời AI
              </h5>
              <div className="settings-mode-row">
                <button
                  className={`settings-mode-btn ${mode === 'kb' || !geminiKey ? 'active' : ''}`}
                  onClick={switchToKB}
                >
                  <Database size={14} />
                  <div>
                    <strong>Tư vấn nhanh</strong>
                    <span>Offline · KB thông minh</span>
                  </div>
                </button>
                <button
                  className={`settings-mode-btn ${isGeminiActive ? 'active gemini' : ''}`}
                  onClick={() => { if (!geminiKey) setApiStatus('idle'); }}
                  title={geminiKey ? 'Gemini AI đang hoạt động' : 'Nhập API Key bên dưới để kích hoạt'}
                >
                  <Sparkles size={14} />
                  <div>
                    <strong>Gemini AI</strong>
                    <span>Realtime · Google AI</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="settings-section">
              <h5 className="settings-title">
                <Key size={14} /> Google Gemini API Key
              </h5>
              <p className="settings-hint">
                Lấy miễn phí tại{' '}
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">
                  aistudio.google.com
                </a>
              </p>
              <div className="settings-key-row">
                <input
                  id="chatbot-api-key-input"
                  type={showKey ? 'text' : 'password'}
                  className="settings-key-input"
                  placeholder="AIza..."
                  value={keyDraft}
                  onChange={(e) => { setKeyDraft(e.target.value); setApiStatus('idle'); setApiError(''); }}
                />
                <button
                  className="settings-key-eye"
                  onClick={() => setShowKey((v) => !v)}
                  aria-label="Hiện/ẩn API key"
                >
                  {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Test result */}
              {apiStatus === 'ok' && (
                <div className="settings-status ok">
                  <CheckCircle size={13} /> Kết nối thành công! Gemini AI đã sẵn sàng.
                </div>
              )}
              {apiStatus === 'error' && (
                <div className="settings-status error">
                  <AlertCircle size={13} /> {apiError}
                </div>
              )}

              <div className="settings-actions">
                <button
                  className="settings-btn test"
                  onClick={handleTestKey}
                  disabled={!keyDraft.trim() || isTestingKey}
                >
                  {isTestingKey ? (
                    <><span className="spin-icon">⟳</span> Đang kiểm tra…</>
                  ) : (
                    <><CheckCircle size={13} /> Kiểm tra kết nối</>
                  )}
                </button>
                <button
                  className="settings-btn save"
                  onClick={handleSaveKey}
                >
                  Lưu & Áp dụng
                </button>
              </div>
            </div>

            <div className="settings-section settings-danger">
              <button className="settings-btn danger" onClick={handleClearHistory}>
                <Trash2 size={13} /> Xóa lịch sử hội thoại
              </button>
              <button className="settings-btn outline" onClick={() => setShowSettings(false)}>
                <RotateCcw size={13} /> Đóng cài đặt
              </button>
            </div>
          </div>
        )}

        {/* ═══ Messages ═══ */}
        {!showSettings && (
          <>
            <div className="chatbot-messages" id="chatbot-messages">
              {messages.map((msg) => (
                <div key={msg.id} className={`chatbot-msg ${msg.role}`}>
                  <div className="chatbot-msg-avatar">
                    {msg.role === 'bot' ? <Bot size={15} /> : <User size={15} />}
                  </div>
                  <div className="chatbot-msg-content">
                    <div className={`chatbot-msg-bubble ${msg.isError ? 'error-bubble' : ''}`}>
                      {renderMarkdown(msg.text)}
                    </div>
                    <div className="chatbot-msg-meta">
                      <span className="chatbot-msg-time">{msg.timestamp}</span>
                      {msg.role === 'bot' && msg.mode && (
                        <span className={`chatbot-msg-source ${msg.mode}`}>
                          {msg.mode === 'gemini' ? <><Sparkles size={9} /> Gemini</> : <><Database size={9} /> KB</>}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="chatbot-msg bot">
                  <div className="chatbot-msg-avatar"><Bot size={15} /></div>
                  <div className="chatbot-msg-content">
                    <div className="chatbot-msg-bubble typing-indicator">
                      <span className="dot" /><span className="dot" /><span className="dot" />
                    </div>
                    {isGeminiActive && (
                      <span className="chatbot-msg-time" style={{ marginLeft: '0.5rem' }}>
                        Gemini đang xử lý…
                      </span>
                    )}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 2 && !isTyping && messages.length > 0 && (
              <div className="chatbot-quick-actions">
                {quickActions.map((qa) => (
                  <button
                    key={qa.label}
                    className="quick-action-chip"
                    onClick={() => handleQuickAction(qa)}
                  >
                    {qa.icon}{qa.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="chatbot-input-area">
              {!isGeminiActive && (
                <button
                  className="chatbot-ai-hint"
                  onClick={openSettings}
                  title="Nâng cấp lên Gemini AI"
                >
                  <Sparkles size={13} />
                </button>
              )}
              <input
                ref={inputRef}
                id="chatbot-input"
                type="text"
                className="chatbot-input"
                placeholder={isGeminiActive ? 'Hỏi AetherBot bất cứ điều gì…' : 'Nhập câu hỏi của bạn…'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                disabled={isTyping}
              />
              <button
                className="chatbot-send-btn"
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                aria-label="Gửi tin nhắn"
              >
                <Send size={17} />
              </button>
            </div>
          </>
        )}
      </div>

      {/* ═══ FAB ═══ */}
      <button
        className={`chatbot-fab ${isOpen ? 'active' : ''} ${isGeminiActive ? 'gemini-mode' : ''}`}
        onClick={toggleChat}
        id="chatbot-fab"
        aria-label="Mở chatbot hỗ trợ AetherBot"
      >
        <span className="chatbot-fab-icon open-icon"><MessageCircle size={24} /></span>
        <span className="chatbot-fab-icon close-icon"><X size={24} /></span>
        {!isOpen && <span className="chatbot-fab-ring" />}
        {hasNewMessage && !isOpen && (
          <span className="chatbot-fab-badge"><Sparkles size={10} /></span>
        )}
      </button>
    </>
  );
};
