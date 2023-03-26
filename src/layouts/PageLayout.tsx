import { PageHeader } from '@/components/PageHeader';
import { PageLayoutProps } from '@/types/props';

export const PageLayout = ({ children }: PageLayoutProps) => {
    return (
        <main className="grid grid-cols-12 pt-20 px-8 max-w-7xl mx-auto h-screen gap-10">
            <PageHeader />
            <div id="content" className="col-span-9">
                {children}
            </div>
        </main>
    );
};
