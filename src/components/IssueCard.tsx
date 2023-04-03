import { IssueCardProps } from '@/types/props';
import CardAvatar from './CardAvatar';
import { Project } from '@/types/dataObjects';
import { useState, useEffect } from 'react';

export default function IssueCard({ issue }: IssueCardProps) {
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
        <article className="w-full max-w-lg border-2 border-secondary-dark rounded-md p-6">
            <div className="h-12 flex justify-between items-center">
                {repository?.owner?.avatar_url && (
                    <CardAvatar
                        src={repository?.owner?.avatar_url}
                        alt="parent repo owner"
                    />
                )}
                <div>
                    <div className="flex items-center gap-3">
                        <div
                            className={`w-3 h-3 rounded-full ${
                                issue?.state === 'open'
                                    ? 'bg-secondary-dark'
                                    : 'bg-red-600'
                            }`}
                        />
                        <p
                            className={`font-paragraph text-xs text-secondary-dark ${
                                issue?.state === 'open'
                                    ? 'text-secondary-dark'
                                    : 'text-red-600'
                            }`}
                        >
                            {issue?.state}
                        </p>
                    </div>
                </div>
            </div>
            <div>
                <h2 className="line-cutoff-1 font-title text-lg mt-2 md:text-2xl font-bold">
                    {issue?.title}
                </h2>
                <a
                    href={`/projects/${repository?.id}`}
                    className="duration-150 cursor-pointer hover:opacity-60"
                >
                    <p className="font-paragraph text-sm text-accent-dark font-light">
                        {repository?.name}
                    </p>
                </a>
            </div>
        </article>
    );
}
