import { useAuth } from '@/context/AuthContext';
import CreateProjects from '@/database/CreateProjects';
import UpdateUser from '@/database/UpdateUser';
import { GetGithubUserRepos } from '@/firebase/auth/gitHubAuth/octokit';
import UploadImage from '@/firebase/storage/UploadImage';
import MutateProjectObjects from '@/helpers/MutateProjectObjects';
import { DatabaseProjectData, IUser, Project } from '@/types/dataObjects';
import { CurrentUserProfileProps } from '@/types/props';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FormEvent, useEffect, useState } from 'react';
import { ModalProjectCheckbox } from './ModalProjectCheckbox';
import { ProjectCard } from './ProjectCard';

export default function CurrentUserProfile({ data }: CurrentUserProfileProps) {
    const [viewProjects, setViewProjects] = useState<boolean>(true);
    const [viewActivity, setViewActivity] = useState<boolean>(false);
    const router = useRouter();
    const { UpdateProfile } = useAuth();
    const [avatar, setAvatar] = useState<File | null>(null);
    const { projects, assignedIssues } = data;
    const [modalProjects, setModalProjects] = useState<Project[]>();
    const [newProjects, setNewProjects] = useState<Project[]>([]);
    const [projectsList, setProjectsList] = useState<DatabaseProjectData[]>();
    const [openProjectModal, setOpenProjectModal] = useState<boolean>(false);
    const [openAvatarModal, setOpenAvatarModal] = useState<boolean>(false);

    async function ChangeView(newType: string) {
        switch (newType) {
            case 'project':
                if (viewActivity) {
                    setViewActivity(false);
                    setViewProjects(true);
                }
                break;
            case 'activity':
                if (viewProjects) {
                    setViewProjects(false);
                    setViewActivity(true);
                }
                break;
        }
    }

    async function UpdateAvatar(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (avatar) {
            await UploadImage(avatar, data?.displayName!).then(async (url) => {
                const updatedUser: IUser = {
                    ...data!,
                    photoURL: avatar ? url : data?.photoURL,
                };

                console.log('Updated User --- : ', updatedUser);

                await UpdateProfile(
                    data?.displayName!,
                    avatar ? url : data?.photoURL!
                ).then((error) => {
                    UpdateUser(updatedUser).then(() => {
                        router.reload();
                    });
                });
            });
        } else {
            console.log('No Avatar Selected');
        }
    }

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
            <header>
                <div className="flex items-center">
                    <div className="rounded-full overflow-hidden mr-5">
                        <Image
                            src={data?.photoURL!}
                            alt="avatar"
                            width={150}
                            height={150}
                            onClick={() => setOpenAvatarModal(true)}
                        />
                    </div>
                </div>
                <div className="flex items-center justify-between my-6">
                    <div>
                        <p className="text-3xl">{data?.displayName}</p>
                        <p className="text-base text-gray-400">10 Followers</p>
                    </div>
                </div>
            </header>
            <div className="w-full grid grid-cols-2 mb-6">
                <button
                    onClick={() => ChangeView('project')}
                    className={`py-3 border-b-2 duration-150 ${
                        viewProjects
                            ? 'border-b-black text-black'
                            : 'border-b-gray-300 text-gray-300'
                    }`}
                >
                    Projects
                </button>
                <button
                    onClick={() => ChangeView('activity')}
                    className={`py-3 border-b-2 duration-150 ${
                        viewActivity
                            ? 'border-b-black text-black'
                            : 'border-b-gray-300 text-gray-300'
                    }`}
                >
                    Activity
                </button>
            </div>
            {viewProjects && (
                <section className="">
                    <div className="flex justify-end items-center">
                        <button
                            onClick={() => setOpenProjectModal(true)}
                            className="border-2 border-blue-300 py-1 px-3 rounded-md text-blue-300 my-4 text-2xl"
                        >
                            +
                        </button>
                    </div>
                    {projectsList ? (
                        <div className="grid grid-cols-2 gap-7">
                            {projectsList?.map((project, index) => (
                                <ProjectCard project={project} key={index} />
                            ))}
                        </div>
                    ) : (
                        <>
                            {projects ? (
                                <p>Loading</p>
                            ) : (
                                <p>No Projects Found</p>
                            )}
                        </>
                    )}
                </section>
            )}
            {viewActivity && (
                <section className="">
                    {assignedIssues?.map((issue, index) => (
                        <div
                            key={index}
                            className="outline outline-2 outline-black my-3 p-5 max-w-xs"
                        >
                            <h4 className="text-lg font-bold">
                                {issue?.title}
                            </h4>
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
            )}
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
            {openAvatarModal && (
                <article className="absolute top-0 left-0 w-full h-screen">
                    <div
                        id="overlay"
                        className="absolute top-0 left-0 w-full h-screen bg-black bg-opacity-75"
                    />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-white">
                        <form onSubmit={UpdateAvatar}>
                            <input
                                type="file"
                                id="avatar"
                                accept="image/jpg image/jpeg image/png"
                                onChange={(e) =>
                                    setAvatar(
                                        e.target.files && e.target.files[0]
                                    )
                                }
                            />
                            <button
                                className="outline outline-2 outline-red-300 rounded-sm py-2 px-5 text-red-300"
                                onClick={() => setOpenAvatarModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="outline outline-2 outline-blue-300 rounded-sm py-2 px-5 text-blue-300"
                                type="submit"
                            >
                                Update
                            </button>
                        </form>
                    </div>
                </article>
            )}
        </div>
    );
}
