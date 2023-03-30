import { ProjectCardProps } from '@/types/props';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import UpdateUser from '@/database/UpdateUser';

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
        <div className="outline outline-1 outline-black rounded-sm p-6">
            <div className="flex justify-between items-center">
                <Link href={`/projects/${project?.id}`}>
                    <h2 className="text-2xl">{project?.name}</h2>
                </Link>
                {!isCurrentUserProject && (
                    <button
                        onClick={HandleFavorite}
                        className="outline outline-1 outline-black rounded-sm p-3"
                    >
                        {updatingFavorites ? (
                            'Loading'
                        ) : (
                            <>{isFavorited ? 'Favorited' : 'Favorite'}</>
                        )}
                    </button>
                )}
            </div>
            <Link href={`/${project.owner?.login}`}>
                <p className="text-sm text-gray-400 hover:text-blue-400 duration-150">
                    {project.owner?.login}
                </p>
            </Link>
            <div className="flex gap-3 mt-5">
                {project?.languages?.map((language, index) => (
                    <p className="" key={index}>
                        {language}
                    </p>
                ))}
            </div>
        </div>
    );
};
