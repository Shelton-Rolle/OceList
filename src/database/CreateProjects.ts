import CreateIssues from './CreateIssues';

export default async function CreateProjects(projects: any[]) {
    // Create Issue Instances for each issue in each projects
    await projects.map(async (project: any) => {
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
