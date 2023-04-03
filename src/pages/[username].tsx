import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { GetServerSideProps } from 'next';
import GetUser from '@/database/GetUser';
import Head from 'next/head';
import { PageLayout } from '@/layouts/PageLayout';
import database from '@/firebase/database/databaseInit';
import { ref, get, child } from 'firebase/database';
import { ModalProjectCheckbox } from '@/components/ModalProjectCheckbox';
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
import ProjectCard from '@/components/ProjectCard';
import { PageLoader } from '@/components/PageLoader';

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
                <title>{data?.displayName}'s Profile</title>
                <meta
                    name="description"
                    content={`Profile page of ${data?.displayName}`}
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
                    <div className="z-10">
                        <section>
                            <div className="absolute top-0 left-0 w-full">
                                <div className="relative h-96">
                                    <Image
                                        src={data?.banner_url!}
                                        alt="banner"
                                        priority
                                        fill
                                        onClick={() => {
                                            if (isCurrentUser) {
                                                setOpenBannerModal(true);
                                            }
                                        }}
                                    />
                                </div>
                                <div className="absolute left-6 -bottom-10 rounded-full overflow-hidden">
                                    <Image
                                        src={data?.photoURL!}
                                        alt="avatar"
                                        width={80}
                                        height={80}
                                        priority
                                        onClick={() => {
                                            if (isCurrentUser) {
                                                setOpenAvatarModal(true);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </section>
                        <section className="mt-96 flex items-center justify-between">
                            <div>
                                <p className="font-paragraph text-2xl font-medium">
                                    {data?.displayName}
                                </p>
                                <p className="font-paragraph text-sm font-light">
                                    {data?.follower_count
                                        ? data?.follower_count
                                        : '0'}{' '}
                                    Followers
                                </p>
                            </div>
                            {!isCurrentUser && (
                                <button onClick={FollowUser}>
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
                        </section>
                        <div className="my-10 text-base md:text-xl">
                            <button
                                className={`py-3 border-b-2 duration-150 w-1/2 border-b-secondary-dark text-secondary-dark ${
                                    viewProjects
                                        ? 'border-opacity-100 opacity-100'
                                        : 'border-opacity-30 opacity-30'
                                }`}
                                onClick={() => ChangeView('project')}
                            >
                                Projects
                            </button>
                            <button
                                className={`py-3 border-b-2 duration-150 w-1/2 border-b-secondary-dark text-secondary-dark ${
                                    viewPosts
                                        ? 'border-opacity-100 opacity-100'
                                        : 'border-opacity-30 opacity-30'
                                }`}
                                onClick={() => ChangeView('posts')}
                            >
                                Posts
                            </button>
                        </div>
                        {viewProjects && (
                            <section>
                                {isCurrentUser && (
                                    <button
                                        className="px-5 py-4 rounded-md bg-default-dark text-background-dark font-paragraph font-light text-sm"
                                        onClick={() =>
                                            setOpenProjectModal(true)
                                        }
                                    >
                                        Add Project
                                    </button>
                                )}
                                {projectsList ? (
                                    <div className="mt-8 flex flex-col gap-4">
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
                                            <p>
                                                <PageLoader />
                                            </p>
                                        ) : (
                                            <p>No Projects Found</p>
                                        )}
                                    </>
                                )}
                            </section>
                        )}
                        {viewPosts && (
                            <section>
                                {isCurrentUser && (
                                    <button
                                        className="px-5 py-4 rounded-md bg-default-dark text-background-dark font-paragraph font-light text-sm"
                                        onClick={() =>
                                            setOpenNewPostModal(true)
                                        }
                                    >
                                        Create Post
                                    </button>
                                )}
                                <div className="mt-8">
                                    {data?.posts ? (
                                        <>
                                            {data?.posts?.map((post, index) => (
                                                <p key={index}>{post.body}</p>
                                            ))}
                                        </>
                                    ) : (
                                        <p>No Posts Found.</p>
                                    )}
                                </div>
                            </section>
                        )}
                        {viewActivity && (
                            <section>
                                {assignedIssues?.map((issue, index) => (
                                    <div key={index}>
                                        <h4>{issue?.title}</h4>
                                        <p>{issue?.body}</p>
                                        <div>
                                            <p>{issue?.user?.login}</p>
                                            <p>{issue?.repository?.name}</p>
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
