/**
 * Initial Seed Data for FreelanceHub
 * Persisted and managed via LocalStorage
 */

export const INITIAL_USERS = [
  {
    id: "usr-admin-1",
    name: "Prudhvi",
    username: "prudhvi",
    email: "prudhvi@freelancehub.com",
    password: "prudhvi@2408",
    role: "Admin",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80",
    joinedDate: "2026-01-10",
    title: "Platform Super Administrator"
  },
  {
    id: "usr-client-1",
    name: "MetricFlow Technologies",
    username: "metricflow",
    email: "client@freelancehub.com",
    password: "client123",
    role: "Client",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80",
    joinedDate: "2026-02-01",
    title: "VP of Engineering",
    bio: "Leading software development initiatives and contracting specialized remote talent for enterprise SaaS solutions.",
    skills: ["Technical Architecture", "React", "Cloud Infrastructure"]
  },
  {
    id: "usr-free-1",
    name: "Rahul Kumar",
    username: "rahul",
    email: "rahul@freelancehub.com",
    password: "user123",
    role: "Freelancer",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=260&q=80",
    joinedDate: "2026-02-15",
    title: "Principal Full Stack Engineer",
    hourlyRate: "₹2,500/hr",
    skills: ["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL"],
    bio: "Over 7 years of experience engineering high-scale distributed web applications and modern SaaS platforms."
  },
  {
    id: "usr-free-2",
    name: "Anjali Sharma",
    username: "anjali",
    email: "anjali@freelancehub.com",
    password: "user123",
    role: "Freelancer",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=260&q=80",
    joinedDate: "2026-02-20",
    title: "Lead Product & UI/UX Designer",
    hourlyRate: "₹3,000/hr",
    skills: ["Figma", "Design Systems", "Mobile UI", "Prototyping"],
    bio: "Award-winning product designer dedicated to crafting delightful, conversion-focused digital experiences."
  }
];

export const INITIAL_PROJECTS = [
  {
    id: "proj-1",
    title: "Full-Stack SaaS Analytics Dashboard in Next.js & Supabase",
    category: "Web Development",
    budget: 38000,
    description: "Looking for an expert React/Next.js developer to construct a high-performance analytics dashboard with chart visualisations, Supabase authentication, and Stripe subscriptions.",
    skills: ["Next.js", "React", "TypeScript", "TailwindCSS", "Supabase"],
    postedTime: "2 hours ago",
    client: { name: "MetricFlow Technologies", email: "client@freelancehub.com", verified: true, rating: 4.9, country: "India" },
    status: "approved",
    proposalsCount: 2,
    isFeatured: true
  },
  {
    id: "proj-2",
    title: "Fintech Mobile App UI/UX Design System & Interactive Prototypes",
    category: "UI/UX & Design",
    budget: 22000,
    description: "Need a comprehensive, modern design system in Figma for a personal wealth management application. Requires responsive mobile screens, dark/light modes, and design tokens.",
    skills: ["Figma", "UI/UX", "Design Systems", "Prototyping", "Mobile Design"],
    postedTime: "4 hours ago",
    client: { name: "Aura Capital", email: "aura@auracapital.in", verified: true, rating: 5.0, country: "India" },
    status: "approved",
    proposalsCount: 1,
    isFeatured: true
  },
  {
    id: "proj-3",
    title: "Cross-Platform Food Delivery Application with Flutter & Firebase",
    category: "Mobile Apps",
    budget: 45000,
    description: "Developing an on-demand delivery app for iOS and Android. Features include real-time live order tracking via Google Maps, Razorpay integration, and push notifications.",
    skills: ["Flutter", "Dart", "Firebase", "Google Maps API", "REST APIs"],
    postedTime: "6 hours ago",
    client: { name: "QuickBite Logistics", email: "quickbite@logistics.in", verified: true, rating: 4.8, country: "India" },
    status: "approved",
    proposalsCount: 1,
    isFeatured: false
  },
  {
    id: "proj-4",
    title: "AI Customer Support Assistant with LangChain & OpenAI API",
    category: "AI & Data",
    budget: 52000,
    description: "Build an enterprise customer support pipeline that performs semantic document retrieval from our knowledge base using vector embeddings and LangChain with streaming responses.",
    skills: ["Python", "LangChain", "OpenAI", "FastAPI", "VectorDB"],
    postedTime: "12 hours ago",
    client: { name: "NexusAI Solutions", email: "nexus@ai.org", verified: true, rating: 4.9, country: "India" },
    status: "approved",
    proposalsCount: 1,
    isFeatured: true
  },
  {
    id: "proj-5",
    title: "E-Commerce Lifestyle Store Redesign & Webflow Setup",
    category: "Web Development",
    budget: 16000,
    description: "Redesign our artisanal goods brand storefront on Webflow. Needs clean typography, subtle micro-interactions, smooth scroll transitions, and mobile responsiveness.",
    skills: ["Webflow", "HTML/CSS", "JavaScript", "E-Commerce", "Responsive"],
    postedTime: "1 day ago",
    client: { name: "Verve Studio", email: "verve@studio.design", verified: true, rating: 4.7, country: "India" },
    status: "approved",
    proposalsCount: 0,
    isFeatured: false
  },
  {
    id: "proj-6",
    title: "Predictive Customer Churn Machine Learning Pipeline",
    category: "AI & Data",
    budget: 32000,
    description: "Construct an end-to-end churn prediction pipeline using historical user telemetry. Requires data preprocessing, feature engineering, model selection, and Dockerized deployment.",
    skills: ["Python", "Scikit-Learn", "Pandas", "Docker", "Machine Learning"],
    postedTime: "2 days ago",
    client: { name: "SaaSify Insights", email: "saasify@insights.io", verified: true, rating: 4.8, country: "India" },
    status: "approved",
    proposalsCount: 0,
    isFeatured: false
  }
];

export const INITIAL_FREELANCERS = [
  {
    id: "free-1",
    name: "Rahul Kumar",
    title: "Principal Full Stack Engineer",
    rating: 4.9,
    reviewsCount: 84,
    hourlyRate: "₹2,500/hr",
    completedJobs: 92,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=260&q=80",
    skills: ["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL"],
    bio: "Over 7 years of experience engineering high-scale distributed web applications and modern SaaS platforms. Passionate about clean code and pixel-perfect UIs.",
    topReview: "“Rahul delivered our SaaS MVP two weeks ahead of schedule. Exceptional communication and pristine code quality.” — MetricFlow"
  },
  {
    id: "free-2",
    name: "Anjali Sharma",
    title: "Lead Product & UI/UX Designer",
    rating: 5.0,
    reviewsCount: 112,
    hourlyRate: "₹3,000/hr",
    completedJobs: 130,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=260&q=80",
    skills: ["Figma", "Design Systems", "Mobile UI", "Prototyping", "Branding"],
    bio: "Award-winning product designer dedicated to crafting delightful, conversion-focused digital experiences for early-stage startups and enterprise brands.",
    topReview: "“Anjali has a rare eye for both design beauty and product usability. Our app conversions went up 40% after her redesign.” — Aura Capital"
  },
  {
    id: "free-3",
    name: "Arjun Reddy",
    title: "Senior Mobile Architect (Flutter & iOS)",
    rating: 4.8,
    reviewsCount: 67,
    hourlyRate: "₹2,800/hr",
    completedJobs: 74,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=260&q=80",
    skills: ["Flutter", "Dart", "Swift", "Firebase", "State Management"],
    bio: "Specializing in snappy, cross-platform mobile apps with buttery 60fps animations, robust offline architecture, and seamless cloud integrations.",
    topReview: "“Arjun solved complex real-time geolocation streaming for our delivery fleet with ease. A true mobile maestro.” — QuickBite"
  },
  {
    id: "free-4",
    name: "Priya Patel",
    title: "AI Engineer & Data Scientist",
    rating: 4.9,
    reviewsCount: 53,
    hourlyRate: "₹3,400/hr",
    completedJobs: 58,
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=260&q=80",
    skills: ["Python", "LangChain", "PyTorch", "OpenAI", "MLOps"],
    bio: "Former research scientist turning generative AI, fine-tuned LLMs, and intelligent automation pipelines into real-world business advantages.",
    topReview: "“Priya built our automated customer agent pipeline from scratch in under 3 weeks. Accuracy exceeded our expectations!” — NexusAI"
  }
];

export const INITIAL_APPLICATIONS = [
  {
    id: "app-101",
    projectId: "proj-1",
    projectTitle: "Full-Stack SaaS Analytics Dashboard in Next.js & Supabase",
    freelancerName: "Rahul Kumar",
    freelancerEmail: "rahul@freelancehub.com",
    bid: 36000,
    timeline: "7 Days",
    coverLetter: "I have built 4 enterprise analytics dashboards with Next.js and Supabase. I can execute clean charts with responsive layouts and optimize query performance.",
    status: "pending",
    escrowState: "Pending Escrow",
    date: "2026-03-01T10:30:00.000Z"
  },
  {
    id: "app-102",
    projectId: "proj-1",
    projectTitle: "Full-Stack SaaS Analytics Dashboard in Next.js & Supabase",
    freelancerName: "Devendra Joshi",
    freelancerEmail: "dev@example.com",
    bid: 38000,
    timeline: "14 Days",
    coverLetter: "Full stack engineer with 5 years of React/TypeScript experience. Ready to deliver production grade code.",
    status: "pending",
    escrowState: "Pending Escrow",
    date: "2026-03-01T11:15:00.000Z"
  },
  {
    id: "app-103",
    projectId: "proj-2",
    projectTitle: "Fintech Mobile App UI/UX Design System & Interactive Prototypes",
    freelancerName: "Anjali Sharma",
    freelancerEmail: "anjali@freelancehub.com",
    bid: 22000,
    timeline: "7 Days",
    coverLetter: "Fintech design is my core specialty. I will provide an interactive Figma prototype complete with auto-layout and design token library.",
    status: "accepted",
    escrowState: "Held in Escrow",
    date: "2026-03-02T09:00:00.000Z"
  },
  {
    id: "app-104",
    projectId: "proj-4",
    projectTitle: "AI Customer Support Assistant with LangChain & OpenAI API",
    freelancerName: "Priya Patel",
    freelancerEmail: "priya@example.com",
    bid: 50000,
    timeline: "14 Days",
    coverLetter: "Experienced with RAG systems, embedding stores, and conversational memory in LangChain.",
    status: "pending",
    escrowState: "Pending Escrow",
    date: "2026-03-02T14:20:00.000Z"
  }
];

export const INITIAL_AUDIT_LOGS = [
  { id: "log-1", time: "2026-03-02 14:20", text: "Priya Patel submitted a proposal for 'AI Customer Support Assistant' (₹50,000)" },
  { id: "log-2", time: "2026-03-02 09:15", text: "MetricFlow Technologies accepted proposal from Anjali Sharma for ₹22,000 (Funds placed in Escrow)" },
  { id: "log-3", time: "2026-03-01 10:30", text: "Rahul Kumar submitted a proposal for 'Full-Stack SaaS Analytics Dashboard' (₹36,000)" },
  { id: "log-4", time: "2026-03-01 08:00", text: "Admin Prudhvi approved 6 initial platform projects" },
  { id: "log-5", time: "2026-02-28 16:45", text: "System database initialized with LocalStorage persistence" }
];

