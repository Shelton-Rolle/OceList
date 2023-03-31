import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { PageLayout } from '@/layouts/PageLayout';
import GetProjects from '@/database/GetProjects';
import GetIssues from '@/database/GetIssues';
import { DatabaseProjectData, Issue } from '@/types/dataObjects';
import { IssueCard } from '@/components/IssueCard';
import { ProjectCard } from '@/components/ProjectCard';

export default function Home() {
    const { currentUserData } = useAuth();
    const [feed, setFeed] = useState<(DatabaseProjectData | Issue)[]>();
    const [loadingFeed, setLoadingFeed] = useState<boolean>();

    async function Shuffle(
        array: (DatabaseProjectData | Issue)[]
    ): Promise<(DatabaseProjectData | Issue)[]> {
        let currentIndex = array.length,
            randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex != 0) {
            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex],
                array[currentIndex],
            ];
        }

        return array;
    }

    async function GenerateFeed() {
        setLoadingFeed(true);
        const projects = await GetProjects();
        const issues = await GetIssues();
        const feedData: (DatabaseProjectData | Issue)[] = await Shuffle([
            ...projects,
            ...issues,
        ]);

        setFeed(feedData);
        setLoadingFeed(false);
    }

    useEffect(() => {
        if (currentUserData) {
            GenerateFeed();
        }
    }, [currentUserData]);

    return (
        <>
            <Head>
                <title>Simu</title>
                <meta name="description" content="Landing Page" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <PageLayout>
                {loadingFeed ? (
                    <div>Loading Feed</div>
                ) : (
                    <div>
                        {feed?.map((item, index) => {
                            switch (item?.type) {
                                case 'issue':
                                    return (
                                        <IssueCard issue={item} key={index} />
                                    );
                                case 'project':
                                    return (
                                        <ProjectCard
                                            project={item}
                                            key={index}
                                        />
                                    );
                            }
                        })}
                    </div>
                )}
            </PageLayout>
        </>
    );
}
