"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GeneratedImage, ImageEditState, VideoClip, VideoAspect } from "../types";
import { AFRICAN_PATTERNS, SAMPLE_VIDEO_CLIPS } from "../data/studioData";
import {
  Image as ImageIcon, Film, Play, Pause, SkipForward, SkipBack, Mic, Volume2, Clock, RotateCcw, RotateCw, Plus, Trash2, Check, Copy, Download, Upload, SlidersHorizontal, Sparkles, Wand2, Zap, ChevronDown, Maximize2, Minimize2, Sun, Moon, Droplets, Flame, Mountain, Leaf,
} from "lucide-react";

const IMAGE_FILTERS = [
  { key: "brightness", label: "Brightness", icon: Sun, min: -100, max: 100, default: 0 },
  { key: "contrast", label: "Contrast", icon: Moon, min: -100, max: 100, default: 0 },
  { key: "saturation", label: "Saturation", icon: Droplets, min: -100, max: 100, default: 0 },
  { key: "blur", label: "Blur", icon: Mountain, min: 0, max: 20, default: 0 },
  { key: "warmGlow", label: "Warm Glow", icon: Flame, min: 0, max: 100, default: 0 },
];

const VIDEO_ASPECTS: { key: VideoAspect; label: string; ratio: string }[] = [
  { key: "9:16", label: "Story", ratio: "9:16" },
  { key: "16:9", label: "Landscape", ratio: "16:9" },
  { key: "1:1", label: "Square", ratio: "1:1" },
  { key: "4:5", label: "Portrait", ratio: "4:5" },
];

export default function MediaAndVideoStudio() {
  const [activeTab, setActiveTab] = useState<"image" | "video">("image");
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [imagePrompt, setImagePrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filters, setFilters] = useState<ImageEditState>({
    prompt: "", brightness: 0, contrast: 0, saturation: 0, blur: 0, warmGlow: 0, overlayPattern: null, cropX: 0, cropY: 0, cropW: 1, cropH: 1,
  });
  const [videoClips, setVideoClips] = useState<VideoClip[]>(SAMPLE_VIDEO_CLIPS);
  const [videoAspect, setVideoAspect] = useState<VideoAspect>("16:9");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [voiceoverStyle, setVoiceoverStyle] = useState<string | null>(null);
  const [bgMusic, setBgMusic] = useState<string | null>(null);

  const generateImage = async () => {
    if (!imagePrompt.trim()) return;
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 1500));
    const colors = ["#F59E0B", "#E11D48", "#059669", "#7C3AED", "#2563EB"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const img: GeneratedImage = {
      id: `img-${Date.now()}`, prompt: imagePrompt, url: "", filters: { ...filters }, createdAt: Date.now(),
    };
    setGeneratedImages((prev) => [...prev, img]);
    setSelectedImage(img.id);
    setFilters({ ...filters, prompt: "" });
    setImagePrompt("");
    setIsGenerating(false);
  };

  const updateFilter = (key: string, value: number | string | null) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const totalDuration = videoClips.reduce((sum, c) => sum + c.duration, 0);

  const addScene = () => {
    const newClip: VideoClip = {
      id: `vc-${Date.now()}`, sceneNumber: videoClips.length + 1, duration: 3, thumbnail: "", caption: "New scene", audioTrack: null, transition: "fade",
    };
    setVideoClips((prev) => [...prev, newClip]);
  };

  const removeScene = (id: string) => {
    setVideoClips((prev) => prev.filter((c) => c.id !== id).map((c, i) => ({ ...c, sceneNumber: i + 1 })));
  };

  const aspectRatioClass: Record<VideoAspect, string> = {
    "9:16": "aspect-[9/16]",
    "16:9": "aspect-[16/9]",
    "1:1": "aspect-square",
    "4:5": "aspect-[4/5]",
  };

  return (
    <div className="flex flex-col h-full bg-[#090D16] text-zinc-100">
      {/* Tab Bar */}
      <div className="flex items-center border-b border-zinc-800/50 bg-zinc-900/60">
        {[
          { key: "image" as const, label: "Image Studio", icon: ImageIcon },
          { key: "video" as const, label: "Video Studio", icon: Film },
        ].map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-medium transition-colors border-b-2 ${activeTab === key ? "border-amber-400 text-amber-400" : "border-transparent text-zinc-500 hover:text-zinc-300"}`}>
            <Icon className="w-4 h-4" />{label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "image" && (
          <motion.div key="image" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Prompt Input */}
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Generate Image</h4>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </div>
              <textarea value={imagePrompt} onChange={(e) => setImagePrompt(e.target.value)} rows={2}
                placeholder="Describe the image you want to create..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none" />
              <div className="flex items-center gap-2">
                <select value={filters.overlayPattern || ""} onChange={(e) => updateFilter("overlayPattern", e.target.value || null)}
                  className="bg-zinc-800 border border-zinc-700 rounded-md px-2 py-1 text-[10px] text-zinc-400 focus:outline-none">
                  <option value="">No Pattern</option>
                  <option value="kente">Kente</option>
                  <option value="ankara">Ankara</option>
                  <option value="bogolan">Bogolan</option>
                  <option value="adinkra">Adinkra</option>
                  <option value="zulu">Zulu Beadwork</option>
                </select>
                <button onClick={generateImage} disabled={!imagePrompt.trim() || isGenerating}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-700 disabled:text-zinc-500 rounded-md text-xs font-medium transition-colors">
                  {isGenerating ? <span className="animate-spin">⏳</span> : <Wand2 className="w-3.5 h-3.5" />}
                  {isGenerating ? "Generating..." : "Generate"}
                </button>
              </div>
            </div>

            {/* Filters Panel */}
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
              <div className="flex items-center gap-2 mb-3">
                <SlidersHorizontal className="w-4 h-4 text-zinc-500" />
                <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Adjustments</h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {IMAGE_FILTERS.map(({ key, label, icon: Icon, min, max, default: def }) => (
                  <div key={key} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5"><Icon className="w-3 h-3 text-zinc-500" /><span className="text-[10px] text-zinc-400">{label}</span></div>
                      <span className="text-[9px] text-zinc-600 font-mono">{filters[key as keyof ImageEditState]}</span>
                    </div>
                    <input type="range" min={min} max={max} value={(filters[key as keyof ImageEditState] as number) ?? def}
                      onChange={(e) => updateFilter(key, Number(e.target.value))}
                      className="w-full accent-amber-500 h-1" />
                  </div>
                ))}
              </div>
            </div>

            {/* Generated Images Grid */}
            <div>
              <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-3">Generated Images ({generatedImages.length})</h4>
              {generatedImages.length === 0 && (
                <div className="p-8 rounded-xl bg-zinc-900/30 border border-zinc-800/30 text-center">
                  <ImageIcon className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                  <p className="text-xs text-zinc-600">No images generated yet.</p>
                </div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {generatedImages.map((img) => (
                  <motion.div key={img.id} layout
                    className={`relative group rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${selectedImage === img.id ? "border-amber-400 shadow-lg shadow-amber-500/20" : "border-zinc-800 hover:border-zinc-700"}`}
                    onClick={() => setSelectedImage(img.id)}>
                    {/* Placeholder with gradient based on prompt */}
                    <div className="aspect-square bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-800 flex items-center justify-center">
                      <div className="text-center">
                        <ImageIcon className="w-8 h-8 text-zinc-700 mx-auto mb-1" />
                        <p className="text-[9px] text-zinc-600 line-clamp-2 px-2">{img.prompt}</p>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button onClick={(e) => { e.stopPropagation(); /* download */ }} className="p-2 rounded-full bg-zinc-700 hover:bg-zinc-600 transition-colors"><Download className="w-3.5 h-3.5" /></button>
                      <button onClick={(e) => { e.stopPropagation(); /* copy */ }} className="p-2 rounded-full bg-zinc-700 hover:bg-zinc-600 transition-colors"><Copy className="w-3.5 h-3.5" /></button>
                      <button onClick={(e) => { e.stopPropagation(); setGeneratedImages((prev) => prev.filter((i) => i.id !== img.id)); }} className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/40 transition-colors"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                    </div>
                    {selectedImage === img.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "video" && (
          <motion.div key="video" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Preview Area */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className={`relative ${aspectRatioClass[videoAspect]} max-h-[400px] mx-auto bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800`}>
                  {videoClips[currentScene] ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
                      <div className="text-6xl mb-4 opacity-30">🎬</div>
                      <p className="text-sm font-medium text-zinc-300">Scene {videoClips[currentScene].sceneNumber}: {videoClips[currentScene].caption}</p>
                      <p className="text-xs text-zinc-500 mt-1">{videoClips[currentScene].duration}s · {videoClips[currentScene].transition}</p>
                      {videoClips[currentScene].audioTrack && (
                        <div className="flex items-center gap-1 mt-2 px-2 py-1 rounded bg-zinc-800/50">
                          <Mic className="w-3 h-3 text-amber-500" />
                          <span className="text-[10px] text-zinc-400">{videoClips[currentScene].audioTrack}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-zinc-600">
                      <Film className="w-12 h-12 opacity-30" />
                    </div>
                  )}
                  {/* Playback controls overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setCurrentScene(Math.max(0, currentScene - 1))} className="p-1.5 rounded hover:bg-white/10"><SkipBack className="w-4 h-4 text-white" /></button>
                      <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 rounded-full bg-amber-500 hover:bg-amber-400 transition-colors">
                        {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white" />}
                      </button>
                      <button onClick={() => setCurrentScene(Math.min(videoClips.length - 1, currentScene + 1))} className="p-1.5 rounded hover:bg-white/10"><SkipForward className="w-4 h-4 text-white" /></button>
                      <div className="flex-1 h-1 bg-zinc-700 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${((currentScene + 1) / Math.max(videoClips.length, 1)) * 100}%` }} />
                      </div>
                      <span className="text-[10px] text-zinc-400 font-mono">{totalDuration}s</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Controls */}
              <div className="lg:w-72 space-y-3">
                {/* Aspect Ratio */}
                <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                  <h5 className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Aspect Ratio</h5>
                  <div className="grid grid-cols-4 gap-1">
                    {VIDEO_ASPECTS.map(({ key, label }) => (
                      <button key={key} onClick={() => setVideoAspect(key)}
                        className={`px-2 py-1.5 rounded text-[10px] font-medium transition-colors ${videoAspect === key ? "bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30" : "bg-zinc-800 text-zinc-500 hover:text-zinc-300"}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Voiceover */}
                <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                  <h5 className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Voiceover Style</h5>
                  <select value={voiceoverStyle || ""} onChange={(e) => setVoiceoverStyle(e.target.value || null)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-300 focus:outline-none">
                    <option value="">None</option>
                    <option value="narrator">Professional Narrator</option>
                    <option value="energetic">Energetic Host</option>
                    <option value="calm">Calm Storyteller</option>
                    <option value="pidgin">Nigerian Pidgin</option>
                    <option value="swahili">Swahili Narration</option>
                  </select>
                </div>

                {/* Background Music */}
                <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
                  <h5 className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Background Music</h5>
                  <select value={bgMusic || ""} onChange={(e) => setBgMusic(e.target.value || null)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-300 focus:outline-none">
                    <option value="">None</option>
                    <option value="afrobeat-upbeat">Afrobeat Upbeat</option>
                    <option value="amapiano-chill">Amapiano Chill</option>
                    <option value="traditional-drums">Traditional Drums</option>
                    <option value="lofi-african">Lo-Fi African</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">Timeline Sequencer ({videoClips.length} scenes)</h4>
                <button onClick={addScene} className="flex items-center gap-1 px-2 py-1 rounded bg-amber-600 hover:bg-amber-500 text-[10px] font-medium transition-colors">
                  <Plus className="w-3 h-3" /> Add Scene
                </button>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {videoClips.map((clip, idx) => (
                  <motion.div key={clip.id} layout
                    className={`flex-shrink-0 w-36 p-2.5 rounded-lg border-2 cursor-pointer transition-all ${currentScene === idx ? "border-amber-400 bg-amber-500/10" : "border-zinc-800 bg-zinc-800/50 hover:border-zinc-700"}`}
                    onClick={() => setCurrentScene(idx)}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-zinc-500">SCENE {clip.sceneNumber}</span>
                      <button onClick={(e) => { e.stopPropagation(); removeScene(clip.id); }} className="p-0.5 text-zinc-600 hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                    </div>
                    <div className="h-16 rounded bg-zinc-700/50 mb-1.5 flex items-center justify-center">
                      <span className="text-2xl opacity-30">🎞️</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 truncate">{clip.caption}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[9px] text-zinc-600 font-mono">{clip.duration}s</span>
                      <span className="text-[9px] text-zinc-600 capitalize">{clip.transition}</span>
                    </div>
                  </motion.div>
                ))}
                <button onClick={addScene} className="flex-shrink-0 w-12 h-24 rounded-lg border-2 border-dashed border-zinc-800 hover:border-zinc-700 flex items-center justify-center text-zinc-600 hover:text-zinc-400 transition-colors">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}