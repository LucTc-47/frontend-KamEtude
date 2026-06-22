import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

export type UserRole = 'client' | 'student' | 'admin' | 'moderator';

// Test UI only: change this value, then log out/log in again to test role-specific pages.
// TODO(backend): remove this switch when Spring Boot authentication provides real roles.
export const MOCK_USER_ROLE: UserRole = 'client';

export interface AppUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  city: string;
  avatar?: string;
  verified: boolean;
  banned: boolean;
  createdAt: string;
}

export interface LocalSession {
  accessToken: string;
  userId: string;
  createdAt: string;
}

interface AuthContextType {
  user: AppUser | null;
  session: LocalSession | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithPhone: (phone: string, otp: string) => Promise<boolean>;
  sendPhoneOtp: (phone: string) => Promise<boolean>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: UserRole;
    city?: string;
    university?: string;
    faculty?: string;
    level?: string;
    bio?: string;
    skills?: string[];
  }) => Promise<{ success: boolean; userId?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const STORAGE_KEY = 'kametud_stub_auth';
const AuthContext = createContext<AuthContextType | null>(null);

const createSession = (userId: string): LocalSession => ({
  accessToken: `stub-token-${userId}`,
  userId,
  createdAt: new Date().toISOString(),
});

const createStubUser = (input: {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  city?: string;
}): AppUser => {
  const email = input.email || 'demo@kametud.local';
  return {
    id: `stub-${btoa(email).replace(/=+$/g, '').toLowerCase()}`,
    firstName: input.firstName || 'Demo',
    lastName: input.lastName || 'KamEtud',
    email,
    phone: input.phone || '',
    role: input.role || MOCK_USER_ROLE,
    city: input.city || 'Dschang',
    verified: (input.role || MOCK_USER_ROLE) === 'student',
    banned: false,
    createdAt: new Date().toISOString(),
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<LocalSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO(backend): reconnecter la restauration de session via Spring Boot (equivalent restauration session ancien fournisseur auth).
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as { user: AppUser; session: LocalSession };
        setUser(parsed.user);
        setSession(parsed.session);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user && session) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, session }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user, session]);

  const login = async (email: string, _password: string): Promise<boolean> => {
    // TODO(backend): reconnecter la connexion email/mot de passe via Spring Boot (endpoint login Spring Boot).
    const nextUser = createStubUser({ email });
    setUser(nextUser);
    setSession(createSession(nextUser.id));
    return true;
  };

  const sendPhoneOtp = async (_phone: string): Promise<boolean> => {
    // TODO(backend): reconnecter l'envoi OTP SMS via Spring Boot (endpoint OTP Spring Boot).
    return true;
  };

  const loginWithPhone = async (phone: string, _otp: string): Promise<boolean> => {
    // TODO(backend): reconnecter la verification OTP via Spring Boot (endpoint verification OTP Spring Boot).
    const nextUser = createStubUser({ phone, email: `${phone.replace(/\D/g, '') || 'phone'}@phone.kametud.local` });
    setUser(nextUser);
    setSession(createSession(nextUser.id));
    return true;
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: UserRole;
    city?: string;
    university?: string;
    faculty?: string;
    level?: string;
    bio?: string;
    skills?: string[];
  }): Promise<{ success: boolean; userId?: string }> => {
    // TODO(backend): reconnecter l'inscription et la creation de profil via Spring Boot (equivalent inscription + creation profil).
    const nextUser = createStubUser(userData);
    setUser(nextUser);
    setSession(createSession(nextUser.id));
    return { success: true, userId: nextUser.id };
  };

  const logout = () => {
    // TODO(backend): reconnecter la deconnexion via Spring Boot (endpoint logout Spring Boot).
    setUser(null);
    setSession(null);
  };

  const value = useMemo<AuthContextType>(() => ({
    user,
    session,
    login,
    loginWithPhone,
    sendPhoneOtp,
    register,
    logout,
    isAuthenticated: !!user,
    loading,
  }), [user, session, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
