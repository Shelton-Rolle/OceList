import { useAuth } from '@/context/AuthContext';
import DeleteProject from '@/database/DeleteProject';
import GetProject from '@/database/GetProject';
import database from '@/firebase/database/databaseInit';
import { PageLayout } from '@/layouts/PageLayout';
import { GithubUserObject } from '@/types/dataObjects';
import { ProjectPageProps } from '@/types/props';
import { ref, get, child } from 'firebase/database';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function ProjectPage({
    projectId,
    project,
    owner,
}: ProjectPageProps) {
    const { currentUser } = useAuth();
    const router = useRouter();
    const [contributors, setContributors] = useState<GithubUserObject[]>();
    const [isOwner, setIsOwner] = useState<boolean>();

    async function fetchContributors() {
        await fetch(project?.contributors_url!)
            .then((res) => res.json())
            .then((res) => setContributors(res));
    }

    async function Delete() {
        await DeleteProject(owner, project)
            .then((res) => {
                console.log('Res: ', res);
                router.push(`/${owner?.login}`);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        fetchContributors();
    }, []);

    useEffect(() => {
        if (currentUser) {
            if (currentUser.displayName === owner.displayName) {
                setIsOwner(true);
            } else {
                setIsOwner(false);
            }
        }
    }, [currentUser]);

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
                    {isOwner && (
                        <button
                            className="outline outline-2 outline-black rounded-sm p-5 my-4"
                            onClick={Delete}
                        >
                            Delete Project
                        </button>
                    )}
                    <h1>{project?.name}</h1>
                    <p>Owner: {project?.owner?.login}</p>
                    <Link href={project?.html_url!}>Repo Link</Link>
                    {project?.homepage && (
                        <Link href={project?.homepage!}>Repo Homepage</Link>
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

    const owner = await get(
        child(ref(database), `users/${project?.owner?.login}`)
    )
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
            owner,
        },
    };
};
