/* ==========================================================================
   FREELANCEHUB — Complete Application Logic & State Engine
   Pure Vanilla JavaScript (ES6+) implementation:
   - Module Navigation & Routing (Public Marketplace, User Portal, Admin Panel)
   - LocalStorage User Authentication & Role-Based Access Control (Admin, Client, Freelancer)
   - Project Moderation & Approval Workflow
   - Client Project Management & Candidate Hiring / Escrow Allocation
   - Freelancer Proposal Submissions & Bid Tracking
   - Real-Time Search, Filtering, Live Card Preview, & Ambient Toast Engine
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. Initial Seed Data
// --------------------------------------------------------------------------
const INITIAL_USERS = [
    {
        id: "usr-admin-1",
        name: "Vikram Malhotra",
        email: "admin@freelancehub.com",
        password: "admin123",
        role: "Admin",
        status: "Active",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80",
        joinedDate: "2026-01-10",
        title: "Platform Super Administrator"
    },
    {
        id: "usr-client-1",
        name: "MetricFlow Technologies",
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

const INITIAL_PROJECTS = [
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

const INITIAL_FREELANCERS = [
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

const INITIAL_APPLICATIONS = [
    {
        id: "app-101",
        projectId: "proj-1",
        projectTitle: "Full-Stack SaaS Analytics Dashboard in Next.js & Supabase",
        freelancerName: "Rahul Kumar",
        freelancerEmail: "rahul@freelancehub.com",
        bid: 36000,
        timeline: "7 Days",
        coverLetter: "I have built 4 enterprise analytics dashboards with Next.js and Supabase. I can execute clean charts with Lucide icons and optimize query performance.",
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

const INITIAL_AUDIT_LOGS = [
    { id: "log-1", time: "2026-03-02 14:20", text: "Priya Patel submitted a proposal for 'AI Customer Support Assistant' (₹50,000)" },
    { id: "log-2", time: "2026-03-02 09:15", text: "MetricFlow Technologies accepted proposal from Anjali Sharma for ₹22,000 (Funds placed in Escrow)" },
    { id: "log-3", time: "2026-03-01 10:30", text: "Rahul Kumar submitted a proposal for 'Full-Stack SaaS Analytics Dashboard' (₹36,000)" },
    { id: "log-4", time: "2026-03-01 08:00", text: "Admin Vikram Malhotra approved 6 initial platform projects" },
    { id: "log-5", time: "2026-02-28 16:45", text: "System database initialized with LocalStorage persistence" }
];

// --------------------------------------------------------------------------
// 2. Storage Keys & Runtime State
// --------------------------------------------------------------------------
const STORAGE_KEYS = {
    USERS: "freelancehub_users_v3",
    SESSION: "freelancehub_session_v3",
    PROJECTS: "freelancehub_projects_v3",
    APPLICATIONS: "freelancehub_applications_v3",
    BOOKMARKS: "freelancehub_bookmarks_v3",
    LOGS: "freelancehub_audit_logs_v3",
    THEME: "freelancehub_theme_v2"
};

let usersData = [];
let projectsData = [];
let applicationsData = [];
let auditLogsData = [];
let bookmarksSet = new Set();
let currentUser = null;

let currentModule = "marketplace"; // "marketplace" | "user" | "admin"
let activeFilter = {
    category: "All",
    search: "",
    budget: "all",
    sort: "newest"
};
let activeApplyProjectId = null;
let activeClientViewingProjectId = null;
let authMode = "signin";

// --------------------------------------------------------------------------
// 3. Application Lifecycle Initialization
// --------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    loadStoredData();
    initEventListeners();
    initLivePreview();
    applyFilters();
    renderFreelancers(INITIAL_FREELANCERS);

    // Initial navigation check based on session
    if (currentUser) {
        updateUserNavUI();
    }
});

// --------------------------------------------------------------------------
// 4. Data Loading & LocalStorage Persistence Engine
// --------------------------------------------------------------------------
function loadStoredData() {
    // 1. Users
    const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    if (storedUsers) {
        try {
            usersData = JSON.parse(storedUsers);
        } catch (e) {
            usersData = [...INITIAL_USERS];
        }
    } else {
        usersData = [...INITIAL_USERS];
        saveUsersToStorage();
    }

    // 2. Projects
    const storedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (storedProjects) {
        try {
            projectsData = JSON.parse(storedProjects);
        } catch (e) {
            projectsData = [...INITIAL_PROJECTS];
        }
    } else {
        projectsData = [...INITIAL_PROJECTS];
        saveProjectsToStorage();
    }

    // 3. Applications
    const storedApps = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (storedApps) {
        try {
            applicationsData = JSON.parse(storedApps);
        } catch (e) {
            applicationsData = [...INITIAL_APPLICATIONS];
        }
    } else {
        applicationsData = [...INITIAL_APPLICATIONS];
        saveApplicationsToStorage();
    }

    // 4. Audit Logs
    const storedLogs = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (storedLogs) {
        try {
            auditLogsData = JSON.parse(storedLogs);
        } catch (e) {
            auditLogsData = [...INITIAL_AUDIT_LOGS];
        }
    } else {
        auditLogsData = [...INITIAL_AUDIT_LOGS];
        saveLogsToStorage();
    }

    // 5. Bookmarks
    const storedBookmarks = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    if (storedBookmarks) {
        try {
            bookmarksSet = new Set(JSON.parse(storedBookmarks));
        } catch (e) {
            bookmarksSet = new Set();
        }
    }

    // 6. Active Session
    const storedSession = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (storedSession) {
        try {
            currentUser = JSON.parse(storedSession);
        } catch (e) {
            currentUser = null;
        }
    }
}

function saveUsersToStorage() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(usersData));
}

function saveProjectsToStorage() {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projectsData));
}

function saveApplicationsToStorage() {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applicationsData));
}

function saveLogsToStorage() {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(auditLogsData));
}

function saveBookmarksToStorage() {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify([...bookmarksSet]));
}

function logAuditEvent(text) {
    const dateStr = new Date().toISOString().replace("T", " ").substring(0, 16);
    const newLog = {
        id: "log-" + Date.now(),
        time: dateStr,
        text
    };
    auditLogsData.unshift(newLog);
    if (auditLogsData.length > 50) auditLogsData.pop();
    saveLogsToStorage();

    if (currentModule === "admin") {
        renderAdminAuditLogs();
    }
}

// --------------------------------------------------------------------------
// 5. Module-Wise Navigation & JavaScript Redirection Engine
// --------------------------------------------------------------------------
function navigateToModule(moduleName) {
    // Role-Based Authorization Guard for Admin Panel
    if (moduleName === "admin") {
        if (!currentUser || currentUser.role !== "Admin") {
            showToast("🛡️ Access Denied: Administrator role required to open the Admin Panel.", "warning");
            openAuthModal();
            return false;
        }
    }

    // Route Guard for User Dashboard
    if (moduleName === "user") {
        if (!currentUser) {
            showToast("Please sign in to access your User Portal.", "info");
            openAuthModal();
            return false;
        }
    }

    currentModule = moduleName;

    // Toggle active module view container
    const marketView = document.getElementById("marketplaceModuleView");
    const userView = document.getElementById("userModuleView");
    const adminView = document.getElementById("adminModuleView");

    if (marketView) marketView.classList.toggle("active", moduleName === "marketplace");
    if (userView) userView.classList.toggle("active", moduleName === "user");
    if (adminView) adminView.classList.toggle("active", moduleName === "admin");

    // Update nav links active states
    const navMarket = document.getElementById("navLinkMarketplace");
    const navUser = document.getElementById("navLinkUser");
    const navAdmin = document.getElementById("navLinkAdmin");

    if (navMarket) navMarket.classList.toggle("active", moduleName === "marketplace");
    if (navUser) navUser.classList.toggle("active", moduleName === "user");
    if (navAdmin) navAdmin.classList.toggle("active", moduleName === "admin");

    // Toggle visibility of Marketplace anchor sublinks
    document.querySelectorAll(".nav-sublink").forEach(link => {
        link.style.display = moduleName === "marketplace" ? "inline-block" : "none";
    });

    // Module-specific data rendering
    if (moduleName === "user") {
        renderUserModule();
    } else if (moduleName === "admin") {
        renderAdminModule();
    } else {
        applyFilters();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
    return true;
}

function userSwitchToPostProject() {
    navigateToModule("marketplace");
    setTimeout(() => {
        const el = document.getElementById("post-project");
        if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 150);
}

// --------------------------------------------------------------------------
// 6. Theme Engine
// --------------------------------------------------------------------------
function initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || "dark";
    setTheme(savedTheme);

    const themeToggleBtn = document.getElementById("themeToggleBtn");
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
            const newTheme = currentTheme === "dark" ? "light" : "dark";
            setTheme(newTheme);
            showToast(`Switched to ${newTheme === "dark" ? "Dark" : "Light"} theme`, "info");
        });
    }
}

function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEYS.THEME, theme);

    const icon = document.getElementById("themeIconSun");
    if (icon) {
        if (theme === "light") {
            icon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
        } else {
            icon.innerHTML = `
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            `;
        }
    }
}

// --------------------------------------------------------------------------
// 7. Authentication Engine with Local Storage
// --------------------------------------------------------------------------
function openAuthModal() {
    const modal = document.getElementById("authModal");
    if (modal) modal.showModal();
}

function closeAuthModal() {
    const modal = document.getElementById("authModal");
    if (modal) modal.close();
}

function switchAuthTab(mode) {
    authMode = mode;
    const tabSignIn = document.getElementById("tabSignIn");
    const tabRegister = document.getElementById("tabRegister");
    const nameGroup = document.getElementById("nameGroup");
    const roleGroup = document.getElementById("roleGroup");
    const modalTitle = document.getElementById("authModalTitle");
    const submitBtn = document.getElementById("authSubmitBtn");

    if (mode === "signin") {
        tabSignIn.classList.add("active");
        tabRegister.classList.remove("active");
        if (nameGroup) nameGroup.style.display = "none";
        if (roleGroup) roleGroup.style.display = "none";
        modalTitle.textContent = "Welcome to FreelanceHub";
        submitBtn.textContent = "Sign In";
    } else {
        tabRegister.classList.add("active");
        tabSignIn.classList.remove("active");
        if (nameGroup) nameGroup.style.display = "block";
        if (roleGroup) roleGroup.style.display = "block";
        modalTitle.textContent = "Create an Account";
        submitBtn.textContent = "Register Account";
    }
}

function handleAuthSubmit(e) {
    e.preventDefault();
    const email = document.getElementById("authEmail").value.trim().toLowerCase();
    const password = document.getElementById("authPassword").value;

    if (authMode === "register") {
        const name = document.getElementById("authName").value.trim();
        const role = document.getElementById("authRole").value;

        if (!name || !email || !password) {
            showToast("Please fill in all registration fields.", "warning");
            return;
        }

        // Check if email already registered
        const existing = usersData.find(u => u.email.toLowerCase() === email);
        if (existing) {
            showToast("An account with this email address already exists. Please sign in.", "warning");
            switchAuthTab("signin");
            return;
        }

        const newUser = {
            id: "usr-" + Date.now(),
            name,
            email,
            password,
            role,
            status: "Active",
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80",
            joinedDate: new Date().toISOString().substring(0, 10),
            title: role === "Freelancer" ? "Freelance Professional" : (role === "Client" ? "Hiring Manager" : "Platform Moderator"),
            hourlyRate: role === "Freelancer" ? "₹2,000/hr" : "",
            skills: role === "Freelancer" ? ["Web Development", "JavaScript"] : []
        };

        usersData.unshift(newUser);
        saveUsersToStorage();
        currentUser = newUser;
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(currentUser));

        logAuditEvent(`New user registered: ${newUser.name} (${newUser.email}) as ${newUser.role}`);
        updateUserNavUI();
        closeAuthModal();
        e.target.reset();

        showToast(`🎉 Registration successful! Welcome to FreelanceHub, ${newUser.name}.`, "success");

        // Module redirection on signup
        if (newUser.role === "Admin") {
            navigateToModule("admin");
        } else {
            navigateToModule("user");
        }
    } else {
        // Sign In Flow
        const user = usersData.find(u => u.email.toLowerCase() === email);

        if (!user || user.password !== password) {
            showToast("Invalid email or password. Please verify your credentials.", "warning");
            return;
        }

        if (user.status === "Suspended") {
            showToast("⚠️ This account has been suspended by administration. Access restricted.", "warning");
            return;
        }

        currentUser = user;
        localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(currentUser));

        logAuditEvent(`User logged in: ${user.name} (${user.role})`);
        updateUserNavUI();
        closeAuthModal();
        e.target.reset();

        showToast(`Welcome back, ${user.name}! Authenticated as ${user.role}.`, "success");

        // Module-wise Redirection on login
        if (user.role === "Admin") {
            navigateToModule("admin");
        } else {
            navigateToModule("user");
        }
    }
}

function demoLogin(roleType) {
    let targetUser = null;
    if (roleType === "admin") {
        targetUser = usersData.find(u => u.role === "Admin") || INITIAL_USERS[0];
    } else if (roleType === "client") {
        targetUser = usersData.find(u => u.role === "Client") || INITIAL_USERS[1];
    } else {
        targetUser = usersData.find(u => u.role === "Freelancer") || INITIAL_USERS[2];
    }

    if (!targetUser) {
        showToast("Demo user not found.", "warning");
        return;
    }

    currentUser = targetUser;
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(currentUser));
    logAuditEvent(`Demo sign-in: ${currentUser.name} (${currentUser.role})`);
    updateUserNavUI();
    closeAuthModal();

    showToast(`⚡ Demo sign-in as ${currentUser.role}: ${currentUser.name}`, "success");

    // Module-wise redirection
    if (currentUser.role === "Admin") {
        navigateToModule("admin");
    } else {
        navigateToModule("user");
    }
}

function logoutUser() {
    if (currentUser) {
        logAuditEvent(`User signed out: ${currentUser.name}`);
    }
    currentUser = null;
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    updateUserNavUI();
    navigateToModule("marketplace");
    showToast("You have been signed out successfully.", "info");
}

function updateUserNavUI() {
    const authBtn = document.getElementById("authNavBtn");
    const roleBadge = document.getElementById("navUserRoleBadge");

    if (!authBtn) return;

    if (currentUser) {
        authBtn.innerHTML = `
            <img src="${currentUser.avatar}" alt="${escapeHtml(currentUser.name)}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover; display: inline-block;">
            <span>${escapeHtml(currentUser.name.split(" ")[0])} (${currentUser.role})</span>
            <span style="font-size: 11px; opacity: 0.8; margin-left: 2px;">✕</span>
        `;
        authBtn.title = "Click to sign out";
        authBtn.onclick = logoutUser;

        if (roleBadge) {
            roleBadge.textContent = currentUser.role;
        }
    } else {
        authBtn.textContent = "Sign In";
        authBtn.title = "Sign in or register";
        authBtn.onclick = openAuthModal;

        if (roleBadge) {
            roleBadge.textContent = "Client/Freelancer";
        }
    }
}

// --------------------------------------------------------------------------
// 8. Public Marketplace Project & Freelancer Engine
// --------------------------------------------------------------------------
function renderProjects(projectsToDisplay) {
    const container = document.getElementById("project-list");
    if (!container) return;

    // Filter only approved projects for public display
    const approvedProjects = projectsToDisplay.filter(p => p.status === "approved" || !p.status);

    if (approvedProjects.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 48px 24px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin: 0 auto 12px; color: var(--text-muted);">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <h3>No matching live projects found</h3>
                <p style="color: var(--text-secondary); margin-top: 6px;">Try adjusting your search criteria, category pill, or budget filter.</p>
                <button class="btn btn-secondary btn-sm" style="margin-top: 14px;" onclick="resetFilters()">
                    Reset All Filters
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = approvedProjects.map(project => {
        const isBookmarked = bookmarksSet.has(project.id);
        const formattedBudget = formatCurrency(project.budget);

        const skillsHtml = (project.skills || [])
            .map(skill => `<span class="skill-tag">${escapeHtml(skill)}</span>`)
            .join("");

        return `
            <article class="project-card" data-id="${project.id}">
                <div>
                    <div class="card-top">
                        <span class="card-category-badge">${escapeHtml(project.category)}</span>
                        <button 
                            class="card-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" 
                            title="${isBookmarked ? 'Remove Bookmark' : 'Save Project'}"
                            onclick="toggleBookmark('${project.id}')"
                            aria-label="Bookmark project">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </button>
                    </div>

                    <h3>${escapeHtml(project.title)}</h3>
                    <p class="project-desc">${escapeHtml(project.description)}</p>

                    <div class="skills-wrapper">
                        ${skillsHtml}
                    </div>
                </div>

                <div class="card-footer">
                    <div class="budget-info">
                        <span class="budget-label">Fixed Budget • ${project.proposalsCount || 0} Proposals</span>
                        <span class="budget-val">${formattedBudget}</span>
                    </div>

                    <button class="btn btn-primary btn-sm" onclick="openApplyModal('${project.id}')">
                        Apply Now
                    </button>
                </div>
            </article>
        `;
    }).join("");
}

function renderFreelancers(freelancers) {
    const container = document.getElementById("freelancer-list");
    if (!container) return;

    container.innerHTML = freelancers.map(freelancer => {
        const skillsHtml = freelancer.skills.slice(0, 3)
            .map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`)
            .join("");

        return `
            <div class="freelancer-card">
                <div class="avatar-wrapper">
                    <img src="${freelancer.avatar}" alt="${escapeHtml(freelancer.name)}" loading="lazy">
                    <span class="online-dot" title="Available for hire"></span>
                </div>

                <h3>
                    ${escapeHtml(freelancer.name)}
                    <span class="verified-icon" title="Identity & Skills Verified">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                    </span>
                </h3>

                <p class="freelancer-title">${escapeHtml(freelancer.title)}</p>

                <div class="freelancer-rating">
                    <span>★ ${freelancer.rating}</span>
                    <span class="reviews-count">(${freelancer.reviewsCount} reviews • ${freelancer.completedJobs} jobs)</span>
                </div>

                <div class="freelancer-skills">
                    ${skillsHtml}
                </div>

                <div class="rate-badge">
                    Rate: <strong>${freelancer.hourlyRate}</strong>
                </div>

                <button class="btn btn-outline btn-sm" style="width: 100%;" onclick="openProfileModal('${freelancer.id}')">
                    View Full Profile
                </button>
            </div>
        `;
    }).join("");
}

// Filtering & Search Logic
function applyFilters() {
    let results = [...projectsData];

    // Category Filter
    if (activeFilter.category && activeFilter.category !== "All") {
        results = results.filter(p => p.category === activeFilter.category);
    }

    // Keyword Search
    if (activeFilter.search.trim()) {
        const query = activeFilter.search.toLowerCase().trim();
        results = results.filter(p => {
            const titleMatch = p.title.toLowerCase().includes(query);
            const descMatch = p.description.toLowerCase().includes(query);
            const skillsMatch = p.skills && p.skills.some(s => s.toLowerCase().includes(query));
            return titleMatch || descMatch || skillsMatch;
        });
    }

    // Budget Tier
    if (activeFilter.budget === "under-10k") {
        results = results.filter(p => p.budget < 10000);
    } else if (activeFilter.budget === "10k-25k") {
        results = results.filter(p => p.budget >= 10000 && p.budget <= 25000);
    } else if (activeFilter.budget === "above-25k") {
        results = results.filter(p => p.budget > 25000);
    }

    // Sorting
    if (activeFilter.sort === "budget-high") {
        results.sort((a, b) => b.budget - a.budget);
    } else if (activeFilter.sort === "budget-low") {
        results.sort((a, b) => a.budget - b.budget);
    }

    renderProjects(results);
}

function filterByTag(tag) {
    activeFilter.search = tag;
    const heroInput = document.getElementById("heroSearchInput");
    if (heroInput) heroInput.value = tag;

    activeFilter.category = "All";
    document.querySelectorAll(".category-pill").forEach(pill => {
        pill.classList.toggle("active", pill.dataset.category === "All");
    });

    applyFilters();
    scrollToProjects();
    showToast(`Filtering projects for "${tag}"`, "info");
}

function resetFilters() {
    activeFilter = { category: "All", search: "", budget: "all", sort: "newest" };
    const heroInput = document.getElementById("heroSearchInput");
    if (heroInput) heroInput.value = "";

    const budgetSelect = document.getElementById("budgetFilter");
    if (budgetSelect) budgetSelect.value = "all";

    const sortSelect = document.getElementById("sortFilter");
    if (sortSelect) sortSelect.value = "newest";

    document.querySelectorAll(".category-pill").forEach(pill => {
        pill.classList.toggle("active", pill.dataset.category === "All");
    });

    applyFilters();
    showToast("Filters reset to default.", "info");
}

function triggerHeroSearch() {
    const input = document.getElementById("heroSearchInput");
    if (input) {
        activeFilter.search = input.value.trim();
        applyFilters();
        scrollToProjects();
    }
}

function toggleBookmark(projectId) {
    if (bookmarksSet.has(projectId)) {
        bookmarksSet.delete(projectId);
        showToast("Project removed from saved list", "info");
    } else {
        bookmarksSet.add(projectId);
        showToast("Project saved to your bookmarks!", "success");
    }

    saveBookmarksToStorage();
    applyFilters();

    if (currentModule === "user") {
        renderUserBookmarks();
    }
}

// --------------------------------------------------------------------------
// 9. Post Project Handler with Live Preview
// --------------------------------------------------------------------------
function initLivePreview() {
    const titleInput = document.getElementById("projectTitle");
    const descInput = document.getElementById("projectDescription");
    const categorySelect = document.getElementById("projectCategory");
    const budgetInput = document.getElementById("projectBudget");
    const skillsInput = document.getElementById("projectSkills");

    const previewTitle = document.getElementById("previewTitle");
    const previewDesc = document.getElementById("previewDesc");
    const previewCategory = document.getElementById("previewCategory");
    const previewBudget = document.getElementById("previewBudgetText");
    const previewSkills = document.getElementById("previewSkills");

    if (titleInput && previewTitle) {
        titleInput.addEventListener("input", (e) => {
            previewTitle.textContent = e.target.value.trim() || "Your Project Title Appears Here";
        });
    }

    if (descInput && previewDesc) {
        descInput.addEventListener("input", (e) => {
            previewDesc.textContent = e.target.value.trim() || "Describe your requirements to preview how candidates will view your job posting on the marketplace.";
        });
    }

    if (categorySelect && previewCategory) {
        categorySelect.addEventListener("change", (e) => {
            previewCategory.textContent = e.target.value;
        });
    }

    if (budgetInput && previewBudget) {
        budgetInput.addEventListener("input", (e) => {
            const val = parseFloat(e.target.value);
            if (!isNaN(val) && val > 0) {
                previewBudget.textContent = formatCurrency(val);
            } else {
                previewBudget.textContent = "₹25,000";
            }
        });
    }

    if (skillsInput && previewSkills) {
        skillsInput.addEventListener("input", (e) => {
            const skillsArr = e.target.value
                .split(",")
                .map(s => s.trim())
                .filter(s => s.length > 0);

            if (skillsArr.length > 0) {
                previewSkills.innerHTML = skillsArr.map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`).join("");
            } else {
                previewSkills.innerHTML = `<span class="skill-tag">HTML</span><span class="skill-tag">CSS</span><span class="skill-tag">JavaScript</span>`;
            }
        });
    }
}

function handlePostProject(e) {
    e.preventDefault();

    const title = document.getElementById("projectTitle").value.trim();
    const category = document.getElementById("projectCategory").value;
    const budget = parseFloat(document.getElementById("projectBudget").value);
    const skillsStr = document.getElementById("projectSkills").value.trim();
    const description = document.getElementById("projectDescription").value.trim();

    if (!title || !description || isNaN(budget) || budget <= 0) {
        showToast("Please fill out all required fields with a valid budget.", "warning");
        return;
    }

    const skills = skillsStr
        .split(",")
        .map(s => s.trim())
        .filter(s => s.length > 0);

    const clientName = currentUser ? currentUser.name : "Verified Employer";
    const clientEmail = currentUser ? currentUser.email : "client@freelancehub.com";

    // Newly posted projects are approved directly or pending review
    const newProject = {
        id: "proj-" + Date.now(),
        title,
        category,
        budget,
        description,
        skills: skills.length > 0 ? skills : ["Web Development"],
        postedTime: "Just now",
        client: {
            name: clientName,
            email: clientEmail,
            verified: true,
            rating: 5.0,
            country: "India"
        },
        status: "approved",
        proposalsCount: 0,
        isFeatured: false
    };

    projectsData.unshift(newProject);
    saveProjectsToStorage();
    logAuditEvent(`New project published: '${title}' by ${clientName} (${formatCurrency(budget)})`);

    applyFilters();

    e.target.reset();
    initLivePreview();

    showToast("🎉 Project published and live on the marketplace!", "success");
    scrollToProjects();
}

// --------------------------------------------------------------------------
// 10. Proposals & Application Flow
// --------------------------------------------------------------------------
function openApplyModal(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return;

    activeApplyProjectId = projectId;

    const modal = document.getElementById("applyModal");
    const modalTitle = document.getElementById("modalProjectTitle");
    const modalBudget = document.getElementById("modalProjectBudget");
    const bidInput = document.getElementById("bidAmount");

    if (modalTitle) modalTitle.textContent = project.title;
    if (modalBudget) {
        modalBudget.textContent = "Client Budget: " + formatCurrency(project.budget);
    }
    if (bidInput) bidInput.value = project.budget;

    if (modal) modal.showModal();
}

function closeApplyModal() {
    const modal = document.getElementById("applyModal");
    if (modal) modal.close();
    activeApplyProjectId = null;
}

function submitApplication(e) {
    e.preventDefault();

    if (!activeApplyProjectId) return;

    const bid = parseFloat(document.getElementById("bidAmount").value);
    const timeline = document.getElementById("deliveryDays").value;
    const coverLetter = document.getElementById("coverLetter").value.trim();

    if (isNaN(bid) || bid <= 0 || !coverLetter) {
        showToast("Please provide your bid amount and cover letter.", "warning");
        return;
    }

    const project = projectsData.find(p => p.id === activeApplyProjectId);
    if (!project) return;

    project.proposalsCount = (project.proposalsCount || 0) + 1;
    saveProjectsToStorage();

    const freelancerName = currentUser ? currentUser.name : "Rahul Kumar";
    const freelancerEmail = currentUser ? currentUser.email : "rahul@freelancehub.com";

    const newApp = {
        id: "app-" + Date.now(),
        projectId: activeApplyProjectId,
        projectTitle: project.title,
        freelancerName,
        freelancerEmail,
        bid,
        timeline,
        coverLetter,
        status: "pending",
        escrowState: "Pending Escrow",
        date: new Date().toISOString()
    };

    applicationsData.unshift(newApp);
    saveApplicationsToStorage();
    logAuditEvent(`Proposal submitted by ${freelancerName} on '${project.title}' (${formatCurrency(bid)})`);

    closeApplyModal();
    document.getElementById("applyForm").reset();

    applyFilters();
    showToast("🚀 Proposal submitted successfully! The client will review your submission.", "success");
}

// --------------------------------------------------------------------------
// 11. USER MODULE IMPLEMENTATION (CLIENT & FREELANCER WORKSPACE)
// --------------------------------------------------------------------------
function renderUserModule() {
    if (!currentUser) return;

    // Header updates
    const greeting = document.getElementById("userBannerGreeting");
    const roleBadge = document.getElementById("userRoleBadge");
    if (greeting) {
        greeting.textContent = `Welcome back, ${currentUser.name}! Authenticated as ${currentUser.role}.`;
    }
    if (roleBadge) {
        roleBadge.textContent = `${currentUser.role} Account`;
    }

    // Calculate user KPIs
    const userProjects = projectsData.filter(p => p.client && (p.client.email === currentUser.email || currentUser.role === "Admin"));
    const proposalsReceived = applicationsData.filter(a => userProjects.some(p => p.id === a.projectId));
    const userSubmittedBids = applicationsData.filter(a => a.freelancerEmail === currentUser.email);

    const statProjects = document.getElementById("statUserPostedProjects");
    const statReceived = document.getElementById("statUserProposalsReceived");
    const statBids = document.getElementById("statUserSubmittedBids");
    const statBookmarks = document.getElementById("statUserBookmarks");

    if (statProjects) statProjects.textContent = userProjects.length;
    if (statReceived) statReceived.textContent = proposalsReceived.length;
    if (statBids) statBids.textContent = userSubmittedBids.length;
    if (statBookmarks) statBookmarks.textContent = bookmarksSet.size;

    // Tab badges
    const bProjects = document.getElementById("userBadgeProjects");
    const bProposals = document.getElementById("userBadgeProposals");
    const bSaved = document.getElementById("userBadgeSaved");
    if (bProjects) bProjects.textContent = userProjects.length;
    if (bProposals) bProposals.textContent = userSubmittedBids.length;
    if (bSaved) bSaved.textContent = bookmarksSet.size;

    // Render Sub-sections
    renderUserProjectsTable(userProjects);
    renderUserProposalsTable(userSubmittedBids);
    renderUserBookmarks();
    populateUserProfileForm();
}

function switchUserTab(tabName) {
    const tabs = ["projects", "proposals", "saved", "profile"];
    tabs.forEach(tab => {
        const btn = document.getElementById(`userTabBtn${capitalize(tab)}`);
        const pane = document.getElementById(`userTabContent${capitalize(tab)}`);
        if (btn) btn.classList.toggle("active", tab === tabName);
        if (pane) pane.style.display = tab === tabName ? "block" : "none";
    });
}

function renderUserProjectsTable(projects) {
    const tbody = document.getElementById("userProjectsTableBody");
    if (!tbody) return;

    if (projects.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 24px; color: var(--text-secondary);">
                    No projects posted yet. Click <strong>+ Post New Job</strong> to create your first listing.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = projects.map(proj => {
        const proposalCount = applicationsData.filter(a => a.projectId === proj.id).length;
        const statusClass = proj.status === "approved" ? "status-approved" : (proj.status === "pending" ? "status-pending" : "status-rejected");
        const statusLabel = proj.status === "approved" ? "Live / Approved" : (proj.status === "pending" ? "Under Review" : "Rejected");

        return `
            <tr>
                <td><strong>${escapeHtml(proj.title)}</strong></td>
                <td>${escapeHtml(proj.category)}</td>
                <td><strong>${formatCurrency(proj.budget)}</strong></td>
                <td><span class="status-pill ${statusClass}">${statusLabel}</span></td>
                <td><span class="status-pill status-open">${proposalCount} Bids</span></td>
                <td>
                    <div class="btn-icon-group">
                        <button class="btn-xs btn-primary" onclick="openClientProposalsModal('${proj.id}')">
                            View Proposals (${proposalCount})
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

function renderUserProposalsTable(bids) {
    const tbody = document.getElementById("userProposalsTableBody");
    if (!tbody) return;

    if (bids.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 24px; color: var(--text-secondary);">
                    You haven't submitted any project proposals yet. Explore available jobs on the marketplace to bid.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = bids.map(bid => {
        const statusClass = bid.status === "accepted" ? "status-accepted" : (bid.status === "pending" ? "status-pending" : "status-rejected");
        const escrowClass = bid.escrowState === "Held in Escrow" ? "status-approved" : "status-pending";
        const formattedDate = new Date(bid.date).toLocaleDateString();

        return `
            <tr>
                <td><strong>${escapeHtml(bid.projectTitle)}</strong></td>
                <td><strong style="color: var(--accent-emerald);">${formatCurrency(bid.bid)}</strong></td>
                <td>${escapeHtml(bid.timeline)}</td>
                <td>${formattedDate}</td>
                <td><span class="status-pill ${statusClass}">${capitalize(bid.status)}</span></td>
                <td><span class="status-pill ${escrowClass}">${escapeHtml(bid.escrowState)}</span></td>
            </tr>
        `;
    }).join("");
}

function renderUserBookmarks() {
    const grid = document.getElementById("userSavedProjectsGrid");
    if (!grid) return;

    const bookmarkedProjects = projectsData.filter(p => bookmarksSet.has(p.id));

    if (bookmarkedProjects.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 36px 20px; color: var(--text-secondary);">
                No bookmarked projects. Click the bookmark icon on any project card to save it here.
            </div>
        `;
        return;
    }

    grid.innerHTML = bookmarkedProjects.map(project => {
        return `
            <article class="project-card" data-id="${project.id}">
                <div>
                    <div class="card-top">
                        <span class="card-category-badge">${escapeHtml(project.category)}</span>
                        <button class="card-bookmark-btn bookmarked" onclick="toggleBookmark('${project.id}')" title="Remove Bookmark">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </button>
                    </div>
                    <h3>${escapeHtml(project.title)}</h3>
                    <p class="project-desc">${escapeHtml(project.description)}</p>
                </div>
                <div class="card-footer">
                    <span class="budget-val">${formatCurrency(project.budget)}</span>
                    <button class="btn btn-primary btn-sm" onclick="openApplyModal('${project.id}')">Apply Now</button>
                </div>
            </article>
        `;
    }).join("");
}

function populateUserProfileForm() {
    if (!currentUser) return;

    const staticAvatar = document.getElementById("userProfileStaticAvatar");
    const staticName = document.getElementById("userProfileStaticName");
    const staticRole = document.getElementById("userProfileStaticRole");
    const staticEmail = document.getElementById("userProfileStaticEmail");

    if (staticAvatar) staticAvatar.src = currentUser.avatar;
    if (staticName) staticName.textContent = currentUser.name;
    if (staticRole) staticRole.textContent = `${currentUser.role} Account`;
    if (staticEmail) staticEmail.textContent = currentUser.email;

    const nameInput = document.getElementById("editProfileName");
    const titleInput = document.getElementById("editProfileTitle");
    const hourlyInput = document.getElementById("editProfileHourly");
    const skillsInput = document.getElementById("editProfileSkills");
    const bioInput = document.getElementById("editProfileBio");

    if (nameInput) nameInput.value = currentUser.name || "";
    if (titleInput) titleInput.value = currentUser.title || "";
    if (hourlyInput) hourlyInput.value = currentUser.hourlyRate || "";
    if (skillsInput) skillsInput.value = (currentUser.skills || []).join(", ");
    if (bioInput) bioInput.value = currentUser.bio || "";
}

function handleUserProfileUpdate(e) {
    e.preventDefault();
    if (!currentUser) return;

    const name = document.getElementById("editProfileName").value.trim();
    const title = document.getElementById("editProfileTitle").value.trim();
    const hourly = document.getElementById("editProfileHourly").value.trim();
    const skillsStr = document.getElementById("editProfileSkills").value.trim();
    const bio = document.getElementById("editProfileBio").value.trim();

    currentUser.name = name;
    currentUser.title = title;
    currentUser.hourlyRate = hourly;
    currentUser.bio = bio;
    currentUser.skills = skillsStr.split(",").map(s => s.trim()).filter(s => s.length > 0);

    // Save to user directory
    const idx = usersData.findIndex(u => u.id === currentUser.id);
    if (idx !== -1) {
        usersData[idx] = { ...usersData[idx], ...currentUser };
        saveUsersToStorage();
    }

    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(currentUser));
    logAuditEvent(`User profile updated: ${currentUser.name}`);
    updateUserNavUI();
    populateUserProfileForm();

    showToast("Profile settings saved successfully!", "success");
}

// --------------------------------------------------------------------------
// 12. Client Proposals Inspection & Candidate Hiring Modal
// --------------------------------------------------------------------------
function openClientProposalsModal(projectId) {
    const project = projectsData.find(p => p.id === projectId);
    if (!project) return;

    activeClientViewingProjectId = projectId;
    const modal = document.getElementById("clientProposalsModal");
    const title = document.getElementById("clientProposalsModalTitle");
    const subtitle = document.getElementById("clientProposalsModalSubtitle");
    const container = document.getElementById("clientProposalsList");

    if (title) title.textContent = `Proposals for: ${project.title}`;
    if (subtitle) subtitle.textContent = `Client Budget: ${formatCurrency(project.budget)} • Category: ${project.category}`;

    const proposals = applicationsData.filter(a => a.projectId === projectId);

    if (container) {
        if (proposals.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 32px 16px; color: var(--text-secondary);">
                    No candidates have submitted proposals for this project yet.
                </div>
            `;
        } else {
            container.innerHTML = proposals.map(prop => {
                const statusPill = prop.status === "accepted"
                    ? `<span class="status-pill status-accepted">✓ Hired / Accepted</span>`
                    : (prop.status === "rejected" ? `<span class="status-pill status-rejected">Declined</span>` : `<span class="status-pill status-pending">Pending Review</span>`);

                const hireButton = prop.status === "pending" ? `
                    <button class="btn btn-primary btn-sm" onclick="clientAcceptProposal('${prop.id}')">
                        Accept Proposal & Escrow Funds
                    </button>
                ` : "";

                return `
                    <div style="background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 18px;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                            <div>
                                <h4 style="font-size: 16px; font-weight: 700;">${escapeHtml(prop.freelancerName)}</h4>
                                <span style="font-size: 13px; color: var(--text-secondary);">${escapeHtml(prop.freelancerEmail)}</span>
                            </div>
                            <div style="text-align: right;">
                                <strong style="font-size: 18px; color: var(--accent-emerald);">${formatCurrency(prop.bid)}</strong>
                                <div style="font-size: 12.5px; color: var(--text-muted); margin-top: 2px;">Delivery in ${escapeHtml(prop.timeline)}</div>
                            </div>
                        </div>

                        <div style="margin: 12px 0; font-size: 13.5px; color: var(--text-secondary); background: var(--bg-surface); padding: 12px; border-radius: var(--radius-sm);">
                            "${escapeHtml(prop.coverLetter)}"
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 14px;">
                            <div>
                                ${statusPill}
                                <span class="status-pill status-in-progress" style="margin-left: 6px;">${escapeHtml(prop.escrowState)}</span>
                            </div>
                            ${hireButton}
                        </div>
                    </div>
                `;
            }).join("");
        }
    }

    if (modal) modal.showModal();
}

function closeClientProposalsModal() {
    const modal = document.getElementById("clientProposalsModal");
    if (modal) modal.close();
    activeClientViewingProjectId = null;
}

function clientAcceptProposal(appId) {
    const app = applicationsData.find(a => a.id === appId);
    if (!app) return;

    app.status = "accepted";
    app.escrowState = "Held in Escrow";
    saveApplicationsToStorage();

    // Mark project as in-progress
    const proj = projectsData.find(p => p.id === app.projectId);
    if (proj) {
        proj.status = "in-progress";
        saveProjectsToStorage();
    }

    logAuditEvent(`Proposal accepted: ${app.freelancerName} awarded '${app.projectTitle}' (${formatCurrency(app.bid)} held in Escrow)`);

    showToast(`🎉 Proposal accepted! ${formatCurrency(app.bid)} allocated into secure platform escrow.`, "success");

    // Refresh client proposals modal & user module
    openClientProposalsModal(app.projectId);
    renderUserModule();
}

// --------------------------------------------------------------------------
// 13. ADMIN MODULE IMPLEMENTATION (GOVERNANCE & CONTROL PANEL)
// --------------------------------------------------------------------------
function renderAdminModule() {
    calculateAdminKpis();
    renderAdminProjectsTable();
    renderAdminUsersTable();
    renderAdminProposalsTable();
    renderAdminAuditLogs();
}

function calculateAdminKpis() {
    const kpiUsers = document.getElementById("adminKpiUsers");
    const kpiProjects = document.getElementById("adminKpiProjects");
    const kpiPending = document.getElementById("adminKpiPending");
    const kpiEscrow = document.getElementById("adminKpiEscrow");

    const pendingCount = projectsData.filter(p => p.status === "pending").length;

    // Escrow volume = sum of bids in accepted/escrow state
    const escrowSum = applicationsData
        .filter(a => a.status === "accepted" || a.escrowState === "Held in Escrow")
        .reduce((sum, a) => sum + (parseFloat(a.bid) || 0), 0);

    if (kpiUsers) kpiUsers.textContent = usersData.length;
    if (kpiProjects) kpiProjects.textContent = projectsData.length;
    if (kpiPending) kpiPending.textContent = pendingCount;
    if (kpiEscrow) kpiEscrow.textContent = formatCurrency(escrowSum);

    // Update tab badges
    const bProjects = document.getElementById("adminBadgeProjects");
    const bUsers = document.getElementById("adminBadgeUsers");
    const bProposals = document.getElementById("adminBadgeProposals");
    if (bProjects) bProjects.textContent = projectsData.length;
    if (bUsers) bUsers.textContent = usersData.length;
    if (bProposals) bProposals.textContent = applicationsData.length;
}

function switchAdminTab(tabName) {
    const tabs = ["projects", "users", "proposals", "logs"];
    tabs.forEach(tab => {
        const btn = document.getElementById(`adminTabBtn${capitalize(tab)}`);
        const pane = document.getElementById(`adminTabContent${capitalize(tab)}`);
        if (btn) btn.classList.toggle("active", tab === tabName);
        if (pane) pane.style.display = tab === tabName ? "block" : "none";
    });
}

function renderAdminProjectsTable() {
    const tbody = document.getElementById("adminProjectsTableBody");
    const filterSelect = document.getElementById("adminProjectStatusFilter");
    if (!tbody) return;

    const filterVal = filterSelect ? filterSelect.value : "all";
    let list = [...projectsData];

    if (filterVal !== "all") {
        list = list.filter(p => p.status === filterVal);
    }

    if (list.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 24px; color: var(--text-secondary);">
                    No projects found for the selected moderation status.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = list.map(proj => {
        const statusClass = proj.status === "approved" ? "status-approved" : (proj.status === "pending" ? "status-pending" : "status-rejected");
        const clientName = proj.client ? proj.client.name : "Anonymous Client";

        return `
            <tr>
                <td><strong>${escapeHtml(proj.title)}</strong></td>
                <td>${escapeHtml(clientName)}</td>
                <td>${escapeHtml(proj.category)}</td>
                <td><strong>${formatCurrency(proj.budget)}</strong></td>
                <td><span class="status-pill ${statusClass}">${capitalize(proj.status)}</span></td>
                <td>
                    <div class="btn-icon-group">
                        ${proj.status !== "approved" ? `
                            <button class="btn-xs btn-success" onclick="adminApproveProject('${proj.id}')" title="Approve Project">
                                ✓ Approve
                            </button>
                        ` : `
                            <button class="btn-xs btn-secondary" onclick="adminRejectProject('${proj.id}')" title="Unpublish / Reject">
                                ✕ Take Down
                            </button>
                        `}
                        <button class="btn-xs btn-danger" onclick="adminDeleteProject('${proj.id}')" title="Delete Project">
                            Delete
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

function adminApproveProject(projId) {
    const proj = projectsData.find(p => p.id === projId);
    if (!proj) return;

    proj.status = "approved";
    saveProjectsToStorage();
    logAuditEvent(`Admin approved project: '${proj.title}'`);
    showToast(`Project '${proj.title}' approved and published to marketplace.`, "success");

    calculateAdminKpis();
    renderAdminProjectsTable();
    applyFilters();
}

function adminRejectProject(projId) {
    const proj = projectsData.find(p => p.id === projId);
    if (!proj) return;

    proj.status = "rejected";
    saveProjectsToStorage();
    logAuditEvent(`Admin rejected project: '${proj.title}'`);
    showToast(`Project '${proj.title}' set to rejected.`, "info");

    calculateAdminKpis();
    renderAdminProjectsTable();
    applyFilters();
}

function adminDeleteProject(projId) {
    const proj = projectsData.find(p => p.id === projId);
    if (!proj) return;

    if (confirm(`Are you sure you want to permanently delete '${proj.title}'?`)) {
        projectsData = projectsData.filter(p => p.id !== projId);
        saveProjectsToStorage();
        logAuditEvent(`Admin deleted project: '${proj.title}'`);
        showToast("Project deleted from platform.", "info");

        calculateAdminKpis();
        renderAdminProjectsTable();
        applyFilters();
    }
}

function renderAdminUsersTable() {
    const tbody = document.getElementById("adminUsersTableBody");
    if (!tbody) return;

    tbody.innerHTML = usersData.map(user => {
        const isSuspended = user.status === "Suspended";
        const statusPill = isSuspended
            ? `<span class="status-pill status-suspended">Suspended</span>`
            : `<span class="status-pill status-active">Active</span>`;

        const roleClass = user.role === "Admin" ? "status-role-admin" : (user.role === "Client" ? "status-role-client" : "status-role-freelancer");

        return `
            <tr>
                <td>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <img src="${user.avatar}" alt="${escapeHtml(user.name)}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">
                        <div>
                            <strong>${escapeHtml(user.name)}</strong>
                            <div style="font-size: 12px; color: var(--text-muted);">${escapeHtml(user.title || user.role)}</div>
                        </div>
                    </div>
                </td>
                <td>${escapeHtml(user.email)}</td>
                <td><span class="status-pill ${roleClass}">${escapeHtml(user.role)}</span></td>
                <td>${statusPill}</td>
                <td>${escapeHtml(user.joinedDate || "2026-01-01")}</td>
                <td>
                    <div class="btn-icon-group">
                        <button class="btn-xs ${isSuspended ? 'btn-success' : 'btn-secondary'}" onclick="adminToggleUserStatus('${user.id}')">
                            ${isSuspended ? 'Reactivate' : 'Suspend'}
                        </button>
                        <button class="btn-xs btn-secondary" onclick="adminChangeUserRole('${user.id}')" title="Change Role">
                            Role ↻
                        </button>
                        ${user.id !== (currentUser ? currentUser.id : '') ? `
                            <button class="btn-xs btn-danger" onclick="adminDeleteUser('${user.id}')">
                                Delete
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;
    }).join("");
}

function adminToggleUserStatus(userId) {
    const user = usersData.find(u => u.id === userId);
    if (!user) return;

    user.status = user.status === "Active" ? "Suspended" : "Active";
    saveUsersToStorage();
    logAuditEvent(`Admin changed user status: ${user.name} is now ${user.status}`);

    showToast(`User ${user.name} is now ${user.status}.`, user.status === "Active" ? "success" : "warning");

    // If current session was suspended, log out
    if (currentUser && currentUser.id === userId && user.status === "Suspended") {
        logoutUser();
    } else {
        renderAdminUsersTable();
    }
}

function adminChangeUserRole(userId) {
    const user = usersData.find(u => u.id === userId);
    if (!user) return;

    const roles = ["Freelancer", "Client", "Admin"];
    const nextRole = roles[(roles.indexOf(user.role) + 1) % roles.length];

    user.role = nextRole;
    saveUsersToStorage();
    logAuditEvent(`Admin updated user role: ${user.name} is now a ${nextRole}`);

    showToast(`User ${user.name} role changed to ${nextRole}.`, "info");
    renderAdminUsersTable();
    updateUserNavUI();
}

function adminDeleteUser(userId) {
    const user = usersData.find(u => u.id === userId);
    if (!user) return;

    if (confirm(`Are you sure you want to permanently delete user '${user.name}' (${user.email})?`)) {
        usersData = usersData.filter(u => u.id !== userId);
        saveUsersToStorage();
        logAuditEvent(`Admin deleted user: ${user.name}`);
        showToast("User account removed.", "info");

        calculateAdminKpis();
        renderAdminUsersTable();
    }
}

function openCreateUserModal() {
    const modal = document.getElementById("adminCreateUserModal");
    if (modal) modal.showModal();
}

function closeCreateUserModal() {
    const modal = document.getElementById("adminCreateUserModal");
    if (modal) modal.close();
}

function handleAdminCreateUser(e) {
    e.preventDefault();

    const name = document.getElementById("newUserName").value.trim();
    const email = document.getElementById("newUserEmail").value.trim().toLowerCase();
    const password = document.getElementById("newUserPassword").value;
    const role = document.getElementById("newUserRole").value;

    if (!name || !email || !password) {
        showToast("Please fill all required fields.", "warning");
        return;
    }

    if (usersData.some(u => u.email.toLowerCase() === email)) {
        showToast("A user with this email address already exists.", "warning");
        return;
    }

    const newUser = {
        id: "usr-" + Date.now(),
        name,
        email,
        password,
        role,
        status: "Active",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80",
        joinedDate: new Date().toISOString().substring(0, 10),
        title: role === "Admin" ? "Platform Administrator" : (role === "Client" ? "Client Representative" : "Contractor")
    };

    usersData.unshift(newUser);
    saveUsersToStorage();
    logAuditEvent(`Admin created user: ${name} (${email}) as ${role}`);

    closeCreateUserModal();
    e.target.reset();

    showToast(`User account created for ${name} (${role}).`, "success");
    calculateAdminKpis();
    renderAdminUsersTable();
}

function renderAdminProposalsTable() {
    const tbody = document.getElementById("adminProposalsTableBody");
    if (!tbody) return;

    if (applicationsData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 24px; color: var(--text-secondary);">
                    No proposals submitted yet across the platform.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = applicationsData.map(app => {
        const statusClass = app.status === "accepted" ? "status-accepted" : (app.status === "pending" ? "status-pending" : "status-rejected");
        const escrowClass = app.escrowState === "Held in Escrow" ? "status-approved" : "status-pending";

        return `
            <tr>
                <td><strong>${escapeHtml(app.projectTitle)}</strong></td>
                <td>
                    <strong>${escapeHtml(app.freelancerName)}</strong>
                    <div style="font-size: 12px; color: var(--text-muted);">${escapeHtml(app.freelancerEmail)}</div>
                </td>
                <td><strong style="color: var(--accent-emerald);">${formatCurrency(app.bid)}</strong></td>
                <td>${escapeHtml(app.timeline)}</td>
                <td><span class="status-pill ${statusClass}">${capitalize(app.status)}</span></td>
                <td><span class="status-pill ${escrowClass}">${escapeHtml(app.escrowState)}</span></td>
            </tr>
        `;
    }).join("");
}

function renderAdminAuditLogs() {
    const container = document.getElementById("adminAuditLogsList");
    if (!container) return;

    if (auditLogsData.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 24px; color: var(--text-secondary);">
                Audit log is currently empty.
            </div>
        `;
        return;
    }

    container.innerHTML = auditLogsData.map(item => {
        return `
            <div class="audit-item">
                <span class="audit-dot"></span>
                <span>${escapeHtml(item.text)}</span>
                <span class="audit-time">${escapeHtml(item.time)}</span>
            </div>
        `;
    }).join("");
}

function clearAuditLogs() {
    if (confirm("Are you sure you want to clear system audit history?")) {
        auditLogsData = [];
        saveLogsToStorage();
        renderAdminAuditLogs();
        showToast("Audit logs cleared.", "info");
    }
}

function refreshAdminData() {
    calculateAdminKpis();
    renderAdminProjectsTable();
    renderAdminUsersTable();
    renderAdminProposalsTable();
    renderAdminAuditLogs();
    showToast("Dashboard data refreshed.", "info");
}

// --------------------------------------------------------------------------
// 14. Event Listeners & Light-Dismiss Dialogs
// --------------------------------------------------------------------------
function initEventListeners() {
    // Category pills
    const categoryContainer = document.getElementById("categoryFilters");
    if (categoryContainer) {
        categoryContainer.addEventListener("click", (e) => {
            const pill = e.target.closest(".category-pill");
            if (!pill) return;

            categoryContainer.querySelectorAll(".category-pill").forEach(p => p.classList.remove("active"));
            pill.classList.add("active");

            activeFilter.category = pill.dataset.category;
            applyFilters();
        });
    }

    // Hero search input
    const heroInput = document.getElementById("heroSearchInput");
    if (heroInput) {
        heroInput.addEventListener("input", debounce((e) => {
            activeFilter.search = e.target.value.trim();
            applyFilters();
        }, 250));

        heroInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                triggerHeroSearch();
            }
        });
    }

    // Budget selector
    const budgetSelect = document.getElementById("budgetFilter");
    if (budgetSelect) {
        budgetSelect.addEventListener("change", (e) => {
            activeFilter.budget = e.target.value;
            applyFilters();
        });
    }

    // Sort selector
    const sortSelect = document.getElementById("sortFilter");
    if (sortSelect) {
        sortSelect.addEventListener("change", (e) => {
            activeFilter.sort = e.target.value;
            applyFilters();
        });
    }

    // Mobile menu toggle
    const mobileBtn = document.getElementById("mobileMenuBtn");
    const navLinks = document.getElementById("navLinks");
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener("click", () => {
            navLinks.classList.toggle("open");
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => navLinks.classList.remove("open"));
        });
    }

    // Post Project Form
    const projectForm = document.getElementById("projectForm");
    if (projectForm) {
        projectForm.addEventListener("submit", handlePostProject);
    }

    // Light-dismiss dialogs when clicking outside modal box
    ["applyModal", "profileModal", "authModal", "clientProposalsModal", "adminCreateUserModal"].forEach(modalId => {
        const dialog = document.getElementById(modalId);
        if (dialog) {
            dialog.addEventListener("click", (e) => {
                const rect = dialog.getBoundingClientRect();
                const isInDialog = (
                    rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
                    rect.left <= e.clientX && e.clientX <= rect.left + rect.width
                );
                if (!isInDialog) {
                    dialog.close();
                }
            });
        }
    });
}

// --------------------------------------------------------------------------
// 15. Freelancer Profile Modal
// --------------------------------------------------------------------------
function openProfileModal(freelancerId) {
    const freelancer = INITIAL_FREELANCERS.find(f => f.id === freelancerId);
    if (!freelancer) return;

    const modal = document.getElementById("profileModal");
    const content = document.getElementById("profileModalContent");

    if (content) {
        const skillsHtml = freelancer.skills
            .map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`)
            .join("");

        content.innerHTML = `
            <div class="profile-modal-hero" style="display: flex; gap: 18px; align-items: center; margin-bottom: 20px;">
                <img src="${freelancer.avatar}" alt="${escapeHtml(freelancer.name)}" class="profile-modal-avatar" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover;">
                <div>
                    <h2 style="font-size: 22px; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
                        ${escapeHtml(freelancer.name)}
                        <span style="color: var(--secondary);">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                        </span>
                    </h2>
                    <p style="color: var(--primary-light); font-weight: 600; font-size: 14.5px;">${escapeHtml(freelancer.title)}</p>
                    <div style="font-size: 14px; color: var(--accent-amber); margin-top: 4px;">
                        ★ ${freelancer.rating} <span style="color: var(--text-muted);">(${freelancer.reviewsCount} verified reviews)</span>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: var(--bg-surface-elevated); padding: 14px 18px; border-radius: var(--radius-md); margin-bottom: 16px;">
                <div>
                    <span style="font-size: 12px; color: var(--text-muted); display: block;">Hourly Rate</span>
                    <strong style="font-size: 16px; color: var(--text-primary);">${freelancer.hourlyRate}</strong>
                </div>
                <div>
                    <span style="font-size: 12px; color: var(--text-muted); display: block;">Completed Projects</span>
                    <strong style="font-size: 16px; color: var(--text-primary);">${freelancer.completedJobs} projects</strong>
                </div>
            </div>

            <div style="margin-bottom: 16px;">
                <h4 style="font-size: 15px; margin-bottom: 8px; color: var(--text-primary);">About</h4>
                <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.6;">${escapeHtml(freelancer.bio)}</p>
            </div>

            <div style="margin-bottom: 16px;">
                <h4 style="font-size: 15px; margin-bottom: 10px; color: var(--text-primary);">Core Competencies</h4>
                <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                    ${skillsHtml}
                </div>
            </div>

            <div style="background: var(--bg-surface-elevated); border-left: 3px solid var(--primary); padding: 12px 16px; border-radius: var(--radius-sm); margin-bottom: 18px;">
                <span style="font-size: 12px; color: var(--text-muted); display: block; margin-bottom: 4px;">Featured Client Endorsement</span>
                <p style="font-size: 13.5px; font-style: italic; color: var(--text-secondary);">${escapeHtml(freelancer.topReview)}</p>
            </div>

            <div style="display: flex; gap: 12px;">
                <button class="btn btn-secondary" style="flex: 1;" onclick="closeProfileModal()">Close</button>
                <button class="btn btn-primary" style="flex: 2;" onclick="showToast('Direct interview request sent to ${escapeHtml(freelancer.name)}!', 'success'); closeProfileModal();">
                    Hire ${escapeHtml(freelancer.name)}
                </button>
            </div>
        `;
    }

    if (modal) modal.showModal();
}

function closeProfileModal() {
    const modal = document.getElementById("profileModal");
    if (modal) modal.close();
}

// --------------------------------------------------------------------------
// 16. Ambient Toast Notification Engine
// --------------------------------------------------------------------------
function showToast(message, type = "success", duration = 3500) {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;

    let iconSvg = "";
    if (type === "success") {
        iconSvg = `
            <svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        `;
    } else if (type === "warning") {
        iconSvg = `
            <svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
        `;
    } else {
        iconSvg = `
            <svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
        `;
    }

    toast.innerHTML = `
        ${iconSvg}
        <span style="flex: 1;">${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(10px)";
        toast.style.transition = "all 0.3s ease";
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// --------------------------------------------------------------------------
// 17. Utilities & Smooth Scrolling
// --------------------------------------------------------------------------
function scrollToProjects() {
    navigateToModule("marketplace");
    setTimeout(() => {
        const el = document.getElementById("projects");
        if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
}

function scrollToPostProject() {
    userSwitchToPostProject();
}

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

function escapeHtml(str) {
    if (!str) return "";
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
}

function formatCurrency(val) {
    const num = parseFloat(val);
    if (isNaN(num)) return "₹0";
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(num);
}

function capitalize(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}