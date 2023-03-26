import { PageHeader } from '@/components/PageHeader';
import { PageLayoutProps } from '@/types/props';

export const PageLayout = ({ children }: PageLayoutProps) => {
    return (
        <main className="grid grid-cols-12 pt-20 px-8 mx-auto h-screen gap-10 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <PageHeader />
            <div
                id="content"
                className="col-span-9 overflow-y-scroll scrollbar-hide"
            >
                {children}
            </div>
        </main>
    );
};
