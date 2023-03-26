import { ProjectCardProps } from '@/types/props';
import React, { useEffect, useState } from 'react';

export const ProjectCard = ({ project }: ProjectCardProps) => {
    console.log('Project Card: ', project);
    return (
        <div className="outline outline-1 outline-black rounded-sm p-6">
            <a href={`/projects/${project?.id}`}>
                <h2 className="text-2xl">{project?.name}</h2>
            </a>
            <p className="text-sm text-gray-400">{project.owner?.login}</p>
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
