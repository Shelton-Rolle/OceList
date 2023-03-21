import { useContext, useEffect, useState, createContext } from 'react';
import auth from '@/firebase/auth/authInit';
import { onAuthStateChanged, User, updateEmail, signOut } from 'firebase/auth';

interface IAuthContext {
    currentUser: User | null;
    updateUserEmail: (email: string) => void;
    logout: () => void;
}

const AuthContext = createContext<IAuthContext>({
    currentUser: null,
    updateUserEmail(email) {},
    logout() {},
});

interface AuthProviderProps {
    children: string | JSX.Element | JSX.Element[];
}

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    async function updateUserEmail(email: string) {
        await updateEmail(currentUser!, email);
    }

    async function logout() {
        await signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
            }
        });

        return unsubscribe;
    }, []);

    const value: IAuthContext = {
        currentUser,
        updateUserEmail,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
