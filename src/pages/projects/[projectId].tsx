import { useAuth } from '@/context/AuthContext';
import DeleteProject from '@/database/DeleteProject';
import GetProject from '@/database/GetProject';
import UpdateProject from '@/database/UpdateProject';
import database from '@/firebase/database/databaseInit';
import { PageLayout } from '@/layouts/PageLayout';
import { GithubUserObject } from '@/types/dataObjects';
import { ProjectPageProps } from '@/types/props';
import { ref, get, child } from 'firebase/database';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

export default function ProjectPage({
    projectId,
    project,
    owner,
}: ProjectPageProps) {
    const { currentUser } = useAuth();
    const router = useRouter();
    const [contributors, setContributors] = useState<GithubUserObject[]>([]);
    const [isOwner, setIsOwner] = useState<boolean>();
    const [readme, setReadme] = useState<string>();

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

    async function Reload() {
        await UpdateProject(
            owner?.githubToken!,
            project,
            owner?.displayName!
        ).then((updated) => {
            if (updated) {
                router.reload();
            } else {
                console.log('Update Error');
            }
        });
    }

    useEffect(() => {
        if (currentUser) {
            if (currentUser.displayName === owner.displayName) {
                setIsOwner(true);
            } else {
                setIsOwner(false);
            }
        } else {
            setIsOwner(false);
        }
    }, [currentUser]);

    useEffect(() => {
        console.log('Project: ', project);
        setReadme(atob(project?.readme?.content));
    }, [project]);

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
                        <>
                            <button
                                className="outline outline-2 outline-black rounded-sm p-5 my-4"
                                onClick={Delete}
                            >
                                Delete Project
                            </button>
                            <button
                                className="outline outline-2 outline-black rounded-sm p-5 my-4"
                                onClick={Reload}
                            >
                                Reload Project
                            </button>
                        </>
                    )}
                    <h1>{project?.name}</h1>
                    <p>Owner: {project?.owner?.login}</p>
                    <Link href={project?.html_url!}>Repo Link</Link>
                    {project?.homepage && (
                        <Link href={project?.homepage!}>Repo Homepage</Link>
                    )}
                    <div>
                        <h2>Contributors</h2>
                        {project?.contributors?.map((contributor, index) => (
                            <div
                                key={index}
                                className="relative w-8 h-8 rounded-full overflow-hidden"
                            >
                                <Image
                                    src={contributor?.avatar_url}
                                    alt="contributor-avatar"
                                    fill
                                />
                            </div>
                        ))}
                    </div>
                    <section className="flex items-center gap-7 my-16">
                        <p>{project?.forks ? project?.forks : 0} Forks</p>
                        <p>
                            {project?.stargazers
                                ? project?.stargazers?.length
                                : 0}{' '}
                            Stars
                        </p>
                        <p>
                            {project?.subscribers
                                ? project?.subscribers?.length
                                : 0}{' '}
                            Watchers
                        </p>
                    </section>
                    <p>License: {project?.license?.name}</p>

                    <div id="readme">
                        <ReactMarkdown>{readme!}</ReactMarkdown>
                    </div>

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
            console.error('Project Error: ', error);
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
            console.error('Owner Error: ', error);
        });

    return {
        props: {
            projectId,
            project,
            owner,
        },
    };
};
