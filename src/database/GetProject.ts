import { Project } from '@/types/dataObjects';

export default async function GetProject(
    projectId: string
): Promise<{ data: Project[] | undefined; errors: string[] } | undefined> {
    let result;

    const data = {
        apiKey: 'test123456',
    };

    await fetch(
        `http://localhost:3001/projects/${projectId}?` +
            new URLSearchParams(data)
    )
        .then((res) => res.json())
        .then((res) => (result = res))
        .catch((error) => console.log(error));

    return result;
}
