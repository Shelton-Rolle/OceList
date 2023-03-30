import { DatabaseProjectData, IUser } from '@/types/dataObjects';
import RemoveProjects from './RemoveProjects';
import UpdateUser from './UpdateUser';

export default async function DeleteProject(
    user: IUser,
    project: DatabaseProjectData
) {
    let result;
    let index: number | undefined;

    for (let i = 0; i < user?.projects?.length!; i++) {
        if (user?.projects![i]?.id === project?.id) {
            index = i;
            user?.projects?.splice(index!, 1);
            break;
        }
    }

    await RemoveProjects([project]).then(async () => {
        const updatedUser: IUser = {
            ...user,
            projects: user?.projects,
        };
        await UpdateUser(updatedUser)
            .then((res) => {
                result = res;
            })
            .catch((error) => {
                console.error(error);
            });
    });

    return result;
}
