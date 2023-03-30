import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { GetServerSideProps } from 'next';
import GetUser from '@/database/GetUser';
import Head from 'next/head';
import { PageLayout } from '@/layouts/PageLayout';
import database from '@/firebase/database/databaseInit';
import { ref, get, child } from 'firebase/database';
import { ModalProjectCheckbox } from '@/components/ModalProjectCheckbox';
import { ProjectCard } from '@/components/ProjectCard';
import CreateProjects from '@/database/CreateProjects';
import UpdateUser from '@/database/UpdateUser';
import { GetGithubUserRepos } from '@/firebase/auth/gitHubAuth/octokit';
import UploadImage from '@/firebase/storage/UploadImage';
import MutateProjectObjects from '@/helpers/MutateProjectObjects';
import { Project, DatabaseProjectData, IUser } from '@/types/dataObjects';
import { useRouter } from 'next/router';
import Image from 'next/image';
import UploadBanner from '@/firebase/storage/UploadBanner';

interface ProfilePageProps {
    profileName: string;
    data: IUser;
}

export default function ProfilePage({ profileName, data }: ProfilePageProps) {
    const { currentUser, UpdateProfile, currentUserData } = useAuth();
    const [isCurrentUser, setIsCurrentUser] = useState<boolean>(false);
    const [viewProjects, setViewProjects] = useState<boolean>(true);
    const [viewActivity, setViewActivity] = useState<boolean>(false);
    const router = useRouter();
    const [avatar, setAvatar] = useState<File | null>(null);
    const [banner, setBanner] = useState<File | null>(null);
    const { projects, assignedIssues } = data;
    const [modalProjects, setModalProjects] = useState<Project[]>();
    const [newProjects, setNewProjects] = useState<Project[]>([]);
    const [projectsList, setProjectsList] = useState<DatabaseProjectData[]>();
    const [openProjectModal, setOpenProjectModal] = useState<boolean>(false);
    const [openAvatarModal, setOpenAvatarModal] = useState<boolean>(false);
    const [openBannerModal, setOpenBannerModal] = useState<boolean>(false);
    const [loadingFollow, setLoadingFollow] = useState<boolean>(false);
    const [isFollowing, setIsFollowing] = useState<boolean>();

    async function FollowUser() {
        setLoadingFollow(true);
        if (isFollowing) {
            const followingList = currentUserData?.following;
            const followerList = data?.followers;
            // Add UnFollow Functionality
            let followingIndex;
            let followerIndex;

            for (let i = 0; i < currentUserData?.following?.length!; i++) {
                if (
                    currentUserData?.following![i].displayName ===
                    data?.displayName
                ) {
                    followingIndex = i;
                }
            }

            for (let i = 0; i < data?.followers?.length!; i++) {
                if (
                    data?.followers![i].displayName ===
                    currentUserData?.displayName
                ) {
                    followerIndex = i;
                }
            }

            console.log('Following Index: ', followingIndex);
            console.log('Follower Index: ', followerIndex);
            if (followingIndex !== undefined) {
                followingList?.splice(followingIndex, 1);
            }
            if (followerIndex !== undefined) {
                followerList?.splice(followerIndex, 1);
            }

            const updatedCurrentUser: IUser = {
                ...currentUserData,
                following: followingList,
                following_count: currentUserData?.following_count! - 1,
            };
            const updatedProfileUser: IUser = {
                ...data,
                followers: followerList,
                follower_count: data?.follower_count! - 1,
            };

            await UpdateUser(updatedCurrentUser).then(async ({ result }) => {
                if (result?.updated) {
                    await UpdateUser(updatedProfileUser).then(({ result }) => {
                        if (result?.updated) {
                            setLoadingFollow(false);
                            setIsFollowing(false);
                        } else {
                            console.log(
                                'Error Updating Profile User: ',
                                result?.errors
                            );
                        }
                    });
                } else {
                    console.log(
                        'Error Updating Current User: ',
                        result?.errors
                    );
                }
            });
        } else {
            const followingUserObject = {
                displayName: data?.displayName,
                html_url: data?.html_url,
            };
            const followerUserObject = {
                displayName: currentUserData?.displayName,
                html_url: currentUserData?.html_url,
            };
            const updatedCurrentUser: IUser = {
                ...currentUserData,
                following: currentUserData?.following
                    ? [...currentUserData?.following, followingUserObject]
                    : [followingUserObject],
                following_count: currentUserData?.following_count
                    ? currentUserData?.following_count + 1
                    : 1,
            };
            const updatedProfileUserData: IUser = {
                ...data,
                followers: data?.followers
                    ? [...data?.followers, followerUserObject]
                    : [followerUserObject],
                follower_count: data?.follower_count
                    ? data?.follower_count + 1
                    : 1,
            };

            await UpdateUser(updatedCurrentUser).then(async ({ result }) => {
                if (result?.updated) {
                    await UpdateUser(updatedProfileUserData).then(
                        ({ result }) => {
                            if (result?.updated) {
                                setLoadingFollow(false);
                                setIsFollowing(true);
                            } else {
                                console.log(
                                    'Error Updating Profile User: ',
                                    result?.errors
                                );
                            }
                        }
                    );
                } else {
                    console.log(
                        'Error Updating Current User: ',
                        result?.errors
                    );
                }
            });
        }
    }

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
                    photoURL: url,
                };

                await UpdateProfile(
                    data?.displayName!,
                    avatar ? url : currentUser?.photoURL!
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

    async function UpdateBanner(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (banner) {
            await UploadBanner(banner, data?.displayName!).then(async (url) => {
                const updatedUser: IUser = {
                    ...data!,
                    banner_url: url,
                };

                await UpdateUser(updatedUser).then(() => {
                    router.reload();
                });
            });
        } else {
            console.log('No Banner Selected');
        }
    }

    async function AddNewProjects() {
        await CreateProjects(data?.githubToken!, newProjects).then(async () => {
            const updatedUserProjectsArray: DatabaseProjectData[] = [];

            await projects?.map((project) => {
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
        if (profileName === currentUser?.displayName) {
            setIsCurrentUser(true);
        } else {
            setIsCurrentUser(false);
        }

        if (currentUserData?.following) {
            for (let i = 0; i < currentUserData?.following?.length; i++) {
                const { displayName } = currentUserData?.following[i];
                if (displayName === data?.displayName) {
                    setIsFollowing(true);
                    break;
                }
            }
        }
    }, [currentUser, currentUserData]);

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
                {data === null ? (
                    <h1>User Not Found</h1>
                ) : (
                    <div>
                        <header>
                            <div className="relative flex items-center h-64 mb-16">
                                <div className="top-0 left-0 w-full h-full absolute overflow-hidden">
                                    <Image
                                        src={data?.banner_url!}
                                        alt="banner"
                                        priority
                                        fill
                                        className="object-cover"
                                        onClick={() => {
                                            if (isCurrentUser) {
                                                setOpenBannerModal(true);
                                            }
                                        }}
                                    />
                                </div>
                                <div className="absolute -bottom-12 left-7 rounded-full overflow-hidden mr-5">
                                    <Image
                                        src={data?.photoURL!}
                                        alt="avatar"
                                        width={100}
                                        height={100}
                                        onClick={() => {
                                            if (isCurrentUser) {
                                                setOpenAvatarModal(true);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-between my-6">
                                <div>
                                    <p className="text-3xl">
                                        {data?.displayName}
                                    </p>
                                    <p className="text-base text-gray-400">
                                        {data?.follower_count
                                            ? data?.follower_count
                                            : '0'}{' '}
                                        Followers
                                    </p>
                                </div>
                                {!isCurrentUser && (
                                    <button
                                        onClick={FollowUser}
                                        className={`outline outline-1 outline-black rounded-sm px-3 py-2 my-4`}
                                    >
                                        {loadingFollow ? (
                                            <>Loading</>
                                        ) : (
                                            <>
                                                {isFollowing
                                                    ? 'Following'
                                                    : 'Follow'}
                                            </>
                                        )}
                                    </button>
                                )}
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
                                {isCurrentUser && (
                                    <div className="flex justify-end items-center">
                                        <button
                                            onClick={() =>
                                                setOpenProjectModal(true)
                                            }
                                            className="border-2 border-blue-300 py-1 px-3 rounded-md text-blue-300 my-4 text-2xl"
                                        >
                                            Add Project
                                        </button>
                                    </div>
                                )}
                                {projectsList ? (
                                    <div className="grid grid-cols-2 gap-7">
                                        {projectsList?.map((project, index) => (
                                            <ProjectCard
                                                project={project}
                                                key={index}
                                            />
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
                                        {modalProjects?.map(
                                            (project, index) => (
                                                <ModalProjectCheckbox
                                                    project={project}
                                                    existingProjects={
                                                        data?.projects!
                                                    }
                                                    newProjects={newProjects}
                                                    setNewProjects={
                                                        setNewProjects
                                                    }
                                                    key={index}
                                                />
                                            )
                                        )}
                                        <button
                                            className="outline outline-2 outline-red-300 rounded-sm py-2 px-5 text-red-300"
                                            onClick={() =>
                                                setOpenProjectModal(false)
                                            }
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
                                                    e.target.files &&
                                                        e.target.files[0]
                                                )
                                            }
                                        />
                                        <button
                                            className="outline outline-2 outline-red-300 rounded-sm py-2 px-5 text-red-300"
                                            onClick={() =>
                                                setOpenAvatarModal(false)
                                            }
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
                        {openBannerModal && (
                            <article className="absolute top-0 left-0 w-full h-screen">
                                <div
                                    id="overlay"
                                    className="absolute top-0 left-0 w-full h-screen bg-black bg-opacity-75"
                                />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-white">
                                    <form onSubmit={UpdateBanner}>
                                        <input
                                            type="file"
                                            id="avatar"
                                            accept="image/jpg image/jpeg image/png"
                                            onChange={(e) =>
                                                setBanner(
                                                    e.target.files &&
                                                        e.target.files[0]
                                                )
                                            }
                                        />
                                        <button
                                            className="outline outline-2 outline-red-300 rounded-sm py-2 px-5 text-red-300"
                                            onClick={() =>
                                                setOpenBannerModal(false)
                                            }
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
                )}
            </PageLayout>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const params = context?.params;
    const username: string = params?.username as string;

    const data = await get(child(ref(database), `users/${username}`))
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
            profileName: username,
            data,
        },
    };
};
