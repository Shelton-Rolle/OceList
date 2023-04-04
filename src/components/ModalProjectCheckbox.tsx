import { Project } from '@/types/dataObjects';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { AiFillCheckCircle } from 'react-icons/ai';

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
        <div className="border-b-2 border-background-light py-3 flex items-center text-default-light pr-5 text-sm border-2 border-b-accent-light">
            <input
                id={project?.name}
                type="checkbox"
                checked={existingProject ? existingProject : addToNewProjects}
                onChange={
                    existingProject
                        ? () => {}
                        : (e) => UpdateNewProjects(e.target.checked, project)
                }
                className="opacity-0"
            />
            <label
                htmlFor={project?.name}
                className="font-paragraph font-light text-lg w-full flex items-center justify-between cursor-pointer"
            >
                {project?.name}{' '}
                {existingProject ? (
                    <AiFillCheckCircle />
                ) : addToNewProjects ? (
                    <AiFillCheckCircle />
                ) : (
                    ''
                )}
            </label>
        </div>
    );
};
