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

        await fetch('/api/projects/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((res) => (result = res))
            .catch((error) => {
                console.log('Projects Remove Error');
                console.error(error);
            });
    } else {
        console.log('No Projects To Remove');
    }

    return result;
}
