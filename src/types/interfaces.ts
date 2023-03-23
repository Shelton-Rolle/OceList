import { User } from 'firebase/auth';
import { IUser } from './dataObjects';

export interface IGithubUser {
    html_url: string | null;
    id: number | null;
    login: string | null;
    public_repos: number | null;
    token: string | undefined;
    projects: any | null;
}

export interface IAuthContext {
    currentUser: User | null;
    currentUserData: IUser | null;
    githubData: IGithubUser | null;
    updateUserEmail: (email: string) => Promise<string | undefined>;
    updateUserPassword: (password: string) => void;
    logout: () => void;
    setGithubData: (data: IGithubUser) => void;
    setCurrentUserData: (data: IUser) => void;
}
