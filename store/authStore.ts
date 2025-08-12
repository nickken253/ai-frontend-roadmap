// store/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProfile {
    learning_style: string;
    weekly_goal: string;
    preferred_languages: string;
}

interface User {
    id: string;
    fullname?: string;
    username?: string;
    email: string;
    avatar: string;
    role?: 'admin' | 'user';
    googleId?: string;
    githubId?: string;
    is_verified: boolean;
    is_active: boolean;
    profile: UserProfile;
    created_at: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (user: any, token: string) => void;
    logout: () => void;
    setUser: (user: any) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            login: (user, token) => {
                set({ user, token, isAuthenticated: true });
            },
            logout: () => {
                localStorage.removeItem('authToken');
                set({ user: null, token: null, isAuthenticated: false });
            },
            setUser: (user) => set({ user }),
        }),
        {
            name: 'auth-storage', // Tên key trong localStorage
            // KHỐI onRehydrate ĐÃ ĐƯỢC XÓA BỎ
        }
    )
);