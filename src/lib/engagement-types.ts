// Types for Full Organic Engagement System

export interface EngagementBundle {
  id: string;
  name: string;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'facebook';
  provider_id: string | null;
  description: string | null;
  icon: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  items?: BundleItem[];
}

export interface BundleItem {
  id: string;
  bundle_id: string;
  service_id: string | null;
  engagement_type: EngagementType;
  ratio_percent: number;
  is_base: boolean;
  default_drip_qty_per_run: number;
  default_drip_interval: number;
  default_drip_interval_unit: 'minutes' | 'hours';
  sort_order: number;
  created_at: string;
  service?: {
    id: string;
    name: string;
    price: number;
    min_quantity: number;
    max_quantity: number;
  };
}

export type EngagementType = 'views' | 'likes' | 'comments' | 'saves' | 'shares' | 'followers' | 'subscribers' | 'watch_hours' | 'retweets' | 'reposts';

export type SpeedPreset = 'fast' | 'natural' | 'safe';

export interface EngagementOrder {
  id: string;
  order_number: number;
  user_id: string;
  bundle_id: string | null;
  link: string;
  base_quantity: number;
  total_price: number;
  is_organic_mode: boolean;
  variance_percent: number;
  peak_hours_enabled: boolean;
  status: 'pending' | 'processing' | 'completed' | 'partial' | 'failed';
  error_message: string | null;
  created_at: string;
  updated_at: string;
  bundle?: EngagementBundle;
  items?: EngagementOrderItem[];
}

export interface EngagementOrderItem {
  id: string;
  engagement_order_id: string;
  engagement_type: EngagementType;
  service_id: string | null;
  quantity: number;
  price: number;
  drip_qty_per_run: number | null;
  drip_interval: number | null;
  drip_interval_unit: string;
  speed_preset: SpeedPreset;
  is_enabled: boolean;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  provider_order_id: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
  runs?: OrganicRun[];
  service?: {
    id: string;
    name: string;
    price: number;
    min_quantity: number;
  };
}

export interface OrganicRun {
  id: string;
  order_id?: string;
  engagement_order_item_id?: string;
  run_number: number;
  scheduled_at: string;
  quantity_to_send: number;
  base_quantity: number;
  variance_applied: number;
  peak_multiplier: number;
  status: 'pending' | 'started' | 'completed' | 'failed';
  provider_order_id: string | null;
  provider_response: Record<string, unknown> | null;
  error_message: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface EngagementConfig {
  type: EngagementType;
  enabled: boolean;
  quantity: number;
  price: number;
  serviceId: string | null;
  minQuantity?: number;        // Actual service minimum from provider
  // Per-type organic settings (optional - defaults will be used if not set)
  timeLimitHours: number;      // 0 = Auto, >0 = specific hours (actual value for backend)
  timeLimitCustomMode?: boolean; // UI-only: true when "Custom" button is selected
  variancePercent: number;     // 10-50, default 25
  peakHoursEnabled: boolean;   // default true
}

// Default organic settings for each type
export const DEFAULT_ORGANIC_SETTINGS = {
  timeLimitHours: 0,        // Auto mode
  variancePercent: 25,      // 25% variance
  peakHoursEnabled: false,  // Peak hours OFF by default
};

// Platform icons and colors - Vibrant gradients
export const PLATFORM_CONFIG = {
  instagram: { icon: 'Instagram', color: 'from-pink-500 via-purple-500 to-orange-400', label: 'Instagram', bgColor: 'bg-gradient-to-br from-pink-500/20 to-purple-500/20', borderColor: 'border-pink-500/40' },
  tiktok: { icon: 'Music', color: 'from-cyan-400 via-teal-500 to-pink-500', label: 'TikTok', bgColor: 'bg-gradient-to-br from-cyan-500/20 to-pink-500/20', borderColor: 'border-cyan-500/40' },
  youtube: { icon: 'Youtube', color: 'from-red-500 to-red-600', label: 'YouTube', bgColor: 'bg-gradient-to-br from-red-500/20 to-red-600/20', borderColor: 'border-red-500/40' },
  twitter: { icon: 'Twitter', color: 'from-sky-400 to-blue-500', label: 'Twitter/X', bgColor: 'bg-gradient-to-br from-sky-500/20 to-blue-500/20', borderColor: 'border-sky-500/40' },
  facebook: { icon: 'Facebook', color: 'from-blue-500 to-indigo-600', label: 'Facebook', bgColor: 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20', borderColor: 'border-blue-500/40' },
} as const;

// Engagement type icons and colors - Vibrant unique colors for each type
export const ENGAGEMENT_CONFIG = {
  views: { icon: 'Eye', color: 'text-cyan-400', bgColor: 'bg-cyan-500/20', borderColor: 'border-cyan-500/40', label: 'Views', emoji: '👁️' },
  likes: { icon: 'Heart', color: 'text-rose-400', bgColor: 'bg-rose-500/20', borderColor: 'border-rose-500/40', label: 'Likes', emoji: '❤️' },
  comments: { icon: 'MessageCircle', color: 'text-emerald-400', bgColor: 'bg-emerald-500/20', borderColor: 'border-emerald-500/40', label: 'Comments', emoji: '💬' },
  saves: { icon: 'Bookmark', color: 'text-amber-400', bgColor: 'bg-amber-500/20', borderColor: 'border-amber-500/40', label: 'Saves', emoji: '📥' },
  shares: { icon: 'Share2', color: 'text-violet-400', bgColor: 'bg-violet-500/20', borderColor: 'border-violet-500/40', label: 'Shares', emoji: '🔄' },
  followers: { icon: 'UserPlus', color: 'text-indigo-400', bgColor: 'bg-indigo-500/20', borderColor: 'border-indigo-500/40', label: 'Followers', emoji: '👥' },
  subscribers: { icon: 'Bell', color: 'text-red-400', bgColor: 'bg-red-500/20', borderColor: 'border-red-500/40', label: 'Subscribers', emoji: '🔔' },
  watch_hours: { icon: 'Clock', color: 'text-orange-400', bgColor: 'bg-orange-500/20', borderColor: 'border-orange-500/40', label: 'Watch Hours', emoji: '⏱️' },
  retweets: { icon: 'Repeat', color: 'text-teal-400', bgColor: 'bg-teal-500/20', borderColor: 'border-teal-500/40', label: 'Retweets', emoji: '🔁' },
  reposts: { icon: 'RefreshCw', color: 'text-pink-400', bgColor: 'bg-pink-500/20', borderColor: 'border-pink-500/40', label: 'Reposts', emoji: '🔄' },
} as const;

// Default engagement ratios (percentage of base views)
export const DEFAULT_RATIOS: Record<EngagementType, number> = {
  views: 100,
  likes: 3.1,
  comments: 0.2,
  saves: 1.1,
  shares: 1.3,
  followers: 2,
  subscribers: 3,
  watch_hours: 5,
  retweets: 4,
  reposts: 0.8,
};

// Platform-specific engagement types
export const PLATFORM_ENGAGEMENT_TYPES: Record<string, EngagementType[]> = {
  instagram: ['views', 'likes', 'comments', 'saves', 'shares', 'reposts', 'followers'],
  tiktok: ['views', 'likes', 'comments', 'saves', 'shares', 'followers'],
  youtube: ['views', 'likes', 'comments', 'subscribers', 'watch_hours'],
  twitter: ['views', 'likes', 'comments', 'retweets', 'followers'],
  facebook: ['views', 'likes', 'comments', 'shares', 'followers'],
};

// Speed presets (kept for legacy compatibility)
export const SPEED_PRESETS: Record<SpeedPreset, { interval: number; unit: 'minutes' | 'hours'; label: string }> = {
  fast: { interval: 15, unit: 'minutes', label: 'Fast' },
  natural: { interval: 30, unit: 'minutes', label: 'Natural' },
  safe: { interval: 60, unit: 'minutes', label: 'Safe' },
};
