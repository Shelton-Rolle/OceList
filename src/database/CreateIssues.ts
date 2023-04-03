import { Issue, Project } from '@/types/dataObjects';

export default async function CreateIssues(project: Project, issues: Issue[]) {
    const issueData: any[] = [];
    for (let i = 0; i < issues.length; i++) {
        const { repository_url } = issues[i];

        issueData.push({
            ...issues[i],
            repository: project,
            type: 'issue',
        });
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
