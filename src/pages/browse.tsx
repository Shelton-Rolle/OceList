import { IssueCard } from '@/components/IssueCard';
import { ProjectCard } from '@/components/ProjectCard';
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
                <div id="search" className="flex flex-col items-end">
                    <h1 className="font-medium text-sm mb-1">Filter By</h1>
                    <select
                        name="search-filter"
                        id="search-filter"
                        className="p-4"
                    >
                        <option value="title">Title</option>
                        <option value="title">Owner</option>
                        <option value="title">Language</option>
                    </select>
                    <input
                        type="text"
                        id="search-bar"
                        placeholder="Search"
                        className=" my-5 border border-black rounded-md w-3/4 px-5 py-3 bg-slate-500 text-white placeholder:text-white"
                    />
                </div>
                <div className="w-full grid grid-cols-2 mb-6">
                    <button
                        onClick={() => ChangeSearch('project')}
                        className={`py-3 border-b-2 duration-150 ${
                            searchProjects
                                ? 'border-b-black text-black'
                                : 'border-b-gray-300 text-gray-300'
                        }`}
                    >
                        Projects
                    </button>
                    <button
                        onClick={() => ChangeSearch('issue')}
                        className={`py-3 border-b-2 duration-150 ${
                            searchIssues
                                ? 'border-b-black text-black'
                                : 'border-b-gray-300 text-gray-300'
                        }`}
                    >
                        Issues
                    </button>
                </div>
                <section className="grid grid-cols-2 gap-7">
                    {searchProjects && (
                        <>
                            {projects?.map((project, index) => (
                                <ProjectCard project={project} key={index} />
                            ))}
                        </>
                    )}
                    {searchIssues && (
                        <>
                            {issues?.map((issue, index) => (
                                <IssueCard issue={issue} key={index} />
                            ))}
                        </>
                    )}
                </section>
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
