/**
 * LocalStorage Service for FreelanceHub
 * Handles CRUD operations, schema initialization, and data persistence.
 */

import {
  INITIAL_USERS,
  INITIAL_PROJECTS,
  INITIAL_APPLICATIONS,
  INITIAL_AUDIT_LOGS
} from './initialData';

export const STORAGE_KEYS = {
  USERS: "freelancehub_users_v3",
  SESSION: "freelancehub_session_v3",
  PROJECTS: "freelancehub_projects_v3",
  APPLICATIONS: "freelancehub_applications_v3",
  BOOKMARKS: "freelancehub_bookmarks_v3",
  LOGS: "freelancehub_audit_logs_v3",
  THEME: "freelancehub_theme_v2",
  SETTINGS: "freelancehub_settings_v1",
  CATEGORIES: "freelancehub_categories_v1"
};

export const DEFAULT_SETTINGS = {
  platformFeePercent: 10, // 10% platform fee
  autoApproveProjects: true, // Auto-approve or require admin approval
  allowNewRegistrations: true, // User registration open
  maintenanceMode: false, // Maintenance mode banner
  escrowDisputeWindowDays: 14 // Dispute resolution window in days
};

export const DEFAULT_CATEGORIES = [
  'Web Development',
  'Mobile Apps',
  'UI/UX Design',
  'AI & Machine Learning',
  'Cloud & DevOps',
  'Data Science & Analytics',
  'Cybersecurity'
];

// Safe JSON parser
function safeParse(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error(`Error parsing localStorage key "${key}":`, err);
    return fallback;
  }
}

// Initialize LocalStorage with default seeds if empty
export function initLocalStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  } else {
    // Ensure Super Admin Prudhvi is always correctly formatted
    const users = safeParse(STORAGE_KEYS.USERS, INITIAL_USERS);
    const adminIdx = users.findIndex(
      u => u.role === "Admin" || u.username === "prudhvi" || u.email === "prudhvi@freelancehub.com"
    );
    if (adminIdx !== -1) {
      users[adminIdx] = {
        ...users[adminIdx],
        name: "Prudhvi",
        username: "prudhvi",
        email: "prudhvi@freelancehub.com",
        password: "prudhvi@2408",
        role: "Admin",
        status: "Active"
      };
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } else {
      users.unshift({ ...INITIAL_USERS[0] });
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
  }

  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
  }

  if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
  }

  if (!localStorage.getItem(STORAGE_KEYS.LOGS)) {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
  }

  if (!localStorage.getItem(STORAGE_KEYS.BOOKMARKS)) {
    localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify([]));
  }

  if (!localStorage.getItem(STORAGE_KEYS.THEME)) {
    localStorage.setItem(STORAGE_KEYS.THEME, "dark");
  }

  if (!localStorage.getItem(STORAGE_KEYS.SETTINGS)) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  }

  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
  }
}

// ----------------- USERS -----------------
export function getStoredUsers() {
  return safeParse(STORAGE_KEYS.USERS, INITIAL_USERS);
}

export function saveStoredUsers(users) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

// ----------------- SESSION -----------------
export function getStoredSession() {
  return safeParse(STORAGE_KEYS.SESSION, null);
}

export function saveStoredSession(user) {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  }
}

// ----------------- PROJECTS -----------------
export function getStoredProjects() {
  return safeParse(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
}

export function saveStoredProjects(projects) {
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
}

// ----------------- APPLICATIONS -----------------
export function getStoredApplications() {
  return safeParse(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
}

export function saveStoredApplications(apps) {
  localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(apps));
}

// ----------------- BOOKMARKS -----------------
export function getStoredBookmarks() {
  return safeParse(STORAGE_KEYS.BOOKMARKS, []);
}

export function saveStoredBookmarks(bookmarks) {
  localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
}

// ----------------- AUDIT LOGS -----------------
export function getStoredLogs() {
  return safeParse(STORAGE_KEYS.LOGS, INITIAL_AUDIT_LOGS);
}

export function addAuditLog(text) {
  const logs = getStoredLogs();
  const now = new Date();
  const timeStr = now.toISOString().replace("T", " ").substring(0, 16);
  const newLog = {
    id: "log-" + Date.now(),
    time: timeStr,
    text: text
  };
  const updated = [newLog, ...logs].slice(0, 60); // keep recent 60
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(updated));
  return updated;
}

export function clearAuditLogsStorage() {
  const logs = [{
    id: "log-" + Date.now(),
    time: new Date().toISOString().replace("T", " ").substring(0, 16),
    text: "Audit logs history was reset by administrator."
  }];
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  return logs;
}

// ----------------- SETTINGS -----------------
export function getStoredSettings() {
  return safeParse(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
}

export function saveStoredSettings(settings) {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

// ----------------- CATEGORIES -----------------
export function getStoredCategories() {
  return safeParse(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
}

export function saveStoredCategories(categories) {
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
}

// ----------------- FACTORY RESET -----------------
export function resetAllToFactorySeeds() {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
  localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
  localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_AUDIT_LOGS));
  localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify([]));
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));

  return {
    users: INITIAL_USERS,
    projects: INITIAL_PROJECTS,
    applications: INITIAL_APPLICATIONS,
    logs: INITIAL_AUDIT_LOGS,
    bookmarks: [],
    settings: DEFAULT_SETTINGS,
    categories: DEFAULT_CATEGORIES
  };
}

// ----------------- THEME -----------------
export function getStoredTheme() {
  return localStorage.getItem(STORAGE_KEYS.THEME) || "dark";
}

export function saveStoredTheme(theme) {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
}
