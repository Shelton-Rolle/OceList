import { Dispatch, ReactNode, SetStateAction } from 'react';
import { DatabaseProjectData, Issue, IUser, Project } from './dataObjects';

export interface AddProjectsProps {
    projects: Project[] | DatabaseProjectData[];
    existingProjects: Project[] | DatabaseProjectData[];
    setModal: Dispatch<SetStateAction<boolean>>;
    userData: IUser;
}

export interface AuthProviderProps {
    children: string | JSX.Element | JSX.Element[];
}

export interface BrowsePageProps {
    projects: DatabaseProjectData[];
    issues: Issue[];
}

export interface ChangeAvatarProps {
    setModal: Dispatch<SetStateAction<boolean>>;
    userData: IUser;
}

export interface ChangeBannerProps {
    setModal: Dispatch<SetStateAction<boolean>>;
    userData: IUser;
}

export interface CurrentUserProfileProps {
    data: IUser;
}

export interface ExternalUserProfileProps {
    data: IUser;
}

export interface IssueCardProps {
    issue: Issue;
}

export interface ModalLayoutProps {
    children: ReactNode | ReactNode[];
}

export interface NewPostProps {
    projects: Project[] | DatabaseProjectData[];
    setModal: Dispatch<SetStateAction<boolean>>;
    userData: IUser;
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
    project: DatabaseProjectData;
    owner: IUser;
}
