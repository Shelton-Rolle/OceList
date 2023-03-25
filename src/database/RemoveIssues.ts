import { DatabaseIssueObject } from '@/types/dataObjects';

export default async function RemoveIssues(issues: DatabaseIssueObject[]) {
    let result;

    if (issues) {
        const data = {
            issues,
        };

        await fetch('/api/issues/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((res) => (result = res))
            .catch((error) => {
                console.log('Issues Remove Error: ');
                console.error(error);
            });
    } else {
        console.log('No Issues To Remove');
    }

    return result;
}
