import { Project } from '@/types/dataObjects';
import CreateIssues from './CreateIssues';

interface DatabaseProjectData {
    id: number;
    name: string;
    owner: any;
    languages: string[];
}

export default async function CreateProjects(projects: Project[]) {
    // Create Issue Instances for each issue in each projects
    await projects.map(async (project: Project) => {
        await CreateIssues(project?.issues);
    });

    const projectData: DatabaseProjectData[] = [];
    for (let i = 0; i < projects.length; i++) {
        const { id, name, owner, languages_url } = projects[i];

        await fetch(languages_url)
            .then((res) => res.json())
            .then((langs) => {
                const languages = Object.keys(langs);
                projectData.push({
                    id,
                    name,
                    owner,
                    languages,
                });
            })
            .catch((err) => console.error(err));
    }

    const data = {
        apiKey: 'test123456',
        projects: projectData,
    };

    await fetch('http://localhost:3001/projects/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}
