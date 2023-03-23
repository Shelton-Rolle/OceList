import { Issue } from '@/types/dataObjects';

interface DatabaseIssueObject {
    id: number;
    title: string;
    body: string;
    repoId: number;
    repoName: string;
    state: string;
}

export default async function CreateIssues(issues: Issue[]) {
    const issueData: DatabaseIssueObject[] = [];
    for (let i = 0; i < issues.length; i++) {
        const { id, title, body, repository_url, state } = issues[i];

        await fetch(repository_url)
            .then((res) => res.json())
            .then((data) => {
                const { id, name } = data;
                issueData.push({
                    id,
                    title,
                    body,
                    repoId: id,
                    repoName: name,
                    state,
                });
            })
            .catch((err) => console.error(err));
    }

    const data = {
        apiKey: 'test123456',
        issues: issueData,
    };

    await fetch('http://localhost:3001/issues/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}
