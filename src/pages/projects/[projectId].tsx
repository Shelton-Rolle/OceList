import { useAuth } from '@/context/AuthContext';
import DeleteProject from '@/database/DeleteProject';
import UpdateProject from '@/database/UpdateProject';
import database from '@/firebase/database/databaseInit';
import { PageLayout } from '@/layouts/PageLayout';
import { ProjectPageProps } from '@/types/props';
import { ref, get, child } from 'firebase/database';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { MdDelete } from 'react-icons/md';
import { TfiReload } from 'react-icons/tfi';
import {
    GoRepoForked,
    GoStar,
    GoEye,
    GoMarkGithub,
    GoBrowser,
} from 'react-icons/go';
import remarkGfm from 'remark-gfm';

export default function ProjectPage({
    projectId,
    project,
    owner,
}: ProjectPageProps) {
    const { currentUser } = useAuth();
    const router = useRouter();
    const [isOwner, setIsOwner] = useState<boolean>();
    const [readme, setReadme] = useState<string>();
    const [showDescription, setShowDescription] = useState<boolean>(true);
    const [showIssues, setShowIssues] = useState<boolean>(false);

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
                        <section id="owner-actions" className="mb-9">
                            <h1 className="font-roboto font-bold text-base text-default-light">
                                Owner Actions
                            </h1>
                            <div
                                id="actions"
                                className="mt-2 flex items-center gap-5 w-full"
                            >
                                <button
                                    className="border-2 border-default-light rounded-md flex items-center gap-4 p-3 text-xs"
                                    onClick={Delete}
                                >
                                    <MdDelete /> Delete Project
                                </button>
                                <button
                                    className="border-2 border-default-light rounded-md flex items-center gap-4 p-3 text-xs"
                                    onClick={Reload}
                                >
                                    <TfiReload /> Reload Project
                                </button>
                            </div>
                        </section>
                    )}
                    <section id="project-details" className="mb-9">
                        <div id="project-identity">
                            <p className="font-poppins font-normal text-sm text-accent-light">
                                {project?.owner?.login}
                            </p>
                            <h2 className="font-poppins font-bold text-2xl text-primary-light">
                                {project?.name}
                            </h2>
                        </div>
                        <div
                            id="analytics"
                            className="flex items-center gap-5 mt-3"
                        >
                            <div className="flex items-center gap-2 text-default-light font-normal font-poppins text-sm">
                                <p>{project?.forks ? project?.forks : 0}</p>
                                <GoRepoForked />
                            </div>
                            <div className="flex items-center gap-2 text-default-light font-normal font-poppins text-sm">
                                <p>
                                    {project?.stargazers
                                        ? project?.stargazers?.length
                                        : 0}
                                </p>
                                <GoStar />
                            </div>
                            <div className="flex items-center gap-2 text-default-light font-normal font-poppins text-sm">
                                <p>
                                    {project?.subscribers
                                        ? project?.subscribers?.length
                                        : 0}
                                </p>
                                <GoEye />
                            </div>
                        </div>
                    </section>
                    <section id="links" className="mb-9">
                        <h3 className="font-roboto font-bold text-xl text-default-light mb-3">
                            Links
                        </h3>
                        <div className="flex items-center gap-5 text-2xl ">
                            <a
                                href={project?.html_url!}
                                target="_blank"
                                className="relative hover:text-secondary-light duration-150"
                            >
                                <GoMarkGithub />
                            </a>
                            {project?.homepage && (
                                <a
                                    href={project?.homepage!}
                                    target="_blank"
                                    className="relative hover:text-secondary-light duration-150"
                                >
                                    <GoBrowser />
                                </a>
                            )}
                        </div>
                    </section>
                    <div>
                        <h4 className="font-roboto font-bold text-xl text-default-light mb-3">
                            Contributors
                        </h4>
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
                    <section id="content">
                        <div>
                            <button>Description</button>
                            <button>Issues</button>
                        </div>
                        {readme && (
                            <div id="readme">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {readme}
                                </ReactMarkdown>
                            </div>
                        )}
                        <div>
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
                        </div>
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
