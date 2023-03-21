import { useContext, useEffect, useState, createContext } from 'react';
import auth from '@/firebase/auth/authInit';
import {
    onAuthStateChanged,
    User,
    updateEmail,
    signOut,
    updatePassword,
} from 'firebase/auth';
import { IAuthContext, IGithubUser } from '@/types/interfaces';

const AuthContext = createContext<IAuthContext>({
    currentUser: null,
    githubData: null,
    updateUserEmail(email) {},
    updateUserPassword(password) {},
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

    async function updateUserPassword(password: string) {
        await updatePassword(currentUser!, password);
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
        updateUserPassword,
        logout,
        setGithubData,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
