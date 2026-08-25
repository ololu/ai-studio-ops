"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ChatMessage, AIDialect } from "../types";
import { AFRICAN_MARKETS, DIALECT_PROMPTS } from "../data/studioData";
import {
  Sparkles, Send, ChevronDown, Languages, Wand2, Brain, MessageSquare, Copy, Check, Loader2, Zap,
} from "lucide-react";

const QUICK_PROMPTS = [
  "Generate Tech Event Banner for Lagos audience",
  "E-commerce Afrobeat Vibe Instagram Post",
  "Create product launch carousel for Nairobi",
  "Design festival poster with Kente patterns",
  "Write brand copy in Nigerian Pidgin",
  "Generate Swahili social media captions",
];

const DIALECTS: { code: AIDialect; label: string; flag: string }[] = [
  { code: "en-US", label: "English (US)", flag: "🇺🇸" },
  { code: "pidgin", label: "Nigerian Pidgin", flag: "🇳🇬" },
  { code: "swahili", label: "Kiswahili", flag: "🇰🇪" },
  { code: "wolof", label: "Wolof", flag: "🇸🇳" },
  { code: "yoruba", label: "Yoruba", flag: "🇳🇬" },
  { code: "amharic", label: "Amharic", flag: "🇪🇹" },
  { code: "fr-west-africa", label: "French (West Africa)", flag: "🇸🇳" },
];

export default function AiDesignAgent() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", content: "Hello! I'm your AI Design Agent. Describe what you'd like to create, and I'll help you design it. I can adapt copy for African markets too.", timestamp: Date.now(), suggestions: ["Start a new design", "Translate copy to Pidgin", "Generate hashtags"] },
  ]);
  const [input, setInput] = useState("");
  const [dialect, setDialect] = useState<AIDialect>("en-US");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDialectPicker, setShowDialectPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const generateResponse = (userMsg: string): ChatMessage => {
    const lower = userMsg.toLowerCase();
    let response = "";
    let suggestions: string[] = [];

    if (lower.includes("banner") || lower.includes("poster") || lower.includes("design")) {
      response = `I've generated a ${dialect !== "en-US" ? DIALECTS.find(d => d.code === dialect)?.label + " styled" : ""} design concept based on your request. The layout uses African geometric patterns with modern typography. You can inject this onto the canvas by clicking the button below.`;
      suggestions = ["Adjust colors to match brand kit", "Add text overlay", "Export as PNG"];
    } else if (lower.includes("copy") || lower.includes("caption") || lower.includes("text")) {
      const prompts = DIALECT_PROMPTS[dialect] || DIALECT_PROMPTS["en-US"];
      response = `Here are some copy options in ${DIALECTS.find(d => d.code === dialect)?.label}: "${prompts[0]}"

Alternative: "${prompts[1]}"

Or try: "${prompts[2]}"`;
      suggestions = ["Make it shorter", "More formal tone", "Add call-to-action"];
    } else if (lower.includes("hashtag") || lower.includes("social")) {
      response = `Here are trending hashtags for your ${dialect !== "en-US" ? DIALECTS.find(d => d.code === dialect)?.flag + " " + DIALECTS.find(d => d.code === dialect)?.label : "target"} audience:

#AfricanDesign #CreativeStudio #AfroTech #MadeInAfrica #DesignInspiration #AfricanArt #CreativeProcess`;
      suggestions = ["Generate more hashtags", "Create Instagram post", "Schedule for TikTok"];
    } else {
      response = `Great idea! I can help you bring that to life. Based on your request, I'd suggest starting with an African-inspired color palette (Ochre Gold, Terracotta, Forest Green) combined with clean modern typography. Would you like me to generate a specific design element?`;
      suggestions = ["Generate banner design", "Create social media post", "Build brand palette"];
    }

    return {
      id: `msg-${Date.now()}`, role: "assistant", content: response, timestamp: Date.now(), suggestions,
    };
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: `msg-${Date.now()}`, role: "user", content: input, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsGenerating(true);

    await new Promise((r) => setTimeout(r, 800 + Math.random() * 1200));

    const response = generateResponse(userMsg.content);
    setMessages((prev) => [...prev, response]);
    setIsGenerating(false);
    scrollToBottom();
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
    setTimeout(() => {
      const userMsg: ChatMessage = { id: `msg-${Date.now()}`, role: "user", content: prompt, timestamp: Date.now() };
      setMessages((prev) => [...prev, userMsg]);
      setIsGenerating(true);
      setTimeout(() => {
        const response = generateResponse(prompt);
        setMessages((prev) => [...prev, response]);
        setIsGenerating(false);
        scrollToBottom();
      }, 1000);
    }, 100);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col h-full bg-[#090D16] text-zinc-100">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/50 bg-zinc-900/60">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/15">
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <h2 className="text-sm font-semibold text-zinc-200">AI Design Agent</h2>
          <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-[10px] text-emerald-400 font-medium">Online</span>
        </div>
        <div className="relative">
          <button onClick={() => setShowDialectPicker(!showDialectPicker)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-md text-xs transition-colors">
            <Languages className="w-3.5 h-3.5 text-zinc-400" />
            <span>{DIALECTS.find(d => d.code === dialect)?.flag} {DIALECTS.find(d => d.code === dialect)?.label}</span>
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          </button>
          <AnimatePresence>
            {showDialectPicker && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="absolute right-0 top-full mt-1 w-56 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-50 overflow-hidden">
                {DIALECTS.map((d) => (
                  <button key={d.code} onClick={() => { setDialect(d.code); setShowDialectPicker(false); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-zinc-700 transition-colors ${dialect === d.code ? "bg-amber-500/15 text-amber-400" : "text-zinc-300"}`}>
                    <span>{d.flag}</span>
                    <span className="flex-1 text-left">{d.label}</span>
                    {dialect === d.code && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 border-b border-zinc-800/50 bg-zinc-900/30">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {QUICK_PROMPTS.map((prompt) => (
            <button key={prompt} onClick={() => handleQuickPrompt(prompt)}
              className="flex-shrink-0 px-3 py-1.5 bg-zinc-800/80 hover:bg-zinc-700 rounded-full text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors border border-zinc-700/50">
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${msg.role === "assistant" ? "bg-amber-500/20" : "bg-zinc-700"}`}>
                {msg.role === "assistant" ? <Brain className="w-3.5 h-3.5 text-amber-400" /> : <span className="text-xs text-zinc-400">You</span>}
              </div>
              <div className={`max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div className={`px-3 py-2 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${msg.role === "user" ? "bg-amber-600 text-white rounded-tr-sm" : "bg-zinc-800 text-zinc-300 rounded-tl-sm"}`}>
                  {msg.content}
                </div>
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {msg.suggestions.map((s) => (
                      <button key={s} onClick={() => handleQuickPrompt(s)}
                        className="px-2.5 py-1 bg-zinc-800/60 hover:bg-zinc-700 rounded-full text-[10px] text-zinc-500 hover:text-amber-400 transition-colors border border-zinc-700/30">
                        {s}
                      </button>
                    ))}
                  </div>
                )}
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-2 mt-1.5">
                    <button onClick={() => copyToClipboard(msg.content)}
                      className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] text-zinc-600 hover:text-zinc-400 transition-colors">
                      <Copy className="w-2.5 h-2.5" /> Copy
                    </button>
                    <button className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] text-amber-500/60 hover:text-amber-400 transition-colors">
                      <Wand2 className="w-2.5 h-2.5" /> Inject to Canvas
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isGenerating && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Brain className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="px-3 py-2 rounded-2xl rounded-tl-sm bg-zinc-800">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-zinc-800/50 bg-zinc-900/60">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Describe your design or ask for copy..." rows={1}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none" />
          </div>
          <button onClick={handleSend} disabled={!input.trim() || isGenerating}
            className="flex-shrink-0 p-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white transition-colors">
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
        <div className="flex items-center gap-2 mt-2 px-1">
          <Zap className="w-3 h-3 text-amber-500/50" />
          <span className="text-[10px] text-zinc-600">Powered by AI · Adapts to {DIALECTS.find(d => d.code === dialect)?.label}</span>
        </div>
      </div>
    </div>
  );
}
