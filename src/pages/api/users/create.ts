import { NextApiRequest, NextApiResponse } from 'next';
import database from '@/firebase/database/databaseInit';
import { ref, child, get, set } from 'firebase/database';
import { IUser } from '@/types/dataObjects';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { user } = req.body;

    await get(child(ref(database), '/users'))
        .then((snapshot) => {
            if (snapshot.exists()) {
                const userData: IUser[] = Object.values(snapshot.val());
                let uniqueEmail = true;

                userData.map((existingUser) => {
                    if (existingUser?.email === user.email) uniqueEmail = false;
                });

                if (uniqueEmail) {
                    set(ref(database, `users/${user.displayName}`), user);
                    res.status(200).json({ created: true, errors: [] });
                } else {
                    res.status(400).json({
                        created: false,
                        errors: ['email-taken'],
                    });
                }
            } else {
                set(ref(database, `users/${user.displayName}`), user);
                res.status(200).json({ created: true, errors: [] });
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
}
