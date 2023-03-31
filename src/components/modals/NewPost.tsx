import UpdateUser from '@/database/UpdateUser';
import { ModalLayout } from '@/layouts/ModalLayout';
import { IUser, Post } from '@/types/dataObjects';
import { NewPostProps } from '@/types/props';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';

export const NewPost = ({ projects, setModal, userData }: NewPostProps) => {
    const router = useRouter();
    const [postProjectId, setPostProjectId] = useState<string | null>(null);
    const [body, setBody] = useState<string>();

    async function CreateNewPost(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!body || body === '') {
            console.log('error/post_body_missing');
            return;
        }

        const { posts } = userData;

        const newPost: Post = {
            owner: userData,
            body,
            projectId: postProjectId!,
        };

        let updatedUserObject: IUser;

        if (posts) {
            // Add the new post to the existing post array
            updatedUserObject = {
                ...userData,
                posts: [...posts, newPost],
            };
        } else {
            // Create the post array with the new post
            updatedUserObject = {
                ...userData,
                posts: [newPost],
            };
        }

        console.log('Updated User Object: ', updatedUserObject);
        await UpdateUser(updatedUserObject).then(({ result }) => {
            if (result?.updated) {
                router.reload();
            } else {
                console.log('Error: ', result?.errors);
            }
        });
    }

    return (
        <ModalLayout>
            <form
                className="flex flex-col w-1/2 mx-auto"
                onSubmit={CreateNewPost}
            >
                <label htmlFor="post_project">Post Project</label>
                <select
                    name="post_project"
                    id="post_project"
                    onChange={(e) => setPostProjectId(e.target.value)}
                >
                    <option value="">None</option>
                    {projects?.map((project, index) => (
                        <option value={project?.id} key={index}>
                            {project?.name}
                        </option>
                    ))}
                </select>
                <textarea
                    id="post_body"
                    placeholder="Start typing..."
                    onChange={(e) => setBody(e.target.value)}
                    className="outline outline-2 outline-black w-full mt-7"
                />
                <div className="mt-7">
                    <button
                        className="outline outline-2 outline-red-300 rounded-sm py-2 px-5 text-red-300"
                        onClick={() => setModal(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="outline outline-2 outline-blue-300 rounded-sm py-2 px-5 text-blue-300"
                        type="submit"
                    >
                        Update
                    </button>
                </div>
            </form>
        </ModalLayout>
    );
};
