"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { CanvasElement, LayerItem, AspectRatio } from "../types";
import { AFRICAN_PATTERNS } from "../data/studioData";
import {
  Layers, Type, Move, Eye, EyeOff, Lock, Trash2, Download, ZoomIn, ZoomOut, Palette, Scissors, Crop, Bold, Italic, AlignLeft, AlignCenter, AlignRight, ChevronDown, Plus, Minus, GripVertical, Maximize2, Minimize2, Check, X, RotateCcw, RotateCw, MousePointer2, Shapes, Square, Circle, Triangle, Diamond, Hexagon, Crosshair, Target, Frame, Compass,
} from "lucide-react";

const ASPECT_RATIOS: Record<AspectRatio, { w: number; h: number; label: string }> = {
  "1:1": { w: 500, h: 500, label: "Square" },
  "9:16": { w: 338, h: 600, label: "Story" },
  "16:9": { w: 600, h: 338, label: "Landscape" },
  "4:5": { w: 400, h: 500, label: "Portrait" },
  "3:2": { w: 600, h: 400, label: "Photo" },
};

export default function CanvasStudio() {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [showLayers, setShowLayers] = useState(true);
  const [showProps, setShowProps] = useState(true);
  const [dragging, setDragging] = useState<string | null>(null);
  const dragStart = useRef({ x: 0, y: 0, elX: 0, elY: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const ar = ASPECT_RATIOS[aspectRatio];

  const addElement = useCallback((type: CanvasElement["type"], content?: string, fill?: string) => {
    const id = `el-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newEl: CanvasElement = {
      id, type, x: ar.w / 2 - 50, y: ar.h / 2 - 25, width: type === "text" ? 200 : 100, height: type === "text" ? 40 : 100, rotation: 0, opacity: 1, locked: false, visible: true,
      content: content || (type === "text" ? "Double-click to edit" : ""),
      fill: fill || "#F59E0B", stroke: "#090D16", strokeWidth: 0, fontSize: 16, fontFamily: "Inter", fontWeight: 400, textAlign: "center",
    };
    if (type === "pattern") {
      const patternKeys = Object.keys(AFRICAN_PATTERNS) as Array<keyof typeof AFRICAN_PATTERNS>;
      const randomPattern = patternKeys[Math.floor(Math.random() * patternKeys.length)];
      newEl.patternType = randomPattern;
      newEl.width = 120;
      newEl.height = 120;
      newEl.fill = undefined;
    }
    if (type === "shape") {
      newEl.strokeWidth = 2;
    }
    setElements((prev) => [...prev, newEl]);
    setSelectedId(id);
  }, [ar]);

  const updateElement = useCallback((id: string, updates: Partial<CanvasElement>) => {
    setElements((prev) => prev.map((el) => el.id === id ? { ...el, ...updates } : el));
  }, []);

  const deleteElement = useCallback((id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  const handleMouseDown = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const el = elements.find((el) => el.id === id);
    if (!el || el.locked) return;
    setSelectedId(id);
    setDragging(id);
    dragStart.current = { x: e.clientX, y: e.clientY, elX: el.x, elY: el.y };
  }, [elements]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    const dx = (e.clientX - dragStart.current.x) / zoom;
    const dy = (e.clientY - dragStart.current.y) / zoom;
    updateElement(dragging, { x: dragStart.current.elX + dx, y: dragStart.current.elY + dy });
  }, [dragging, zoom, updateElement]);

  const handleMouseUp = useCallback(() => setDragging(null), []);

  const selectedEl = elements.find((el) => el.id === selectedId);

  const layers: LayerItem[] = elements.map((el) => ({
    id: el.id, name: el.type === "text" ? (el.content?.slice(0, 15) || "Text") : `${el.type}`, type: el.type, visible: el.visible, locked: el.locked, opacity: el.opacity,
  }));

  const exportCanvas = () => {
    const data = JSON.stringify({ elements, aspectRatio, zoom }, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "canvas-design.json"; a.click();
    URL.revokeObjectURL(url);
  };

  const shapes = ["square", "circle", "triangle", "diamond", "hexagon"];
  const shapePaths: Record<string, string> = {
    square: "M10 10 L90 10 L90 90 L10 90 Z",
    circle: "M50 10 A40 40 0 1 1 50 90 A40 40 0 1 1 50 10",
    triangle: "M50 10 L90 90 L10 90 Z",
    diamond: "M50 5 L95 50 L50 95 L5 50 Z",
    hexagon: "M75 15 L90 40 L90 70 L75 95 L25 95 L10 70 L10 40 Z",
  };

  return (
    <div className="flex flex-col lg:flex-row h-full bg-[#090D16] text-zinc-100">
      {/* Left Toolbar */}
      <motion.div initial={{ x: -60 }} animate={{ x: 0 }} className="flex lg:flex-col gap-1 p-2 bg-zinc-900/80 border-r border-zinc-800/50 min-w-[56px] lg:min-w-[64px] overflow-x-auto lg:overflow-y-auto">
        {[
          { icon: MousePointer2, label: "Select", action: () => {} },
          { icon: Type, label: "Text", action: () => addElement("text") },
          { icon: Shapes, label: "Shapes", action: () => addElement("shape", "", "#F59E0B") },
          { icon: Palette, label: "Pattern", action: () => addElement("pattern") },
          { icon: Compass, label: "Crop", action: () => {} },
          { icon: Scissors, label: "Cut", action: () => {} },
        ].map(({ icon: Icon, label, action }) => (
          <button key={label} onClick={action} title={label}
            className="p-2 rounded-lg hover:bg-zinc-800 transition-colors group relative flex-shrink-0">
            <Icon className="w-5 h-5 text-zinc-400 group-hover:text-amber-400 transition-colors" />
            <span className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-zinc-800 text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50">{label}</span>
          </button>
        ))}
        <div className="lg:hidden h-px bg-zinc-800 my-1" />
        {shapes.map((shape) => (
          <button key={shape} onClick={() => addElement("shape", "", "#E11D48")} title={`${shape} shape`}
            className="p-2 rounded-lg hover:bg-zinc-800 transition-colors flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-5 h-5">
              <path d={shapePaths[shape]} fill="#E11D48" />
            </svg>
          </button>
        ))}
      </motion.div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/60 border-b border-zinc-800/50">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-zinc-200">Canvas Studio</h2>
            <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
              className="bg-zinc-800 border border-zinc-700 rounded-md px-2 py-1 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-amber-500">
              {Object.entries(ASPECT_RATIOS).map(([k, v]) => (
                <option key={k} value={k}>{v.label} ({k})</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setZoom((z) => Math.max(0.25, z - 0.1))} className="p-1.5 rounded hover:bg-zinc-800"><Minus className="w-4 h-4 text-zinc-400" /></button>
            <span className="text-xs text-zinc-500 w-12 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom((z) => Math.min(3, z + 0.1))} className="p-1.5 rounded hover:bg-zinc-800"><Plus className="w-4 h-4 text-zinc-400" /></button>
            <div className="w-px h-4 bg-zinc-700 mx-1" />
            <button onClick={() => { setPanX(0); setPanY(0); }} className="p-1.5 rounded hover:bg-zinc-800" title="Reset view"><RotateCcw className="w-4 h-4 text-zinc-400" /></button>
            <button onClick={exportCanvas} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 rounded-md text-xs font-medium transition-colors">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </div>
        </div>

        {/* Canvas */}
        <div ref={canvasRef} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}
          className="flex-1 overflow-auto bg-[#0a0f1a] relative" style={{ backgroundImage: "radial-gradient(circle, #1a1f2e 1px, transparent 1px)", backgroundSize: "20px 20px" }}>
          <motion.div className="absolute flex items-center justify-center"
            style={{ transform: `translate(${panX}px, ${panY}px)` }}>
            <motion.div
              className="relative shadow-2xl shadow-black/50"
              style={{ width: ar.w * zoom, height: ar.h * zoom, backgroundColor: "#ffffff" }}
              animate={{ scale: zoom }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Grid overlay */}
              <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.05 }}>
                <div className="w-full h-full" style={{ backgroundImage: "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
              </div>

              {/* Elements */}
              {elements.map((el) => (
                <motion.div key={el.id}
                  className={`absolute cursor-move select-none ${selectedId === el.id ? "ring-2 ring-amber-400 ring-offset-1 ring-offset-white" : ""}`}
                  style={{ left: el.x * zoom, top: el.y * zoom, width: el.width * zoom, height: el.height * zoom, opacity: el.opacity, transform: `rotate(${el.rotation}deg)`, zIndex: selectedId === el.id ? 10 : 1 }}
                  onMouseDown={(e) => handleMouseDown(e, el.id)}
                  whileHover={{ scale: 1.01 }}
                  layoutId={el.id}>
                  {el.type === "text" && (
                    <div className="w-full h-full flex items-center justify-center" style={{ fontSize: el.fontSize! * zoom * 0.5, fontFamily: el.fontFamily, fontWeight: el.fontWeight, textAlign: el.textAlign as any, color: el.fill }}>
                      {el.content}
                    </div>
                  )}
                  {el.type === "shape" && (
                    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ fill: el.fill, stroke: el.stroke, strokeWidth: el.strokeWidth }}>
                      <rect x="0" y="0" width="100" height="100" rx="4" />
                    </svg>
                  )}
                  {el.type === "pattern" && el.patternType && (
                    <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: AFRICAN_PATTERNS[el.patternType] }} />
                  )}
                  {/* Selection handles */}
                  {selectedId === el.id && !el.locked && (
                    <>
                      <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-amber-400 rounded-full" />
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full" />
                      <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-amber-400 rounded-full" />
                      <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full" />
                    </>
                  )}
                </motion.div>
              ))}

              {/* Empty state */}
              {elements.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400">
                  <Frame className="w-12 h-12 mb-3 opacity-30" />
                  <p className="text-sm font-medium">Click tools on the left to add elements</p>
                  <p className="text-xs mt-1 opacity-60">Drag to move · Click to select · Double-click text to edit</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex lg:flex-col border-l border-zinc-800/50 bg-zinc-900/80">
        {/* Layers */}
        <motion.div initial={{ width: showLayers ? 200 : 40 }} animate={{ width: showLayers ? 200 : 40 }}
          className="border-r border-zinc-800/50 flex flex-col" style={{ minWidth: showLayers ? 200 : 40 }}>
          <button onClick={() => setShowLayers(!showLayers)} className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200 border-b border-zinc-800/50">
            <Layers className="w-4 h-4" />
            {showLayers && <span>Layers</span>}
          </button>
          <AnimatePresence>
            {showLayers && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto p-2 space-y-1">
                {layers.length === 0 && <p className="text-xs text-zinc-600 px-2 py-4 text-center">No layers yet</p>}
                {[...layers].reverse().map((layer) => (
                  <div key={layer.id} onClick={() => setSelectedId(layer.id)}
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs cursor-pointer transition-colors ${selectedId === layer.id ? "bg-amber-500/15 text-amber-300" : "hover:bg-zinc-800 text-zinc-400"}`}>
                    <GripVertical className="w-3 h-3 opacity-40 flex-shrink-0" />
                    <span className="truncate flex-1">{layer.name}</span>
                    <button onClick={(e) => { e.stopPropagation(); updateElement(layer.id, { visible: !layer.visible }); }} className="p-0.5 hover:text-zinc-200">
                      {layer.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); updateElement(layer.id, { locked: !layer.locked }); }} className="p-0.5 hover:text-zinc-200">
                      {layer.locked ? <Lock className="w-3 h-3" /> : <div className="w-3 h-3" />}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); deleteElement(layer.id); }} className="p-0.5 hover:text-red-400">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Properties */}
        <motion.div initial={{ width: showProps ? 220 : 40 }} animate={{ width: showProps ? 220 : 40 }}
          className="flex flex-col" style={{ minWidth: showProps ? 220 : 40 }}>
          <button onClick={() => setShowProps(!showProps)} className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-400 hover:text-zinc-200 border-b border-zinc-800/50">
            <SettingsIcon />
            {showProps && <span>Properties</span>}
          </button>
          <AnimatePresence>
            {showProps && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 overflow-y-auto p-3 space-y-4">
                {!selectedEl ? (
                  <p className="text-xs text-zinc-600 text-center py-8">Select an element to edit properties</p>
                ) : (
                  <>
                    {/* Position & Size */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Position</label>
                      <div className="grid grid-cols-2 gap-2">
                        <div><label className="text-[10px] text-zinc-600">X</label><input type="number" value={Math.round(selectedEl.x)} onChange={(e) => updateElement(selectedEl.id, { x: Number(e.target.value) })} className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-amber-500" /></div>
                        <div><label className="text-[10px] text-zinc-600">Y</label><input type="number" value={Math.round(selectedEl.y)} onChange={(e) => updateElement(selectedEl.id, { y: Number(e.target.value) })} className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-amber-500" /></div>
                        <div><label className="text-[10px] text-zinc-600">W</label><input type="number" value={Math.round(selectedEl.width)} onChange={(e) => updateElement(selectedEl.id, { width: Number(e.target.value) })} className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-amber-500" /></div>
                        <div><label className="text-[10px] text-zinc-600">H</label><input type="number" value={Math.round(selectedEl.height)} onChange={(e) => updateElement(selectedEl.id, { height: Number(e.target.value) })} className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-amber-500" /></div>
                      </div>
                    </div>

                    {/* Rotation & Opacity */}
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Transform</label>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-zinc-600 w-12">Rotation</span>
                          <input type="range" min={0} max={360} value={selectedEl.rotation} onChange={(e) => updateElement(selectedEl.id, { rotation: Number(e.target.value) })} className="flex-1 accent-amber-500" />
                          <span className="text-[10px] text-zinc-400 w-8 text-right">{selectedEl.rotation}°</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-zinc-600 w-12">Opacity</span>
                          <input type="range" min={0} max={1} step={0.05} value={selectedEl.opacity} onChange={(e) => updateElement(selectedEl.id, { opacity: Number(e.target.value) })} className="flex-1 accent-amber-500" />
                          <span className="text-[10px] text-zinc-400 w-8 text-right">{Math.round(selectedEl.opacity * 100)}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Color */}
                    {(selectedEl.type === "text" || selectedEl.type === "shape") && (
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Color</label>
                        <div className="flex flex-wrap gap-1.5">
                          {["#F59E0B", "#E11D48", "#059669", "#090D16", "#FEF3C7", "#DC2626", "#166534", "#7C3AED", "#2563EB", "#FFFFFF"].map((c) => (
                            <button key={c} onClick={() => updateElement(selectedEl.id, { fill: c })}
                              className={`w-6 h-6 rounded-md border-2 transition-transform hover:scale-110 ${selectedEl.fill === c ? "border-amber-400 scale-110" : "border-zinc-700"}`}
                              style={{ backgroundColor: c }} title={c} />
                          ))}
                          <input type="color" value={selectedEl.fill || "#F59E0B"} onChange={(e) => updateElement(selectedEl.id, { fill: e.target.value })} className="w-6 h-6 rounded cursor-pointer border-0" />
                        </div>
                      </div>
                    )}

                    {/* Text props */}
                    {selectedEl.type === "text" && (
                      <>
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Content</label>
                          <textarea value={selectedEl.content || ""} onChange={(e) => updateElement(selectedEl.id, { content: e.target.value })} rows={2}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-2 py-1.5 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-amber-500 resize-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Typography</label>
                          <div className="grid grid-cols-2 gap-2">
                            <div><label className="text-[10px] text-zinc-600">Size</label><input type="number" value={selectedEl.fontSize} onChange={(e) => updateElement(selectedEl.id, { fontSize: Number(e.target.value) })} className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-amber-500" /></div>
                            <div><label className="text-[10px] text-zinc-600">Weight</label><input type="number" value={selectedEl.fontWeight} onChange={(e) => updateElement(selectedEl.id, { fontWeight: Number(e.target.value) })} className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-amber-500" /></div>
                          </div>
                          <div className="flex gap-1">
                            {[{ icon: AlignLeft, val: "left" as const }, { icon: AlignCenter, val: "center" as const }, { icon: AlignRight, val: "right" as const }].map(({ icon: Icon, val }) => (
                              <button key={val} onClick={() => updateElement(selectedEl.id, { textAlign: val })}
                                className={`p-1.5 rounded ${selectedEl.textAlign === val ? "bg-amber-500/20 text-amber-400" : "bg-zinc-800 text-zinc-500 hover:text-zinc-300"}`}>
                                <Icon className="w-3.5 h-3.5" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </>
                    )}

                    {/* Delete */}
                    <button onClick={() => deleteElement(selectedEl.id)}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-md text-xs font-medium transition-colors">
                      <Trash2 className="w-3.5 h-3.5" /> Delete Element
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

function SettingsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}