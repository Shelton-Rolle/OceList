import { IUser } from '@/types/dataObjects';

export default async function GetUser(
    displayName: string
): Promise<IUser | undefined> {
    let userData: IUser | undefined;
    const data = {
        apiKey: 'test123456',
    };

    await fetch(
        `http://localhost:3001/users/${displayName}?` +
            new URLSearchParams(data)
    )
        .then((res: any) => res.json())
        .then((response) => {
            userData = response?.data;
        })
        .catch((err) => console.error(err));

    return userData;
}
