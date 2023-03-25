import { NextApiRequest, NextApiResponse } from 'next';
import database from '@/firebase/database/databaseInit';
import { ref, set } from 'firebase/database';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { projects } = req.body;
    projects.map(async (project: any) => {
        const { id } = project;
        await set(ref(database, `projects/${id}`), project).catch((error) =>
            res.status(400).json({ error })
        );
    });
    res.status(200).json({ created: true, errors: [] });
}
