import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { FormEvent, useEffect, useState } from 'react';
import UpdateUser from '@/database/UpdateUser';
import { IUser } from '@/types/dataObjects';
import { useRouter } from 'next/router';

export default function Settings() {
    const router = useRouter();
    const { currentUser, currentUserData, updateUserEmail } = useAuth();
    const [username, setUsername] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [profileChanged, setProfileChanged] = useState<boolean>(false);

    async function UpdateProfile(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        // If the email was changed, update the email on the users auth profile before updating the database
        if (email && email !== currentUserData?.email) {
            updateUserEmail(email!);
        }

        // Create a clone of the currentUserData object with the updated data and update the database
        const updatedUser: IUser = {
            ...currentUserData!,
            email: email ? email : currentUserData?.email,
            login: username ? username : currentUserData?.login,
        };
        await UpdateUser(updatedUser).then(() => {
            router.reload();
        });
    }

    useEffect(() => {
        let detectedChanges = false;

        if (username && username !== '') {
            detectedChanges = true;
        }

        if (email && email !== '') {
            detectedChanges = true;
        }

        setProfileChanged(detectedChanges);
    }, [username, email]);

    return (
        <>
            <Head>
                <title>Landing</title>
                <meta name="description" content="Landing Page" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                {currentUserData ? (
                    <>
                        <h1>Settings</h1>

                        <section className="flex flex-col gap-2">
                            <h2 className="text-2xl font-bold">Edit Profile</h2>
                            <form
                                onSubmit={UpdateProfile}
                                className="flex flex-col gap-4"
                            >
                                <label htmlFor="avatar">
                                    {/* Having the image in the label allows the user to click it to open the file explorer */}
                                    <Image
                                        src={currentUser?.photoURL!}
                                        alt="avatar"
                                        width={250}
                                        height={250}
                                    />
                                    <input
                                        type="file"
                                        id="avatar"
                                        accept="image/jpg image/jpeg image/png"
                                    />
                                </label>
                                <label htmlFor="username">
                                    Username:
                                    <input
                                        type="text"
                                        id="username"
                                        placeholder={currentUserData?.login!}
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                        className="p-2 rounded-sm outline outline-2 outline-gray-400"
                                    />
                                </label>
                                <label htmlFor="email">
                                    Email:
                                    <input
                                        type="text"
                                        id="email"
                                        placeholder={currentUserData?.email!}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        className="p-2 rounded-sm outline outline-2 outline-gray-400"
                                    />
                                </label>
                                <button
                                    type="submit"
                                    disabled={!profileChanged}
                                    className={`outline outline-2  w-36 rounded-sm ${
                                        profileChanged
                                            ? 'outline-black text-black'
                                            : 'outline-gray-400 text-gray-400'
                                    }`}
                                >
                                    Save
                                </button>
                            </form>
                        </section>
                        <section>
                            <h2 className="text-2xl font-bold">Connections</h2>
                        </section>
                        <section>
                            <h2 className="text-2xl font-bold">Danger</h2>
                            <button>Logout</button>
                            <button>Delete Account</button>
                        </section>
                    </>
                ) : (
                    <div>Loading</div>
                )}
            </main>
        </>
    );
}
