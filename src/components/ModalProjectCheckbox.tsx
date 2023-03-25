import { Project } from '@/types/dataObjects';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export const ModalProjectCheckbox = ({
    project,
    existingProjects,
    newProjects,
    setNewProjects,
}: {
    project: Project;
    existingProjects: Project[];
    newProjects: Project[];
    setNewProjects: Dispatch<SetStateAction<Project[]>>;
}) => {
    const [existingProject, setExistingProject] = useState<boolean>();
    const [addToNewProjects, setAddToNewProjects] = useState<boolean>(false);

    async function UpdateNewProjects(checked: boolean, project: Project) {
        const newProjectsClone = newProjects;

        if (checked) {
            newProjectsClone.push(project);
            setAddToNewProjects(true);
        } else {
            const index = newProjectsClone.indexOf(project);
            newProjectsClone.splice(index, 1);
            setAddToNewProjects(false);
        }

        setNewProjects(newProjectsClone);
    }

    useEffect(() => {
        const { id } = project;

        existingProjects?.map((project) => {
            if (id === project?.id) {
                setExistingProject(true);
            }
        });
    }, []);

    return (
        <div>
            <label>
                <input
                    type="checkbox"
                    checked={
                        existingProject ? existingProject : addToNewProjects
                    }
                    onChange={
                        existingProject
                            ? () => {}
                            : (e) =>
                                  UpdateNewProjects(e.target.checked, project)
                    }
                />
                {project?.name}
            </label>
            <p>--------------</p>
        </div>
    );
};
