import MutateProjectObjects from '@/helpers/MutateProjectObjects';
import { DatabaseProjectData, IUser, Project } from '@/types/dataObjects';

export default async function CreateUser(user: IUser) {
    let result: { created: boolean; errors: string[] } | undefined;
    let projects: DatabaseProjectData[] = [];

    if (user?.projects) {
        projects = await MutateProjectObjects(user?.projects as Project[]);
    }

    const updatedUser: IUser = {
        ...user,
        projects,
    };

    const data = {
        user: updatedUser,
    };

    await fetch('/api/users/create', {
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

    return { result, user: updatedUser };
}
