import { RepositoryCheckbox } from '@/components/RepoCheckbox';
import CreateProjects from '@/database/CreateProjects';
import CreateUser from '@/database/CreateUser';
import {
    GetGitHubUserIssues,
    GetGithubUserRepos,
} from '@/firebase/auth/gitHubAuth/octokit';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { IUser, Project } from '@/types/dataObjects';
import { sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import auth from '@/firebase/auth/authInit';
import GenerateTemporaryPassword from '@/helpers/GenerateTemporaryPassword';
import GetDefaultBanners from '@/firebase/storage/GetDefaultBanners';
import { PageLoader } from '@/components/PageLoader';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export default function ProfileSetup() {
    const {
        currentUser,
        githubData,
        setCurrentUserData,
        updateUserPassword,
        UpdateProfile,
    } = useAuth();
    const router = useRouter();
    const [finalizing, setFinalizing] = useState<boolean>();
    // This will be an array of Projects
    const [repos, setRepos] = useState<Project[]>();

    async function UpdateRepos() {
        await GetGithubUserRepos(githubData?.githubToken!, githubData?.login!)
            .then((res) => setRepos(res))
            .catch((err) => console.error(err));
    }

    async function FinalizeProfileSetup() {
        setFinalizing(true);
        if (repos?.length! > 0) {
            // Create Project Instances of each project in the database
            await CreateProjects(
                githubData?.githubToken!,
                Object.values(githubData?.projects)
            )
                .then(async () => {
                    const assignedIssues = await GetGitHubUserIssues(
                        githubData?.githubToken!
                    );
                    const fullUser: IUser = {
                        ...githubData,
                        assignedIssues,
                    };

                    await UpdateProfile(
                        githubData?.login!,
                        githubData?.avatar_url!
                    ).then(async () => {
                        fullUser.displayName = githubData?.login!;
                        fullUser.photoURL = githubData?.avatar_url!;
                        await GetDefaultBanners().then(
                            async (defaultBanners) => {
                                fullUser.banner_url =
                                    defaultBanners[
                                        Math.floor(
                                            Math.random() *
                                                defaultBanners.length
                                        )
                                    ];

                                // Generate a temporary password for the user
                                const password = GenerateTemporaryPassword();
                                await updateUserPassword(password);

                                // Code for signing up with github
                                await CreateUser(
                                    githubData?.githubToken!,
                                    fullUser
                                ).then(async ({ result }) => {
                                    setFinalizing(false);
                                    setCurrentUserData(fullUser);
                                    await sendEmailVerification(currentUser!);
                                    router.push(`/`);
                                });
                            }
                        );
                    });
                })
                .catch((error) => {
                    console.log('Finalize Profile Error: ', error);
                });
        } else {
            router.push('/');
        }
    }

    useEffect(() => {
        UpdateRepos();
    }, []);

    return (
        <section className="flex justify-center items-center h-screen max-w-lg mx-auto px-4">
            <div className="w-fit">
                {!repos ? (
                    <PageLoader />
                ) : (
                    <div>
                        {repos.length < 1 ? (
                            <>
                                <h1 className="font-roboto font-bold text-2xl mb-4 md:text-3xl text-primary-light">
                                    Looks like you&apos;re skipping this step!
                                </h1>
                                <p className="font-poppins font-light leading-8 text-default-light">
                                    Usually we would display a list of public
                                    repos we found for your account and ask you
                                    to choose which you would like to list as
                                    Open Source projects, but it seems we came
                                    up empty. Click continue to continue on
                                    towards the site.
                                </p>
                            </>
                        ) : (
                            <>
                                <h1 className="font-title font-bold text-2xl mb-4 md:text-3xl">
                                    Almost Done!
                                </h1>
                                <p className="font-paragraph font-light leading-8">
                                    Below is a list of all public repositories
                                    we found for your account. Select which
                                    projects you would like to be listed as Open
                                    Source projects. If you aren&apos;t sure
                                    now, you can continue without selecting any
                                    and do this later in your profile page.
                                </p>
                                <div
                                    id="repos"
                                    className="my-6 max-h-44 overflow-y-scroll border-2 border-default-light rounded-md"
                                >
                                    {repos.map((repo, index) => (
                                        <RepositoryCheckbox
                                            repo={repo}
                                            key={index}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                        <button
                            className="px-8 py-3 font-title font-medium bg-default-light text-background-light rounded-md mt-8"
                            onClick={FinalizeProfileSetup}
                        >
                            {finalizing ? (
                                <div className="animate-spin">
                                    <AiOutlineLoading3Quarters
                                        size={25}
                                        color="#03080E"
                                    />
                                </div>
                            ) : (
                                'Continue'
                            )}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
