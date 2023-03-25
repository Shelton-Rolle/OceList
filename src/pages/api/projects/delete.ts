import { NextApiRequest, NextApiResponse } from 'next';
import database from '@/firebase/database/databaseInit';
import { ref, remove } from 'firebase/database';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { projects } = req.body;
    projects.map(async (project: any) => {
        await remove(ref(database, `projects/${project?.id}`)).catch((error) =>
            res.status(400).json({ error })
        );
    });
    res.status(200).json({ deleted: true, errors: [] });
}
