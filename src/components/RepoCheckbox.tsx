import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { IGithubUser } from '@/pages/signup';

interface RepositoryCheckboxProps {
    repo: any;
}

export const RepositoryCheckbox = ({ repo }: RepositoryCheckboxProps) => {
    const { githubData, setGithubData } = useAuth();
    const [checked, setChecked] = useState<boolean>(false);

    async function UpdateUserProjects(currentCheckedValue: boolean) {
        let data: IGithubUser = githubData!;
        const projects = { ...githubData?.projects };

        if (currentCheckedValue) {
            projects[`${repo.id}`] = repo;
        } else {
            delete projects[`${repo.id}`];
        }

        data = {
            ...data,
            projects,
        };

        setGithubData(data);
    }

    return (
        <div className="flex">
            <input
                id={repo.name}
                type="checkbox"
                checked={checked}
                onChange={(e) => {
                    setChecked(e.target.checked);
                    UpdateUserProjects(e.target.checked);
                }}
            />
            <label htmlFor={repo.name}>{repo.name}</label>
        </div>
    );
};
