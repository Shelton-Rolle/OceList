import { RepositoryCheckbox } from '@/components/RepoCheckbox';
import { GetGithubUserRepos } from '@/firebase/auth/gitHubAuth/octokit';
import { RootState } from '@/redux/store';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function ProfileSetup() {
    const { user } = useSelector((state: RootState) => state?.user);

    // This will be an array of Projects
    const [repos, setRepos] = useState<any[]>([]);

    async function UpdateRepos(user: any) {
        await GetGithubUserRepos(user?.token, user?.login)
            .then((res) => setRepos(res))
            .catch((err) => console.error(err));
    }

    async function FinalizeProfileSetup() {}

    useEffect(() => {
        UpdateRepos(user);
    }, [user]);

    return (
        <div>
            {repos.length < 1 ? (
                <div>Loading</div>
            ) : (
                <>
                    <h1>
                        Select which repos you want to list as open source
                        projects
                    </h1>
                    <div id="repos">
                        {repos.map((repo, index) => (
                            <RepositoryCheckbox repo={repo} key={index} />
                        ))}
                    </div>
                </>
            )}
            <button onClick={FinalizeProfileSetup}>Continue</button>
        </div>
    );
}
