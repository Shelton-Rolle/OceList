import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { PageLayout } from '@/layouts/PageLayout';
import GetProjects from '@/database/GetProjects';
import GetIssues from '@/database/GetIssues';
import { DatabaseProjectData, Issue, Post } from '@/types/dataObjects';
import { IssueCard } from '@/components/IssueCard';
import { ProjectCard } from '@/components/ProjectCard';
import GetFollowedPosts from '@/database/GetFollowedPosts';

export default function Home() {
    const { currentUserData } = useAuth();
    const [feed, setFeed] = useState<(DatabaseProjectData | Issue | Post)[]>(
        []
    );
    const [loadingFeed, setLoadingFeed] = useState<boolean>();

    async function Shuffle(
        array: (DatabaseProjectData | Issue | Post)[]
    ): Promise<(DatabaseProjectData | Issue | Post)[]> {
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
        let followedPosts: Post[] = [];

        if (currentUserData?.following) {
            followedPosts = await GetFollowedPosts(currentUserData?.following!);
        }

        const feedData: (DatabaseProjectData | Issue | Post)[] = await Shuffle([
            ...projects,
            ...issues,
            ...followedPosts,
        ]);

        setFeed(feedData);
        setLoadingFeed(false);
    }

    useEffect(() => {
        if (currentUserData) {
            if (feed?.length < 1) {
                GenerateFeed();
            }
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
                                    const issue = item as Issue;
                                    return (
                                        <IssueCard issue={issue} key={index} />
                                    );
                                case 'project':
                                    const project = item as DatabaseProjectData;
                                    return (
                                        <ProjectCard
                                            project={project}
                                            key={index}
                                        />
                                    );
                                case 'post':
                                    const post = item as Post;
                                    return (
                                        <div key={index}>
                                            <h1 className="font-bold">
                                                {post?.owner?.displayName}
                                            </h1>
                                            <p>{post?.body}</p>
                                        </div>
                                    );
                            }
                        })}
                    </div>
                )}
            </PageLayout>
        </>
    );
}
