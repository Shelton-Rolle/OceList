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

export default function ProfileSetup() {
    const {
        currentUser,
        githubData,
        setCurrentUserData,
        updateUserPassword,
        UpdateProfile,
    } = useAuth();
    const router = useRouter();

    // This will be an array of Projects
    const [repos, setRepos] = useState<Project[]>();

    async function UpdateRepos() {
        await GetGithubUserRepos(githubData?.githubToken!, githubData?.login!)
            .then((res) => setRepos(res))
            .catch((err) => console.error(err));
    }

    async function FinalizeProfileSetup() {
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
                    await GetDefaultBanners().then(async (defaultBanners) => {
                        fullUser.banner_url =
                            defaultBanners[
                                Math.floor(
                                    Math.random() * defaultBanners.length
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
                            setCurrentUserData(fullUser);
                            await sendEmailVerification(currentUser!);
                            router.push(`/`);
                        });
                    });
                });
            })
            .catch((error) => {
                console.log('Finalize Profile Error: ', error);
            });
    }

    useEffect(() => {
        UpdateRepos();
    }, []);

    return (
        <div>
            {!repos ? (
                <div>Loading</div>
            ) : (
                <>
                    {repos.length < 1 ? (
                        <p>No Repos Found</p>
                    ) : (
                        <>
                            <h1>
                                Select which repos you want to list as open
                                source projects
                            </h1>
                            <div id="repos">
                                {repos.map((repo, index) => (
                                    <RepositoryCheckbox
                                        repo={repo}
                                        key={index}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}
            <button onClick={FinalizeProfileSetup}>Continue</button>
        </div>
    );
}
