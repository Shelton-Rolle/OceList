export default async function CreateProjects(projects: any[]) {
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
    })
        .then((res) => console.log('Res: ', res))
        .catch((err) => console.error(err));
}
