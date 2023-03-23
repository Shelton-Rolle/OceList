import { DatabaseIssueObject } from '@/types/dataObjects';

export default async function RemoveIssues(issues: DatabaseIssueObject[]) {
    if (issues) {
        console.log('Remove These Issues: ', issues);
    } else {
        console.log('No Issues To Remove');
    }

    const data = {
        apiKey: 'test123456',
        issues,
    };
}
