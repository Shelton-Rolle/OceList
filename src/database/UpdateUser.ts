import { IUser } from '@/types/dataObjects';

export default async function UpdateUser(user: IUser) {
    const data = {
        apiKey: 'test123456',
        userId: user?.uid,
        updatedData: user,
    };

    await fetch('http://localhost:3001/users/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then((res) => res.json())
        .then((res) => console.log('res: ', res))
        .catch((err) => console.error(err));
}
