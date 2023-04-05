import { ProjectCardProps } from '@/types/props';
import { MdFavorite } from 'react-icons/md';
import { IoIosHeartDislike } from 'react-icons/io';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import UpdateUser from '@/database/UpdateUser';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { GoMarkGithub, GoBrowser } from 'react-icons/go';

export default function ProjectCard({ project }: ProjectCardProps) {
    const { currentUser, currentUserData, setCurrentUserData } = useAuth();
    const [isFavorited, setIsFavorited] = useState<boolean>();
    const [updatingFavorites, setUpdatingFavorites] = useState<boolean>(false);
    const [isCurrentUserProject, setIsCurrentUserProject] = useState<boolean>();

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
        <article className="w-full max-w-mobile-card bg-white p-8 pb-0 border-2 border-accent-light rounded-md grid grid-rows-3 max-h-80 max-md:mx-auto">
            <div className="mb-6">
                <a href={`/projects/${project?.id}`}>
                    <p className="font-roboto font-bold text-xl text-primary-light line-cutoff-1">
                        {project?.name}
                    </p>
                </a>
                <a href={`/${project?.owner?.login}`}>
                    <p className="font-poppins font-medium text-sm">
                        {project?.owner?.login}
                    </p>
                </a>
            </div>
            <div className="mb-8">
                <p className="font-roboto font-medium text-base mb-2">
                    Languages
                </p>
                <ul className="flex flex-col gap-1 list-disc">
                    {project?.languages?.map((language, index) => {
                        if (index > 2) return;
                        return (
                            <li
                                key={index}
                                className="font-poppins font-light text-xs lg:text-sm"
                            >
                                {language}
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <a href={project?.html_url} target="_blank">
                        <GoMarkGithub color="#9381FF" size={22} />
                    </a>
                    {project?.homepage && (
                        <a href={project?.homepage} target="_blank">
                            <GoBrowser color="#9381FF" size={22} />
                        </a>
                    )}
                </div>
                {!isCurrentUserProject && currentUser && (
                    <button onClick={HandleFavorite}>
                        {updatingFavorites ? (
                            <div>
                                <AiOutlineLoading3Quarters
                                    color="#EE6C4D"
                                    size={22}
                                />
                            </div>
                        ) : (
                            <>
                                {isFavorited ? (
                                    <IoIosHeartDislike
                                        color="#EE6C4D"
                                        size={22}
                                    />
                                ) : (
                                    <MdFavorite color="#EE6C4D" size={22} />
                                )}
                            </>
                        )}
                    </button>
                )}
            </div>
        </article>
    );
}
