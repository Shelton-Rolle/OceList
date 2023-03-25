import { ReactNode } from 'react';
import { IUser, Project } from './dataObjects';

export interface AuthProviderProps {
    children: string | JSX.Element | JSX.Element[];
}

export interface ExternalUserProfileProps {
    data: IUser;
}

export interface CurrentUserProfileProps {
    data: IUser;
}

export interface PageLayoutProps {
    children: ReactNode | ReactNode[];
}
export interface RepositoryCheckboxProps {
    repo: Project;
}

export interface ProjectPageProps {
    projectId: string;
    project: Project;
}
