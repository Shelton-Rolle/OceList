import { RepositoryCheckbox } from '@/components/RepoCheckbox';
import CreateProjects from '@/database/CreateProjects';
import CreateUser from '@/database/CreateUser';
import { GetGithubUserRepos } from '@/firebase/auth/gitHubAuth/octokit';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { IUser, Project } from '@/types/dataObjects';
import GenerateTemporaryPassword from '@/helpers/GenerateTemporaryPassword';
import UpdateUserWithGithubData from '@/database/UpdateUserWithGithub';
import { sendPasswordResetEmail } from 'firebase/auth';
import auth from '@/firebase/auth/authInit';

export default function ProfileSetup() {
    const { currentUser, githubData, updateUserPassword, currentUserData } =
        useAuth();
    const router = useRouter();

    // This will be an array of Projects
    const [repos, setRepos] = useState<Project[]>();

    async function UpdateRepos() {
        await GetGithubUserRepos(githubData?.token!, githubData?.login!)
            .then((res) => setRepos(res))
            .catch((err) => console.error(err));
    }

    async function FinalizeProfileSetup() {
        console.log('Current Database Data: ', currentUserData);

        // Create Project Instances of each project in the database
        await CreateProjects(Object.values(githubData?.projects)).then(
            async () => {
                const fullUser: IUser = {
                    ...currentUser,
                    ...githubData,
                };

                if (currentUserData) {
                    fullUser.photoURL = currentUserData?.photoURL;
                    fullUser.login = currentUserData?.login;
                    // Code for connecting github to current account
                    await UpdateUserWithGithubData(fullUser).then(
                        ({ result }) => {
                            console.log('Update Request Result: ', result);
                        }
                    );
                    router.push(`/profile/${currentUserData?.login}`);
                } else {
                    // Code for signing up with github
                    await CreateUser(fullUser).then(async ({ result }) => {
                        console.log('Create Request Reesult: ', result);
                        await sendPasswordResetEmail(
                            auth,
                            currentUser?.email!
                        ).then(() => {
                            router.push(`/profile/${githubData?.login}`);
                        });
                    });
                }
            }
        );
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
