import { Project } from '@/types/dataObjects';
import { IssueCardProps } from '@/types/props';
import React, { useEffect, useState } from 'react';

export const IssueCard = ({ issue }: IssueCardProps) => {
    const [repository, setRepository] = useState<Project>();

    async function fetchRepository() {
        await fetch(issue?.repository_url!)
            .then((res) => res.json())
            .then((res) => setRepository(res))
            .catch((error) => console.error(error));
    }

    useEffect(() => {
        fetchRepository();
    }, []);

    return (
        <div className="outline outline-1 outline-black rounded-sm p-4">
            <h2 className="text-2xl">{issue?.title}</h2>
            <p className="text-sm text-gray-400">{repository?.name}</p>
            <p className="mt-6">{issue?.body}</p>
        </div>
    );
};
