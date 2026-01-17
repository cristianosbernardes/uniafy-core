import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserRole, User } from '@/types/uniafy';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const getRoleFromEmail = (email: string | undefined): UserRole => {
        if (!email) return UserRole.CLIENT;

        const ownerEmails = ['cristiano.sbernardes@gmail.com'];
        const agencyEmails = ['gestor@uniafy.com'];

        if (ownerEmails.includes(email.toLowerCase())) {
            return UserRole.OWNER;
        }

        if (agencyEmails.includes(email.toLowerCase())) {
            return UserRole.AGENCY;
        }

        return UserRole.CLIENT;
    };

    useEffect(() => {
        // Helper function to update user state with subscription
        const updateUserData = async (session: any) => {
            if (session?.user) {
                // Fetch Subscription Data
                const { data: subData } = await supabase
                    .from('subscriptions')
                    .select('*')
                    .eq('tenant_id', session.user.id)
                    .maybeSingle();

                const newUser: User = {
                    id: session.user.id,
                    name: session.user.user_metadata.name || session.user.email?.split('@')[0] || 'Usuário',
                    email: session.user.email || '',
                    role: getRoleFromEmail(session.user.email),
                    avatar: session.user.user_metadata.avatar_url,
                    subscription: subData as any,
                };

                setUser((prev) => {
                    if (JSON.stringify(prev) === JSON.stringify(newUser)) {
                        return prev;
                    }
                    console.log('[AuthContext] User Start/Update:', newUser.email);
                    return newUser;
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        };

        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            updateUserData(session);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            updateUserData(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
