import { GlobalContent } from '../types/content';

export const initialContent: GlobalContent = {
  seo: {
    pageTitle: "SHPIXELS | Sharif Abs - Cinematographer & Creative Filmmaker",
    metaDescription: "SHPIXELS - Professional videography, commercial brand ads, weddings, creative productions, and cinematic storytelling by Sharif Abs.",
    ogTitle: "SHPIXELS - Visual Storytelling Through Cinematic Motion",
    ogDescription: "Crafting impactful cinematic filmmaking, commercial advertising, and visual stories by Sharif Abs.",
    ogImage: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80",
    canonicalUrl: "https://shpixels.vercel.app/",
    favicon: "/assets/shpixels-icon.svg",
    googleSiteVerification: "",
    googleAnalyticsId: "",
    sitemapEnabled: true
  },
  branding: {
    logoText: "SHPIXELS",
    logoSubtext: "SHARIF ABS • CINEMATOGRAPHY",
    logoImage: "/assets/shpixels-logo.svg",
    favicon: "/assets/shpixels-icon.svg",
    accentColor: "#2563eb"
  },
  navigation: [
    { id: "nav-1", label: "Home", href: "#hero", order: 1, visible: true },
    { id: "nav-2", label: "Showreel", href: "#showreel", order: 2, visible: true },
    { id: "nav-3", label: "Work", href: "#portfolio", order: 3, visible: true },
    { id: "nav-4", label: "About", href: "#about", order: 4, visible: true },
    { id: "nav-5", label: "Services", href: "#services", order: 5, visible: true },
    { id: "nav-6", label: "Process", href: "#process", order: 6, visible: true },
    { id: "nav-7", label: "Gallery", href: "#gallery", order: 7, visible: true },
    { id: "nav-8", label: "Contact", href: "#contact", order: 8, visible: true }
  ],
  hero: {
    title: "VISUAL STORYTELLING THROUGH CINEMATIC MOTION",
    subtitle: "Sharif Abs crafting high-impact commercial ads, emotionally resonant wedding films, luxury visuals, and cutting-edge cinematography.",
    badgeText: "SHARIF ABS • CINEMATOGRAPHER & DIRECTOR",
    primaryCtaText: "Explore Portfolio",
    primaryCtaLink: "#portfolio",
    secondaryCtaText: "Watch 2026 Showreel",
    secondaryCtaLink: "#showreel",
    featuredVideoId: "ScMzIvxBSi4", // Replaced/configurable cinematic showreel
    bgImageUrl: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1920&q=85",
    marqueeItems: [
      "COMMERCIAL & BRAND ADS",
      "AI & MOTION GRAPHICS",
      "WEDDINGS & EVENTS",
      "MEDICAL & HEALTHCARE",
      "SPORT & GYM VISUALS",
      "AERIAL & 4K DRONE",
      "MUSIC VIDEOS",
      "CINEMATIC COLOR GRADING",
      "DAVINCI RESOLVE COLORIST",
      "VISUAL EFFECTS & STORYTELLING"
    ]
  },
  about: {
    badge: "THE CINEMATOGRAPHER BEHIND THE LENS",
    heading: "Crafting visual stories that linger in the memory.",
    highlightText: "Sharif Abs — Filmmaker & Visual Storyteller",
    bioParagraphs: [
      "With passion and precision behind the camera, I specialize in transforming concepts into compelling cinematic narratives. As the creative force behind SHPIXELS, my work bridges raw human emotion and sharp commercial visual excellence.",
      "At SHPIXELS, every frame is engineered with intention. Whether directing a high-energy brand advertisement, capturing intimate wedding vows, detailing architectural landmarks, or producing sleek commercial visuals, my philosophy remains constant: authentic emotion elevated by uncompromising cinematic craftsmanship.",
      "Equipped with modern cinema cameras (RED & Sony Cinema Line), certified aerial drone systems, and an advanced DaVinci Resolve color grading suite, I deliver end-to-end visual solutions tailored for modern digital screens and international broadcasts."
    ],
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    stats: [
      { id: "stat-1", value: "7+", label: "Years Experience" },
      { id: "stat-2", value: "120+", label: "Completed Projects" },
      { id: "stat-3", value: "12+", label: "Creative Categories" },
      { id: "stat-4", value: "100%", label: "Client Satisfaction" }
    ],
    skills: [
      "Cinematic Directing & Filming",
      "DaVinci Resolve Color Grading",
      "AI Visual Generation & Synthesis",
      "Advanced Motion Typography",
      "Sound Design & Audio Mastering",
      "Licensed Aerial Drone Operations",
      "Commercial Script & Storyboarding",
      "Lighting & Mood Architecture"
    ],
    tools: [
      "Sony Cinema Line (FX6/FX3)",
      "DJI Mavic 3 Pro Cine",
      "DaVinci Resolve Studio",
      "Adobe After Effects",
      "Midjourney & Runway Gen-3",
      "Aputure & Nanlite Lighting"
    ],
    experienceYears: 7
  },
  services: [
    {
      id: "srv-1",
      title: "Commercial & Brand Ads",
      subtitle: "High-conversion cinematic campaigns",
      description: "From concept script to final color master. We create punchy, broadcast-standard commercials and digital reels that elevate brand prestige and drive engagement.",
      category: "Commercial",
      icon: "Film",
      features: [
        "Creative direction & concept development",
        "Full 4K/6K cinema camera setup",
        "Product macro & studio lighting",
        "Multi-aspect deliverables (16:9, 9:16, 1:1)"
      ]
    },
    {
      id: "srv-2",
      title: "AI & Motion Graphics",
      subtitle: "Boundary-pushing visual synthesis",
      description: "Combining conventional filmmaking with state-of-the-art generative AI and kinetic motion graphics to produce impossible camera moves and stylized visual metaphors.",
      category: "AI & Motion",
      icon: "Cpu",
      features: [
        "AI-assisted frame synthesis & transitions",
        "Kinetic 3D typography & title design",
        "CGI and VFX integration",
        "Sci-fi & stylized concept treatments"
      ]
    },
    {
      id: "srv-3",
      title: "Weddings & Luxury Events",
      subtitle: "Emotional storytelling & memory preservation",
      description: "Discreet, documentary-style cinematography paired with heartfelt storytelling. We capture genuine tears, laughter, and high-energy celebrations in timeless cinematic quality.",
      category: "Weddings",
      icon: "Heart",
      features: [
        "Multi-camera continuous coverage",
        "Same-day teaser trailers for social media",
        "High-fidelity wireless audio capture",
        "Comprehensive documentary cut + highlights"
      ]
    },
    {
      id: "srv-4",
      title: "Medical & Healthcare",
      subtitle: "Precision, ethics & patient empathy",
      description: "Specialized videography for healthcare institutions, surgeons, dental clinics, and wellness brands. Clean, professional lighting, compliant sterile filming, and articulate explanations.",
      category: "Medical",
      icon: "Activity",
      features: [
        "Clinical procedure & surgical recording",
        "Patient testimonial case studies",
        "Educational medical explainer films",
        "Sterile environment certified handling"
      ]
    },
    {
      id: "srv-5",
      title: "Sport, Fitness & Gym",
      subtitle: "Adrenaline, motion & dynamic rhythm",
      description: "High frame-rate slow motion, explosive camera movements, and rhythm-synced sound design engineered to spotlight athletic dedication, athlete profiles, and gym launches.",
      category: "Sport",
      icon: "Zap",
      features: [
        "120fps/240fps high-speed capture",
        "Gimbal-stabilized tracking shots",
        "Heavy beat-synced sound design",
        "Gym & fitness apparel brand reels"
      ]
    },
    {
      id: "srv-6",
      title: "Aerial & Drone Videography",
      subtitle: "Expansive perspective from above",
      description: "Licensed drone flights capturing dramatic sweeping vistas, architectural real estate, outdoor events, and high-speed car chases with buttery smooth stabilization.",
      category: "Aerial",
      icon: "Compass",
      features: [
        "Apple ProRes 4K aerial recording",
        "Precise orbital & tracking maneuvers",
        "Sunset & blue-hour twilight flights",
        "Fully insured & compliant operations"
      ]
    }
  ],
  projects: [
    {
      id: "proj-001",
      title: "VORTEX: High-Performance Athletic Reel",
      description: "A fast-paced commercial campaign capturing high-intensity crossfit training, explosive muscle motion, and low-light neon lighting aesthetics.",
      category: "Sport & Gym",
      client: "Vortex Athletics",
      year: "2026",
      coverImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80",
      videos: [
        {
          id: "vid-001",
          title: "VORTEX Main Commercial (4K)",
          youtubeUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
          videoId: "ScMzIvxBSi4",
          caption: "Directed & Color Graded by Mo Abdallah"
        }
      ],
      gallery: [
        "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80"
      ],
      externalLinks: [
        { label: "Client Website", url: "https://example.com/vortex" }
      ],
      featured: true,
      published: true,
      order: 1
    },
    {
      id: "proj-002",
      title: "SYNTHESIS: AI Motion Experience",
      description: "An experimental visual showcase merging live-action camera tracking with neural generative motion graphics, exploring digital transhumanism.",
      category: "AI & Motion Graphics",
      client: "SHPIXELS Labs",
      year: "2026",
      coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80",
      videos: [
        {
          id: "vid-002",
          title: "SYNTHESIS - AI Concept Film",
          youtubeUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
          videoId: "ysz5S6PUM-U",
          caption: "Midjourney + Runway Gen-3 + After Effects Composition"
        }
      ],
      gallery: [
        "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80"
      ],
      externalLinks: [],
      featured: true,
      published: true,
      order: 2
    },
    {
      id: "proj-003",
      title: "ETERNAL HORIZON: Tuscan Wedding Film",
      description: "An emotional destination wedding film filmed across sun-drenched vineyards in Italy, focusing on natural light, poetic timing, and heartfelt vows.",
      category: "Weddings & Events",
      client: "Elena & Marcus",
      year: "2025",
      coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80",
      videos: [
        {
          id: "vid-003",
          title: "Elena & Marcus Wedding Highlights",
          youtubeUrl: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
          videoId: "jNQXAC9IVRw",
          caption: "Sony FX6 + G-Master Lenses + 32-bit Float Audio"
        }
      ],
      gallery: [
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80"
      ],
      externalLinks: [],
      featured: true,
      published: true,
      order: 3
    },
    {
      id: "proj-004",
      title: "LUMINA: Dental Aesthetics Masterclass",
      description: "Clean, clinical documentary highlighting state-of-the-art porcelain veneer procedures, 3D facial scanning, and patient smile transformations.",
      category: "Medical & Healthcare",
      client: "Lumina Dental Studio",
      year: "2025",
      coverImage: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1000&q=80",
      videos: [
        {
          id: "vid-004",
          title: "Lumina Dental Clinic Brand Story",
          youtubeUrl: "https://www.youtube.com/watch?v=L_LUpnjgPso",
          videoId: "L_LUpnjgPso",
          caption: "Sterile Cinema Rig + Ring Light Macro"
        }
      ],
      gallery: [
        "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80"
      ],
      externalLinks: [],
      featured: false,
      published: true,
      order: 4
    },
    {
      id: "proj-005",
      title: "AURORA: Nocturnal Drone Symphony",
      description: "An aerial exploration of modern metropolitan architecture, bridge illumination, and harbor reflections filmed at 4K during blue hour and midnight.",
      category: "Aerial & Drone",
      client: "Skyline Visuals",
      year: "2025",
      coverImage: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1000&q=80",
      videos: [
        {
          id: "vid-005",
          title: "Metropolitan Blue Hour Drone Reel",
          youtubeUrl: "https://www.youtube.com/watch?v=aqz-KE-bpKQ",
          videoId: "aqz-KE-bpKQ",
          caption: "DJI Mavic 3 Cine D-LogM"
        }
      ],
      gallery: [],
      externalLinks: [],
      featured: true,
      published: true,
      order: 5
    },
    {
      id: "proj-006",
      title: "ECHOES: Indie Artist Music Video",
      description: "A mood-driven visual piece filmed in atmospheric mist and vintage retro neon streets with analog film grain and anamorphic lens flares.",
      category: "Music Videos",
      client: "Solace Records",
      year: "2025",
      coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80",
      videos: [
        {
          id: "vid-006",
          title: "Echoes Official Music Video",
          youtubeUrl: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
          videoId: "kJQP7kiw5Fk",
          caption: "Anamorphic 2.39:1 Cinema Ratio"
        }
      ],
      gallery: [],
      externalLinks: [],
      featured: false,
      published: true,
      order: 6
    }
  ],
  featuredVideos: [
    {
      id: "fvid-1",
      title: "SHPIXELS Official 2026 Cinematography Showreel",
      youtubeUrl: "https://www.youtube.com/watch?v=ScMzIvxBSi4",
      videoId: "ScMzIvxBSi4",
      thumbnail: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80",
      description: "A curated 2-minute visual journey showcasing commercial advertisements, dramatic drone perspectives, medical precision, and cinematic narratives.",
      category: "Showreel",
      featured: true,
      order: 1,
      visible: true,
      caption: "Resolution: 4K UHD • Color: DaVinci Resolve Wide Gamut • Audio: Spatial Stereo",
      client: "SHPIXELS Studio"
    },
    {
      id: "fvid-2",
      title: "Commercial Direction Highlights",
      youtubeUrl: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
      videoId: "ysz5S6PUM-U",
      thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80",
      description: "Selected brand films crafted for international retail, luxury products, and lifestyle clients.",
      category: "Commercial",
      featured: true,
      order: 2,
      visible: true,
      caption: "Sony Cinema Line FX3/FX6",
      client: "Various Clients"
    }
  ],
  gallery: [
    {
      id: "gal-1",
      title: "Cinema Rig on Set",
      image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?auto=format&fit=crop&w=800&q=80",
      category: "Behind the Scenes",
      caption: "Matte box & wireless follow focus setup during night shoot."
    },
    {
      id: "gal-2",
      title: "Golden Hour Aerial Flight",
      image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80",
      category: "Drone",
      caption: "Mavic 3 Cine tracking sunset over coastal terrain."
    },
    {
      id: "gal-3",
      title: "Color Grading Suite",
      image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
      category: "Post-Production",
      caption: "DaVinci Resolve Mini Panel calibration session."
    },
    {
      id: "gal-4",
      title: "Commercial Set Lighting",
      image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80",
      category: "Commercial",
      caption: "Diffusion frames and rim light sculpting product silhouettes."
    },
    {
      id: "gal-5",
      title: "Wedding Vow Moment",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      category: "Weddings",
      caption: "Candid emotional framing during vow exchange."
    },
    {
      id: "gal-6",
      title: "Athletic Sprint Tracking",
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
      category: "Sport",
      caption: "High-speed gimbal pursuit along track lane."
    }
  ],
  workflow: [
    {
      number: "01",
      title: "Concept & Narrative Blueprint",
      description: "We dissect your core message, identify audience emotional triggers, sketch storyboards, and formulate visual treatments and shot lists."
    },
    {
      number: "02",
      title: "Cinematic Production & Filming",
      description: "On-location or in-studio execution with dedicated cinema lighting, multi-cam capture, certified aerial drones, and crystal-clear 32-bit float audio."
    },
    {
      number: "03",
      title: "AI Synthesis & Motion Graphics",
      description: "For select projects, we weave kinetic typography, impossible camera transitions, and neural visual elements seamlessly into the edit."
    },
    {
      number: "04",
      title: "Color Grading & Master Delivery",
      description: "Final polish in DaVinci Resolve with customized LUTs, balanced skin tones, dynamic sound mix, and tailored multi-platform export packages."
    }
  ],
  contact: {
    email: "contact@shpixels.com",
    phone: "+971 50 123 4567",
    whatsapp: "https://wa.me/971501234567",
    location: "Sharif Abs Studio • Available Globally for Remote & On-Location Projects",
    instagram: "https://instagram.com/shpixels",
    youtube: "https://youtube.com/@shpixels",
    tiktok: "https://tiktok.com/@shpixels",
    linkedin: "https://linkedin.com/in/sharif-abs",
    behance: "https://behance.net/shpixels",
    ctaHeading: "LET'S CREATE SOMETHING UNFORGETTABLE",
    ctaSubtitle: "Have a commercial campaign, wedding, film production, or creative concept? Share your vision and let's craft cinematic impact together.",
    responseTimeNote: "Typically responds within 24 hours on business days."
  },
  footer: {
    copyrightText: "© 2026 SHPIXELS. All rights reserved. Directed by Sharif Abs.",
    quote: "Every frame carries purpose. Every story deserves cinematic depth.",
    disclaimer: "SHPIXELS — Professional videographer portfolio & creative production studio by Sharif Abs."
  },
  categories: [
    "Commercial & Brand Ads",
    "Sport & Gym",
    "Weddings & Events",
    "AI & Motion Graphics",
    "Medical & Healthcare",
    "Aerial & Drone"
  ],
  categoryDetails: {
    "Commercial & Brand Ads": {
      coverImage: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=85",
      description: "High-impact commercial storytelling, automotive visual hooks, and broadcast advertising campaigns.",
      descriptionAr: "إعلانات تجارية سينمائية عالية التأثير للعلامات التجارية.",
      nameAr: "إعلانات تجارية",
      color: "#2563eb"
    },
    "Sport & Gym": {
      coverImage: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=85",
      description: "High-octane fitness cinematography, athletic speed, and kinetic intensity.",
      descriptionAr: "تصوير حركي ديناميكي للياقة البدنية والرياضيين.",
      nameAr: "رياضة ولياقة",
      color: "#ef4444"
    },
    "Weddings & Events": {
      coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85",
      description: "Emotionally resonant luxury wedding films and timeless celebration archives.",
      descriptionAr: "توثيق سينمائي فاخر للأعراس واللحظات العاطفية الخالدة.",
      nameAr: "أعراس وفعاليات",
      color: "#d97706"
    },
    "AI & Motion Graphics": {
      coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85",
      description: "Generative neural aesthetics, kinetic typography, and seamless visual effects.",
      descriptionAr: "مؤثرات بصرية متقدمة وموشن جرافيكس مدعوم بالذكاء الاصطناعي.",
      nameAr: "ذكاء اصطناعي وموشن",
      color: "#8b5cf6"
    },
    "Medical & Healthcare": {
      coverImage: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=85",
      description: "Human-centered healthcare documentaries, clinical innovations, and medical portraits.",
      descriptionAr: "أفلام طبية وثائقية للمستشفيات والكوادر الصحية.",
      nameAr: "رعاية صحية وطبية",
      color: "#06b6d4"
    },
    "Aerial & Drone": {
      coverImage: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1200&q=85",
      description: "Licensed 4K aerial cinematography and sweeping landscape reveals.",
      descriptionAr: "لقطات جوية 4K مرخصة وتوثيق معماري وطبيعي مذهل.",
      nameAr: "تصوير جوي درون",
      color: "#10b981"
    }
  },
  adminAuth: {
    // Salted SHA-256 for 'mografix2026' with salt 'shpixels_secure_salt_2026'
    passwordHash: "4d7023cb2d6084c00d5946188c0f56d4aa86318719131695206fb5963c0de8cf",
    salt: "shpixels_secure_salt_2026",
    updatedAt: "2026-09-23T00:00:00.000Z"
  },
  clientLogos: [
    { id: "cl-1", name: "Sony Cinema Line", logoUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=200&q=80" },
    { id: "cl-2", name: "DJI Aerial Systems", logoUrl: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=200&q=80" },
    { id: "cl-3", name: "DaVinci Resolve Studio", logoUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=200&q=80" },
    { id: "cl-4", name: "Red Bull Energy", logoUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=200&q=80" }
  ],
  lastPublished: new Date().toISOString(),
  publicationInfo: {
    publishedAt: new Date().toISOString(),
    version: 1,
    publishedBy: "Admin"
  },
  publicationHistory: [
    {
      id: "pub-init",
      publishedAt: new Date().toISOString(),
      version: 1,
      publishedBy: "Admin",
      note: "Initial system publication"
    }
  ]
};
