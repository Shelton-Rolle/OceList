import UpdateUser from '@/database/UpdateUser';
import UploadBanner from '@/firebase/storage/UploadBanner';
import { ModalLayout } from '@/layouts/ModalLayout';
import { IUser } from '@/types/dataObjects';
import { ChangeBannerProps } from '@/types/props';
import router from 'next/router';
import { FormEvent, useState } from 'react';

export const ChangeBanner = ({ setModal, userData }: ChangeBannerProps) => {
    const [banner, setBanner] = useState<File | null>(null);

    async function UpdateBanner(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (banner) {
            await UploadBanner(banner, userData?.displayName!).then(
                async (url) => {
                    const updatedUser: IUser = {
                        ...userData!,
                        banner_url: url,
                    };

                    await UpdateUser(updatedUser).then(() => {
                        router.reload();
                    });
                }
            );
        } else {
            console.log('No Banner Selected');
        }
    }

    return (
        <ModalLayout>
            <form onSubmit={UpdateBanner}>
                <input
                    type="file"
                    id="avatar"
                    accept="image/jpg image/jpeg image/png"
                    onChange={(e) =>
                        setBanner(e.target.files && e.target.files[0])
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
