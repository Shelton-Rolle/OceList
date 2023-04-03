import CreateProjects from '@/database/CreateProjects';
import UpdateUser from '@/database/UpdateUser';
import MutateProjectObjects from '@/helpers/MutateProjectObjects';
import { ModalLayout } from '@/layouts/ModalLayout';
import { DatabaseProjectData, IUser, Project } from '@/types/dataObjects';
import { AddProjectsProps } from '@/types/props';
import router from 'next/router';
import { useState } from 'react';
import { ModalProjectCheckbox } from '../ModalProjectCheckbox';

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
            <div>
                {projects?.map((project, index) => (
                    <ModalProjectCheckbox
                        project={project}
                        existingProjects={existingProjects}
                        newProjects={newProjects}
                        setNewProjects={setNewProjects}
                        key={index}
                    />
                ))}
                <button
                    className="outline outline-2 outline-red-300 rounded-sm py-2 px-5 text-red-300"
                    onClick={() => setModal(false)}
                >
                    Cancel
                </button>
                <button
                    className="outline outline-2 outline-blue-300 rounded-sm py-2 px-5 text-blue-300"
                    onClick={AddNewProjects}
                >
                    Add Projects
                </button>
            </div>
        </ModalLayout>
    );
};
