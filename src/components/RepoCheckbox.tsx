import { update } from '@/redux/slices/userSlice';
import { RootState } from '@/redux/store';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

interface RepositoryCheckboxProps {
    repo: any;
}

export const RepositoryCheckbox = ({ repo }: RepositoryCheckboxProps) => {
    const [checked, setChecked] = useState<boolean>(false);
    const { user } = useSelector((state: RootState) => state?.user);
    const dispatch = useDispatch();

    async function UpdateUserProjects(currentCheckedValue: boolean) {
        let userData;
        const projects = { ...user?.projects };

        if (currentCheckedValue) {
            projects[`${repo.id}`] = repo;
        } else {
            delete projects[`${repo.id}`];
        }

        userData = {
            ...user,
            projects,
        };

        dispatch(update(userData));
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
