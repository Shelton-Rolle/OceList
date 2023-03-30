import { PageLayout } from '@/layouts/PageLayout';
import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { Project } from '@/types/dataObjects';
import { ProjectCard } from '@/components/ProjectCard';

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
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <PageLayout>
                {loadingData ? (
                    <div>Loading Data</div>
                ) : (
                    <>
                        {favorites?.length! > 0 ? (
                            <div className=" mt-3 grid grid-cols-2 gap-4">
                                {favorites?.map((favorite, index) => (
                                    <ProjectCard
                                        project={favorite}
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