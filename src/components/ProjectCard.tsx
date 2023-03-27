import { ProjectCardProps } from '@/types/props';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export const ProjectCard = ({ project }: ProjectCardProps) => {
    return (
        <div className="outline outline-1 outline-black rounded-sm p-6">
            <a href={`/projects/${project?.id}`}>
                <h2 className="text-2xl">{project?.name}</h2>
            </a>
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
