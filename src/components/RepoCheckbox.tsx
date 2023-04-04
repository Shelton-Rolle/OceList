import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { RepositoryCheckboxProps } from '@/types/props';
import { IGithubUser } from '@/types/interfaces';
import { AiFillCheckCircle } from 'react-icons/ai';

export const RepositoryCheckbox = ({ repo }: RepositoryCheckboxProps) => {
    const { githubData, setGithubData } = useAuth();
    const [checked, setChecked] = useState<boolean>(false);

    async function UpdateUserProjects(currentCheckedValue: boolean) {
        let data: IGithubUser = githubData!;
        const projects = [...githubData?.projects];

        if (currentCheckedValue) {
            projects.push(repo);
        } else {
            const index = projects.indexOf(repo);
            projects.splice(index, 1);
        }

        data = {
            ...data,
            projects,
        };

        setGithubData(data);
    }

    return (
        <div className="border-b-2 border-background-light py-3 flex items-center bg-default-light text-background-light pr-5">
            <input
                id={repo.name}
                type="checkbox"
                checked={checked}
                onChange={(e) => {
                    setChecked(e.target.checked);
                    UpdateUserProjects(e.target.checked);
                }}
                className="opacity-0"
            />
            <label
                htmlFor={repo.name}
                className="font-paragraph font-light text-lg w-full flex items-center justify-between cursor-pointer"
            >
                {repo.name} {checked && <AiFillCheckCircle />}
            </label>
        </div>
    );
};
