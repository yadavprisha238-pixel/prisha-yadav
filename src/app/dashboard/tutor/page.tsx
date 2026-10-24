"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Brain,
  Send,
  Sparkles,
  RotateCcw,
  Trash2,
  Copy,
  Check,
  Lightbulb,
  HelpCircle,
  MessageSquare,
  AlertCircle,
  Zap,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Storage } from "@/lib/storage";
import { ChatMessage, Language } from "@/lib/types";

const SUGGESTED_PROMPTS = [
  "Chai banane se Newton's Third Law samjhao!",
  "Polymorphism kya hota hai with real-world analogy?",
  "Samajh nahi aaya: Recursion ko ekdum basic se batao",
  "Time complexity Big O notation 2 minute me samjhao",
];

function TutorPageContent() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [language, setLanguage] = useState<Language>("hinglish");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load chat history from storage
    const loaded = Storage.getChatHistory();
    setMessages(loaded);

    // If query param q is present from topbar search, automatically ask!
    const query = searchParams.get("q");
    if (query && query.trim()) {
      handleSendMessage(query.trim());
    }
  }, [searchParams]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (customPrompt?: string, forceSimplify = false) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: "msg-" + Date.now(),
      sender: "user",
      content: textToSend,
      timestamp: new Date().toISOString(),
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    Storage.saveChatHistory(updated);
    if (!customPrompt) setInputMessage("");
    setLoading(true);

    try {
      const customKey = Storage.getCustomApiKey();
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(customKey ? { "x-gemini-key": customKey } : {}),
        },
        body: JSON.stringify({
          message: textToSend,
          language,
          history: messages.map((m) => ({ sender: m.sender, content: m.content })),
          simplify: forceSimplify,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Fallback demo response for presentation if API key is not configured
        let fallbackReply = "";
        if (data.error === "GEMINI_API_KEY_MISSING") {
          fallbackReply = `Namaste! 🙏 (Presentation Mode Active)\n\nAapka sawal tha: **"${textToSend}"**\n\n**Simple Hinglish Explanation:**\nArre bilkul easy hai! Isko aise socho jaise aap daily life me chai banate ho. Jab aap stove on karte ho aur paani garam hota hai, wahi heat energy water molecules ko excite karti hai! \n\n1. **Core Concept:** Har action ka equal aur opposite reaction hota hai.\n2. **Everyday Analogy:** Jab aap walking karte ho, aapka pair zameen ko peeche push karta hai, aur zameen aapko aage push karti hai!\n3. **Quick Practice Question:** Agar rocket niche gas exhaust throw karta hai, toh rocket upar kyu udta hai? (Hint: Newton's 3rd Law)\n\n*(Note: Add your Gemini API key in Settings to chat with the live unrestricted model!)*`;
        } else {
          fallbackReply = `Oops, thoda issue aaya: ${data.message || "Failed to communicate with AI"}. Please check your connection or API key.`;
        }

        const fallbackMsg: ChatMessage = {
          id: "msg-" + (Date.now() + 1),
          sender: "assistant",
          content: fallbackReply,
          timestamp: new Date().toISOString(),
          isSimplified: forceSimplify,
        };
        const nextMsgs = [...updated, fallbackMsg];
        setMessages(nextMsgs);
        Storage.saveChatHistory(nextMsgs);
        return;
      }

      if (data.reply) {
        const aiMsg: ChatMessage = {
          id: "msg-" + (Date.now() + 1),
          sender: "assistant",
          content: data.reply,
          timestamp: data.timestamp || new Date().toISOString(),
          isSimplified: data.isSimplified,
        };
        const nextMsgs = [...updated, aiMsg];
        setMessages(nextMsgs);
        Storage.saveChatHistory(nextMsgs);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    Storage.clearChatHistory();
    const fresh = Storage.getChatHistory();
    setMessages(fresh);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="h-[calc(100vh-8.5rem)] flex flex-col space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Brain className="w-6 h-6 text-indigo-400" />
            <span>Hinglish AI Tutor</span>
          </h1>
          <p className="text-xs text-[#A5B4CF]">
            Your patient personal study companion. Complex concepts explained with real-life Indian analogies!
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Language selector */}
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1 text-xs">
            {(["hinglish", "hindi", "english"] as Language[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2.5 py-1 rounded-lg capitalize transition ${
                  language === lang
                    ? "gradient-primary text-white font-medium"
                    : "text-[#A5B4CF] hover:text-white"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          <button
            onClick={handleClearChat}
            className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-[#A5B4CF] hover:text-white text-xs transition"
            title="Clear Chat History"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Glass Chat Box */}
      <GlassCard className="flex-1 flex flex-col min-h-0 overflow-hidden p-4 sm:p-6 border-white/10">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center text-white shrink-0 mt-1 shadow-md shadow-indigo-500/20">
                    <Brain className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? "gradient-primary text-white rounded-br-none shadow-lg shadow-indigo-500/20"
                      : "bg-[#10152B]/90 border border-white/10 text-gray-200 rounded-bl-none shadow-sm"
                  }`}
                >
                  {/* Assistant header badges */}
                  {!isUser && (
                    <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2 text-[10px] text-indigo-300">
                      <span className="font-semibold flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                        AI Study Mate
                      </span>
                      <div className="flex items-center gap-2">
                        {msg.isSimplified && (
                          <span className="bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded text-[9px] font-semibold">
                            Simplified Mode
                          </span>
                        )}
                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.content)}
                          className="hover:text-white transition"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="whitespace-pre-wrap">{msg.content}</div>

                  {/* Quick Helper Button if user didn't understand */}
                  {!isUser && (
                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleSendMessage("Samajh nahi aaya, aur simple example se samjhao!", true)
                        }
                        className="inline-flex items-center gap-1.5 text-[11px] text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 px-2.5 py-1 rounded-lg transition"
                      >
                        <HelpCircle className="w-3 h-3 text-amber-400" />
                        <span>Samajh nahi aaya? Click to Simplify</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center text-white shrink-0 mt-1">
                <Brain className="w-4 h-4 animate-pulse" />
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-indigo-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                <span>AI Tutor thinking of an everyday analogy...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts Pills */}
        <div className="pt-3 pb-2 flex items-center gap-2 overflow-x-auto text-xs no-scrollbar shrink-0">
          <span className="text-[10px] text-[#A5B4CF] uppercase font-bold shrink-0 flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-amber-400" />
            Suggestions:
          </span>
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[#A5B4CF] hover:text-white text-xs whitespace-nowrap transition"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="pt-2 flex items-center gap-2 shrink-0 border-t border-white/10"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your question in Hinglish (e.g. 'Binary Search samjhao na' or 'Samajh nahi aaya')..."
            className="flex-1 glass-input px-4 py-3 rounded-xl text-xs sm:text-sm text-white placeholder-[#A5B4CF]/60"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || loading}
            className="gradient-primary gradient-primary-hover px-5 py-3 rounded-xl text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-500/20 transition disabled:opacity-40"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </GlassCard>
    </div>
  );
}

export default function TutorPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-[#A5B4CF]">
          Loading AI Tutor...
        </div>
      }
    >
      <TutorPageContent />
    </Suspense>
  );
}

