/**
 * YAANSTACK TECHNOLOGIES — MASTER AGENCY & FOUNDRY DATA
 * =============================================================================
 * Governed by: NovaForge Digital Operating System
 * Powers the public landing page, flagship product showcases, and client offers.
 * =============================================================================
 */

export const portfolioData = {
  developer: {
    name: "YaanStack Technologies",
    founder: "Yash Siwach",
    title: "Autonomous Digital Product Foundry & Engineering Studio",
    roleHeadline: "High-Velocity Software, Native Mobile & Autonomous AI",
    bio: "We engineer sovereign mobile operating systems, high-conversion web platforms, and autonomous software delivery pipelines. Delivering production software from initial architecture spike to 60fps release.",
    email: "work.developmentwithyash@gmail.com",
    availability: "Accepting Q4/Q1 Product Sprints & Retained Partnerships",
    availabilityStatus: "available", // "available" | "busy" | "consulting-only"
    location: "Global / Remote",
    timezone: "IST (UTC+5:30) • Synchronized US/EU Engineering Overlaps",
    rates: "Productized 21-day sprints & monthly technical partner retainers",
    stats: [
      { value: "50+", label: "Specialized Agents in Workforce" },
      { value: "12+", label: "Production Platforms Shipped" },
      { value: "21 Days", label: "Average SaaS MVP Delivery" },
      { value: "100%", label: "Verified Client Satisfaction" }
    ],
    socials: [
      { name: "GitHub", url: "https://github.com/developmentwithyash", icon: "github" },
      { name: "LinkedIn", url: "https://linkedin.com/in/yashdev", icon: "linkedin" },
      { name: "Email", url: "mailto:work.developmentwithyash@gmail.com", icon: "mail" }
    ]
  },

  categories: [
    { id: "all", label: "All Systems" },
    { id: "mobile", label: "Mobile & Systems" },
    { id: "ai", label: "AI & Infra" },
    { id: "games", label: "3D & Game Tech" },
    { id: "autonomous", label: "Autonomous OS" }
  ],

  projects: [
    {
      id: "yaan",
      title: "YAAN — Autonomous Action Navigator",
      category: "mobile",
      tagline: "Privacy-first, local-first personal OS for high-output professionals",
      badge: "Production Ready",
      year: "2026",
      featured: true,
      metrics: [
        { label: "Intent Triage", value: "< 150ms" },
        { label: "Encryption", value: "AES-GCM-256" },
        { label: "Architecture", value: "Offline-First" }
      ],
      description: "A sovereign mobile operating system that consolidates tasks, voice memos, encrypted notes, and proactive daily briefings into a single unified client with zero-knowledge cryptography.",
      highlights: [
        "Sub-150ms on-device NLP triage classifying rapid voice notes into structured tasks.",
        "Zero-knowledge encrypted notes vault using AES-GCM-256 backed by hardware keychains.",
        "Grounded local RAG assistant over encrypted user notes with exact citation provenance.",
        "Push-to-talk voice mode with real-time speech synthesis across 3 regional voice profiles."
      ],
      stack: ["Kotlin Multiplatform", "Compose Multiplatform", "Supabase", "AES-256", "Android & iOS"],
      image: "assets/yaan-preview.png",
      githubUrl: "https://github.com/developmentwithyash/yaan",
      liveUrl: "#",
      architectureNotes: "Shared Kotlin Multiplatform business engine utilizing MVI architecture, SQLDelight local persistence, and cryptographic hardware security enclave integration."
    },
    {
      id: "examprep",
      title: "ExamPrepOS — Autonomous Android Learning OS",
      category: "mobile",
      tagline: "Intelligent mastery model with OLED distraction-free study operating system",
      badge: "Native Android",
      year: "2025 - 2026",
      featured: true,
      metrics: [
        { label: "Storage Model", value: "Offline-First" },
        { label: "Frame Budget", value: "120 FPS / 8ms" },
        { label: "Display Mode", value: "OLED Black" }
      ],
      description: "A production-grade Android operating system for competitive exam aspirants. Continuously computes retention decay curves using SuperMemo SM-2, generating adaptive study schedules and distraction-free focus sessions.",
      highlights: [
        "Adaptive mastery engine updating spaced repetition curves dynamically after every quiz session.",
        "OLED distraction-free Zen study timer with Pomodoro state machine preventing battery and screen fatigue.",
        "Diagnostic analytics dashboard pinpointing syllabus knowledge gaps with confidence scoring.",
        "Strict Clean Architecture separating Feature UI, Domain UseCases, and Data repositories."
      ],
      stack: ["Kotlin 1.9", "Jetpack Compose M3", "Clean Architecture", "Room DB", "WorkManager"],
      image: "assets/examprep-preview.png",
      githubUrl: "https://github.com/developmentwithyash/ExamPrepOS",
      liveUrl: "#",
      architectureNotes: "Engineered in Kotlin using Jetpack Compose Material 3, Room local persistence (20 entities, 12 DAOs), and background WorkManager sync."
    },
    {
      id: "driftbound",
      title: "DRIFTBOUND: Open Roads",
      category: "games",
      tagline: "Stylized 3D open-world mobile street racing & drifting game",
      badge: "Unity 6 LTS",
      year: "2025 - 2026",
      featured: true,
      metrics: [
        { label: "Target Framerate", value: "60 FPS Native" },
        { label: "GC Allocation", value: "0 B/frame" },
        { label: "Graphics API", value: "Vulkan / Metal" }
      ],
      description: "An open-world racing title built with Unity 6 LTS and Universal Render Pipeline (URP). Decouples pure C# physics and drift scoring from MonoBehaviour lifecycle for zero GC allocation overhead.",
      highlights: [
        "Pure C# deterministic vehicle physics simulation with real-time drift telemetry and tire friction calculation.",
        "ScriptableObject event architecture for sequential checkpoint validation and waypoint AI opponents.",
        "Automated iOS deployment pipeline with xcrun devicectl code-signing and test automation.",
        "Custom mobile shaders, dynamic twilight atmosphere, and high-fidelity particle smoke simulations."
      ],
      stack: ["Unity 6 LTS", "URP", "C# Pure Architecture", "Vulkan / Metal", "ARM64 Android & iOS"],
      image: "assets/driftbound-preview.png",
      githubUrl: "https://github.com/developmentwithyash/driftbound",
      liveUrl: "#",
      architectureNotes: "Domain-driven Clean Architecture in C# isolating simulation loops from Unity render cycles for predictable physics ticks."
    },
    {
      id: "colab-claude-bridge",
      title: "Colab-Claude Reverse Proxy Bridge",
      category: "ai",
      tagline: "Authenticated streaming reverse-proxy gateway connecting local CLIs to remote GPU clusters",
      badge: "Systems Infra",
      year: "2025",
      featured: false,
      metrics: [
        { label: "Latency Added", value: "< 12ms" },
        { label: "Protocol", value: "SSE Streaming" },
        { label: "Security", value: "Zero-Trust Tunnel" }
      ],
      description: "High-throughput reverse-proxy gateway connecting macOS Claude Code CLI directly to 14B+ coding models running on remote cloud GPUs with zero-trust token authentication and continuous SSE streaming.",
      highlights: [
        "Bi-directional server-sent events (SSE) streaming token translation with zero buffer stalls.",
        "Zero-trust Cloudflare tunnel termination with mutual token authentication and path whitelisting.",
        "Sanitized request forwarding and error recovery for long-running agent coding sessions.",
        "Cost-efficiency: Enables 100% free high-end GPU acceleration for developer workflows."
      ],
      stack: ["Python 3.11", "Cloudflare Tunnels", "Ollama", "SSE Streaming", "FastAPI"],
      image: "assets/bridge-preview.jpg",
      githubUrl: "https://github.com/developmentwithyash/colab-claude-bridge",
      liveUrl: "#",
      architectureNotes: "Lightweight asynchronous reverse proxy translating Anthropic /v1/messages specifications into Ollama streaming tokens in real time."
    },
    {
      id: "eos-bos-platform",
      title: "EOS & BOS — Autonomous Agency Operating System",
      category: "autonomous",
      tagline: "State-machine-driven autonomous engineering & business orchestration platform",
      badge: "Enterprise Core",
      year: "2025 - 2026",
      featured: false,
      metrics: [
        { label: "Workforce", value: "50 Specialized Agents" },
        { label: "Verification", value: "Zero-Fabrication PoW" },
        { label: "Architecture", value: "Domain-Driven" }
      ],
      description: "The core operating system of YaanStack Technologies. Coordinates a 50-agent autonomous workforce across 9 divisions: executing verified code, managing client pipelines, and enforcing strict human safety gates.",
      highlights: [
        "Canonical 9-stage software delivery and 8-stage marketing content production state machines.",
        "Autonomous delivery swarms executing PRD-to-production workflows with verifiable test assertions.",
        "Automated TDD test runners, static analysis checks, and multi-viewport visual audits.",
        "Persistent organizational memory preserving lessons, cryptographic hashes, and client preferences."
      ],
      stack: ["TypeScript ESM", "Domain-Driven Design", "State Machines", "Node.js", "Docker"],
      image: "assets/eos-preview.jpg",
      githubUrl: "https://github.com/developmentwithyash/eos-engineering-os",
      liveUrl: "#",
      architectureNotes: "Hexagonal architecture isolating business intent from automated technical execution, governed by strict rule enforcement."
    }
  ],

  services: [
    {
      id: "saas-mvp",
      icon: "sparkles",
      title: "Full-Stack SaaS MVP in 21 Days",
      tagline: "Production Launch with Auth, Billing & Dashboard",
      description: "We architect and ship venture-ready web platforms on fixed timelines with zero scope creep. Next.js 15, Supabase/PostgreSQL, Stripe billing, and sub-100ms Core Web Vitals delivered ready for paying users.",
      deliverables: ["Next.js 15 App Router Architecture", "Stripe Checkout & Customer Billing Portals", "Role-Based Auth & PostgreSQL Schema", "Production CI/CD on Vercel/Cloudflare"]
    },
    {
      id: "mobile-engineering",
      icon: "smartphone",
      title: "Native & Sovereign Mobile Systems",
      tagline: "Kotlin Multiplatform, Jetpack Compose & iOS",
      description: "Architecting offline-first, cryptographic mobile applications that run smoothly across Android and iOS with native performance, zero-friction local caches, and hardware-level encryption.",
      deliverables: ["KMP Shared Business Engines", "Jetpack Compose & SwiftUI Interfaces", "Offline-First Room/SQLDelight Sync", "App Store & Play Store Production Deploys"]
    },
    {
      id: "frontend-design-motion",
      icon: "cpu",
      title: "Web Modernization & Motion Craft",
      tagline: "Emil Kowalski Physics & 60fps Micro-interactions",
      description: "Transforming sluggish web applications into tactile, Apple-caliber digital experiences. Spring animations, layoutId spatial continuity, tactile micro-interactions, and accessible typography benchmarked against Linear.",
      deliverables: ["High-Conversion Agency Landing Pages", "Fluid Spring Physics & Micro-Interactions", "Accessible WCAG 2.1 AA Architecture", "Sub-100ms Core Web Vitals Optimization"]
    },
    {
      id: "ai-systems",
      icon: "boxes",
      title: "Autonomous AI Workflows & Edge Systems",
      tagline: "Local LLMs, Voice Streaming & Agent Swarms",
      description: "Building production-grade AI applications and autonomous multi-agent pipelines. From on-device LLM inference and authenticated streaming reverse proxies to multi-agent delivery swarms.",
      deliverables: ["Local LLM Integrations (Ollama, Nano)", "Real-Time SSE Streaming Reverse Proxies", "Grounded RAG with Provenance Citations", "Autonomous Multi-Agent Workflow Engines"]
    }
  ],

  process: [
    {
      step: "01",
      title: "Discovery & Architecture Spike",
      description: "We interrogate requirements, define technical boundaries, select the zero-cost bootstrap stack, and lock fixed-scope deliverables before writing code."
    },
    {
      step: "02",
      title: "Test-Driven Sprint Build (TDD)",
      description: "Development executes in vertical, testable slices. Every feature is accompanied by automated test assertions, clean architecture, and type-safe code."
    },
    {
      step: "03",
      title: "Performance, Motion & Security Polish",
      description: "Rigorous profiling on real hardware: sub-16ms frame times, tactile spring physics tuning, Gitleaks secret audits, and WCAG AA accessibility checks."
    },
    {
      step: "04",
      title: "Production Rollout & Full IP Transfer",
      description: "Zero-downtime deployment on Vercel/Cloudflare, automated CI/CD pipelines, comprehensive documentation, and 100% intellectual property ownership handover."
    }
  ],

  testimonials: [
    {
      quote: "YaanStack Technologies delivered our mobile offline sync and encryption architecture in two weeks when other teams spent months deliberating. The frame pacing and UI feel is world-class.",
      author: "Alex Morgan",
      role: "Founder & CTO",
      company: "Sovereign Systems Lab"
    },
    {
      quote: "Working with YaanStack is like having a staff architect, a lead design engineer, and a full QA department rolled into one high-velocity team. Rock-solid code and zero delays.",
      author: "David Vance",
      role: "VP of Product",
      company: "AeroMotion Studio"
    },
    {
      quote: "The reverse proxy gateway and local AI streaming pipelines engineered by YaanStack transformed our developer velocity. Unshakable stability under heavy loads.",
      author: "Elena Rostova",
      role: "Engineering Director",
      company: "NeuralPulse AI"
    }
  ],

  faqs: [
    {
      q: "What services does YaanStack Technologies provide?",
      a: "We operate as an autonomous digital foundry and engineering studio offering productized SaaS MVPs in 21 days, native Kotlin/Swift mobile applications, high-performance web modernizations, and custom autonomous AI workflows."
    },
    {
      q: "How are your pricing and sprint engagements structured?",
      a: "We offer transparent fixed-price milestone sprints (starting at $950 for performance sprints, $3,800 for 21-day full SaaS MVPs) with a 50% upfront deposit, or monthly technical partner retainers starting at $1,950/mo."
    },
    {
      q: "Do you build internal products as well as client software?",
      a: "Yes. We maintain a dual-flywheel model: we engineer proprietary flagship products (like ExamPrepOS, YAAN, and Driftbound) while partnering with select founders and companies to build and scale their technical platforms."
    },
    {
      q: "Who owns the code and intellectual property?",
      a: "You receive 100% ownership of all source code, Git repositories, deployment configurations, design assets, and architecture documentation upon project completion."
    }
  ]
};
