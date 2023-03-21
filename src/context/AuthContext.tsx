import { useContext, useEffect, useState, createContext } from 'react';
import auth from '@/firebase/auth/authInit';
import {
    onAuthStateChanged,
    User,
    updateEmail,
    signOut,
    updateProfile,
} from 'firebase/auth';
import { IGithubUser } from '@/pages/signup';

interface IAuthContext {
    currentUser: User | null;
    githubData: IGithubUser | null;
    updateUserEmail: (email: string) => void;
    logout: () => void;
    setGithubData: (data: IGithubUser) => void;
}

const AuthContext = createContext<IAuthContext>({
    currentUser: null,
    githubData: null,
    updateUserEmail(email) {},
    logout() {},
    setGithubData(data) {},
});

interface AuthProviderProps {
    children: string | JSX.Element | JSX.Element[];
}

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [githubData, setGithubData] = useState<IGithubUser | null>(null);
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
        githubData,
        updateUserEmail,
        logout,
        setGithubData,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
