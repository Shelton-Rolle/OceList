import CreateProjects from '@/database/CreateProjects';
import UpdateUser from '@/database/UpdateUser';
import MutateProjectObjects from '@/helpers/MutateProjectObjects';
import { ModalLayout } from '@/layouts/ModalLayout';
import { DatabaseProjectData, IUser, Project } from '@/types/dataObjects';
import { AddProjectsProps } from '@/types/props';
import router from 'next/router';
import { useState } from 'react';
import { ModalProjectCheckbox } from '../ModalProjectCheckbox';
import { PageLoader } from '../PageLoader';

export const AddProjects = ({
    projects,
    existingProjects,
    setModal,
    userData,
}: AddProjectsProps) => {
    const [newProjects, setNewProjects] = useState<Project[]>([]);

    async function AddNewProjects() {
        await CreateProjects(userData?.githubToken!, newProjects).then(
            async () => {
                const updatedUserProjectsArray: DatabaseProjectData[] =
                    existingProjects as DatabaseProjectData[];

                const mutatedProjects = await MutateProjectObjects(
                    userData?.githubToken!,
                    newProjects
                );

                await mutatedProjects.map((project) => {
                    updatedUserProjectsArray?.push(project);
                });

                const updatedUser: IUser = {
                    ...userData,
                    projects: updatedUserProjectsArray,
                };

                await UpdateUser(updatedUser).then(({ result }) => {
                    if (result?.updated) {
                        router.reload();
                    } else {
                        console.log('There was an error: ', result?.errors);
                    }
                });
            }
        );
    }

    return (
        <ModalLayout>
            <header className="mb-7">
                <h1 className="font-roboto font-bold text-default-light text-xl mb-2">
                    Select Projects
                </h1>
                <p className="font-poppins font-light text-default-light text-sm">
                    Use the list below to select the new projects you would like
                    to add. Note: Existing projects are denoted with a checkmark
                    and selecting them will not delete them.
                </p>
            </header>
            <div className="max-h-72 overflow-scroll mb-7">
                {!projects ? (
                    <PageLoader size={18} color="#9381FF" />
                ) : (
                    <>
                        {projects.length > 0 ? (
                            <>
                                {projects?.map((project, index) => (
                                    <ModalProjectCheckbox
                                        project={project}
                                        existingProjects={existingProjects}
                                        newProjects={newProjects}
                                        setNewProjects={setNewProjects}
                                        key={index}
                                    />
                                ))}
                            </>
                        ) : (
                            <div>No Projects Found</div>
                        )}
                    </>
                )}
            </div>
            <div className="flex items-center gap-4">
                <button
                    className="border-2 border-primary-light rounded-sm py-2 px-5 text-background-light bg-primary-light"
                    onClick={() => setModal(false)}
                >
                    Cancel
                </button>
                <button
                    className="border-2 border-secondary-light rounded-sm py-2 px-5 text-background-light bg-secondary-light"
                    onClick={AddNewProjects}
                >
                    Add Projects
                </button>
            </div>
        </ModalLayout>
    );
};
