import { ProjectCardProps } from '@/types/props';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import UpdateUser from '@/database/UpdateUser';
import Image from 'next/image';
import { MdFavorite } from 'react-icons/md';
import { IoIosHeartDislike } from 'react-icons/io';

export const ProjectCard = ({ project }: ProjectCardProps) => {
    const { currentUser, currentUserData, setCurrentUserData } = useAuth();
    const [isCurrentUserProject, setIsCurrentUserProject] =
        useState<boolean>(false);
    const [isFavorited, setIsFavorited] = useState<boolean>();
    const [updatingFavorites, setUpdatingFavorites] = useState<boolean>(false);

    async function HandleFavorite() {
        setUpdatingFavorites(true);
        const { favorite_projects, favorite_projects_count } = currentUserData!;

        if (favorite_projects) {
            if (isFavorited) {
                const favoriteListClone = favorite_projects;
                let index: number | undefined;

                for (let i = 0; i < favorite_projects.length; i++) {
                    if (favorite_projects[i].name === project.name) {
                        index = i;
                        break;
                    }
                }

                favoriteListClone.splice(index!, 1);

                const updatedUser = {
                    ...currentUserData,
                    favorite_projects: favoriteListClone,
                    favorite_projects_count: favorite_projects_count! - 1,
                };

                await UpdateUser(updatedUser).then(({ result }) => {
                    if (result?.updated) {
                        setCurrentUserData(updatedUser);
                        setIsFavorited(false);
                    } else {
                        console.log('Errors: ', result?.errors);
                    }
                });
            } else {
                const favoriteListClone = favorite_projects;

                const updatedUser = {
                    ...currentUserData,
                    favorite_projects: [...favoriteListClone, project],
                    favorite_projects_count: favorite_projects_count! + 1,
                };

                await UpdateUser(updatedUser).then(({ result }) => {
                    if (result?.updated) {
                        setCurrentUserData(updatedUser);
                        setIsFavorited(true);
                    } else {
                        console.log('Errors: ', result?.errors);
                    }
                });
            }
        } else {
            const updatedUser = {
                ...currentUserData,
                favorite_projects: [project],
                favorite_projects_count: 1,
            };

            await UpdateUser(updatedUser).then(({ result }) => {
                if (result?.updated) {
                    setCurrentUserData(updatedUser);
                    setIsFavorited(true);
                } else {
                    console.log('Error: ', result?.errors);
                }
            });
        }

        setUpdatingFavorites(false);
    }

    useEffect(() => {
        if (currentUser) {
            if (currentUser?.displayName === project?.owner?.login) {
                setIsCurrentUserProject(true);
            }
        }

        if (currentUserData?.favorite_projects) {
            for (
                let i = 0;
                i < currentUserData?.favorite_projects?.length;
                i++
            ) {
                if (
                    currentUserData?.favorite_projects[i].name === project.name
                ) {
                    setIsFavorited(true);
                    break;
                }
            }
        }
    }, [currentUser, currentUserData]);

    return (
        <article className="border-b-2 border-default-dark border-opacity-10 p-5">
            <div className="grid grid-cols-12 gap-4">
                <div className="relative w-full h-full max-w-[35px] max-h-[35px] rounded-full overflow-hidden col-span-2">
                    <Image
                        src={project?.owner?.avatar_url!}
                        alt="owner-avatar"
                        fill
                    />
                </div>
                <div className="col-span-9">
                    <Link href={`/projects/${project?.id}`}>
                        <h1 className="line-cutoff-1 font-title text-lg font-bold">
                            {project?.name}
                        </h1>
                    </Link>
                    <Link href={`/${project.owner?.login}`}>
                        <p className="font-paragraph text-sm text-accent-dark font-light">
                            {project?.owner?.login}
                        </p>
                    </Link>
                </div>
                <div className="col-span-1">
                    {!isCurrentUserProject && (
                        <button onClick={HandleFavorite}>
                            {updatingFavorites ? (
                                'Loading'
                            ) : (
                                <>
                                    {isFavorited ? (
                                        <IoIosHeartDislike size={22} />
                                    ) : (
                                        <MdFavorite size={22} />
                                    )}
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
            <div className="mt-12 flex items-center gap-7">
                {project?.languages?.map((language, index) => {
                    if (index > 2) return <></>;
                    return (
                        <p
                            className="font-paragraph text-secondary-dark font-light text-sm"
                            key={index}
                        >
                            {language}
                        </p>
                    );
                })}
            </div>
        </article>
    );

    return (
        <div>
            <div>
                <Link href={`/projects/${project?.id}`}>
                    <h2>{project?.name}</h2>
                </Link>
                {!isCurrentUserProject && (
                    <button onClick={HandleFavorite}>
                        {updatingFavorites ? (
                            'Loading'
                        ) : (
                            <>{isFavorited ? 'Favorited' : 'Favorite'}</>
                        )}
                    </button>
                )}
            </div>
            <Link href={`/${project.owner?.login}`}>
                <p>{project.owner?.login}</p>
            </Link>
            <div>
                {project?.languages?.map((language, index) => (
                    <p key={index}>{language}</p>
                ))}
            </div>
        </div>
    );
};
