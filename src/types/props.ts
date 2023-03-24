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
export interface RepositoryCheckboxProps {
    repo: Project;
}
