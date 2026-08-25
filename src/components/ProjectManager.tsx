"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { KanbanTask, KanbanStatus, AssetItem, RevisionEntry, LocalizationChecklist } from "../types";
import { SAMPLE_TASKS, SAMPLE_ASSETS, SAMPLE_REVISIONS, AFRICAN_MARKETS } from "../data/studioData";
import {
  Kanban as KanbanIcon, Folder, FileText, FileImage, Tag, Globe, MapPin, Users, MessageSquare, Bell, Star, Heart, Bookmark, ExternalLink, Copy, Clipboard, RefreshCw, RotateCcw, RotateCw, ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Plus, Minus, Sparkles, Zap, Wand2, Brain, Send, Loader2, AlertCircle, Info, PanelLeft, PanelRight, Menu, Sidebar, Upload, Download, Save, Edit3, Pencil, Ruler, Circle, Triangle, Diamond, Hexagon, Crosshair, Target, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, AlignLeft, AlignCenter, AlignRight, GripVertical, MousePointer2, Shapes, Grid3X3, BarChart3, TrendingUp, Search, Settings, Check, X, Hash, Calendar, Share2, UserPlus, Undo, Redo, Maximize2, Minimize2, MoreHorizontal, MoreVertical, Filter, SlidersHorizontal, Eye, EyeOff, Lock, Trash2, Film, Palette,
} from "lucide-react";

const STATUS_CONFIG: Record<KanbanStatus, { label: string; color: string; icon: string }> = {
  "ideation": { label: "Ideation", color: "blue", icon: "💡" },
  "design": { label: "Design", color: "amber", icon: "🎨" },
  "localization-qa": { label: "Localization QA", color: "purple", icon: "🌍" },
  "client-review": { label: "Client Review", color: "orange", icon: "👁️" },
  "published": { label: "Published", color: "green", icon: "✅" },
};

const PRIORITY_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  urgent: { color: "text-red-400", bg: "bg-red-500/15 border-red-500/30", label: "Urgent" },
  high: { color: "text-orange-400", bg: "bg-orange-500/15 border-orange-500/30", label: "High" },
  medium: { color: "text-amber-400", bg: "bg-amber-500/15 border-amber-500/30", label: "Medium" },
  low: { color: "text-zinc-400", bg: "bg-zinc-700/50 border-zinc-600/30", label: "Low" },
};

export default function ProjectManager() {
  const [activeTab, setActiveTab] = useState<"kanban" | "assets" | "revisions">("kanban");
  const [tasks, setTasks] = useState<KanbanTask[]>(SAMPLE_TASKS);
  const [assets] = useState<AssetItem[]>(SAMPLE_ASSETS);
  const [revisions] = useState<RevisionEntry[]>(SAMPLE_REVISIONS);
  const [teamNotes, setTeamNotes] = useState(["Welcome to the Creative Studio! Start by selecting a workspace above.", "Tip: Use the AI Agent to generate designs from text prompts."]);
  const [newNote, setNewNote] = useState("");
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const moveTask = (taskId: string, direction: "left" | "right") => {
    const statusOrder: KanbanStatus[] = ["ideation", "design", "localization-qa", "client-review", "published"];
    setTasks((prev) => prev.map((t) => {
      if (t.id !== taskId) return t;
      const idx = statusOrder.indexOf(t.status);
      const newIdx = direction === "right" ? Math.min(idx + 1, statusOrder.length - 1) : Math.max(idx - 1, 0);
      return { ...t, status: statusOrder[newIdx], updatedAt: Date.now() };
    }));
  };

  const addNote = () => {
    if (!newNote.trim()) return;
    setTeamNotes((prev) => [...prev, newNote.trim()]);
    setNewNote("");
  };

  const toggleCheck = (taskId: string, marketCode: string) => {
    setTasks((prev) => prev.map((t) => {
      if (t.id !== taskId) return t;
      return {
        ...t,
        localizationChecks: t.localizationChecks.map((c) =>
          c.marketCode === marketCode ? { ...c, checked: !c.checked, notes: !c.checked ? "Checked" : "" } : c
        ),
      };
    }));
  };

  const filteredTasks = searchQuery
    ? tasks.filter((t) => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.tags.some((tg) => tg.toLowerCase().includes(searchQuery.toLowerCase())))
    : tasks;

  const getStatusCount = (status: KanbanStatus) => tasks.filter((t) => t.status === status).length;

  return (
    <div className="flex flex-col h-full bg-[#090D16] text-zinc-100">
      {/* Tab Bar */}
      <div className="flex items-center border-b border-zinc-800/50 bg-zinc-900/60">
        {[
          { key: "kanban" as const, label: "Kanban Board", icon: KanbanIcon },
          { key: "assets" as const, label: "Assets", icon: Folder },
          { key: "revisions" as const, label: "Revisions & Notes", icon: MessageSquare },
        ].map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-medium transition-colors border-b-2 ${activeTab === key ? "border-amber-400 text-amber-400" : "border-transparent text-zinc-500 hover:text-zinc-300"}`}>
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "kanban" && (
          <motion.div key="kanban" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-hidden flex flex-col">
            {/* Search & Stats */}
            <div className="px-4 py-2 border-b border-zinc-800/50 bg-zinc-900/30 flex items-center gap-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search tasks..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500" />
              </div>
              <div className="flex items-center gap-2">
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                  <span key={key} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-zinc-800 text-[10px]">
                    <span>{cfg.icon}</span>
                    <span className="text-zinc-400">{getStatusCount(key as KanbanStatus)}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Kanban Columns */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden p-3">
              <div className="flex gap-3 min-w-max h-full">
                {(Object.entries(STATUS_CONFIG) as [KanbanStatus, typeof STATUS_CONFIG[KanbanStatus]][]).map(([status, cfg]) => {
                  const colTasks = filteredTasks.filter((t) => t.status === status);
                  return (
                    <div key={status} className="w-72 flex-shrink-0 flex flex-col">
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-t-lg bg-${cfg.color}-500/10 border border-${cfg.color}-500/20`}>
                        <span className="text-sm">{cfg.icon}</span>
                        <h3 className="text-xs font-semibold text-zinc-300">{cfg.label}</h3>
                        <span className="ml-auto text-[10px] text-zinc-500 bg-zinc-800 px-1.5 py-0.5 rounded-full">{colTasks.length}</span>
                      </div>
                      <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-zinc-900/30 border-x border-b border-zinc-800/50 rounded-b-lg">
                        {colTasks.map((task) => (
                          <motion.div key={task.id} layout
                            className={`p-3 rounded-lg bg-zinc-900/80 border border-zinc-800/50 hover:border-zinc-700/50 cursor-pointer transition-all ${expandedTask === task.id ? "ring-1 ring-amber-500/30" : ""}`}
                            onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}>
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="text-xs font-medium text-zinc-200 leading-snug">{task.title}</h4>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium border ${PRIORITY_CONFIG[task.priority].bg} ${PRIORITY_CONFIG[task.priority].color}`}>
                                {PRIORITY_CONFIG[task.priority].label}
                              </span>
                            </div>
                            <p className="text-[10px] text-zinc-500 line-clamp-2 mb-2">{task.description}</p>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {task.tags.map((tag, i) => (
                                <span key={i} className="px-1.5 py-0.5 rounded bg-zinc-800 text-[9px] text-zinc-500">#{tag}</span>
                              ))}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-500 to-rose-500 flex items-center justify-center text-[8px] font-bold text-white">
                                  {task.assignee.charAt(0)}
                                </div>
                                <span className="text-[10px] text-zinc-500">{task.assignee}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <button onClick={(e) => { e.stopPropagation(); moveTask(task.id, "left"); }}
                                  className="p-1 rounded hover:bg-zinc-800 text-zinc-600 hover:text-zinc-400 transition-colors"><ArrowLeft className="w-3 h-3" /></button>
                                <button onClick={(e) => { e.stopPropagation(); moveTask(task.id, "right"); }}
                                  className="p-1 rounded hover:bg-zinc-800 text-zinc-600 hover:text-zinc-400 transition-colors"><ArrowRight className="w-3 h-3" /></button>
                              </div>
                            </div>

                            {/* Expanded details */}
                            <AnimatePresence>
                              {expandedTask === task.id && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                                  className="mt-3 pt-3 border-t border-zinc-800/50 space-y-3">
                                  {/* Localization Checklist */}
                                  <div>
                                    <h5 className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                                      <Globe className="w-3 h-3" /> Localization QA
                                    </h5>
                                    <div className="space-y-1">
                                      {task.localizationChecks.map((check) => {
                                        const market = AFRICAN_MARKETS.find((m) => m.code === check.marketCode);
                                        return (
                                          <div key={check.marketCode} className="flex items-center gap-2 px-2 py-1 rounded bg-zinc-800/50">
                                            <button onClick={(e) => { e.stopPropagation(); toggleCheck(task.id, check.marketCode); }}
                                              className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${check.checked ? "bg-emerald-500 border-emerald-500" : "border-zinc-600"}`}>
                                              {check.checked && <Check className="w-2.5 h-2.5 text-white" />}
                                            </button>
                                            <span className="text-[10px] text-zinc-400">{market?.flag} {market?.city}</span>
                                            {check.notes && <span className="text-[9px] text-zinc-600 ml-auto">{check.notes}</span>}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  {/* Activity */}
                                  <div>
                                    <h5 className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                                      <RefreshCw className="w-3 h-3" /> Recent Activity
                                    </h5>
                                    {revisions.filter((r) => r.taskId === task.id).map((rev) => (
                                      <div key={rev.id} className="px-2 py-1 text-[10px] text-zinc-500">
                                        <span className="text-zinc-400">v{rev.version}</span> · {rev.author} · {rev.changes}
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        ))}
                        {colTasks.length === 0 && (
                          <div className="p-4 text-center text-[10px] text-zinc-700">No tasks</div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "assets" && (
          <motion.div key="assets" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-zinc-200">Asset Library ({assets.length})</h3>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 rounded-md text-xs font-medium transition-colors">
                <Upload className="w-3.5 h-3.5" /> Upload
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {assets.map((asset) => (
                <div key={asset.id} className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700/50 transition-colors group">
                  <div className="aspect-square rounded-lg bg-zinc-800/50 flex items-center justify-center mb-2">
                    {asset.type === "image" && <FileImage className="w-8 h-8 text-zinc-600" />}
                    {asset.type === "video" && <Film className="w-8 h-8 text-zinc-600" />}
                    {asset.type === "audio" && <MusicIcon />}
                    {asset.type === "document" && <FileText className="w-8 h-8 text-zinc-600" />}
                    {asset.type === "font" && <TypeIcon />}
                    {asset.type === "brand" && <Palette className="w-8 h-8 text-zinc-600" />}
                  </div>
                  <p className="text-xs text-zinc-300 truncate">{asset.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-[10px] text-zinc-600 uppercase">{asset.type}</span>
                    <span className="text-[10px] text-zinc-600">{asset.size}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] text-zinc-400 transition-colors">
                      <Download className="w-3 h-3" /> Download
                    </button>
                    <button className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 transition-colors"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "revisions" && (
          <motion.div key="revisions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Revisions */}
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
              <h3 className="text-sm font-semibold text-zinc-200 mb-3">Revision History</h3>
              <div className="space-y-2">
                {revisions.map((rev) => {
                  const task = tasks.find((t) => t.id === rev.taskId);
                  return (
                    <div key={rev.id} className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/30 border border-zinc-800/50">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
                        <RotateCcw className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-medium text-zinc-300">{task?.title || "Unknown Task"}</span>
                          <span className="px-1.5 py-0.5 rounded bg-zinc-700 text-[9px] text-zinc-400">v{rev.version}</span>
                        </div>
                        <p className="text-[10px] text-zinc-500">{rev.changes}</p>
                        <p className="text-[9px] text-zinc-600 mt-1">by {rev.author} · {new Date(rev.timestamp).toLocaleDateString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Team Notes */}
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
              <h3 className="text-sm font-semibold text-zinc-200 mb-3">Team Notes</h3>
              <div className="space-y-2 mb-3">
                {teamNotes.map((note, i) => (
                  <div key={i} className="p-3 rounded-lg bg-zinc-800/30 border border-zinc-800/50">
                    <p className="text-xs text-zinc-400">{note}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={newNote} onChange={(e) => setNewNote(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addNote(); }}
                  placeholder="Add a team note..."
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-amber-500" />
                <button onClick={addNote} disabled={!newNote.trim()}
                  className="px-3 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-700 disabled:text-zinc-500 rounded-lg text-xs font-medium transition-colors">
                  Add
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MusicIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600">
      <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
    </svg>
  );
}

function TypeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600">
      <polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" />
    </svg>
  );
}