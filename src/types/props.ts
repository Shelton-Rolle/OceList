import { ReactNode } from 'react';
import { DatabaseProjectData, Issue, IUser, Project } from './dataObjects';

export interface AuthProviderProps {
    children: string | JSX.Element | JSX.Element[];
}

export interface BrowsePageProps {
    projects: Project[];
    issues: Issue[];
}

export interface ExternalUserProfileProps {
    data: IUser;
}

export interface CurrentUserProfileProps {
    data: IUser;
}

export interface IssueCardProps {
    issue: Issue;
}

export interface PageLayoutProps {
    children: ReactNode | ReactNode[];
}
export interface RepositoryCheckboxProps {
    repo: Project;
}
export interface ProjectCardProps {
    project: DatabaseProjectData;
}

export interface ProjectPageProps {
    projectId: string;
    project: Project;
}
