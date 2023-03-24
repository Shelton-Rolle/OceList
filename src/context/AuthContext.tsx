import { useContext, useEffect, useState, createContext } from 'react';
import auth from '@/firebase/auth/authInit';
import {
    onAuthStateChanged,
    User,
    updateEmail,
    signOut,
    updatePassword,
    deleteUser,
    updateProfile,
} from 'firebase/auth';
import { IAuthContext, IGithubUser } from '@/types/interfaces';
import { IUser } from '@/types/dataObjects';
import GetUser from '@/database/GetUser';
import { AuthProviderProps } from '@/types/props';
import RemoveUser from '@/database/RemoveUser';
import { useRouter } from 'next/router';

const AuthContext = createContext<IAuthContext>({
    currentUser: null,
    currentUserData: null,
    githubData: null,
    updateUserEmail: async (email) => undefined,
    updateUserPassword(password) {},
    logout() {},
    setGithubData(data) {},
    setCurrentUserData(data) {},
    DeleteAccount: async () => undefined,
    UpdateProfile: async (displayName, photoURL) => undefined,
});

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }: AuthProviderProps) {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [githubData, setGithubData] = useState<IGithubUser | null>(null);
    const [currentUserData, setCurrentUserData] = useState<IUser | null>(null);

    async function updateUserEmail(email: string): Promise<string | undefined> {
        let errorCode: string;

        await updateEmail(currentUser!, email).catch((error) => {
            errorCode = error.code;
        });

        return errorCode!;
    }

    async function logout() {
        await signOut(auth);
    }

    async function updateUserPassword(password: string) {
        await updatePassword(currentUser!, password);
    }

    async function UpdateProfile(displayName?: string, photoURL?: string) {
        let errorCode: string | undefined;
        console.log('Currently Usering User: ', currentUser);
        await updateProfile(currentUser!, {
            displayName,
            photoURL,
        })
            .then(() => {
                console.log('Updated Profile!');
            })
            .catch((error) => {
                console.log('Something went wrong: ', error.code);
                console.log(error);
                errorCode = error.code;
            });

        return errorCode;
    }

    async function DeleteAccount(): Promise<string | undefined> {
        let errorCode: string | undefined;

        await deleteUser(currentUser!)
            .then(async () => {
                await RemoveUser(currentUserData!).then(async (result: any) => {
                    console.log('Remove Result: ', result);
                    if (result?.deleted) {
                        setCurrentUserData(null);
                        router.push('/');
                    }
                });
            })
            .catch((error) => {
                console.log('Initial Error Code: ', error.code);
                errorCode = error.code;
            });

        return errorCode;
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setCurrentUser(user);
                await GetUser(user?.uid).then((userData) => {
                    setCurrentUserData(userData!);
                });
            }
        });

        return unsubscribe;
    }, []);

    const value: IAuthContext = {
        currentUser,
        currentUserData,
        githubData,
        updateUserEmail,
        updateUserPassword,
        logout,
        setGithubData,
        setCurrentUserData,
        DeleteAccount,
        UpdateProfile,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}
