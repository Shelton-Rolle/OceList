import database from '@/firebase/database/databaseInit';
import { PageLayout } from '@/layouts/PageLayout';
import { BrowsePageProps } from '@/types/props';
import { get, child, ref } from 'firebase/database';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function BrowsePage({ projects, issues }: BrowsePageProps) {
    const [searchProjects, setSearchProjects] = useState<boolean>(true);
    const [searchIssues, setSearchIssues] = useState<boolean>(false);

    async function ChangeSearch(newType: string) {
        switch (newType) {
            case 'project':
                if (searchIssues) {
                    setSearchIssues(false);
                    setSearchProjects(true);
                }
                break;
            case 'issue':
                if (searchProjects) {
                    setSearchProjects(false);
                    setSearchIssues(true);
                }
                break;
        }
    }

    useEffect(() => {
        console.log('Projects: ', projects);
        console.log('Issues: ', issues);
    }, []);

    return (
        <>
            <Head>
                <title>Landing</title>
                <meta name="description" content="Landing Page" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <PageLayout>
                <div>
                    <button
                        onClick={() => ChangeSearch('project')}
                        className="outline outline-2 outline-black p-5 mx-5"
                    >
                        Searh Projects
                    </button>
                    <button
                        onClick={() => ChangeSearch('issue')}
                        className="outline outline-2 outline-black p-5 mx-5"
                    >
                        Search Issues
                    </button>
                </div>
                <div>
                    {searchProjects && <h1>Searching Projects</h1>}
                    {searchIssues && <h1>Searching Issues</h1>}
                </div>
            </PageLayout>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const projects = await get(child(ref(database), '/projects'))
        .then((snapshot) => {
            if (snapshot.exists()) {
                return Object.values(snapshot.val());
            } else {
                return [];
            }
        })
        .catch((error) => {
            console.error(error);
        });

    const issues = await get(child(ref(database), '/issues'))
        .then((snapshot) => {
            if (snapshot.exists()) {
                return Object.values(snapshot.val());
            } else {
                return [];
            }
        })
        .catch((error) => {
            console.error(error);
        });

    return {
        props: {
            projects,
            issues,
        },
    };
};
