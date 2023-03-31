import database from '@/firebase/database/databaseInit';
import { set, ref } from 'firebase/database';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { project } = req.body;

    await set(ref(database, `projects/${project?.id}`), project)
        .then(() => {
            res.status(200).json({ updated: true, errors: [] });
        })
        .catch((error) => res.status(400).json({ error }));
}
