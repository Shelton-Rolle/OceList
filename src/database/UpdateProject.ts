import MutateProjectObjects from '@/helpers/MutateProjectObjects';
import { DatabaseProjectData, IUser } from '@/types/dataObjects';
import GetUser from './GetUser';
import UpdateUser from './UpdateUser';

export default async function UpdateProject(
    token: string,
    project: DatabaseProjectData,
    ownerName: string
): Promise<boolean> {
    let updated = false;
    const mutatedProject = await MutateProjectObjects(token, [project]);

    const user: IUser | undefined = await GetUser(ownerName);
    const projects = user?.projects;

    if (projects) {
        for (let i = 0; i < projects?.length; i++) {
            if (projects[i]?.id === project.id) {
                projects[i] = mutatedProject[0];
                break;
            }
        }
    }

    const updatedUser = {
        ...user,
        projects,
    };
    console.log('Updated User: ', updatedUser);

    const projectData = {
        project: mutatedProject[0],
    };

    await fetch(`/api/projects/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
    })
        .then((res) => res.json())
        .then(async (res) => {
            if (res?.updated) {
                await UpdateUser(updatedUser).then(({ result }) => {
                    if (result?.updated) {
                        updated = true;
                    } else {
                        console.log('Errors: ', result?.errors);
                    }
                });
            }
        });
    return updated;
}
