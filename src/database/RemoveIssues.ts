import { DatabaseIssueObject } from '@/types/dataObjects';

export default async function RemoveIssues(issues: DatabaseIssueObject[]) {
    let result;

    if (issues) {
        const data = {
            apiKey: 'test123456',
            issues,
        };

        await fetch('http://localhost:3001/issues/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((res) => (result = res));
    } else {
        console.log('No Issues To Remove');
    }

    return result;
}
