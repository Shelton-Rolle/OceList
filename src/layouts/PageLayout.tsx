import PageFooter from '@/components/PageFooter';
import { PageHeader } from '@/components/PageHeader';
import { PageLayoutProps } from '@/types/props';

export const PageLayout = ({ children }: PageLayoutProps) => {
    return (
        <main className="text-default-light flex flex-col justify-between min-h-screen">
            <PageHeader />
            <div
                id="content"
                className="mx-auto md:max-w-tablet lg:max-w-desktop w-full mt-7 md:mt-9 lg:mt-11 max-md:px-6 lg:px-6"
            >
                {children}
            </div>
            <PageFooter />
        </main>
    );
};
