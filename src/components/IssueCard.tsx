import { IssueCardProps } from '@/types/props';
import CardAvatar from './CardAvatar';

export default function IssueCard({ issue }: IssueCardProps) {
    return (
        <article className="p-8 bg-white rounded-md border-2 border-accent-light max-md:mx-auto">
            <div>
                <a href={issue?.html_url} className="mb-3">
                    <p className="font-roboto font-bold text-primary-light text-xl line-cutoff-1 w-mobile-card duration-200 hover:underline">
                        {issue?.title}
                    </p>
                </a>
                <a href={issue?.repository?.html_url}>
                    <p className="font-poppins font-medium text-default-light text-sm duration-200 hover:underline">
                        {issue?.repository?.name}
                    </p>
                </a>
            </div>
            <div className="flex items-center gap-2 mt-5">
                <div
                    className={`w-2 h-2 rounded-full ${
                        issue?.state === 'open'
                            ? 'bg-issue-state-open'
                            : 'bg-issue-state-closed'
                    }`}
                />
                <p
                    className={`font-poppins font-normal text-base ${
                        issue?.state === 'open'
                            ? 'text-issue-state-open'
                            : 'text-issue-state-closed'
                    }`}
                >
                    {issue?.state}
                </p>
            </div>
        </article>
    );
}
