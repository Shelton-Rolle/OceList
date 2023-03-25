import { NextApiRequest, NextApiResponse } from 'next';
import database from '@/firebase/database/databaseInit';
import { ref, remove } from 'firebase/database';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { issues } = req.body;

    issues.map(async (issue: any) => {
        await remove(ref(database, `issues/${issue.id}`)).catch((error) =>
            res.status(400).json({ error })
        );
    });
    res.status(200).json({ deleted: true, errors: [] });
}
