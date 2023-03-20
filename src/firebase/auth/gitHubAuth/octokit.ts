import { Octokit } from 'octokit';

function OctokitInit(token: string) {
    const octokit = new Octokit({
        auth: token,
    });

    return octokit;
}

export async function GetGitHubUser(token: string) {
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

// User users' username to get repos
// await octokit
//     .request('GET /users/{username}/repos', {
//         username: res?.data?.login,
//     })
//     .then((res) => {
//         // Log the  users repos
//         console.log('Repos: ', res);
//     })
//     .catch((err) => {
//         console.error(err);
//     });
