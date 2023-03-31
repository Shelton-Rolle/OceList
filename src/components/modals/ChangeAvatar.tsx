import { useAuth } from '@/context/AuthContext';
import UpdateUser from '@/database/UpdateUser';
import UploadImage from '@/firebase/storage/UploadImage';
import { ModalLayout } from '@/layouts/ModalLayout';
import { IUser } from '@/types/dataObjects';
import { ChangeAvatarProps } from '@/types/props';
import router from 'next/router';
import { FormEvent, useState } from 'react';

export const ChangeAvatar = ({ setModal, userData }: ChangeAvatarProps) => {
    const { UpdateProfile, currentUser } = useAuth();
    const [avatar, setAvatar] = useState<File | null>(null);

    async function UpdateAvatar(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (avatar) {
            await UploadImage(avatar, userData?.displayName!).then(
                async (url) => {
                    const updatedUser: IUser = {
                        ...userData!,
                        photoURL: url,
                    };

                    await UpdateProfile(
                        userData?.displayName!,
                        avatar ? url : currentUser?.photoURL!
                    ).then((error) => {
                        UpdateUser(updatedUser).then(() => {
                            router.reload();
                        });
                    });
                }
            );
        } else {
            console.log('No Avatar Selected');
        }
    }

    return (
        <ModalLayout>
            <form onSubmit={UpdateAvatar}>
                <input
                    type="file"
                    id="avatar"
                    accept="image/jpg image/jpeg image/png"
                    onChange={(e) =>
                        setAvatar(e.target.files && e.target.files[0])
                    }
                />
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
            </form>
        </ModalLayout>
    );
};
