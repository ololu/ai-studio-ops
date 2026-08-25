import { LucideIcon } from "lucide-react";

// ─── Canvas Types ───────────────────────────────────────────────
export interface CanvasElement {
  id: string;
  type: "text" | "shape" | "image" | "pattern" | "icon";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  locked: boolean;
  visible: boolean;
  content?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  textAlign?: "left" | "center" | "right";
  patternType?: "kente" | "ankara" | "bogolan" | "adinkra" | "zulu";
  imageUrl?: string;
}

export interface LayerItem {
  id: string;
  name: string;
  type: CanvasElement["type"];
  visible: boolean;
  locked: boolean;
  opacity: number;
}

export type AspectRatio = "1:1" | "9:16" | "16:9" | "4:5" | "3:2";

export interface CanvasState {
  elements: CanvasElement[];
  selectedId: string | null;
  aspectRatio: AspectRatio;
  zoom: number;
  panX: number;
  panY: number;
}

// ─── AI Agent Types ─────────────────────────────────────────────
export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  suggestions?: string[];
}

export type AIDialect =
  | "en-US"
  | "pidgin"
  | "swahili"
  | "wolof"
  | "yoruba"
  | "amharic"
  | "fr-west-africa";

export interface AIContext {
  dialect: AIDialect;
  brandKitId: string | null;
  canvasState: CanvasState | null;
}

// ─── Brand Kit Types ────────────────────────────────────────────
export interface ColorSwatch {
  name: string;
  hex: string;
  usage: "primary" | "secondary" | "accent" | "neutral";
}

export interface FontPairing {
  heading: string;
  body: string;
  fallback: string;
}

export interface LogoVariation {
  name: string;
  format: "svg" | "png" | "webp";
  variant: "full" | "icon" | "wordmark" | "monochrome";
  url?: string;
}

export interface BrandKit {
  id: string;
  name: string;
  description: string;
  colors: ColorSwatch[];
  fonts: FontPairing[];
  logos: LogoVariation[];
  toneOfVoice: string;
  culturalTokens: string[];
  createdAt: number;
}

// ─── Social Media Types ─────────────────────────────────────────
export type Platform = "instagram" | "tiktok" | "linkedin" | "x" | "facebook";

export interface SocialTemplate {
  id: string;
  platform: Platform;
  title: string;
  aspectRatio: AspectRatio;
  caption: string;
  hashtags: string[];
  scheduledDate: string | null;
  status: "draft" | "scheduled" | "published";
  designUrl?: string;
}

// ─── Image Studio Types ─────────────────────────────────────────
export interface ImageEditState {
  prompt: string;
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  warmGlow: number;
  overlayPattern: string | null;
  cropX: number;
  cropY: number;
  cropW: number;
  cropH: number;
}

export interface GeneratedImage {
  id: string;
  prompt: string;
  url: string;
  filters: Partial<ImageEditState>;
  createdAt: number;
}

// ─── Video Studio Types ─────────────────────────────────────────
export type VideoAspect = "9:16" | "16:9" | "1:1" | "4:5";

export interface VideoClip {
  id: string;
  sceneNumber: number;
  duration: number;
  thumbnail: string;
  caption: string;
  audioTrack: string | null;
  transition: "none" | "fade" | "slide" | "zoom";
}

export interface VideoProject {
  id: string;
  title: string;
  clips: VideoClip[];
  aspectRatio: VideoAspect;
  totalDuration: number;
  voiceoverStyle: string | null;
  backgroundMusic: string | null;
}

// ─── Localization Types ─────────────────────────────────────────
export interface AfricanMarket {
  code: string;
  country: string;
  city: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  dialects: AIDialect[];
  culturalMotifs: string[];
}

export interface LocalizationChecklist {
  taskId: string;
  marketCode: string;
  checked: boolean;
  notes: string;
}

// ─── Project Manager Types ──────────────────────────────────────
export type KanbanStatus =
  | "ideation"
  | "design"
  | "localization-qa"
  | "client-review"
  | "published";

export interface KanbanTask {
  id: string;
  title: string;
  description: string;
  status: KanbanStatus;
  priority: "low" | "medium" | "high" | "urgent";
  assignee: string;
  tags: string[];
  attachments: string[];
  localizationChecks: LocalizationChecklist[];
  createdAt: number;
  updatedAt: number;
}

export interface AssetItem {
  id: string;
  name: string;
  type: "image" | "video" | "audio" | "document" | "font" | "brand";
  size: string;
  url: string;
  uploadedAt: number;
}

export interface RevisionEntry {
  id: string;
  taskId: string;
  version: number;
  changes: string;
  author: string;
  timestamp: number;
}

export interface ProjectManagerState {
  tasks: KanbanTask[];
  assets: AssetItem[];
  revisions: RevisionEntry[];
  teamNotes: string[];
}

// ─── Shared Types ───────────────────────────────────────────────
export interface ToastNotification {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
}

export interface AppState {
  activeWorkspace: string;
  activeProject: string;
  currentMarket: AfricanMarket;
  brandKits: BrandKit[];
  socialTemplates: SocialTemplate[];
  generatedImages: GeneratedImage[];
  videoProjects: VideoProject[];
  projectManager: ProjectManagerState;
  toasts: ToastNotification[];
}
