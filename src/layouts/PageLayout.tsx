import { PageHeader } from '@/components/PageHeader';
import { useAuth } from '@/context/AuthContext';
import { PageLayoutProps } from '@/types/props';
import { useEffect, useState } from 'react';

export const PageLayout = ({ children }: PageLayoutProps) => {
    const { currentUser, currentUserData } = useAuth();
    const [isLoadingPage, setIsLoadingPage] = useState<boolean>(true);

    useEffect(() => {
        if (currentUser && currentUserData) {
            setIsLoadingPage(false);
        }
    }, [currentUser, currentUserData]);

    return (
        <main className="w-full h-full text-default-dark">
            {/* <div className="grid grid-cols-12 pt-20 px-8 max-w-7xl mx-auto h-screen gap-10"> */}
            <div className="p-6">
                <PageHeader />
                <div
                    id="content"
                    className="col-span-9 overflow-y-scroll scrollbar-hide px-7"
                >
                    {children}
                </div>
            </div>
        </main>
    );
};
