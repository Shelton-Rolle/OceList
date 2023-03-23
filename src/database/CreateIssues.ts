import { DatabaseIssueObject, Issue } from '@/types/dataObjects';

export default async function CreateIssues(issues: Issue[]) {
    const issueData: DatabaseIssueObject[] = [];
    for (let i = 0; i < issues.length; i++) {
        const { title, body, repository_url, state } = issues[i];

        await fetch(repository_url)
            .then((res) => res.json())
            .then((data) => {
                const { id, name } = data;
                issueData.push({
                    id: issues[i].id,
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
