import { NextApiRequest, NextApiResponse } from 'next';
import database from '@/firebase/database/databaseInit';
import { ref, remove } from 'firebase/database';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { displayName } = req.body;

    await remove(ref(database, `users/${displayName}`))
        .then(() => {
            res.status(200).json({ deleted: true, errors: [] });
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
}
