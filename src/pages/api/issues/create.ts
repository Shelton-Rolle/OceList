import { NextApiRequest, NextApiResponse } from 'next';
import database from '@/firebase/database/databaseInit';
import { ref, set } from 'firebase/database';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { issues } = req.body;

    issues.map(async (issue: any) => {
        const { id } = issue;
        await set(ref(database, `issues/${id}`), issue).catch((error) =>
            res.status(400).json({ error })
        );
    });
    res.status(200).json({ created: true, errors: [] });
}
