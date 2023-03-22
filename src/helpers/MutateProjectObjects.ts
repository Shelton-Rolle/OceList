import { DatabaseProjectData } from '@/database/CreateProjects';
import { Project } from '@/types/dataObjects';

export default async function MutateProjectObjects(
    projects: Project[]
): Promise<DatabaseProjectData[]> {
    let mutatedProjects: DatabaseProjectData[] = [];

    for (let i = 0; i < projects.length; i++) {
        const { id, name, owner, languages_url } = projects[i];

        await fetch(languages_url)
            .then((res) => res.json())
            .then((langs) => {
                const languages = Object.keys(langs);
                mutatedProjects?.push({
                    id,
                    name,
                    owner,
                    languages,
                });
            })
            .catch((err) => console.error(err));
    }

    return mutatedProjects;
}
