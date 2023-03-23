import { Project } from './dataObjects';

export interface AuthProviderProps {
    children: string | JSX.Element | JSX.Element[];
}
export interface RepositoryCheckboxProps {
    repo: Project;
}
