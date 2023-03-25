import { NextApiRequest, NextApiResponse } from 'next';
import database from '@/firebase/database/databaseInit';
import { ref, child, get } from 'firebase/database';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { displayName } = req.query;

    await get(child(ref(database), `users/${displayName}`))
        .then((snapshot) => {
            if (snapshot.exists()) {
                res.status(200).json({ data: snapshot.val() });
            } else {
                res.status(200).json({ data: null });
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
}
