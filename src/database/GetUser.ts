import { IUser } from '@/types/dataObjects';

export default async function GetUser(
    displayName: string
): Promise<IUser | undefined> {
    let userData: IUser | undefined;

    await fetch(`/api/users/${displayName}`)
        .then((res: any) => res.json())
        .then((response) => (userData = response?.data))
        .catch((err) => console.error(err));

    return userData;
}
