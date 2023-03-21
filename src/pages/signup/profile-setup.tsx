import { RepositoryCheckbox } from '@/components/RepoCheckbox';
import CreateProjects from '@/database/CreateProjects';
import CreateUser from '@/database/CreateUser';
import { GetGithubUserRepos } from '@/firebase/auth/gitHubAuth/octokit';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';

export default function ProfileSetup() {
    const { currentUser, githubData } = useAuth();
    const router = useRouter();

    // This will be an array of Projects
    const [repos, setRepos] = useState<any[]>();

    async function UpdateRepos() {
        await GetGithubUserRepos(githubData?.token!, githubData?.login!)
            .then((res) => setRepos(res))
            .catch((err) => console.error(err));
    }

    async function FinalizeProfileSetup() {
        // Create Project Instances of each project in the database
        await CreateProjects(Object.values(githubData?.projects)).then(
            async () => {
                const fullUser = {
                    ...currentUser,
                    ...githubData,
                };

                await CreateUser(fullUser).then(() => {
                    router.push(`/profile/${githubData?.login}`);
                });
            }
        );
        // Create User instance of the user data in the database
    }

    useEffect(() => {
        console.log('Current User: ', currentUser);
    }, [currentUser]);

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
