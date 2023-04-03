import { FeedProjectProps } from '@/types/props';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import UpdateUser from '@/database/UpdateUser';
import { MdFavorite } from 'react-icons/md';
import { IoIosHeartDislike } from 'react-icons/io';
import CardAvatar from './CardAvatar';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export const FeedProject = ({ project }: FeedProjectProps) => {
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
        <article className="border-b-2 border-default-dark border-opacity-10 px-5 py-8 max-w-lg">
            <div className="grid grid-cols-12 gap-4">
                <CardAvatar
                    src={project?.owner?.avatar_url!}
                    alt="owner-avatar"
                />
                <div className="col-span-9">
                    <Link href={`/projects/${project?.id}`}>
                        <h1 className="line-cutoff-1 font-title text-lg font-bold md:text-xl lg:text-2xl">
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
                                <div className="h-full flex justify-center items-center animate-spin">
                                    <AiOutlineLoading3Quarters
                                        size={22}
                                        color="#FDF5BF"
                                    />
                                </div>
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
};
