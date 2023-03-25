import { PageHeader } from '@/components/PageHeader';
import { PageLayoutProps } from '@/types/props';

export const PageLayout = ({ children }: PageLayoutProps) => {
    return (
        <main>
            <PageHeader />
            {children}
        </main>
    );
};
