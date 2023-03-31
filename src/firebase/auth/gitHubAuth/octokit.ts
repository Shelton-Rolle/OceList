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

export async function GetGitHubRepositoryLanugages(
    token: string,
    owner: string,
    repo: string
) {
    let languages;
    const octokit = OctokitInit(token);

    await octokit
        .request('GET /repos/{owner}/{repo}/languages', {
            owner,
            repo,
        })
        .then(async (res) => (languages = Object.keys(res?.data)))
        .catch((error) => console.error(error));

    return languages;
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
            console.error('Get Github User Repo Error: ', err);
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
        .request('GET /repos/{owner}/{repo}', {
            owner,
            repo,
        })
        .then((res) => {
            data = res?.data;
        })
        .catch((error) => {
            console.error('Get Repo Error: ', error);
        });

    return data;
}

export async function GetProjectContributors(
    token: string,
    owner: string,
    repo: string
) {
    let data;
    const octokit = OctokitInit(token);

    await octokit
        .request('GET /repos/{owner}/{repo}/contributors', {
            owner,
            repo,
        })
        .then((res) => {
            data = res?.data;
        });

    return data;
}

export async function GetProjectReadme(
    token: string,
    owner: string,
    repo: string
) {
    let data;
    const octokit = OctokitInit(token);

    await octokit
        .request('GET /repos/{owner}/{repo}/readme', {
            owner,
            repo,
        })
        .then((res) => {
            data = res?.data;
        });

    return data;
}

export async function GetRepositorySubscribers(
    token: string,
    owner: string,
    repo: string
) {
    let data;
    const octokit = OctokitInit(token);

    await octokit
        .request('GET /repos/{owner}/{repo}/subscribers', {
            owner,
            repo,
        })
        .then((res) => {
            data = res?.data;
        });

    return data;
}

export async function GetRepositoryStargazers(
    token: string,
    owner: string,
    repo: string
) {
    let data;
    const octokit = OctokitInit(token);

    await octokit
        .request('GET /repos/{owner}/{repo}/stargazers', {
            owner,
            repo,
        })
        .then((res) => {
            data = res?.data;
        });

    return data;
}

export async function GetRepositoryForksCount(
    token: string,
    owner: string,
    repo: string
) {
    let data;
    const octokit = OctokitInit(token);

    await octokit
        .request('GET /repos/{owner}/{repo}/forks', {
            owner,
            repo,
        })
        .then((res) => {
            data = res?.data.length;
        });

    return data;
}
