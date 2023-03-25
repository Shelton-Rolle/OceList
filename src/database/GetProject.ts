import { Project } from '@/types/dataObjects';

export default async function GetProject(
    projectId: string
): Promise<{ data: Project[] | undefined; errors: string[] } | undefined> {
    let result;

    await fetch(`/api/projects/${projectId}`)
        .then((res) => res.json())
        .then((res) => (result = res))
        .catch((error) => console.log(error));

    return result;
}
