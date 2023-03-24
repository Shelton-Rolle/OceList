import { GithubUserObject, Issue, Project } from '@/types/dataObjects';
import { Octokit } from 'octokit';

function OctokitInit(token: string) {
    const octokit = new Octokit({
        auth: token,
    });

    return octokit;
}

// This should return a Promise<User>
export async function GetGitHubUser(
    token: string
): Promise<GithubUserObject | undefined> {
    let user;
    const octokit = OctokitInit(token);

    await octokit
        .request('GET /user')
        .then(async (res) => {
            user = res?.data;
        })
        .catch((err) => {
            console.error(err);
        });

    return user;
}

export async function GetGitHubUserIssues(
    token: string
): Promise<Issue[] | undefined> {
    let issues;
    const octokit = OctokitInit(token);

    await octokit
        .request('GET /issues')
        .then(async (res) => {
            issues = res?.data;
        })
        .catch((error) => {
            console.log('Get Github Issues Error: ', error);
        });

    return issues;
}

// This should return a Promise<Project[]>
export async function GetGithubUserRepos(
    token: string,
    username: string
): Promise<Project[]> {
    let data: Project[] = [];
    const octokit = OctokitInit(token);

    await octokit
        .request('GET /users/{username}/repos', {
            username,
        })
        .then(async (res) => {
            const repoData = res?.data;
            const updatedRepoData: any[] = [];

            for (let i = 0; i < repoData.length; i++) {
                const repo = repoData[i];

                await GetGithubRepoIssues(token, repo.owner.login, repo.name)
                    .then((res) => {
                        const updatedRepo = { ...repo, issues: res };
                        updatedRepoData.push(updatedRepo);
                    })
                    .catch((err) => console.error(err));
            }

            data = updatedRepoData;
        })
        .catch((err) => {
            console.error(err);
        });

    return data;
}

export async function GetGithubRepoIssues(
    token: string,
    ownerLogin: string,
    repoName: string
) {
    let data: any[] = [];
    const octokit = OctokitInit(token);

    await octokit
        .request('GET /repos/{owner}/{repo}/issues', {
            owner: ownerLogin,
            repo: repoName,
        })
        .then((res) => {
            data = res?.data;
        });

    return data;
}

export async function GetGitHubRepository(
    token: string,
    owner: string,
    repo: string
) {
    let data;
    const octokit = OctokitInit(token);

    await octokit
        .request('GET /repos/{owner}/{repo}}', {
            owner,
            repo,
        })
        .then((res) => {
            data = res?.data;
        })
        .catch((error) => {
            console.error(error);
        });

    return data;
}
