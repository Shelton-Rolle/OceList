export default async function CreateIssues(issues: any[]) {
    const data = {
        apiKey: 'test123456',
        issues,
    };

    await fetch('http://localhost:3001/issues/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}
