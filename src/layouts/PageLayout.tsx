import { PageHeader } from '@/components/PageHeader';
import { PageLayoutProps } from '@/types/props';

export const PageLayout = ({ children }: PageLayoutProps) => {
    return (
        <main className="text-default-light">
            <div>
                <PageHeader />
                <div id="content">{children}</div>
            </div>
        </main>
    );
};
