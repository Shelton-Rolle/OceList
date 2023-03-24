import { DatabaseProjectData, IUser } from '@/types/dataObjects';
import RemoveProjects from './RemoveProjects';

export default async function RemoveUser(user: IUser) {
    let result;
    const { projects } = user;

    if (projects) {
        console.log('HELLLOOOO');
        const projectRemovalResult: any = await RemoveProjects(
            projects as DatabaseProjectData[]
        );

        if (projectRemovalResult?.deleted) {
            const data = {
                apiKey: 'test123456',
                user,
            };

            await fetch('http://localhost:3001/users/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
                .then((res) => res.json())
                .then((res) => (result = res));
        }
    } else {
        const data = {
            apiKey: 'test123456',
            user,
        };

        await fetch('http://localhost:3001/users/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((res) => (result = res));
    }

    return result;
}
