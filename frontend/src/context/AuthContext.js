'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEMO_USER = {
  id: 'usr_demo_01',
  name: 'Alex Chen',
  email: 'alex.chen@transformai.local',
  role: 'Product Lead',
  plan: 'Pro Edge Tier',
  avatar: '⚡',
  nodeId: 'node-edge-049',
  memberSince: 'Sept 2026',
  transformationsCount: 18,
};

const DEFAULT_USERS_REGISTRY = [
  {
    ...DEMO_USER,
    password: 'password123',
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // 1. Initialize registered users database if empty
      const storedRegistry = localStorage.getItem('transformai_users_db');
      if (!storedRegistry) {
        localStorage.setItem(
          'transformai_users_db',
          JSON.stringify(DEFAULT_USERS_REGISTRY)
        );
      }

      // 2. Check for active logged-in user
      const storedUser = localStorage.getItem('transformai_auth_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // Default to demo user for seamless out-of-the-box experience
        setUser(DEMO_USER);
        localStorage.setItem('transformai_auth_user', JSON.stringify(DEMO_USER));
      }
    } catch (e) {
      console.error('[AuthContext] Initialization error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const registry = JSON.parse(
            localStorage.getItem('transformai_users_db') || '[]'
          );
          const found = registry.find(
            (u) =>
              u.email.toLowerCase() === email.trim().toLowerCase() &&
              u.password === password
          );

          if (found) {
            const { password: _, ...userData } = found;
            setUser(userData);
            localStorage.setItem('transformai_auth_user', JSON.stringify(userData));
            resolve(userData);
          } else {
            // Check if email exists to give specific feedback
            const emailExists = registry.some(
              (u) => u.email.toLowerCase() === email.trim().toLowerCase()
            );
            if (emailExists) {
              reject(new Error('Incorrect password. Please verify and try again.'));
            } else {
              reject(
                new Error(
                  'No account found with this email. Please sign up or use Demo mode.'
                )
              );
            }
          }
        } catch (err) {
          reject(new Error('Authentication system error.'));
        }
      }, 500); // Realistic slight async delay
    });
  };

  const quickDemoLogin = () => {
    setUser(DEMO_USER);
    localStorage.setItem('transformai_auth_user', JSON.stringify(DEMO_USER));
    return DEMO_USER;
  };

  const signup = async ({ name, email, password, role = 'Executive Lead' }) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const registry = JSON.parse(
            localStorage.getItem('transformai_users_db') || '[]'
          );
          const exists = registry.some(
            (u) => u.email.toLowerCase() === email.trim().toLowerCase()
          );

          if (exists) {
            return reject(
              new Error('An account with this email address already exists.')
            );
          }

          const newUser = {
            id: `usr_${Date.now()}`,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
            role,
            plan: 'Pro Edge Tier',
            avatar: '🚀',
            nodeId: `node-edge-${Math.floor(100 + Math.random() * 900)}`,
            memberSince: 'Just now',
            transformationsCount: 0,
          };

          const updatedRegistry = [...registry, newUser];
          localStorage.setItem(
            'transformai_users_db',
            JSON.stringify(updatedRegistry)
          );

          const { password: _, ...userData } = newUser;
          setUser(userData);
          localStorage.setItem('transformai_auth_user', JSON.stringify(userData));
          resolve(userData);
        } catch (err) {
          reject(new Error('Failed to create account. Please try again.'));
        }
      }, 500);
    });
  };

  const resetPassword = async (email, newPassword) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const registry = JSON.parse(
            localStorage.getItem('transformai_users_db') || '[]'
          );
          const userIdx = registry.findIndex(
            (u) => u.email.toLowerCase() === email.trim().toLowerCase()
          );

          if (userIdx === -1) {
            return reject(
              new Error('We could not find an account associated with this email.')
            );
          }

          registry[userIdx].password = newPassword;
          localStorage.setItem(
            'transformai_users_db',
            JSON.stringify(registry)
          );

          // If current user is the one resetting password, update
          if (user && user.email.toLowerCase() === email.trim().toLowerCase()) {
            const updated = { ...user };
            setUser(updated);
            localStorage.setItem('transformai_auth_user', JSON.stringify(updated));
          }

          resolve(true);
        } catch (err) {
          reject(new Error('Failed to reset password.'));
        }
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('transformai_auth_user');
  };

  const updateProfile = (updatedFields) => {
    if (!user) return;
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem('transformai_auth_user', JSON.stringify(updated));

    // Update in registry too
    try {
      const registry = JSON.parse(
        localStorage.getItem('transformai_users_db') || '[]'
      );
      const idx = registry.findIndex((u) => u.id === user.id);
      if (idx !== -1) {
        registry[idx] = { ...registry[idx], ...updatedFields };
        localStorage.setItem(
          'transformai_users_db',
          JSON.stringify(registry)
        );
      }
    } catch (e) {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        quickDemoLogin,
        signup,
        resetPassword,
        logout,
        updateProfile,
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
