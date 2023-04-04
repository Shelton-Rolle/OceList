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

export interface CardAvatarProps {
    src: string;
    alt: string;
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

export interface FeedIssueProps {
    issue: Issue;
}

export interface IssueCardProps {
    issue: Issue;
}

export interface NavItemProps {
    label: string | ReactNode;
    href: string;
    active: boolean;
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
    modalOpen?: boolean;
}

export interface ProjectCardProps {
    project: DatabaseProjectData;
}
export interface RepositoryCheckboxProps {
    repo: Project;
}
export interface FeedProjectProps {
    project: DatabaseProjectData;
}

export interface ProjectPageProps {
    projectId: string;
    project: DatabaseProjectData;
    owner: IUser;
}
