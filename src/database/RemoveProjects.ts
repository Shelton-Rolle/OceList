import { DatabaseProjectData } from '@/types/dataObjects';
import RemoveIssues from './RemoveIssues';

export default async function RemoveProjects(projects: DatabaseProjectData[]) {
    if (projects) {
        console.log('Remove these projects: ', projects);
        await projects.map(async (project) => {
            await RemoveIssues(project?.issues!);
        });

        const data = {
            apiKey: 'test123456',
            projects,
        };
    } else {
        console.log('No Projects To Remove');
    }
}
