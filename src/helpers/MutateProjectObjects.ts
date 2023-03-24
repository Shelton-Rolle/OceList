import {
    DatabaseIssueObject,
    DatabaseProjectData,
    Project,
} from '@/types/dataObjects';

export default async function MutateProjectObjects(
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
                    id,
                    body,
                    state,
                    title,
                    repoId: projects[i].id,
                    repoName: name,
                });
            });
        }

        await fetch(languages_url)
            .then((res) => res.json())
            .then((langs) => {
                const languages = Object.keys(langs);
                mutatedProjects?.push({
                    id,
                    name,
                    owner,
                    languages,
                    issues: issueData,
                });
            })
            .catch((err) => console.error(err));
    }

    return mutatedProjects;
}
