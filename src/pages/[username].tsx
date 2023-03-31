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
import { NewPost } from '@/components/modals/NewPost';
import { ChangeBanner } from '@/components/modals/ChangeBanner';
import { ChangeAvatar } from '@/components/modals/ChangeAvatar';
import { AddProjects } from '@/components/modals/AddProjects';

interface ProfilePageProps {
    profileName: string;
    data: IUser;
}

export default function ProfilePage({ profileName, data }: ProfilePageProps) {
    const { currentUser, currentUserData } = useAuth();
    const [isCurrentUser, setIsCurrentUser] = useState<boolean>(false);
    const [viewProjects, setViewProjects] = useState<boolean>(true);
    const [viewActivity, setViewActivity] = useState<boolean>(false);
    const [viewPosts, setViewPosts] = useState<boolean>(false);
    const { projects, assignedIssues } = data;
    const [modalProjects, setModalProjects] = useState<Project[]>();
    const [projectsList, setProjectsList] = useState<DatabaseProjectData[]>();
    const [openProjectModal, setOpenProjectModal] = useState<boolean>(false);
    const [openAvatarModal, setOpenAvatarModal] = useState<boolean>(false);
    const [openBannerModal, setOpenBannerModal] = useState<boolean>(false);
    const [loadingFollow, setLoadingFollow] = useState<boolean>(false);
    const [isFollowing, setIsFollowing] = useState<boolean>();
    const [openNewPostModal, setOpenNewPostModal] = useState<boolean>(false);

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
                } else if (viewPosts) {
                    setViewPosts(false);
                }
                setViewProjects(true);
                break;
            case 'activity':
                if (viewProjects) {
                    setViewProjects(false);
                } else if (viewPosts) {
                    setViewPosts(false);
                }
                setViewActivity(true);
                break;
            case 'posts':
                if (viewProjects) {
                    setViewProjects(false);
                } else if (viewActivity) {
                    setViewActivity(false);
                }
                setViewPosts(true);
                break;
        }
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
                        {isCurrentUser && (
                            <div>
                                <button
                                    className="outline outline-2 outline-black rounded-md px-4 py-2"
                                    onClick={() => setOpenNewPostModal(true)}
                                >
                                    Create Post
                                </button>
                            </div>
                        )}
                        <div className="w-full grid grid-cols-3 mb-6">
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
                                onClick={() => ChangeView('posts')}
                                className={`py-3 border-b-2 duration-150 ${
                                    viewPosts
                                        ? 'border-b-black text-black'
                                        : 'border-b-gray-300 text-gray-300'
                                }`}
                            >
                                Posts
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
                        {viewPosts && (
                            <section>
                                {data?.posts ? (
                                    <>
                                        {data?.posts?.map((post, index) => (
                                            <p key={index}>{post.body}</p>
                                        ))}
                                    </>
                                ) : (
                                    <p>No Posts Found.</p>
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
                            <AddProjects
                                projects={modalProjects!}
                                existingProjects={data?.projects!}
                                setModal={setOpenProjectModal}
                                userData={data}
                            />
                        )}
                        {openAvatarModal && (
                            <ChangeAvatar
                                setModal={setOpenAvatarModal}
                                userData={data}
                            />
                        )}
                        {openBannerModal && (
                            <ChangeBanner
                                setModal={setOpenBannerModal}
                                userData={data}
                            />
                        )}
                        {openNewPostModal && (
                            <NewPost
                                projects={data?.projects!}
                                setModal={setOpenNewPostModal}
                                userData={data}
                            />
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
