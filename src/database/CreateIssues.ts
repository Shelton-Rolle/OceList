import { Issue } from '@/types/dataObjects';

export default async function CreateIssues(issues: Issue[]) {
    const issueData: any[] = [];
    for (let i = 0; i < issues.length; i++) {
        const { repository_url } = issues[i];

        await fetch(repository_url!)
            .then((res) => res.json())
            .then((data) => {
                const { id, name } = data;
                issueData.push({
                    ...issues[i],
                    project: data,
                    type: 'issue',
                });
            })
            .catch((err) => console.error(err));
    }

    const data = {
        issues: issueData,
    };

    await fetch('/api/issues/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}
