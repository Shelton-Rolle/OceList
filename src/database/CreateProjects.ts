import MutateProjectObjects from '@/helpers/MutateProjectObjects';
import { DatabaseProjectData, Project } from '@/types/dataObjects';
import CreateIssues from './CreateIssues';

export default async function CreateProjects(projects: Project[]) {
    // Create Issue Instances for each issue in each projects
    await projects.map(async (project: Project) => {
        await CreateIssues(project?.issues);
    });

    const data = {
        apiKey: 'test123456',
        projects,
    };

    await fetch('http://localhost:3001/projects/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}
