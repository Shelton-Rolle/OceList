import {
    GetGitHubRepositoryLanugages,
    GetProjectContributors,
    GetProjectReadme,
    GetRepositorySubscribers,
} from '@/firebase/auth/gitHubAuth/octokit';
import {
    DatabaseIssueObject,
    DatabaseProjectData,
    Project,
} from '@/types/dataObjects';

export default async function MutateProjectObjects(
    token: string,
    projects: Project[]
): Promise<DatabaseProjectData[]> {
    let mutatedProjects: DatabaseProjectData[] = [];

    for (let i = 0; i < projects.length; i++) {
        const { name, owner, issues } = projects[i];
        const issueData: DatabaseIssueObject[] = [];

        if (issues) {
            await issues.map((issue) => {
                const { id, body, state, title } = issue;
                issueData.push({
                    id: id!,
                    body: body!,
                    state: state!,
                    title: title!,
                    repoId: projects[i].id!,
                    repoName: name!,
                    type: 'issue',
                });
            });
        }

        const languages = await GetGitHubRepositoryLanugages(
            token,
            owner?.login!,
            name!
        );

        const readme = await GetProjectReadme(token, owner?.login!, name!);

        const contributors = await GetProjectContributors(
            token,
            owner?.login!,
            name!
        );

        const subscribers = await GetRepositorySubscribers(
            token,
            owner?.login!,
            name!
        );

        mutatedProjects?.push({
            ...projects[i],
            issues: issueData,
            languages,
            readme,
            contributors,
            subscribers,
            type: 'project',
        });
    }

    return mutatedProjects;
}
