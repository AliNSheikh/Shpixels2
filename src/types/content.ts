export interface SEOData {
  pageTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
  favicon?: string;
  googleSiteVerification?: string;
  googleAnalyticsId?: string;
  sitemapEnabled?: boolean;
}

export interface BrandingData {
  logoText: string;
  logoSubtext: string;
  logoImage?: string;
  favicon?: string;
  accentColor: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  order: number;
  visible: boolean;
}

export interface HeroData {
  title: string;
  subtitle: string;
  badgeText: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  featuredVideoId: string;
  bgImageUrl: string;
  marqueeItems: string[];
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  suffix?: string;
}

export interface AboutData {
  badge: string;
  heading: string;
  highlightText: string;
  bioParagraphs: string[];
  profileImage: string;
  stats: StatItem[];
  skills: string[];
  tools: string[];
  experienceYears: number;
}

export interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  icon: string;
  features: string[];
}

export interface ProjectVideo {
  id: string;
  title: string;
  youtubeUrl: string;
  videoId: string;
  caption?: string;
  platform?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  category: string;
  client: string;
  year: string;
  coverImage: string;
  videos: ProjectVideo[];
  gallery: string[];
  externalLinks: { label: string; url: string }[];
  featured: boolean;
  published: boolean;
  order: number;
}

export interface YouTubeVideoItem {
  id: string;
  title: string;
  youtubeUrl: string;
  videoId: string;
  thumbnail: string;
  description: string;
  category: string;
  featured: boolean;
  order: number;
  visible: boolean;
  caption?: string;
  client?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  category: string;
  caption?: string;
  client?: string;
  order?: number;
}

export interface WorkflowStep {
  number: string;
  title: string;
  description: string;
  icon?: string;
}

export interface ClientLogo {
  id: string;
  name: string;
  logoUrl?: string;
  logo?: string;
  websiteUrl?: string;
  website?: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  nameAr?: string;
  color?: string;
  icon?: string;
  coverImage?: string;
  description?: string;
  descriptionAr?: string;
}

export interface CategoryDetail {
  coverImage?: string;
  description?: string;
  descriptionAr?: string;
  nameAr?: string;
  color?: string;
}

export interface AdminAuthData {
  passwordHash: string;
  salt: string;
  updatedAt: string;
}

export interface SupabaseConfigData {
  url?: string;
  anonKey?: string;
  autoSync?: boolean;
}

export interface SectionHeaderInfo {
  badge?: string;
  title?: string;
  description?: string;
}

export interface ContactData {
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  linkedin: string;
  behance: string;
  ctaHeading: string;
  ctaSubtitle: string;
  responseTimeNote: string;
}

export interface FooterData {
  copyrightText: string;
  quote: string;
  disclaimer: string;
}

export interface PublicationRecord {
  id: string;
  publishedAt: string;
  version: number;
  publishedBy?: string;
  note?: string;
}

export interface PublicationInfo {
  publishedAt: string;
  version: number;
  publishedBy?: string;
}

export interface GlobalContent {
  seo: SEOData;
  branding: BrandingData;
  navigation: NavigationItem[];
  hero: HeroData;
  about: AboutData;
  services: ServiceItem[];
  projects: ProjectItem[];
  featuredVideos: YouTubeVideoItem[];
  gallery: GalleryItem[];
  workflow: WorkflowStep[];
  contact: ContactData;
  footer: FooterData;
  categories?: string[];
  categoryDetails?: Record<string, CategoryDetail>;
  adminAuth?: AdminAuthData;
  supabaseConfig?: SupabaseConfigData;
  clientLogos?: ClientLogo[];
  sectionHeaders?: Record<string, SectionHeaderInfo>;
  lastPublished?: string;
  publicationInfo?: PublicationInfo;
  publicationHistory?: PublicationRecord[];
}
