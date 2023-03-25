import { DatabaseProjectData } from '@/types/dataObjects';
import { CurrentUserProfileProps } from '@/types/props';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function CurrentUserProfile({ data }: CurrentUserProfileProps) {
    const { projects, assignedIssues } = data;
    const [projectsList, setProjectsList] = useState<DatabaseProjectData[]>();

    useEffect(() => {
        console.log('HERE IS OUR USER DATA: ', data);
        setProjectsList(data?.projects as DatabaseProjectData[]);
    }, []);

    return (
        <div>
            <h1>This is the profile of the logged in user</h1>
            <Image
                src={data?.photoURL!}
                alt="avatar"
                width={150}
                height={150}
            />
            <p>{data?.displayName}</p>
            <section className="my-4">
                <h2>Projects</h2>
                {projectsList ? (
                    <>
                        {projectsList?.map((project, index) => (
                            <div
                                key={index}
                                className="outline outline-2 outline-black my-3 p-5 max-w-md"
                            >
                                <a href={`/projects/${project?.id}`}>
                                    <h4 className="text-lg font-bold">
                                        {project?.name}
                                    </h4>
                                </a>
                                <p>{project?.owner?.login}</p>
                                <div className="flex gap-4 items-center">
                                    {project?.languages.map(
                                        (language, index) => (
                                            <p
                                                key={index}
                                                className="text-gray-400 text-sm"
                                            >
                                                {language}
                                            </p>
                                        )
                                    )}
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <>{projects ? <p>Loading</p> : <p>No Projects Found</p>}</>
                )}
            </section>
            <section className="my-4">
                <h2>Contributions</h2>
                {assignedIssues?.map((issue, index) => (
                    <div
                        key={index}
                        className="outline outline-2 outline-black my-3 p-5 max-w-xs"
                    >
                        <h4 className="text-lg font-bold">{issue?.title}</h4>
                        <p>{issue?.body}</p>
                        <p className="text-gray-400 text-sm">
                            {issue?.user?.login}
                        </p>
                    </div>
                ))}
            </section>
        </div>
    );
}
