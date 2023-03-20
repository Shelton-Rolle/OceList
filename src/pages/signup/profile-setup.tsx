import { RepositoryCheckbox } from '@/components/RepoCheckbox';
import CreateProjects from '@/database/CreateProjects';
import CreateUser from '@/database/CreateUser';
import { GetGithubUserRepos } from '@/firebase/auth/gitHubAuth/octokit';
import { RootState } from '@/redux/store';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function ProfileSetup() {
    const { user } = useSelector((state: RootState) => state?.user);

    // This will be an array of Projects
    const [repos, setRepos] = useState<any[]>();

    async function UpdateRepos(user: any) {
        await GetGithubUserRepos(user?.token, user?.login)
            .then((res) => setRepos(res))
            .catch((err) => console.error(err));
    }

    async function FinalizeProfileSetup() {
        // Create Project Instances of each project in the database
        await CreateProjects(Object.values(user?.projects)).then(async () => {
            await CreateUser(user);
        });
        // Create User instance of the user data in the database
    }

    useEffect(() => {
        UpdateRepos(user);
    }, [user]);

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
