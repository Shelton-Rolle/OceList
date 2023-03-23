import { DatabaseProjectData } from '@/types/dataObjects';
import RemoveIssues from './RemoveIssues';

export default async function RemoveProjects(projects: DatabaseProjectData[]) {
    let result;

    if (projects) {
        await projects.map(async (project) => {
            await RemoveIssues(project?.issues!);
        });

        const data = {
            apiKey: 'test123456',
            projects,
        };

        await fetch('http://localhost:3001/projects/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((res) => (result = res));
    } else {
        console.log('No Projects To Remove');
    }

    return result;
}
