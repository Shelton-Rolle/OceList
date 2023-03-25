import MutateProjectObjects from '@/helpers/MutateProjectObjects';
import { DatabaseProjectData, Project } from '@/types/dataObjects';
import CreateIssues from './CreateIssues';

export default async function CreateProjects(
    token: string,
    projects: Project[]
) {
    // Create Issue Instances for each issue in each projects
    await projects.map(async (project: Project) => {
        await CreateIssues(project?.issues!);
    });
    const mutatedProjects = await MutateProjectObjects(token, projects);

    const data = {
        projects: mutatedProjects,
    };

    await fetch('/api/projects/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}
