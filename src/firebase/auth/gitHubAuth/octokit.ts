import { Octokit } from 'octokit';

function OctokitInit(token: string) {
    const octokit = new Octokit({
        auth: token,
    });

    return octokit;
}

// This should return a Promise<User>
export async function GetGitHubUser(token: string): Promise<any> {
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

// This should return a Promise<Project[]>
export async function GetGithubUserRepos(
    token: string,
    username: string
): Promise<any[]> {
    let data: any[] = [];
    const octokit = OctokitInit(token);

    await octokit
        .request('GET /users/{username}/repos', {
            username,
        })
        .then((res) => {
            data = res?.data;
        })
        .catch((err) => {
            console.error(err);
        });

    return data;
}
