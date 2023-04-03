import { FeedIssueProps } from '@/types/props';
import CardAvatar from './CardAvatar';

export const FeedIssue = ({ issue }: FeedIssueProps) => {
    return (
        <article className="border-b-2 border-x-2 border-default-dark border-opacity-10 px-5 py-8 max-w-lg">
            <div className="grid grid-cols-12 gap-4">
                <CardAvatar
                    src={issue?.repository?.owner?.avatar_url!}
                    alt="owner-avatar"
                />
                <div className="col-span-10">
                    <a href={issue?.html_url}>
                        <h2 className="font-title text-lg font-bold line-cutoff-1 md:text-xl lg:text-2xl">
                            {issue?.title}
                        </h2>
                    </a>
                    <a href={`/projects/${issue?.repository?.id}`}>
                        <p className="font-paragraph text-sm text-accent-dark font-light">
                            {issue?.repository?.name}
                        </p>
                    </a>
                </div>
            </div>
            <div className="mt-7">
                <p className="font-paragraph text-base leading-8 font-light">
                    {issue?.body}
                </p>
            </div>
            <div className="mt-12">
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
        </article>
    );

    // return (
    //     <div>
    //         <a href={issue?.html_url} target="_blank">
    //             <h2>{issue?.title}</h2>
    //         </a>
    //         <p>{repository?.name}</p>
    //         <p>{issue?.body}</p>
    //     </div>
    // );
};
