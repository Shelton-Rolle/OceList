import { DatabaseProjectData, IUser } from '@/types/dataObjects';
import RemoveProjects from './RemoveProjects';

export default async function RemoveUser(user: IUser) {
    let result;
    const { projects } = user;

    if (projects) {
        await RemoveProjects(projects as DatabaseProjectData[]);
    }

    const data = {
        displayName: user?.displayName,
    };

    await fetch('/api/users/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .then((res) => (result = res))
        .catch((error) => {
            console.log('User Remove Error');
            console.error(error);
        });

    return result;
}
