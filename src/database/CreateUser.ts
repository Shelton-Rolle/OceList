import MutateProjectObjects from '@/helpers/MutateProjectObjects';
import { IUser } from '@/types/dataObjects';
import { DatabaseProjectData } from './CreateProjects';

export default async function CreateUser(user: IUser) {
    const { projects } = user;
    const updatedProjects: DatabaseProjectData[] = await MutateProjectObjects(
        projects!
    );

    const updatedUser = {
        ...user,
        projects: updatedProjects,
    };

    const data = {
        apiKey: 'test123456',
        user: updatedUser,
    };

    await fetch('http://localhost:3001/users/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}
