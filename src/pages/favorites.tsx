import { PageLayout } from '@/layouts/PageLayout';
import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { DatabaseProjectData, Project } from '@/types/dataObjects';
import ProjectCard from '@/components/ProjectCard';
import { PageLoader } from '@/components/PageLoader';

export default function Favorites() {
    const { currentUserData } = useAuth();
    const [loadingData, setLoadingData] = useState<boolean>();
    const [favorites, setFavorites] = useState<Project[]>();

    useEffect(() => {
        if (currentUserData) {
            if (currentUserData?.favorite_projects) {
                setFavorites(currentUserData?.favorite_projects);
            } else {
                setFavorites([]);
            }
            setLoadingData(false);
        } else {
            setLoadingData(true);
        }
    }, [currentUserData]);
    return (
        <>
            <Head>
                <title>Favorites</title>
                <meta
                    name="description"
                    content="Page containing a list of projects that the current user has favorited."
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1203308068531230"
                    crossOrigin="anonymous"
                ></script>
            </Head>
            <PageLayout>
                {loadingData ? (
                    <PageLoader size={60} color="#9381FF" />
                ) : (
                    <>
                        {favorites?.length! > 0 ? (
                            <div className="mt-3 grid lg:grid-cols-2 gap-4">
                                {favorites?.map((favorite, index) => (
                                    <ProjectCard
                                        project={
                                            favorite as DatabaseProjectData
                                        }
                                        key={index}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div>No Favorites Found</div>
                        )}
                    </>
                )}
            </PageLayout>
        </>
    );
}
