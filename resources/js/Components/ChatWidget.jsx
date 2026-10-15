import React, { useState, useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';
import Button from './Button';
import Badge from './Badge';

const STORAGE_KEY = 'roblox_advisory_chat_history';
const THIRTY_MINUTES_MS = 30 * 60 * 1000;

function getCookie(name) {
  try {
    const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
    return match ? decodeURIComponent(match[3]) : null;
  } catch {
    return null;
  }
}

function getTurnstileSiteKey() {
  if (typeof document !== 'undefined') {
    const meta = document.querySelector('meta[name="turnstile-site-key"]');
    if (meta && meta.content) return meta.content;
  }
  return '';
}

let turnstileScriptLoading = false;
function loadTurnstileScript(onLoaded) {
  if (typeof window === 'undefined') return;
  if (window.turnstile) {
    onLoaded();
    return;
  }
  if (turnstileScriptLoading) {
    const check = setInterval(() => {
      if (window.turnstile) {
        clearInterval(check);
        onLoaded();
      }
    }, 100);
    return;
  }
  turnstileScriptLoading = true;
  const script = document.createElement('script');
  script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
  script.async = true;
  script.defer = true;
  script.onload = () => onLoaded();
  document.head.appendChild(script);
}

function loadStoredHistory() {
  try {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const stored = window.sessionStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed.map((m) => ({
          role: m.role,
          content: m.content,
          sig: m.sig,
          truncated: m.truncated,
        }));
      }
      if (parsed && typeof parsed === 'object' && Array.isArray(parsed.messages)) {
        const lastActive = Number(parsed.lastActive) || 0;
        if (Date.now() - lastActive > THIRTY_MINUTES_MS) {
          window.sessionStorage.removeItem(STORAGE_KEY);
          return [];
        }
        return parsed.messages.map((m) => ({
          role: m.role,
          content: m.content,
          sig: m.sig,
          truncated: m.truncated,
        }));
      }
    }
  } catch {
    // Storage unavailable fallback
  }
  return [];
}

async function sendChatRequest(messages, turnstileToken = null) {
  const payload = { messages };
  if (turnstileToken) {
    payload.turnstile_token = turnstileToken;
  }

  if (typeof window !== 'undefined' && window.axios) {
    const response = await window.axios.post('/api/chat', payload);
    return response.data;
  }

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const csrfMeta = typeof document !== 'undefined'
    ? document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
    : null;
  if (csrfMeta) {
    headers['X-CSRF-TOKEN'] = csrfMeta;
  }

  const xsrfCookie = getCookie('XSRF-TOKEN');
  if (xsrfCookie) {
    headers['X-XSRF-TOKEN'] = xsrfCookie;
  }

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data?.reply || data?.message || 'Chat request failed');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

function fallbackCopyText(text, onSuccess) {
  try {
    if (typeof document === 'undefined') return;
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus({ preventScroll: true });
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    if (successful && onSuccess) {
      onSuccess();
    }
  } catch {
    // Ignore fallback failure
  }
}

function CodeSnippet({ language, code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const onCopied = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    };

    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(code)
        .then(onCopied)
        .catch(() => fallbackCopyText(code, onCopied));
    } else {
      fallbackCopyText(code, onCopied);
    }
  };

  return (
    <div className="w-full min-w-0 rounded-xl border border-ink/15 bg-ink/[0.04] overflow-hidden my-2">
      <div className="flex items-center justify-between px-3 py-1.5 bg-ink/[0.07] border-b border-ink/10 text-[11px] font-mono text-ink-soft select-none">
        <span className="lowercase">{language || 'code'}</span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? 'Code copied to clipboard' : 'Copy code block to clipboard'}
          className="px-2 py-0.5 rounded text-[11px] font-sans font-medium text-ink bg-white hover:bg-cream border border-ink/10 transition-colors shadow-2xs focus-visible:outline-2 focus-visible:outline-ink"
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="p-3 text-xs font-mono text-ink overflow-x-auto whitespace-pre min-w-0">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function parseMessageSegments(text) {
  if (!text) return [];
  const normalized = text.replace(/\r\n/g, '\n');
  const lines = normalized.split('\n');
  const segments = [];
  let inCode = false;
  let currentLanguage = '';
  let currentLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!inCode) {
      const openMatch = trimmed.match(/^```([a-zA-Z0-9_-]*)$/);
      if (openMatch) {
        const textContent = currentLines.join('\n').trim();
        if (textContent.length > 0) {
          segments.push({ type: 'text', content: textContent });
        }
        currentLines = [];
        inCode = true;
        currentLanguage = openMatch[1] || '';
      } else {
        currentLines.push(line);
      }
    } else {
      if (trimmed === '```' || trimmed.startsWith('```')) {
        segments.push({
          type: 'code',
          language: currentLanguage,
          content: currentLines.join('\n').replace(/\n+$/, ''),
        });
        currentLines = [];
        inCode = false;
        currentLanguage = '';
      } else {
        currentLines.push(line);
      }
    }
  }

  if (inCode) {
    segments.push({
      type: 'code',
      language: currentLanguage,
      content: currentLines.join('\n').replace(/\n+$/, ''),
    });
  } else {
    const textContent = currentLines.join('\n').trim();
    if (textContent.length > 0) {
      segments.push({ type: 'text', content: textContent });
    }
  }

  return segments;
}

function renderInlineText(text) {
  if (!text) return null;
  const tokenRegex = /(`[^`\n]+`|\*\*[^*\n]+\*\*)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 mx-0.5 rounded-md bg-ink/8 text-ink font-mono text-[0.85em] border border-ink/10 break-all"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return (
        <strong key={index} className="font-semibold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return part;
  });
}

function FormattedContent({ text }) {
  const segments = parseMessageSegments(text);

  return (
    <div className="space-y-1.5 text-xs sm:text-sm min-w-0 w-full">
      {segments.map((segment, index) => {
        if (segment.type === 'code') {
          return (
            <CodeSnippet
              key={index}
              language={segment.language}
              code={segment.content}
            />
          );
        }
        return (
          <p key={index} className="whitespace-pre-wrap leading-relaxed break-words">
            {renderInlineText(segment.content)}
          </p>
        );
      })}
    </div>
  );
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => loadStoredHistory());
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const [errorState, setErrorState] = useState(null);

  const launcherRef = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const turnstileContainerRef = useRef(null);
  const lastPendingMessageRef = useRef(null);
  const prevIsOpenRef = useRef(isOpen);
  const isNearBottomRef = useRef(true);

  const starterQuestions = [
    'How do I structure BindToClose for safe DataStore saves?',
    'What is the best way to secure client RemoteEvents?',
    'How do I calibrate economy progression for player retention?',
  ];

  // Save to sessionStorage with timestamp
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        if (messages.length > 0) {
          window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
            messages: messages.map((m) => ({
              role: m.role,
              content: m.content,
              sig: m.sig,
              truncated: m.truncated,
            })),
            lastActive: Date.now(),
          }));
        } else {
          window.sessionStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch {
      // Storage unavailable fallback
    }
  }, [messages]);

  // Check 30-minute expiration when opening panel
  useEffect(() => {
    if (isOpen) {
      try {
        if (typeof window !== 'undefined' && window.sessionStorage) {
          const stored = window.sessionStorage.getItem(STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && parsed.lastActive) {
              const lastActive = Number(parsed.lastActive) || 0;
              if (Date.now() - lastActive > THIRTY_MINUTES_MS) {
                window.sessionStorage.removeItem(STORAGE_KEY);
                setMessages([]);
              }
            }
          }
        }
      } catch {}

      setTimeout(() => {
        inputRef.current?.focus({ preventScroll: true });
      }, 50);
    }
  }, [isOpen]);

  useEffect(() => {
    function handleGlobalKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        launcherRef.current?.focus({ preventScroll: true });
      }
    }
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen]);

  useEffect(() => {
    function handleOpenChat(e) {
      setIsOpen(true);
      const prefill = e?.detail?.prefill;
      if (typeof prefill === 'string') {
        setInput(prefill);
      }
      setTimeout(() => {
        inputRef.current?.focus({ preventScroll: true });
      }, 80);
    }
    window.addEventListener('open-chat', handleOpenChat);
    return () => window.removeEventListener('open-chat', handleOpenChat);
  }, []);

  const handleMessagesScroll = (e) => {
    const el = e.currentTarget;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    isNearBottomRef.current = distFromBottom <= 80;
  };

  useEffect(() => {
    if (!isOpen) {
      prevIsOpenRef.current = false;
      return;
    }

    const justOpened = !prevIsOpenRef.current && isOpen;
    prevIsOpenRef.current = isOpen;

    const el = messagesContainerRef.current;
    if (!el) return;

    const lastMsg = messages[messages.length - 1];
    const isUserMessage = lastMsg?.role === 'user';

    if (justOpened || isUserMessage || isNearBottomRef.current) {
      el.scrollTop = el.scrollHeight;
      isNearBottomRef.current = true;
    }

    if (panelRef.current && panelRef.current.scrollTop !== 0) {
      panelRef.current.scrollTop = 0;
    }
  }, [messages.length, isLoading, errorState, isOpen]);

  const handleNewConversation = () => {
    setMessages([]);
    setErrorState(null);
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {}
  };

  const handleSendMessage = async (textToSend, turnstileToken = null) => {
    const content = (textToSend || input).trim();
    if (!content || isLoading || isCooldown || content.length > 2000) return;

    lastPendingMessageRef.current = content;

    const userMessage = { role: 'user', content };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput('');
    setErrorState(null);
    setIsLoading(true);

    // 2-second cooldown on client side
    setIsCooldown(true);
    setTimeout(() => setIsCooldown(false), 2000);

    try {
      const payloadMessages = updatedMessages.slice(-6).map((m) => {
        const item = { role: m.role, content: m.content };
        if (m.role === 'assistant' && m.sig) {
          item.sig = m.sig;
        }
        return item;
      });

      const data = await sendChatRequest(payloadMessages, turnstileToken);
      const replyText = data?.reply || 'No response received.';
      const isTruncated = Boolean(data?.truncated);
      const signature = data?.sig || null;

      setMessages([
        ...updatedMessages,
        {
          role: 'assistant',
          content: replyText,
          truncated: isTruncated,
          sig: signature,
        },
      ]);
    } catch (err) {
      const status = err.status || err.response?.status;
      const errorData = err.data || err.response?.data || {};

      if (status === 429) {
        if (errorData.code === 'slow_down') {
          setErrorState({
            type: 'slow_down',
            message: 'You are sending messages too quickly. Please wait a moment and try again.',
          });
        } else if (errorData.code === 'global_cap') {
          setErrorState({
            type: 'global_cap',
            message: errorData.reply || 'Our free chat quota for today has been reached. Please try again tomorrow or book a consultation.',
          });
        } else {
          setErrorState({
            type: 'ip_limit',
            message: errorData.reply || 'You have reached the per-IP message limit for today. If you need direct advisory, please get in touch.',
          });
        }
      } else if (status === 403 && errorData.code === 'verify') {
        const siteKey = getTurnstileSiteKey();
        if (siteKey) {
          setErrorState({
            type: 'verify',
            message: 'Please complete the verification challenge below to continue.',
          });
          loadTurnstileScript(() => {
            if (window.turnstile && turnstileContainerRef.current) {
              window.turnstile.render(turnstileContainerRef.current, {
                sitekey: siteKey,
                callback: (token) => {
                  setErrorState(null);
                  if (lastPendingMessageRef.current) {
                    handleSendMessage(lastPendingMessageRef.current, token);
                  }
                },
              });
            }
          });
        } else {
          setErrorState({
            type: 'verify',
            message: 'Verification required. Please contact support if this continues.',
          });
        }
      } else if (status === 502 || status === 503) {
        setErrorState({
          type: 'upstream',
          message: errorData.reply || 'The assistant is unavailable right now. Please try again later.',
        });
      } else if (status === 422) {
        setErrorState({
          type: 'validation',
          message: errorData.message || 'The message could not be processed. Please try again.',
        });
      } else {
        setErrorState({
          type: 'upstream',
          message: 'The assistant is unavailable right now. Please try again later.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating launcher button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          ref={launcherRef}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Close advisory chat' : 'Open advisory chat'}
          aria-expanded={isOpen}
          className="h-13 w-13 rounded-2xl bg-ink text-cream hover:bg-ink-soft border border-ink shadow-md flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-ink"
        >
          {isOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          )}
        </button>
      </div>

      {/* Chat panel */}
      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Roblox Advisory Assistant chat"
          onScroll={(e) => {
            if (e.currentTarget.scrollTop !== 0) {
              e.currentTarget.scrollTop = 0;
            }
          }}
          className="fixed bottom-22 right-4 sm:bottom-22 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] md:w-[420px] h-[520px] max-h-[calc(100vh-7rem)] bg-cream rounded-2xl sm:rounded-3xl border border-ink/15 shadow-2xl flex flex-col overflow-hidden overscroll-none transition-all duration-200"
        >
          {/* Header */}
          <div className="px-4 py-3 sm:px-5 sm:py-3.5 bg-white/80 backdrop-blur-xs border-b border-ink/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-peach border border-ink/20 flex items-center justify-center font-display font-bold text-xs text-ink shadow-2xs">
                R
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm text-ink leading-tight">
                  Roblox Advisory Assistant
                </h3>
                <span className="text-[11px] text-ink-soft block leading-none mt-0.5">
                  Engineering and Economy
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleNewConversation}
                disabled={messages.length === 0 || isLoading}
                aria-label="Start new conversation"
                title="New conversation"
                className="text-[11px] font-sans font-medium px-2 py-1 rounded-lg text-ink-soft hover:text-ink hover:bg-ink/5 disabled:opacity-30 disabled:pointer-events-none transition-colors focus-visible:outline-2 focus-visible:outline-ink"
              >
                New conversation
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  launcherRef.current?.focus({ preventScroll: true });
                }}
                aria-label="Close chat panel"
                className="p-1.5 rounded-lg text-ink-soft hover:text-ink hover:bg-ink/5 transition-colors focus-visible:outline-2 focus-visible:outline-ink"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages list */}
          <div
            ref={messagesContainerRef}
            role="log"
            aria-live="polite"
            onScroll={handleMessagesScroll}
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-3.5 min-w-0"
          >
            {/* Welcome banner */}
            <div className="p-3.5 bg-white rounded-2xl border border-ink/10 shadow-2xs space-y-2">
              <div className="flex items-center gap-1.5">
                <Badge color="butter" size="sm">Advisory</Badge>
              </div>
              <p className="text-xs sm:text-sm text-ink leading-relaxed">
                Ask technical questions regarding Luau code, architecture patterns, game economy balancing, or live-ops.
              </p>
            </div>

            {/* Conversation messages */}
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={index}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} min-w-0 w-full`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-2xs min-w-0 ${
                      isUser
                        ? 'bg-ink text-cream border border-ink'
                        : 'bg-white text-ink border border-ink/10'
                    }`}
                  >
                    {isUser ? (
                      <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed break-words">
                        {msg.content}
                      </p>
                    ) : (
                      <FormattedContent text={msg.content} />
                    )}
                  </div>
                  {!isUser && msg.truncated && (
                    <p className="text-[11px] text-ink-soft mt-1 px-1 leading-normal max-w-[85%]">
                      This response reached the length limit. Type continue to see the rest.
                    </p>
                  )}
                </div>
              );
            })}

            {/* Quick action links after assistant response */}
            {messages.some((m) => m.role === 'assistant') && (
              <div className="flex items-center gap-3 pt-1 px-1 text-xs text-ink-soft select-none">
                <Link
                  href="/contact"
                  className="hover:text-ink underline decoration-ink/25 hover:decoration-ink transition-colors"
                >
                  Book a consultation
                </Link>
                <span className="text-ink/30" aria-hidden="true">&middot;</span>
                <Link
                  href="/packages"
                  className="hover:text-ink underline decoration-ink/25 hover:decoration-ink transition-colors"
                >
                  See packages
                </Link>
              </div>
            )}

            {/* Starter questions if history is empty */}
            {messages.length === 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft block">
                  Suggested topics
                </span>
                <div className="flex flex-col gap-1.5">
                  {starterQuestions.map((question, qIdx) => (
                    <button
                      key={qIdx}
                      type="button"
                      onClick={() => handleSendMessage(question)}
                      aria-label={`Ask topic: ${question}`}
                      className="text-left text-xs text-ink bg-white hover:bg-peach/30 border border-ink/10 rounded-xl px-3 py-2 transition-colors focus-visible:outline-2 focus-visible:outline-ink shadow-2xs"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div
                  role="status"
                  className="flex items-center gap-1.5 px-3 py-2 bg-white border border-ink/10 rounded-2xl shadow-2xs"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-ink/50 animate-typing-dot motion-reduce:animate-none" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-ink/50 animate-typing-dot motion-reduce:animate-none" style={{ animationDelay: '160ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-ink/50 animate-typing-dot motion-reduce:animate-none" style={{ animationDelay: '320ms' }} />
                  <span className="sr-only">Assistant is typing</span>
                </div>
              </div>
            )}

            {/* Turnstile challenge container */}
            <div ref={turnstileContainerRef} className="my-2 empty:hidden" />

            {/* Error display */}
            {errorState && (
              <div
                role="alert"
                className="p-3 rounded-2xl bg-peach/30 border border-ink/15 text-xs text-ink space-y-2 shadow-2xs"
              >
                <p className="leading-relaxed font-medium">
                  {errorState.message}
                </p>
                {(errorState.type === 'ip_limit' || errorState.type === 'global_cap') && (
                  <div className="pt-1">
                    <Button
                      href="/contact"
                      size="sm"
                      variant="primary"
                      className="w-full justify-center"
                    >
                      Book a Consultation
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input bar */}
          <div className="p-3 bg-white/80 backdrop-blur-xs border-t border-ink/10 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="space-y-2"
            >
              <div className="relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, 2000))}
                  onKeyDown={handleInputKeyDown}
                  placeholder="Ask a technical Roblox question..."
                  rows={2}
                  disabled={isLoading}
                  maxLength={2000}
                  aria-label="Chat message input"
                  className="w-full resize-none rounded-xl border border-ink/15 bg-white px-3 py-2 text-xs sm:text-sm text-ink placeholder:text-ink/40 focus:border-ink focus:outline-none disabled:opacity-50"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-ink-soft">
                <span className={input.length >= 1900 ? 'text-red-600 font-medium' : 'text-[11px]'}>
                  {input.length}/2000
                </span>
                <Button
                  type="submit"
                  size="sm"
                  variant="primary"
                  disabled={!input.trim() || isLoading || isCooldown}
                  aria-label="Send message"
                >
                  Send
                </Button>
              </div>
            </form>
            <p className="text-[11px] text-ink-soft text-center pt-2 leading-tight select-none">
              AI assistant, powered by Claude. Responses may contain errors. Test code before using it.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
