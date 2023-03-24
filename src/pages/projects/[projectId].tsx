import GetProject from '@/database/GetProject';
import { GetGitHubRepository } from '@/firebase/auth/gitHubAuth/octokit';
import { GetServerSideProps } from 'next';
import { useEffect } from 'react';

export default function ProjectPage({ projectId, project }: any) {
    useEffect(() => {
        console.log('Project Id: ', projectId);
        console.log('Data: ', project);
    }, []);

    return <div>Project Page</div>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const projectId = context?.params?.projectId;

    const data = await GetProject(projectId as string);
    const project = data?.data;

    return {
        props: {
            projectId,
            project,
        },
    };
};
