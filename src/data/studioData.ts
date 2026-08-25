import {
  BrandKit,
  AfricanMarket,
  KanbanTask,
  AssetItem,
  RevisionEntry,
  ProjectManagerState,
  SocialTemplate,
  GeneratedImage,
  VideoProject,
  VideoClip,
} from "../types";

// ─── African Markets ────────────────────────────────────────────
export const AFRICAN_MARKETS: AfricanMarket[] = [
  { code: "NG", country: "Nigeria", city: "Lagos", flag: "🇳🇬", currency: "NGN", currencySymbol: "₦", dialects: ["pidgin", "yoruba"], culturalMotifs: ["Ankara", "Adire", "Nsibidi"] },
  { code: "KE", country: "Kenya", city: "Nairobi", flag: "🇰🇪", currency: "KES", currencySymbol: "KSh", dialects: ["swahili"], culturalMotifs: ["Kitenge", "Maasai Beadwork"] },
  { code: "ZA", country: "South Africa", city: "Johannesburg", flag: "🇿🇦", currency: "ZAR", currencySymbol: "R", dialects: ["en-US"], culturalMotifs: ["Zulu Beadwork", "San Rock Art"] },
  { code: "SN", country: "Senegal", city: "Dakar", flag: "🇸🇳", currency: "XOF", currencySymbol: "CFA", dialects: ["wolof", "fr-west-africa"], culturalMotifs: ["Wolof Textiles", "Ndege Pattern"] },
  { code: "GH", country: "Ghana", city: "Accra", flag: "🇬🇭", currency: "GHS", currencySymbol: "GH₵", dialects: ["en-US"], culturalMotifs: ["Kente", "Adinkra"] },
  { code: "RW", country: "Rwanda", city: "Kigali", flag: "🇷🇼", currency: "RWF", currencySymbol: "RF", dialects: ["en-US"], culturalMotifs: ["Imigongo", "Basket Weaving"] },
  { code: "EG", country: "Egypt", city: "Cairo", flag: "🇪🇬", currency: "EGP", currencySymbol: "E£", dialects: ["en-US"], culturalMotifs: ["Hieroglyphic", "Pharaonic"] },
];

// ─── Sample Brand Kits ──────────────────────────────────────────
export const SAMPLE_BRAND_KITS: BrandKit[] = [
  {
    id: "bk-1", name: "AfroPulse Tech", description: "Modern tech startup with Afro-futurist branding",
    colors: [
      { name: "Ochre Gold", hex: "#F59E0B", usage: "primary" },
      { name: "Terracotta", hex: "#E11D48", usage: "secondary" },
      { name: "Forest Green", hex: "#059669", usage: "accent" },
      { name: "Midnight Slate", hex: "#090D16", usage: "neutral" },
      { name: "Warm Sand", hex: "#FDE68A", usage: "neutral" },
    ],
    fonts: [{ heading: "Outfit", body: "Inter", fallback: "sans-serif" }],
    logos: [{ name: "Full Logo", format: "svg", variant: "full" }, { name: "Icon Mark", format: "png", variant: "icon" }],
    toneOfVoice: "Bold, innovative, culturally rooted",
    culturalTokens: ["Afrofuturism", "Pan-African", "Digital Heritage"],
    createdAt: Date.now(),
  },
  {
    id: "bk-2", name: "Savanna Luxe", description: "Premium lifestyle brand inspired by African landscapes",
    colors: [
      { name: "Savanna Gold", hex: "#D97706", usage: "primary" },
      { name: "Earth Brown", hex: "#78350F", usage: "secondary" },
      { name: "Acacia Green", hex: "#166534", usage: "accent" },
      { name: "Bone White", hex: "#FEF3C7", usage: "neutral" },
    ],
    fonts: [{ heading: "Cabinet Grotesk", body: "Geist", fallback: "system-ui" }],
    logos: [{ name: "Wordmark", format: "svg", variant: "wordmark" }],
    toneOfVoice: "Refined, warm, nature-inspired",
    culturalTokens: ["Savanna", "Heritage Luxury", "Organic"],
    createdAt: Date.now(),
  },
  {
    id: "bk-3", name: "Naija Bites", description: "Food delivery brand celebrating Nigerian cuisine",
    colors: [
      { name: "Chili Red", hex: "#DC2626", usage: "primary" },
      { name: "Plantain Yellow", hex: "#FBBF24", usage: "secondary" },
      { name: "Okro Green", hex: "#15803D", usage: "accent" },
      { name: "Charcoal", hex: "#18181B", usage: "neutral" },
    ],
    fonts: [{ heading: "Space Grotesk", body: "Plus Jakarta Sans", fallback: "sans-serif" }],
    logos: [{ name: "Full Logo", format: "svg", variant: "full" }, { name: "Monochrome", format: "png", variant: "monochrome" }],
    toneOfVoice: "Playful, appetizing, street-smart",
    culturalTokens: ["Nigerian Street Food", "Pidgin English", "Vibrant"],
    createdAt: Date.now(),
  },
];

// ─── African SVG Patterns ───────────────────────────────────────
export const AFRICAN_PATTERNS = {
  kente: `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><rect width="60" height="60" fill="#F59E0B"/><rect x="0" y="0" width="15" height="15" fill="#E11D48"/><rect x="15" y="15" width="15" height="15" fill="#059669"/><rect x="30" y="0" width="15" height="15" fill="#F59E0B"/><rect x="45" y="15" width="15" height="15" fill="#E11D48"/><rect x="0" y="30" width="15" height="15" fill="#059669"/><rect x="15" y="45" width="15" height="15" fill="#F59E0B"/><rect x="30" y="30" width="15" height="15" fill="#E11D48"/><rect x="45" y="45" width="15" height="15" fill="#059669"/></svg>`,
  ankara: `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><rect width="60" height="60" fill="#78350F"/><circle cx="15" cy="15" r="8" fill="#F59E0B"/><circle cx="45" cy="15" r="8" fill="#E11D48"/><circle cx="15" cy="45" r="8" fill="#059669"/><circle cx="45" cy="45" r="8" fill="#F59E0B"/><circle cx="30" cy="30" r="10" fill="#E11D48"/></svg>`,
  bogolan: `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><rect width="60" height="60" fill="#92400E"/><line x1="0" y1="10" x2="60" y2="10" stroke="#F59E0B" stroke-width="2"/><line x1="0" y1="30" x2="60" y2="30" stroke="#F59E0B" stroke-width="2"/><line x1="0" y1="50" x2="60" y2="50" stroke="#F59E0B" stroke-width="2"/><line x1="10" y1="0" x2="10" y2="60" stroke="#F59E0B" stroke-width="1.5"/><line x1="30" y1="0" x2="30" y2="60" stroke="#F59E0B" stroke-width="1.5"/><line x1="50" y1="0" x2="50" y2="60" stroke="#F59E0B" stroke-width="1.5"/></svg>`,
  adinkra: `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><rect width="60" height="60" fill="#18181B"/><polygon points="30,5 55,30 30,55 5,30" fill="none" stroke="#F59E0B" stroke-width="2"/><circle cx="30" cy="30" r="8" fill="#F59E0B"/><line x1="30" y1="5" x2="30" y2="22" stroke="#E11D48" stroke-width="1.5"/><line x1="30" y1="38" x2="30" y2="55" stroke="#E11D48" stroke-width="1.5"/><line x1="5" y1="30" x2="22" y2="30" stroke="#E11D48" stroke-width="1.5"/><line x1="38" y1="30" x2="55" y2="30" stroke="#E11D48" stroke-width="1.5"/></svg>`,
  zulu: `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><rect width="60" height="60" fill="#1E3A5F"/><circle cx="10" cy="10" r="4" fill="#F59E0B"/><circle cx="30" cy="10" r="4" fill="#E11D48"/><circle cx="50" cy="10" r="4" fill="#F59E0B"/><circle cx="10" cy="30" r="4" fill="#E11D48"/><circle cx="30" cy="30" r="4" fill="#F59E0B"/><circle cx="50" cy="30" r="4" fill="#E11D48"/><circle cx="10" cy="50" r="4" fill="#F59E0B"/><circle cx="30" cy="50" r="4" fill="#E11D48"/><circle cx="50" cy="50" r="4" fill="#F59E0B"/></svg>`,
};

// ─── Dialect Copy Prompts ───────────────────────────────────────
export const DIALECT_PROMPTS: Record<string, string[]> = {
  pidgin: ["Make am sharp pass for Naija audience", "Use street language wey dey touch people heart", "Add some Naija flavor make e pop"],
  swahili: ["Tumia lugha ya Kiswahili yenye nguvu", "Onyesha utamaduni wa Afrika Mashariki", "Fanya iwe nzuri na ya kuvutia"],
  wolof: ["Jëfandikoo ci wóolu Wolof bu baax", "Wone ndajeem ak yépp ci Senegaal", "Def ko bu baax te mu gën a leer"],
  yoruba: ["Lo ede Yoruba ti o dabi oju opolo", "Fi awon ohun ti o ni ibatan si Yoruba silẹ", "Se o dara ati ki o jẹ ki o wo dandan"],
  amharic: ["በአማርኛ ቋንቋ ይጠቀሙ", "የኢትዮጵያ ባህልን ያሳዩ", "ጥሩ እና ለስላሳ ያድርጉት"],
  "fr-west-africa": ["Utilisez le français ouest-africain authentique", "Mettez en valeur la culture ouest-africaine", "Rendez-le attrayant et engageant"],
};

// ─── Platform Hashtags ──────────────────────────────────────────
export const PLATFORM_HASHTAGS: Record<string, string[]> = {
  instagram: ["#AfricanDesign", "#CreativeStudio", "#AfroTech", "#MadeInAfrica", "#DesignInspiration", "#AfricanArt", "#CreativeProcess"],
  tiktok: ["#AfricanCreator", "#DesignTok", "#CreativeContent", "#AfrobeatsVibes", "#AfricanStyle", "#ContentCreator"],
  linkedin: ["#AfricanBusiness", "#CreativeIndustry", "#DesignThinking", "#InnovationAfrica", "#BrandStrategy", "#MarketingAfrica"],
  x: ["#AfricanDesign", "#CreativeAfrica", "#DesignTwitter", "#BrandBuilding", "#AfricanCreatives"],
  facebook: ["#AfricanCommunity", "#CreativeHub", "#DesignAfrica", "#SmallBusinessAfrica", "#CreativeEntrepreneurs"],
};

// ─── Sample Kanban Tasks ────────────────────────────────────────
export const SAMPLE_TASKS: KanbanTask[] = [
  {
    id: "task-1", title: "Lagos Product Launch Banner", description: "Create hero banner for product launch event in Lagos", status: "design", priority: "high", assignee: "Amara O.", tags: ["banner", "product-launch"], attachments: [], localizationChecks: [{ taskId: "task-1", marketCode: "NG", checked: false, notes: "" }], createdAt: Date.now() - 86400000, updatedAt: Date.now() - 3600000,
  },
  {
    id: "task-2", title: "Nairobi Social Campaign", description: "Multi-platform social media campaign for Nairobi office opening", status: "localization-qa", priority: "medium", assignee: "Wanjiku K.", tags: ["social", "campaign"], attachments: [], localizationChecks: [{ taskId: "task-2", marketCode: "KE", checked: true, notes: "Swahili copy approved" }], createdAt: Date.now() - 172800000, updatedAt: Date.now() - 7200000,
  },
  {
    id: "task-3", title: "Jo'burg Brand Refresh", description: "Complete brand kit refresh for Johannesburg operations", status: "client-review", priority: "urgent", assignee: "Thabo M.", tags: ["branding", "refresh"], attachments: [], localizationChecks: [{ taskId: "task-3", marketCode: "ZA", checked: false, notes: "Awaiting client feedback" }], createdAt: Date.now() - 259200000, updatedAt: Date.now() - 14400000,
  },
  {
    id: "task-4", title: "Dakar Eid Collection Posters", description: "Festival posters for Dakar Eid celebration collection", status: "ideation", priority: "low", assignee: "Fatou D.", tags: ["festival", "posters"], attachments: [], localizationChecks: [{ taskId: "task-4", marketCode: "SN", checked: false, notes: "" }], createdAt: Date.now() - 345600000, updatedAt: Date.now() - 28800000,
  },
  {
    id: "task-5", title: "Accra E-commerce Product Cards", description: "Product card designs for Accra online store", status: "published", priority: "medium", assignee: "Kofi A.", tags: ["ecommerce", "product-cards"], attachments: [], localizationChecks: [{ taskId: "task-5", marketCode: "GH", checked: true, notes: "All markets localized" }], createdAt: Date.now() - 432000000, updatedAt: Date.now() - 86400000,
  },
];

// ─── Sample Assets ──────────────────────────────────────────────
export const SAMPLE_ASSETS: AssetItem[] = [
  { id: "asset-1", name: "AfroPulse_Logo_Full.svg", type: "image", size: "24 KB", url: "", uploadedAt: Date.now() - 86400000 },
  { id: "asset-2", name: "Kente_Pattern_Background.png", type: "image", size: "1.2 MB", url: "", uploadedAt: Date.now() - 172800000 },
  { id: "asset-3", name: "Brand_Guidelines_v2.pdf", type: "document", size: "3.4 MB", url: "", uploadedAt: Date.now() - 259200000 },
  { id: "asset-4", name: "Background_Afrobeat.mp3", type: "audio", size: "5.8 MB", url: "", uploadedAt: Date.now() - 345600000 },
  { id: "asset-5", name: "Outfit_Font_Family.zip", type: "font", size: "2.1 MB", url: "", uploadedAt: Date.now() - 432000000 },
];

// ─── Sample Revisions ───────────────────────────────────────────
export const SAMPLE_REVISIONS: RevisionEntry[] = [
  { id: "rev-1", taskId: "task-1", version: 3, changes: "Updated color palette to match new brand guidelines", author: "Amara O.", timestamp: Date.now() - 3600000 },
  { id: "rev-2", taskId: "task-2", version: 2, changes: "Localized hashtags for Kenyan market", author: "Wanjiku K.", timestamp: Date.now() - 7200000 },
  { id: "rev-3", taskId: "task-3", version: 5, changes: "Major redesign based on client feedback", author: "Thabo M.", timestamp: Date.now() - 14400000 },
];

// ─── Sample Social Templates ────────────────────────────────────
export const SAMPLE_SOCIAL_TEMPLATES: SocialTemplate[] = [
  { id: "st-1", platform: "instagram", title: "Lagos Product Launch Story", aspectRatio: "9:16", caption: "Something big is coming to Lagos 🚀 Stay tuned!", hashtags: ["#Lagos", "#ProductLaunch", "#AfroTech"], scheduledDate: null, status: "draft" },
  { id: "st-2", platform: "tiktok", title: "Behind the Scenes - Design Process", aspectRatio: "9:16", caption: "Watch how we create magic ✨ #DesignProcess", hashtags: ["#DesignTok", "#CreativeProcess", "#AfricanCreator"], scheduledDate: null, status: "draft" },
  { id: "st-3", platform: "linkedin", title: "Q4 Growth Report Infographic", aspectRatio: "1:1", caption: "Our Q4 numbers are in! Here's what drove our growth across Africa.", hashtags: ["#AfricanBusiness", "#GrowthReport", "#InnovationAfrica"], scheduledDate: null, status: "draft" },
];

// ─── Sample Video Clips ─────────────────────────────────────────
export const SAMPLE_VIDEO_CLIPS: VideoClip[] = [
  { id: "vc-1", sceneNumber: 1, duration: 3, thumbnail: "", caption: "Opening title sequence", audioTrack: null, transition: "fade" },
  { id: "vc-2", sceneNumber: 2, duration: 5, thumbnail: "", caption: "Product showcase montage", audioTrack: "afrobeat-upbeat", transition: "slide" },
  { id: "vc-3", sceneNumber: 3, duration: 4, thumbnail: "", caption: "Customer testimonials", audioTrack: null, transition: "zoom" },
  { id: "vc-4", sceneNumber: 4, duration: 3, thumbnail: "", caption: "Call to action end screen", audioTrack: null, transition: "fade" },
];

// ─── Default Project Manager State ──────────────────────────────
export const DEFAULT_PROJECT_MANAGER_STATE: ProjectManagerState = {
  tasks: SAMPLE_TASKS,
  assets: SAMPLE_ASSETS,
  revisions: SAMPLE_REVISIONS,
  teamNotes: ["Welcome to the Creative Studio! Start by selecting a workspace above.", "Tip: Use the AI Agent to generate designs from text prompts."],
};
