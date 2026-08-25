"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CanvasStudio from "./components/CanvasStudio";
import AiDesignAgent from "./components/AiDesignAgent";
import BrandAndSocialStudio from "./components/BrandAndSocialStudio";
import MediaAndVideoStudio from "./components/MediaAndVideoStudio";
import ProjectManager from "./components/ProjectManager";
import { AFRICAN_MARKETS } from "./data/studioData";
import type { AfricanMarket, ToastNotification } from "./types";
import {
  Layers, Sparkles, Palette, Film, Kanban as KanbanIcon, Globe, MapPin, ChevronDown, Download, Bell, Settings, Menu, X, Search, Zap, ArrowRight, Check, Copy,
} from "lucide-react";

const WORKSPACES = [
  { key: "canvas", label: "Canvas Studio", icon: Layers, shortcut: "1" },
  { key: "ai", label: "AI Design Agent", icon: Sparkles, shortcut: "2" },
  { key: "brand", label: "Brand & Social", icon: Palette, shortcut: "3" },
  { key: "media", label: "Media & Video", icon: Film, shortcut: "4" },
  { key: "projects", label: "Projects", icon: KanbanIcon, shortcut: "5" },
];

export default function App() {
  const [activeWorkspace, setActiveWorkspace] = useState("canvas");
  const [selectedMarket, setSelectedMarket] = useState<AfricanMarket>(AFRICAN_MARKETS[0]);
  const [showMarketPicker, setShowMarketPicker] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Persist workspace preference
  useEffect(() => {
    const saved = localStorage.getItem("creative-studio-workspace");
    if (saved && WORKSPACES.find((w) => w.key === saved)) {
      setActiveWorkspace(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("creative-studio-workspace", activeWorkspace);
  }, [activeWorkspace]);

  const addToast = (message: string, type: ToastNotification["type"] = "success") => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  };

  const handleExport = () => {
    addToast("Project exported successfully!", "success");
  };

  const renderWorkspace = () => {
    switch (activeWorkspace) {
      case "canvas": return <CanvasStudio />;
      case "ai": return <AiDesignAgent />;
      case "brand": return <BrandAndSocialStudio />;
      case "media": return <MediaAndVideoStudio />;
      case "projects": return <ProjectManager />;
      default: return <CanvasStudio />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#090D16] text-zinc-100 overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between px-3 py-2 bg-zinc-900/80 border-b border-zinc-800/50 backdrop-blur-sm z-50">
        {/* Left: Logo + Workspace Tabs */}
        <div className="flex items-center gap-3">
          {/* Mobile menu toggle */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-1.5 rounded-lg hover:bg-zinc-800 transition-colors">
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2 mr-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight hidden sm:block">
              <span className="text-amber-400">Creative</span>
              <span className="text-zinc-300">Studio</span>
            </span>
          </div>

          {/* Desktop Workspace Tabs */}
          <nav className="hidden lg:flex items-center gap-0.5 bg-zinc-800/50 rounded-xl p-0.5">
            {WORKSPACES.map(({ key, label, icon: Icon, shortcut }) => (
              <button key={key} onClick={() => setActiveWorkspace(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeWorkspace === key ? "bg-amber-500/20 text-amber-400 shadow-sm" : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700/50"}`}>
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">{label}</span>
                <span className="hidden xl:inline text-[9px] opacity-40 ml-1">{shortcut}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Center: Market Selector */}
        <div className="relative">
          <button onClick={() => setShowMarketPicker(!showMarketPicker)}
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/60 hover:bg-zinc-800 rounded-lg text-xs transition-colors border border-zinc-700/50">
            <Globe className="w-3.5 h-3.5 text-amber-500" />
            <span>{selectedMarket.flag}</span>
            <span className="hidden sm:inline text-zinc-300">{selectedMarket.city}</span>
            <ChevronDown className="w-3 h-3 text-zinc-500" />
          </button>
          <AnimatePresence>
            {showMarketPicker && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="absolute left-0 top-full mt-1 w-56 bg-zinc-800 border border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="p-2 border-b border-zinc-700/50">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                    <input placeholder="Search markets..." className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500" />
                  </div>
                </div>
                {AFRICAN_MARKETS.map((market) => (
                  <button key={market.code} onClick={() => { setSelectedMarket(market); setShowMarketPicker(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs hover:bg-zinc-700/50 transition-colors ${selectedMarket.code === market.code ? "bg-amber-500/10 text-amber-400" : "text-zinc-300"}`}>
                    <span className="text-base">{market.flag}</span>
                    <div className="flex-1 text-left">
                      <p className="font-medium">{market.city}</p>
                      <p className="text-[10px] opacity-60">{market.country} · {market.currencySymbol}</p>
                    </div>
                    {selectedMarket.code === market.code && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          <button onClick={() => addToast("Notifications cleared", "info")}
            className="relative p-2 rounded-lg hover:bg-zinc-800 transition-colors">
            <Bell className="w-4 h-4 text-zinc-400" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
          </button>
          <button onClick={() => addToast("Settings opened", "info")}
            className="hidden sm:flex p-2 rounded-lg hover:bg-zinc-800 transition-colors">
            <Settings className="w-4 h-4 text-zinc-400" />
          </button>
          <button onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 rounded-lg text-xs font-medium transition-colors shadow-lg shadow-amber-500/20">
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </header>

      {/* Mobile Workspace Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-40 w-64 bg-zinc-900 border-r border-zinc-800 p-4 lg:hidden">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-bold"><span className="text-amber-400">Creative</span><span className="text-zinc-300">Studio</span></span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 rounded-lg hover:bg-zinc-800"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-1">
              {WORKSPACES.map(({ key, label, icon: Icon }) => (
                <button key={key} onClick={() => { setActiveWorkspace(key); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeWorkspace === key ? "bg-amber-500/20 text-amber-400" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"}`}>
                  <Icon className="w-4 h-4" />{label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breadcrumb / Status Bar */}
      <div className="flex items-center justify-between px-4 py-1 bg-zinc-900/40 border-b border-zinc-800/30 text-[10px] text-zinc-600">
        <div className="flex items-center gap-2">
          <span className="text-zinc-500">Workspace:</span>
          <span className="text-zinc-400 font-medium">{WORKSPACES.find((w) => w.key === activeWorkspace)?.label}</span>
          <span className="text-zinc-700">·</span>
          <span className="text-zinc-500">Market:</span>
          <span className="text-zinc-400">{selectedMarket.flag} {selectedMarket.city}, {selectedMarket.country}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> System Ready</span>
          <span>v1.0.0</span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div key={activeWorkspace} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute inset-0">
            {renderWorkspace()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div key={toast.id} initial={{ opacity: 0, x: 40, scale: 0.95 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 40, scale: 0.95 }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-medium backdrop-blur-sm border ${toast.type === "success" ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300" : toast.type === "error" ? "bg-red-500/15 border-red-500/30 text-red-300" : "bg-zinc-800/90 border-zinc-700 text-zinc-300"}`}>
              {toast.type === "success" && <Check className="w-3.5 h-3.5" />}
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
