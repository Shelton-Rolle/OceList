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
        <div className="outline outline-1 outline-black p-4 m-7 rounded-sm">
            <h2>{issue?.title}</h2>
            <p>{repository?.name}</p>
        </div>
    );
};
