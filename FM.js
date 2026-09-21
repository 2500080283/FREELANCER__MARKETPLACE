/* ==========================================================================
   FREELANCEHUB — Application Logic & Interactivity
   State management, LocalStorage persistence, native modals, toasts, & filters
   ========================================================================== */

// --------------------------------------------------------------------------
// Seed Data
// --------------------------------------------------------------------------
const INITIAL_PROJECTS = [
    {
        id: "proj-1",
        title: "Full-Stack SaaS Analytics Dashboard in Next.js & Supabase",
        category: "Web Development",
        budget: 38000,
        description: "Looking for an expert React/Next.js developer to construct a high-performance analytics dashboard with chart visualisations, Supabase authentication, and Stripe subscriptions.",
        skills: ["Next.js", "React", "TypeScript", "TailwindCSS", "Supabase"],
        postedTime: "2 hours ago",
        client: { name: "MetricFlow Technologies", verified: true, rating: 4.9, country: "India" },
        proposalsCount: 8
    },
    {
        id: "proj-2",
        title: "Fintech Mobile App UI/UX Design System & Interactive Prototypes",
        category: "UI/UX & Design",
        budget: 22000,
        description: "Need a comprehensive, modern design system in Figma for a personal wealth management application. Requires responsive mobile screens, dark/light modes, and design tokens.",
        skills: ["Figma", "UI/UX", "Design Systems", "Prototyping", "Mobile Design"],
        postedTime: "4 hours ago",
        client: { name: "Aura Capital", verified: true, rating: 5.0, country: "India" },
        proposalsCount: 12
    },
    {
        id: "proj-3",
        title: "Cross-Platform Food Delivery Application with Flutter & Firebase",
        category: "Mobile Apps",
        budget: 45000,
        description: "Developing an on-demand delivery app for iOS and Android. Features include real-time live order tracking via Google Maps, Razorpay integration, and push notifications.",
        skills: ["Flutter", "Dart", "Firebase", "Google Maps API", "REST APIs"],
        postedTime: "6 hours ago",
        client: { name: "QuickBite Logistics", verified: true, rating: 4.8, country: "India" },
        proposalsCount: 5
    },
    {
        id: "proj-4",
        title: "AI Customer Support Assistant with LangChain & OpenAI API",
        category: "AI & Data",
        budget: 52000,
        description: "Build an enterprise customer support pipeline that performs semantic document retrieval from our knowledge base using vector embeddings and LangChain with streaming responses.",
        skills: ["Python", "LangChain", "OpenAI", "FastAPI", "VectorDB"],
        postedTime: "12 hours ago",
        client: { name: "NexusAI Solutions", verified: true, rating: 4.9, country: "India" },
        proposalsCount: 9
    },
    {
        id: "proj-5",
        title: "E-Commerce Lifestyle Store Redesign & Webflow Setup",
        category: "Web Development",
        budget: 16000,
        description: "Redesign our artisanal goods brand storefront on Webflow. Needs clean typography, subtle micro-interactions, smooth scroll transitions, and mobile responsiveness.",
        skills: ["Webflow", "HTML/CSS", "JavaScript", "E-Commerce", "Responsive"],
        postedTime: "1 day ago",
        client: { name: "Verve Studio", verified: true, rating: 4.7, country: "India" },
        proposalsCount: 14
    },
    {
        id: "proj-6",
        title: "Predictive Customer Churn Machine Learning Pipeline",
        category: "AI & Data",
        budget: 32000,
        description: "Construct an end-to-end churn prediction pipeline using historical user telemetry. Requires data preprocessing, feature engineering, model selection, and Dockerized deployment.",
        skills: ["Python", "Scikit-Learn", "Pandas", "Docker", "Machine Learning"],
        postedTime: "2 days ago",
        client: { name: "SaaSify Insights", verified: true, rating: 4.8, country: "India" },
        proposalsCount: 4
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

// --------------------------------------------------------------------------
// Local Storage Keys & State
// --------------------------------------------------------------------------
const STORAGE_KEYS = {
    PROJECTS: "freelancehub_projects_v2",
    BOOKMARKS: "freelancehub_bookmarks_v2",
    APPLICATIONS: "freelancehub_applications_v2",
    THEME: "freelancehub_theme_v2",
    USER: "freelancehub_user_v2"
};

let projectsData = [];
let bookmarksSet = new Set();
let activeFilter = {
    category: "All",
    search: "",
    budget: "all",
    sort: "newest"
};
let currentUser = null;
let activeApplyProjectId = null;

// --------------------------------------------------------------------------
// Initialization
// --------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    loadStoredData();
    initEventListeners();
    initLivePreview();
    applyFilters();
    renderFreelancers(INITIAL_FREELANCERS);
});

// --------------------------------------------------------------------------
// Theme Toggle & Persistence
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
            showToast(`Switched to ${newTheme === "dark" ? "Dark" : "Light"} mode`, "info");
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
// Storage & Data Loading
// --------------------------------------------------------------------------
function loadStoredData() {
    // Projects
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

    // Bookmarks
    const storedBookmarks = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    if (storedBookmarks) {
        try {
            bookmarksSet = new Set(JSON.parse(storedBookmarks));
        } catch (e) {
            bookmarksSet = new Set();
        }
    }

    // User Auth State
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (storedUser) {
        try {
            currentUser = JSON.parse(storedUser);
            updateUserNavUI();
        } catch (e) {
            currentUser = null;
        }
    }
}

function saveProjectsToStorage() {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projectsData));
}

function saveBookmarksToStorage() {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify([...bookmarksSet]));
}

// --------------------------------------------------------------------------
// Render Functions
// --------------------------------------------------------------------------
function renderProjects(projectsToDisplay) {
    const container = document.getElementById("project-list");
    if (!container) return;

    if (projectsToDisplay.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <h3>No matching projects found</h3>
                <p>Try adjusting your search criteria or clearing active filters.</p>
                <button class="btn btn-secondary btn-sm" style="margin-top: 14px;" onclick="resetFilters()">
                    Reset All Filters
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = projectsToDisplay.map(project => {
        const isBookmarked = bookmarksSet.has(project.id);
        const formattedBudget = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(project.budget);

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

// --------------------------------------------------------------------------
// Filtering & Search
// --------------------------------------------------------------------------
function applyFilters() {
    let results = [...projectsData];

    // Category Filter
    if (activeFilter.category && activeFilter.category !== "All") {
        results = results.filter(p => p.category === activeFilter.category);
    }

    // Search Query (title, description, or skills)
    if (activeFilter.search.trim()) {
        const query = activeFilter.search.toLowerCase().trim();
        results = results.filter(p => {
            const titleMatch = p.title.toLowerCase().includes(query);
            const descMatch = p.description.toLowerCase().includes(query);
            const skillsMatch = p.skills && p.skills.some(s => s.toLowerCase().includes(query));
            return titleMatch || descMatch || skillsMatch;
        });
    }

    // Budget Filter
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
    // "newest" preserves insertion order

    renderProjects(results);
}

function filterByTag(tag) {
    activeFilter.search = tag;
    const heroInput = document.getElementById("heroSearchInput");
    if (heroInput) heroInput.value = tag;

    // Reset category to All
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
    showToast("Filters reset to default", "info");
}

function triggerHeroSearch() {
    const input = document.getElementById("heroSearchInput");
    if (input) {
        activeFilter.search = input.value;
        applyFilters();
        scrollToProjects();
    }
}

// --------------------------------------------------------------------------
// Event Listeners Setup
// --------------------------------------------------------------------------
function initEventListeners() {
    // Hero search input typing
    const heroInput = document.getElementById("heroSearchInput");
    if (heroInput) {
        heroInput.addEventListener("input", debounce((e) => {
            activeFilter.search = e.target.value;
            applyFilters();
        }, 250));

        heroInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                triggerHeroSearch();
            }
        });
    }

    // Category pills
    const categoryContainer = document.getElementById("categoryFilters");
    if (categoryContainer) {
        categoryContainer.addEventListener("click", (e) => {
            const pill = e.target.closest(".category-pill");
            if (!pill) return;

            document.querySelectorAll(".category-pill").forEach(p => p.classList.remove("active"));
            pill.classList.add("active");

            activeFilter.category = pill.dataset.category;
            applyFilters();
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

        // Close when a link is clicked
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => navLinks.classList.remove("open"));
        });
    }

    // Post Project Form submission
    const projectForm = document.getElementById("projectForm");
    if (projectForm) {
        projectForm.addEventListener("submit", handlePostProject);
    }

    // Light-dismiss dialogs when clicking outside modal content
    ["applyModal", "profileModal", "authModal"].forEach(modalId => {
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
// Live Preview Box for Post Project
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
                previewBudget.textContent = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
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

// --------------------------------------------------------------------------
// Post Project Handler
// --------------------------------------------------------------------------
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

    const newProject = {
        id: "proj-" + Date.now(),
        title,
        category,
        budget,
        description,
        skills: skills.length > 0 ? skills : ["General Development"],
        postedTime: "Just now",
        client: {
            name: currentUser ? currentUser.name : "Verified Employer",
            verified: true,
            rating: 5.0,
            country: "India"
        },
        proposalsCount: 0
    };

    projectsData.unshift(newProject);
    saveProjectsToStorage();
    applyFilters();

    // Reset Form & Preview
    e.target.reset();
    initLivePreview();

    showToast("🎉 Project published successfully!", "success");
    scrollToProjects();
}

// --------------------------------------------------------------------------
// Bookmarks
// --------------------------------------------------------------------------
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
}

// --------------------------------------------------------------------------
// Modals Handling (Native <dialog>)
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
        modalBudget.textContent = "Client Budget: " + new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(project.budget);
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

    const bid = document.getElementById("bidAmount").value;
    const timeline = document.getElementById("deliveryDays").value;
    const coverLetter = document.getElementById("coverLetter").value.trim();

    if (!bid || !coverLetter) {
        showToast("Please provide your bid amount and cover letter.", "warning");
        return;
    }

    // Increment proposals count on project
    const project = projectsData.find(p => p.id === activeApplyProjectId);
    if (project) {
        project.proposalsCount = (project.proposalsCount || 0) + 1;
        saveProjectsToStorage();
        applyFilters();
    }

    // Store proposal in storage
    const storedApps = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS) || "[]");
    storedApps.push({
        projectId: activeApplyProjectId,
        projectTitle: project ? project.title : "",
        bid,
        timeline,
        coverLetter,
        date: new Date().toISOString()
    });
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(storedApps));

    closeApplyModal();
    document.getElementById("applyForm").reset();

    showToast("🚀 Application submitted successfully! The client will review your proposal.", "success");
}

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
            <div class="profile-modal-hero">
                <img src="${freelancer.avatar}" alt="${escapeHtml(freelancer.name)}" class="profile-modal-avatar">
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

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: var(--bg-surface-elevated); padding: 14px 18px; border-radius: var(--radius-md);">
                <div>
                    <span style="font-size: 12px; color: var(--text-muted); display: block;">Hourly Rate</span>
                    <strong style="font-size: 16px; color: var(--text-primary);">${freelancer.hourlyRate}</strong>
                </div>
                <div>
                    <span style="font-size: 12px; color: var(--text-muted); display: block;">Completed Projects</span>
                    <strong style="font-size: 16px; color: var(--text-primary);">${freelancer.completedJobs} projects</strong>
                </div>
            </div>

            <div>
                <h4 style="font-size: 15px; margin-bottom: 8px; color: var(--text-primary);">About</h4>
                <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.6;">${escapeHtml(freelancer.bio)}</p>
            </div>

            <div>
                <h4 style="font-size: 15px; margin-bottom: 10px; color: var(--text-primary);">Core Competencies</h4>
                <div style="display: flex; flex-wrap: wrap; gap: 6px;">
                    ${skillsHtml}
                </div>
            </div>

            <div style="background: var(--bg-surface-elevated); border-left: 3px solid var(--primary); padding: 12px 16px; border-radius: var(--radius-sm);">
                <span style="font-size: 12px; color: var(--text-muted); display: block; margin-bottom: 4px;">Featured Client Endorsement</span>
                <p style="font-size: 13.5px; font-style: italic; color: var(--text-secondary);">${escapeHtml(freelancer.topReview)}</p>
            </div>

            <div style="display: flex; gap: 12px; margin-top: 10px;">
                <button class="btn btn-secondary" style="flex: 1;" onclick="closeProfileModal()">Close</button>
                <button class="btn btn-primary" style="flex: 2;" onclick="showToast('Direct contact initiated with ${escapeHtml(freelancer.name)}!', 'success'); closeProfileModal();">
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
// Auth Modal & State
// --------------------------------------------------------------------------
let authMode = "signin";

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
    const modalTitle = document.getElementById("authModalTitle");
    const submitBtn = document.getElementById("authSubmitBtn");

    if (mode === "signin") {
        tabSignIn.classList.add("active");
        tabRegister.classList.remove("active");
        nameGroup.style.display = "none";
        modalTitle.textContent = "Welcome to FreelanceHub";
        submitBtn.textContent = "Sign In";
    } else {
        tabRegister.classList.add("active");
        tabSignIn.classList.remove("active");
        nameGroup.style.display = "flex";
        modalTitle.textContent = "Join FreelanceHub";
        submitBtn.textContent = "Create Account";
    }
}

function handleAuthSubmit(e) {
    e.preventDefault();
    const email = document.getElementById("authEmail").value.trim();
    const nameInput = document.getElementById("authName").value.trim();

    const displayName = authMode === "register" && nameInput ? nameInput : email.split("@")[0];

    currentUser = {
        name: displayName,
        email: email,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"
    };

    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(currentUser));
    updateUserNavUI();
    closeAuthModal();

    showToast(`Welcome back, ${displayName}!`, "success");
}

function updateUserNavUI() {
    const authBtn = document.getElementById("authNavBtn");
    if (!authBtn) return;

    if (currentUser) {
        authBtn.innerHTML = `
            <img src="${currentUser.avatar}" alt="${escapeHtml(currentUser.name)}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover; display: inline-block;">
            <span>${escapeHtml(currentUser.name)}</span>
        `;
        authBtn.title = "Click to log out";
        authBtn.onclick = logoutUser;
    } else {
        authBtn.textContent = "Sign In";
        authBtn.title = "";
        authBtn.onclick = openAuthModal;
    }
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem(STORAGE_KEYS.USER);
    updateUserNavUI();
    showToast("You have been signed out.", "info");
}

// --------------------------------------------------------------------------
// Toast Notification Engine
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
// Navigation Smooth Scrolling
// --------------------------------------------------------------------------
function scrollToProjects() {
    const el = document.getElementById("projects");
    if (el) el.scrollIntoView({ behavior: "smooth" });
}

function scrollToPostProject() {
    const el = document.getElementById("post-project");
    if (el) el.scrollIntoView({ behavior: "smooth" });
}

// --------------------------------------------------------------------------
// Utilities
// --------------------------------------------------------------------------
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