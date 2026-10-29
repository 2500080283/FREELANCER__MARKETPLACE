import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getStoredUsers,
  saveStoredUsers,
  getStoredSession,
  saveStoredSession,
  addAuditLog
} from '../data/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('signin'); // 'signin' | 'register'
  const [loading, setLoading] = useState(true);

  // Load existing session on mount
  useEffect(() => {
    const session = getStoredSession();
    if (session) {
      // Validate that user still exists and is active
      const allUsers = getStoredUsers();
      const matched = allUsers.find(u => u.id === session.id || u.email === session.email);
      if (matched && matched.status !== 'Suspended') {
        setCurrentUser(matched);
      } else {
        saveStoredSession(null);
        setCurrentUser(null);
      }
    }
    setLoading(false);
  }, []);

  const openAuthModal = (tab = 'signin') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const login = (identifier, password) => {
    const users = getStoredUsers();
    const cleanId = identifier.trim().toLowerCase();
    const matched = users.find(u =>
      (u.email.toLowerCase() === cleanId || (u.username && u.username.toLowerCase() === cleanId)) &&
      u.password === password
    );

    if (!matched) {
      throw new Error('Invalid email/username or password. Please check your credentials.');
    }

    if (matched.status === 'Suspended') {
      throw new Error('Your account has been suspended by an administrator. Please contact support.');
    }

    saveStoredSession(matched);
    setCurrentUser(matched);
    addAuditLog(`User "${matched.name}" (${matched.role}) logged into the platform.`);
    closeAuthModal();
    return matched;
  };

  const signup = ({ name, email, password, role = 'Freelancer' }) => {
    const users = getStoredUsers();
    const cleanEmail = email.trim().toLowerCase();

    // Check existing
    const exists = users.some(u => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      throw new Error('An account with this email address already exists. Please sign in instead.');
    }

    const defaultAvatars = {
      Admin: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80',
      Client: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
      Freelancer: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=260&q=80'
    };

    const newUser = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      username: name.trim().toLowerCase().replace(/\s+/g, ''),
      email: cleanEmail,
      password: password,
      role: role,
      status: 'Active',
      avatar: defaultAvatars[role] || defaultAvatars.Freelancer,
      joinedDate: new Date().toISOString().split('T')[0],
      title: role === 'Client' ? 'Project Owner & Client' : (role === 'Admin' ? 'Platform Administrator' : 'Independent Specialist'),
      bio: '',
      hourlyRate: role === 'Freelancer' ? '₹1,500/hr' : undefined,
      skills: role === 'Freelancer' ? ['React', 'JavaScript', 'Web Development'] : []
    };

    const updatedUsers = [...users, newUser];
    saveStoredUsers(updatedUsers);
    saveStoredSession(newUser);
    setCurrentUser(newUser);

    addAuditLog(`New ${role} account registered: "${newUser.name}" (${newUser.email}).`);
    closeAuthModal();
    return newUser;
  };

  const logout = () => {
    if (currentUser) {
      addAuditLog(`User "${currentUser.name}" logged out.`);
    }
    saveStoredSession(null);
    setCurrentUser(null);
  };

  const demoLogin = (roleType) => {
    const users = getStoredUsers();
    let target = null;

    if (roleType === 'admin') {
      target = users.find(u => u.role === 'Admin' || u.username === 'prudhvi') || users[0];
    } else if (roleType === 'client') {
      target = users.find(u => u.role === 'Client') || users[1];
    } else {
      target = users.find(u => u.role === 'Freelancer') || users[2];
    }

    if (target) {
      saveStoredSession(target);
      setCurrentUser(target);
      addAuditLog(`Demo sign-in executed for ${target.name} (${target.role}).`);
      closeAuthModal();
      return target;
    }
  };

  const updateProfile = (data) => {
    if (!currentUser) return;
    const users = getStoredUsers();
    const updatedUser = { ...currentUser, ...data };

    const updatedUsers = users.map(u => u.id === currentUser.id ? updatedUser : u);
    saveStoredUsers(updatedUsers);
    saveStoredSession(updatedUser);
    setCurrentUser(updatedUser);

    addAuditLog(`Profile updated for user "${updatedUser.name}".`);
    return updatedUser;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        authModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        logout,
        demoLogin,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

