import MutateProjectObjects from '@/helpers/MutateProjectObjects';
import { DatabaseProjectData, IUser, Project } from '@/types/dataObjects';

export default async function UpdateUser(user: IUser) {
    let result: { updated: boolean; errors: string[] } | undefined;

    const data = {
        displayName: user?.displayName,
        updatedData: user,
    };

    await fetch('/api/users/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .then((res) => {
            result = res;
        })
        .catch((err) => console.error(err));

    return { result };
}
