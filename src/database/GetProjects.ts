import { Project } from '@/types/dataObjects';

export default async function GetProjects(): Promise<Project[]> {
    let projects: Project[] = [];

    await fetch('/api/projects')
        .then((res) => res.json())
        .then((res) => (projects = Object.values(res?.data)))
        .catch((error) => console.error(error));

    return projects;
}
