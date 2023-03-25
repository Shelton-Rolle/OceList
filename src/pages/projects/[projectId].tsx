import GetProject from '@/database/GetProject';
import database from '@/firebase/database/databaseInit';
import { PageLayout } from '@/layouts/PageLayout';
import { GithubUserObject } from '@/types/dataObjects';
import { ProjectPageProps } from '@/types/props';
import { ref, get, child } from 'firebase/database';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function ProjectPage({ projectId, project }: ProjectPageProps) {
    const [contributors, setContributors] = useState<GithubUserObject[]>();
    // We can fetch any repo data we need that we dont have using the provided links in the project as seen below where we fetch the contributors
    async function fetchContributors() {
        await fetch(project?.contributors_url!)
            .then((res) => res.json())
            .then((res) => setContributors(res));
    }

    useEffect(() => {
        console.log('Project Id: ', projectId);
        console.log('Data: ', project);
        fetchContributors();
    }, []);

    return (
        <>
            <Head>
                <title>Landing</title>
                <meta name="description" content="Landing Page" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <PageLayout>
                <div>
                    <h1>{project?.name}</h1>
                    <p>Owner: {project?.owner?.login}</p>
                    <a href={project?.html_url}>Repo Link</a>
                    {project?.homepage && (
                        <a href={project?.homepage}>Repo Homepage</a>
                    )}
                    {contributors?.map((contributor, index) => (
                        <p key={index}>Contributor: {contributor?.login}</p>
                    ))}
                    <section className="flex items-center gap-7 my-16">
                        <p>{project?.forks_count} Forks</p>
                        <p>{project?.stargazers_count} Stars</p>
                        <p>{project?.watchers_count} Watchers</p>
                    </section>

                    <section>
                        {project?.issues?.map((issue, index) => (
                            <div
                                key={index}
                                className="outline outline-2 outline-black my-3 p-5 max-w-xs"
                            >
                                <h4 className="text-lg font-bold">
                                    {issue?.title}
                                </h4>
                                <p>{issue?.body}</p>
                                <p className="text-gray-400 text-sm">
                                    {issue?.user?.login}
                                </p>
                            </div>
                        ))}
                    </section>
                </div>
            </PageLayout>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const projectId = context?.params?.projectId;

    const project = await get(child(ref(database), `projects/${projectId}`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                return null;
            }
        })
        .catch((error) => {
            console.error(error);
        });

    return {
        props: {
            projectId,
            project,
        },
    };
};
