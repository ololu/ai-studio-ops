"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { BrandKit, SocialTemplate, Platform } from "../types";
import { SAMPLE_BRAND_KITS, PLATFORM_HASHTAGS, AFRICAN_MARKETS } from "../data/studioData";
import {
  Palette, Hash, Calendar, Copy, Check, Plus, Trash2, Globe, MapPin, Users, Tag, Star, Heart, Share2, Clock, ChevronDown, Settings, Edit3, Save, Upload, Download,
} from "lucide-react";

const PLATFORMS: { key: Platform; label: string; icon: string; color: string }[] = [
  { key: "instagram", label: "Instagram", icon: "📸", color: "#E1306C" },
  { key: "tiktok", label: "TikTok", icon: "🎵", color: "#00F2EA" },
  { key: "linkedin", label: "LinkedIn", icon: "💼", color: "#0A66C2" },
  { key: "x", label: "X / Twitter", icon: "✖️", color: "#1DA1F2" },
  { key: "facebook", label: "Facebook", icon: "👥", color: "#1877F2" },
];

export default function BrandAndSocialStudio() {
  const [activeTab, setActiveTab] = useState<"brand" | "social">("brand");
  const [brandKits, setBrandKits] = useState<BrandKit[]>(SAMPLE_BRAND_KITS);
  const [selectedKit, setSelectedKit] = useState<string>(SAMPLE_BRAND_KITS[0].id);
  const [socialTemplates, setSocialTemplates] = useState<SocialTemplate[]>([]);
  const [newPlatform, setNewPlatform] = useState<Platform>("instagram");
  const [newCaption, setNewCaption] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const kit = brandKits.find((k) => k.id === selectedKit) || brandKits[0];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const generatePost = () => {
    if (!newCaption.trim()) return;
    const hashtags = PLATFORM_HASHTAGS[newPlatform] || [];
    const template: SocialTemplate = {
      id: `st-${Date.now()}`, platform: newPlatform, title: `Auto-generated ${newPlatform} post`,
      aspectRatio: newPlatform === "tiktok" ? "9:16" : "1:1", caption: newCaption, hashtags,
      scheduledDate: null, status: "draft",
    };
    setSocialTemplates((prev) => [...prev, template]);
    setNewCaption("");
  };

  const deleteTemplate = (id: string) => {
    setSocialTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="flex flex-col h-full bg-[#090D16] text-zinc-100">
      {/* Tab Bar */}
      <div className="flex items-center border-b border-zinc-800/50 bg-zinc-900/60">
        {[
          { key: "brand" as const, label: "Brand Kit", icon: Palette },
          { key: "social" as const, label: "Social Generator", icon: Hash },
        ].map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-medium transition-colors border-b-2 ${activeTab === key ? "border-amber-400 text-amber-400" : "border-transparent text-zinc-500 hover:text-zinc-300"}`}>
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "brand" && (
          <motion.div key="brand" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Kit Selector */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {brandKits.map((bk) => (
                <button key={bk.id} onClick={() => setSelectedKit(bk.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedKit === bk.id ? "bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}>
                  {bk.name}
                </button>
              ))}
              <button className="flex-shrink-0 p-1.5 rounded-lg bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Brand Info */}
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
              <h3 className="text-sm font-semibold text-zinc-200 mb-1">{kit.name}</h3>
              <p className="text-xs text-zinc-500 mb-4">{kit.description}</p>
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-3.5 h-3.5 text-zinc-600" />
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Tone of Voice</span>
              </div>
              <p className="text-xs text-zinc-400 italic">"{kit.toneOfVoice}"</p>
            </div>

            {/* Color Palette */}
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Color Palette</h4>
                <button className="text-[10px] text-amber-500 hover:text-amber-400 flex items-center gap-1"><Upload className="w-3 h-3" /> Import</button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {kit.colors.map((c, i) => (
                  <div key={i} className="group relative">
                    <div className="w-full aspect-square rounded-lg shadow-lg cursor-pointer transition-transform group-hover:scale-105" style={{ backgroundColor: c.hex }} />
                    <div className="mt-1.5 text-center">
                      <p className="text-[10px] text-zinc-400 truncate">{c.name}</p>
                      <p className="text-[9px] text-zinc-600 font-mono">{c.hex}</p>
                    </div>
                    <button onClick={() => copyToClipboard(c.hex, `color-${i}`)}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity">
                      {copiedId === `color-${i}` ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Typography */}
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
              <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">Typography Pairings</h4>
              {kit.fonts.map((f, i) => (
                <div key={i} className="space-y-2 p-3 rounded-lg bg-zinc-800/50">
                  <p className="text-lg font-bold" style={{ fontFamily: f.heading }}>{f.heading}</p>
                  <p className="text-sm" style={{ fontFamily: f.body }}>{f.body} — The quick brown fox jumps over the lazy dog.</p>
                  <p className="text-[10px] text-zinc-600">Fallback: {f.fallback}</p>
                </div>
              ))}
            </div>

            {/* Cultural Tokens */}
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
              <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">Cultural Design Tokens</h4>
              <div className="flex flex-wrap gap-2">
                {kit.culturalTokens.map((token, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-medium border border-amber-500/20">{token}</span>
                ))}
              </div>
            </div>

            {/* Logos */}
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Logo Vault</h4>
                <button className="text-[10px] text-amber-500 hover:text-amber-400 flex items-center gap-1"><Download className="w-3 h-3" /> Export All</button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {kit.logos.map((logo, i) => (
                  <div key={i} className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50 flex flex-col items-center gap-2 hover:border-amber-500/30 transition-colors">
                    <div className="w-12 h-12 rounded-md bg-zinc-700/50 flex items-center justify-center">
                      <span className="text-2xl">◆</span>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-zinc-400">{logo.name}</p>
                      <p className="text-[9px] text-zinc-600 uppercase">{logo.format} · {logo.variant}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "social" && (
          <motion.div key="social" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Generator */}
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 space-y-3">
              <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Generate Post</h4>
              <div className="flex items-center gap-2">
                <select value={newPlatform} onChange={(e) => setNewPlatform(e.target.value as Platform)}
                  className="bg-zinc-800 border border-zinc-700 rounded-md px-2 py-1.5 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-amber-500">
                  {PLATFORMS.map((p) => (
                    <option key={p.key} value={p.key}>{p.icon} {p.label}</option>
                  ))}
                </select>
                <button onClick={generatePost} disabled={!newCaption.trim()}
                  className="flex-1 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-700 disabled:text-zinc-500 rounded-md text-xs font-medium transition-colors">
                  Generate & Schedule
                </button>
              </div>
              <textarea value={newCaption} onChange={(e) => setNewCaption(e.target.value)} rows={3}
                placeholder="Write your post caption..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none" />
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-zinc-600" />
                <select className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-[10px] text-zinc-400 focus:outline-none">
                  {AFRICAN_MARKETS.map((m) => (
                    <option key={m.code} value={m.code}>{m.flag} {m.city}, {m.country}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Generated Templates */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Generated Posts ({socialTemplates.length})</h4>
              {socialTemplates.length === 0 && (
                <div className="p-8 rounded-xl bg-zinc-900/30 border border-zinc-800/30 text-center">
                  <Hash className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                  <p className="text-xs text-zinc-600">No posts generated yet. Use the generator above.</p>
                </div>
              )}
              {socialTemplates.map((t) => {
                const plat = PLATFORMS.find((p) => p.key === t.platform);
                return (
                  <div key={t.id} className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span>{plat?.icon}</span>
                        <span className="text-xs font-medium text-zinc-300 capitalize">{t.platform}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${t.status === "published" ? "bg-emerald-500/15 text-emerald-400" : t.status === "scheduled" ? "bg-blue-500/15 text-blue-400" : "bg-zinc-700 text-zinc-400"}`}>
                          {t.status}
                        </span>
                      </div>
                      <button onClick={() => deleteTemplate(t.id)} className="p-1 text-zinc-600 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                    <p className="text-xs text-zinc-400 mb-2 line-clamp-2">{t.caption}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {t.hashtags.slice(0, 4).map((h, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-zinc-800 text-[9px] text-zinc-500">{h}</span>
                      ))}
                      {t.hashtags.length > 4 && <span className="text-[9px] text-zinc-600">+{t.hashtags.length - 4} more</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => copyToClipboard(`${t.caption}
${t.hashtags.join(" ")}`, t.id)}
                        className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] text-zinc-400 transition-colors">
                        {copiedId === t.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedId === t.id ? "Copied!" : "Copy All"}
                      </button>
                      <button className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] text-zinc-400 transition-colors">
                        <Calendar className="w-3 h-3" /> Schedule
                      </button>
                      <button className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] text-zinc-400 transition-colors">
                        <Share2 className="w-3 h-3" /> Share
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
