import CreateProjects from '@/database/CreateProjects';
import UpdateUser from '@/database/UpdateUser';
import { GetGithubUserRepos } from '@/firebase/auth/gitHubAuth/octokit';
import MutateProjectObjects from '@/helpers/MutateProjectObjects';
import { DatabaseProjectData, IUser, Project } from '@/types/dataObjects';
import { CurrentUserProfileProps } from '@/types/props';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { ModalProjectCheckbox } from './ModalProjectCheckbox';

export default function CurrentUserProfile({ data }: CurrentUserProfileProps) {
    const router = useRouter();
    const { projects, assignedIssues } = data;
    const [modalProjects, setModalProjects] = useState<Project[]>();
    const [newProjects, setNewProjects] = useState<Project[]>([]);
    const [projectsList, setProjectsList] = useState<DatabaseProjectData[]>();
    const [openProjectModal, setOpenProjectModal] = useState<boolean>(false);

    async function AddNewProjects() {
        await CreateProjects(data?.githubToken!, newProjects).then(async () => {
            const updatedUserProjectsArray: DatabaseProjectData[] = [];

            await data?.projects?.map((project) => {
                updatedUserProjectsArray.push(project as DatabaseProjectData);
            });

            const mutatedProjects = await MutateProjectObjects(
                data?.githubToken!,
                newProjects
            );

            await mutatedProjects.map((project) => {
                updatedUserProjectsArray?.push(project);
            });

            const updatedUser: IUser = {
                ...data,
                projects: updatedUserProjectsArray,
            };

            console.log('Updated User: ', updatedUser);
            console.log('Updated projects: ', updatedUserProjectsArray);

            await UpdateUser(updatedUser).then(({ result }) => {
                if (result?.updated) {
                    router.reload();
                } else {
                    console.log('There was an error: ', result?.errors);
                }
            });
        });
    }

    useEffect(() => {
        setProjectsList(data?.projects as DatabaseProjectData[]);
    }, []);

    useEffect(() => {
        if (openProjectModal) {
            GetGithubUserRepos(data?.githubToken!, data?.displayName!).then(
                (res) => {
                    setModalProjects(res);
                }
            );
        }
    }, [openProjectModal]);

    return (
        <div>
            {openProjectModal && (
                <article className="absolute top-0 left-0 w-full h-screen">
                    <div
                        id="overlay"
                        className="absolute top-0 left-0 w-full h-screen bg-black bg-opacity-75"
                    />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-white">
                        <div>
                            {modalProjects?.map((project, index) => (
                                <ModalProjectCheckbox
                                    project={project}
                                    existingProjects={data?.projects!}
                                    newProjects={newProjects}
                                    setNewProjects={setNewProjects}
                                    key={index}
                                />
                            ))}
                            <button
                                className="outline outline-2 outline-red-300 rounded-sm py-2 px-5 text-red-300"
                                onClick={() => setOpenProjectModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="outline outline-2 outline-blue-300 rounded-sm py-2 px-5 text-blue-300"
                                onClick={AddNewProjects}
                            >
                                Add Projects
                            </button>
                        </div>
                    </div>
                </article>
            )}
            <header>
                <div>
                    <Image
                        src={data?.photoURL!}
                        alt="avatar"
                        width={150}
                        height={150}
                    />
                    <p>{data?.displayName}</p>
                </div>
                <button
                    onClick={() => setOpenProjectModal(true)}
                    className="outline outline-2 outline-blue-300 rounded-sm py-2 px-5 text-blue-300"
                >
                    Add Project
                </button>
            </header>
            <section className="my-4">
                <h2>Projects</h2>
                {projectsList ? (
                    <>
                        {projectsList?.map((project, index) => (
                            <div
                                key={index}
                                className="outline outline-2 outline-black my-3 p-5 max-w-md"
                            >
                                <Link href={`/projects/${project?.id}`}>
                                    <h4 className="text-lg font-bold">
                                        {project?.name}
                                    </h4>
                                </Link>
                                <p>{project?.owner?.login}</p>
                                <div className="flex gap-4 items-center">
                                    {project?.languages?.map(
                                        (language, index) => (
                                            <p
                                                key={index}
                                                className="text-gray-400 text-sm"
                                            >
                                                {language}
                                            </p>
                                        )
                                    )}
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <>{projects ? <p>Loading</p> : <p>No Projects Found</p>}</>
                )}
            </section>
            <section className="my-4">
                <h2>Contributions</h2>
                {assignedIssues?.map((issue, index) => (
                    <div
                        key={index}
                        className="outline outline-2 outline-black my-3 p-5 max-w-xs"
                    >
                        <h4 className="text-lg font-bold">{issue?.title}</h4>
                        <p>{issue?.body}</p>
                        <div className="flex items-center gap-5">
                            <p className="text-gray-400 text-sm">
                                {issue?.user?.login}
                            </p>
                            <p className="text-gray-400 text-sm">
                                {issue?.repository?.name}
                            </p>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}
