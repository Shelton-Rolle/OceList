import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { PageLayout } from '@/layouts/PageLayout';
import database from '@/firebase/database/databaseInit';
import { ref, get, child } from 'firebase/database';
import UpdateUser from '@/database/UpdateUser';
import { GetGithubUserRepos } from '@/firebase/auth/gitHubAuth/octokit';
import { Project, DatabaseProjectData, IUser } from '@/types/dataObjects';
import Image from 'next/image';
import { NewPost } from '@/components/modals/NewPost';
import { ChangeBanner } from '@/components/modals/ChangeBanner';
import { ChangeAvatar } from '@/components/modals/ChangeAvatar';
import { AddProjects } from '@/components/modals/AddProjects';
import ProjectCard from '@/components/ProjectCard';
import { PageLoader } from '@/components/PageLoader';
import { RiUserFollowFill } from 'react-icons/ri';

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
                <title>{`${profileName}'s Profile`}</title>
                <meta
                    name="description"
                    content={`Profile page of ${profileName}`}
                />
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
                        <section className="relative">
                            <div
                                id="profile-banner"
                                className="relative h-96 w-screen max-md:-mx-6 md:w-full duration-200 cursor-pointer"
                            >
                                <Image
                                    src={data?.banner_url!}
                                    alt="banner"
                                    priority
                                    fill
                                />
                                {isCurrentUser && (
                                    <button
                                        className="absolute w-full h-full bg-black bg-opacity-0 duration-200 hover:bg-opacity-60 flex justify-center items-center text-background-light text-opacity-0 hover:text-opacity-100"
                                        onClick={() => setOpenBannerModal(true)}
                                    >
                                        Update Banner
                                    </button>
                                )}
                            </div>
                            <div className="absolute -bottom-10 left-0 rounded-full overflow-hidden md:left-6">
                                <Image
                                    src={data?.photoURL!}
                                    alt="avatar"
                                    width={80}
                                    height={80}
                                    priority
                                />
                            </div>
                        </section>
                        <section className="py-12 flex items-start justify-between max-w-sm md:px-6">
                            <div>
                                <p className="font-poppins font-medium text-2xl text-default-light">
                                    {data?.displayName}
                                </p>
                                <p className="font-poppins font-light text-default-light text-sm">
                                    {data?.follower_count
                                        ? data?.follower_count
                                        : '0'}{' '}
                                    Followers
                                </p>
                            </div>
                            {!isCurrentUser && (
                                <button
                                    className="flex items-center px-3 py-1 text-sm bg-default-light text-background-light rounded-md"
                                    onClick={FollowUser}
                                >
                                    {loadingFollow ? (
                                        <>Loading</>
                                    ) : (
                                        <>
                                            {isFollowing ? (
                                                <>
                                                    Following{' '}
                                                    <RiUserFollowFill />
                                                </>
                                            ) : (
                                                <>Follow</>
                                            )}
                                        </>
                                    )}
                                </button>
                            )}
                        </section>
                        <section>
                            <div className="flex justify-between items-start mb-7">
                                <h1 className="font-roboto font-bold text-lg text-default-light">
                                    Projects
                                </h1>
                                {isCurrentUser && (
                                    <button
                                        className="px-3 py-2 text-sm bg-default-light text-background-light rounded-md"
                                        onClick={() =>
                                            setOpenProjectModal(true)
                                        }
                                    >
                                        Add Project
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-6">
                                {projectsList ? (
                                    <>
                                        {projectsList?.map((project, index) => (
                                            <ProjectCard
                                                project={project}
                                                key={index}
                                            />
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        {projects ? (
                                            <PageLoader />
                                        ) : (
                                            <p>No Projects Found</p>
                                        )}
                                    </>
                                )}
                            </div>
                        </section>
                        {openProjectModal && (
                            <AddProjects
                                projects={modalProjects!}
                                existingProjects={data?.projects!}
                                setModal={setOpenProjectModal}
                                userData={data}
                            />
                        )}
                        {openBannerModal && (
                            <ChangeBanner
                                setModal={setOpenBannerModal}
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
