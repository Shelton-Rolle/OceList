import IssueCard from '@/components/IssueCard';
import ProjectCard from '@/components/ProjectCard';
import database from '@/firebase/database/databaseInit';
import { PageLayout } from '@/layouts/PageLayout';
import { DatabaseProjectData, Issue, Project } from '@/types/dataObjects';
import { BrowsePageProps } from '@/types/props';
import { get, child, ref } from 'firebase/database';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useState } from 'react';

export default function BrowsePage({ projects, issues }: BrowsePageProps) {
    const [searchProjects, setSearchProjects] = useState<boolean>(true);
    const [searchIssues, setSearchIssues] = useState<boolean>(false);
    const [searchFilter, setSearchFilter] = useState<string>('title');

    const [displayedProjects, setDisplayedProjects] =
        useState<DatabaseProjectData[]>(projects);
    const [displayedIssues, setDisplayedIssues] = useState<Issue[]>(issues);

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

    async function UpdateDisplayResults(query: string) {
        if (searchProjects) {
            if (query === '') {
                setDisplayedProjects(projects);
            } else {
                const updatedProjects: DatabaseProjectData[] = [];

                projects?.map((project) => {
                    switch (searchFilter) {
                        case 'title':
                            if (
                                project?.name
                                    ?.toLowerCase()
                                    .includes(query.toLowerCase())
                            )
                                updatedProjects.push(project);
                            break;
                        case 'owner':
                            if (
                                project?.owner?.login
                                    .toLowerCase()
                                    .includes(query.toLowerCase())
                            )
                                updatedProjects.push(project);
                            break;
                        case 'language':
                            const languages = project?.languages;
                            for (let i = 0; i < languages?.length!; i++) {
                                if (
                                    languages![i]
                                        .toLowerCase()
                                        .includes(query.toLowerCase())
                                ) {
                                    updatedProjects.push(project);
                                    break;
                                }
                            }
                            break;
                    }
                });

                setDisplayedProjects(updatedProjects);
            }
        } else if (searchIssues) {
            if (query === '') {
                setDisplayedIssues(issues);
            } else {
                const updatedIssues: Issue[] = [];

                issues?.map(async (issue) => {
                    switch (searchFilter) {
                        case 'title':
                            if (
                                issue?.title
                                    ?.toLowerCase()
                                    .includes(query.toLowerCase())
                            )
                                updatedIssues.push(issue);
                            break;
                    }
                });

                setDisplayedIssues(updatedIssues);
            }
        }
    }

    return (
        <>
            <Head>
                <title>Browse</title>
                <meta
                    name="description"
                    content="Browse a collection of Open Source projects"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <PageLayout>
                <div className="relative text-base md:text-xl mb-9 max-w-sm -z-10 lg:mt-11">
                    <button
                        onClick={() => ChangeSearch('project')}
                        className={`py-3 border-b-2 duration-150 w-1/2 border-b-primary-light text-primary-light font-poppins font-light text-xs lg:text-lg ${
                            searchProjects
                                ? 'border-opacity-100 opacity-100'
                                : 'border-opacity-30 opacity-30'
                        }`}
                    >
                        Search Projects
                    </button>
                    <button
                        onClick={() => ChangeSearch('issue')}
                        className={`py-3 border-b-2 duration-150 w-1/2 border-b-primary-light text-primary-light font-poppins font-light text-xs lg:text-lg ${
                            searchIssues
                                ? 'border-opacity-100 opacity-100'
                                : 'border-opacity-30 opacity-30'
                        }`}
                    >
                        Search Issues
                    </button>
                </div>
                <div id="search">
                    <div>
                        <h1 className="font-bold font-title mb-2">Search By</h1>
                        <select
                            name="search-filter"
                            id="search-filter"
                            className="bg-transparent border border-accent-light rounded-md p-2 w-full cursor-pointer text-xs placeholder:text-xs text-accent-light lg:text-base lg:px-5 lg:py-3"
                            onChange={(e) => setSearchFilter(e.target.value)}
                        >
                            {searchProjects ? (
                                <>
                                    <option value="title">Title</option>
                                    <option value="owner">Owner</option>
                                    <option value="language">Language</option>
                                </>
                            ) : (
                                <>
                                    <option value="title">Title</option>
                                </>
                            )}
                        </select>
                    </div>
                    <input
                        type="text"
                        id="search-bar"
                        placeholder="Search"
                        className="border-2 border-secondary-light rounded-md py-2 px-5 text-sm placeholder:text-accent-light w-full mt-6 mb-10 outline-none text-default-light font-poppins font-medium lg:text-base lg:px-5 lg:py-3"
                        onChange={(e) => UpdateDisplayResults(e.target.value)}
                    />
                </div>
                <section className="flex flex-wrap gap-4 w-full mx-auto">
                    {searchProjects && (
                        <>
                            {displayedProjects?.map((project, index) => (
                                <ProjectCard project={project} key={index} />
                            ))}
                        </>
                    )}
                    {searchIssues && (
                        <>
                            {displayedIssues?.map((issue, index) => (
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
