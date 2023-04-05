import UpdateUser from '@/database/UpdateUser';
import UploadBanner from '@/firebase/storage/UploadBanner';
import { ModalLayout } from '@/layouts/ModalLayout';
import { IUser } from '@/types/dataObjects';
import { ChangeBannerProps } from '@/types/props';
import Image from 'next/image';
import router from 'next/router';
import { FormEvent, useEffect, useState } from 'react';

export const ChangeBanner = ({ setModal, userData }: ChangeBannerProps) => {
    const [banner, setBanner] = useState<File | null>(null);
    const [missingBanner, setMissingBanner] = useState<boolean>(false);

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
            setMissingBanner(true);
        }
    }

    useEffect(() => {
        console.log('Banner: ', banner);
    }, [banner]);

    return (
        <ModalLayout>
            <form onSubmit={UpdateBanner}>
                <div className="flex items-center justify-center w-full">
                    <label
                        htmlFor="dropzone-file"
                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-background-light hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-slate-200 duration-200"
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg
                                aria-hidden="true"
                                className="w-10 h-10 mb-3 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                ></path>
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                <span className="font-semibold">
                                    Click to upload
                                </span>{' '}
                                or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                SVG, PNG, JPG or GIF (MAX. 800x400px)
                            </p>
                        </div>
                        <input
                            id="dropzone-file"
                            type="file"
                            className="hidden"
                            accept="image/jpg image/jpeg image/png"
                            onChange={(e) =>
                                setBanner(e.target.files && e.target.files[0])
                            }
                        />
                    </label>
                </div>
                {missingBanner && <p>No Banner Selected.</p>}
                {banner && <p>{banner?.name}</p>}
                <div className="mt-10 flex items-center gap-6">
                    <button
                        className="border-2 border-primary-light rounded-sm py-2 px-5 text-background-light bg-primary-light"
                        onClick={() => setModal(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="border-2 border-secondary-light rounded-sm py-2 px-5 text-background-light bg-secondary-light"
                        type="submit"
                    >
                        Update
                    </button>
                </div>
            </form>
        </ModalLayout>
    );
};
