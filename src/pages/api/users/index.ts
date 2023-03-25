import { NextApiRequest, NextApiResponse } from 'next';
import database from '@/firebase/database/databaseInit';
import { ref, child, get } from 'firebase/database';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    await get(child(ref(database), '/users'))
        .then((snapshot) => {
            if (snapshot.exists()) {
                res.status(200).json({ data: snapshot.val() });
            } else {
                res.status(201).json({ data: [] });
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
}
