import { ProjectCardProps } from '@/types/props';
import React, { useEffect, useState } from 'react';

export const ProjectCard = ({ project }: ProjectCardProps) => {
    console.log('Project: ', project);
    return (
        <div className="outline outline-1 outline-black p-4 m-7 rounded-sm">
            <h2>{project?.name}</h2>
            <p>{project.owner?.login}</p>
            <div className="flex items-center my-3">
                {project?.languages?.map((language, index) => (
                    <p className="mr-3" key={index}>
                        {language}
                    </p>
                ))}
            </div>
        </div>
    );
};
