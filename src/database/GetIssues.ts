import { Issue } from '@/types/dataObjects';

export default async function GetIssues(): Promise<Issue[]> {
    let issues: Issue[] = [];

    await fetch('/api/issues')
        .then((res) => res.json())
        .then((res) => (issues = Object.values(res?.data)))
        .catch((error) => console.error(error));

    return issues;
}
