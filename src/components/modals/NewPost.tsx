import { ModalLayout } from '@/layouts/ModalLayout';
import { NewPostProps } from '@/types/props';

export const NewPost = ({ projects, setModal, userData }: NewPostProps) => {
    async function CreateNewPost() {}

    return (
        <ModalLayout>
            <form
                className="flex flex-col w-1/2 mx-auto"
                onSubmit={CreateNewPost}
            >
                <label htmlFor="post_project">Post Project</label>
                <select name="post_project" id="post_project">
                    <option value="">None</option>
                    {projects?.map((project, index) => (
                        <option
                            value={project?.name?.toLowerCase()}
                            key={index}
                        >
                            {project?.name}
                        </option>
                    ))}
                </select>
                <textarea
                    id="post_body"
                    placeholder="Start typing..."
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
