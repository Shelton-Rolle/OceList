import { GetGitHubRepositoryLanugages } from '@/firebase/auth/gitHubAuth/octokit';
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
        const { id, name, owner, languages_url, issues } = projects[i];
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
                });
            });
        }

        const languages = await GetGitHubRepositoryLanugages(
            token,
            owner?.login!,
            name!
        );

        mutatedProjects?.push({
            ...projects[i],
            issues: issueData,
            languages,
        });
    }

    return mutatedProjects;
}
