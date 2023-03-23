import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { FormEvent, useEffect, useState } from 'react';
import UpdateUser from '@/database/UpdateUser';
import {
    DatabaseProjectData,
    GithubUserObject,
    IUser,
} from '@/types/dataObjects';
import { useRouter } from 'next/router';
import AuthenticateWithGitHub from '@/firebase/auth/gitHubAuth/auth';
import { GetGitHubUser } from '@/firebase/auth/gitHubAuth/octokit';
import { IGithubUser } from '@/types/interfaces';
import {
    EmailAuthCredential,
    EmailAuthProvider,
    linkWithPopup,
    reauthenticateWithCredential,
    reauthenticateWithPopup,
    sendPasswordResetEmail,
    unlink,
} from 'firebase/auth';
import auth from '@/firebase/auth/authInit';
import githubProvider from '@/firebase/auth/gitHubAuth/githubInit';
import UploadImage from '@/firebase/storage/UploadImage';
import RemoveProjects from '@/database/RemoveProjects';

const defaultImage =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIEAAACBCAMAAADQfiliAAAAMFBMVEW6urr////o6Oi3t7f8/Py/v7/39/fHx8fExMTt7e3MzMzj4+PS0tLy8vLX19fa2tr1LdARAAACdElEQVR4nO2aXXeDIAxAwYCA8vH//+2k1m511RIk2tOT+7BzthfuAklJqBAMwzAMwzAMwzDfB4AQ2hpjrJ5/OX19m1yvZEb1LtmTHUCnXj7TJ32eA+hRyf+o8TSHuP7/H3GIZywPottYP9MJ8jCA3QpA3ocpDJZYAcyOwLwThlQB9KsjuAoE7Xl8F4FbFCgFOlkQg+k4UgGxIAKZSLUPBYfgHgZNIwBjqYAciYJQKJAhWb84BBmaIJRk4gJJRhqEgJSmvQBqE2i2waEMQnsB3ZdWg4zq25cEixGYFGxrARhQAlIOrQ/CBxh4pIH/QoPLd0GYq3NhqgcoA4J6IALKgKAmXv+5gDyK7Q/iBOpzgWB9IVB3JBIDjTCguSyDK+hXZhzRXbm4KBGUo5nihKRqF0RpVSKoRgtQdFFSlEOMorJEUox+Fd5fE5pfDNYKw/5GKNoI3BTs3nEM1IOs2WE7KQnT8FnBvB4pdrRjtGdMtz4OqiNoVncA0L579HGq77w+f8A/rWgHH2P0g73ifeFuMS0N9KPkzwYyV60LQt+emfJDk17+dNLqdoijC+pvPioV3BgHTW4BYPwY7u9bz+Vg/hlGb+gkpuxLoWCyHZIlSQ8AX963Bd88EAAJ2Tunxg4et/7NwbdbHixulrjgWl0WIOIDcA9Dk6eO/ffFdzR5f6zbgQV3tcBxBTgqcLSLhXRYQMp0QAE9RHzNkRYCNz/bor6TLX7hfEd9WcANMbepffdCD7O3qexmG2TiQm1GNhOofIMF3APjPlUdZbNMyFRlA3KUvU9dW3/kU3lN3dcy2IAN2IAN2IAN2IAN2IAN2IAN2OBygx/3Xx6T8g+yzwAAAABJRU5ErkJggg==';

export default function Settings() {
    const router = useRouter();
    const {
        currentUser,
        currentUserData,
        updateUserEmail,
        logout,
        setGithubData,
    } = useAuth();

    const [previousEmail, setPreviousEmail] = useState<string>();
    const [userPassword, setUserPassword] = useState<string>();
    const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
    const [avatar, setAvatar] = useState<any>();
    const [username, setUsername] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [profileChanged, setProfileChanged] = useState<boolean>(false);
    const [isGithubConnected, setIsGithubConnected] = useState<boolean>();
    const [reAuthenticateErrors, setReAuthenticateErrors] = useState<string[]>(
        []
    );
    const [reAuthenticateNotifications, setReAuthenticateNotifications] =
        useState<string[]>([]);

    async function UpdateProfile(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        let newAvatarURL: string | undefined;

        if (avatar) {
            await UploadImage(avatar, currentUser?.uid!).then((url) => {
                newAvatarURL = url;
            });
        }

        // Create a clone of the currentUserData object with the updated data and update the database
        const updatedUser: IUser = {
            ...currentUserData!,
            photoURL: avatar ? newAvatarURL : currentUserData?.photoURL,
            login: username ? username : currentUserData?.login,
        };

        await UpdateUser(updatedUser).then(() => {
            router.reload();
        });
    }

    async function UpdateEmail() {
        const updatedUser: IUser = {
            ...currentUserData!,
            email: email ? email : currentUserData?.email,
        };

        // If the email was changed, update the email on the users auth profile before updating the database
        if (email && email !== currentUserData?.email) {
            const error = await updateUserEmail(email!);
            if (error) console.log('YO Error Code: ', error);

            if (error == 'auth/requires-recent-login') {
                setShowPasswordModal(true);
            } else {
                await UpdateUser(updatedUser).then(() => {
                    router.reload();
                });
            }
        }
    }

    async function ReAuthenticate(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const credentials = EmailAuthProvider.credential(
            previousEmail!,
            userPassword!
        );

        await reauthenticateWithCredential(currentUser!, credentials)
            .then(() => {
                // Once ReAuthenticated, re-run the UpdateEmail function
                UpdateEmail();
            })
            .catch((error) => {
                setReAuthenticateErrors([error.code]);
            });
    }

    async function ConnectGithub() {
        await linkWithPopup(currentUser!, githubProvider).then(
            ({ _tokenResponse }: any) => {
                const { oauthAccessToken } = _tokenResponse;

                GetGitHubUser(oauthAccessToken!).then((user) => {
                    const userData: GithubUserObject = user!;
                    const { html_url, id, public_repos, login } = userData;

                    const userObject: IGithubUser = {
                        login,
                        html_url,
                        githubId: id,
                        public_repos,
                        githubToken: oauthAccessToken,
                        projects: [],
                    };

                    setGithubData(userObject);
                    router.push('/signup/profile-setup');
                });
            }
        );
    }

    async function DisconnectGithub() {
        await unlink(currentUser!, 'github.com')
            .then(async () => {
                const userData: IUser = {
                    ...currentUserData,
                    providerData: currentUser?.providerData,
                    html_url: null,
                    githubId: null,
                    projects: [],
                    public_repos: null,
                    githubToken: null,
                };
                await UpdateUser(userData).then(async ({ result }) => {
                    if (result?.updated) {
                        console.log('Github Disconnected!');
                        await RemoveProjects(
                            currentUserData?.projects as DatabaseProjectData[]
                        );
                    }
                });
            })
            .catch((error) => {
                console.log('Error Code: ', error.code);
            });
    }

    useEffect(() => {
        let detectedChanges = false;

        if (username && username !== '') {
            detectedChanges = true;
        }

        if (avatar) {
            detectedChanges = true;
        }

        setProfileChanged(detectedChanges);
    }, [username, avatar]);

    useEffect(() => {
        console.log('Current User: ', currentUser);
    }, [currentUser]);

    useEffect(() => {
        let isConnected = false;
        currentUser?.providerData.map((provider) => {
            if (provider?.providerId === 'github.com') {
                isConnected = true;
            }
        });

        setIsGithubConnected(isConnected);
    }, [currentUser]);

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
                                        src={
                                            currentUserData?.photoURL
                                                ? currentUserData?.photoURL!
                                                : defaultImage
                                        }
                                        alt="avatar"
                                        width={250}
                                        height={250}
                                    />
                                    <input
                                        type="file"
                                        id="avatar"
                                        accept="image/jpg image/jpeg image/png"
                                        onChange={(e) =>
                                            setAvatar(
                                                e.target.files &&
                                                    e.target.files[0]
                                            )
                                        }
                                    />
                                </label>
                                {avatar && <p>Selected File: {avatar?.name}</p>}
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
                            <h2>Contact Info</h2>
                            <div
                                className={`p-4 outline outline-2 outline-black ${
                                    showPasswordModal ? 'block' : 'hidden'
                                }`}
                            >
                                {reAuthenticateErrors.includes(
                                    'auth/wrong-password'
                                ) && (
                                    <div>
                                        <p>incorrect password</p>
                                        <button
                                            onClick={async () => {
                                                await sendPasswordResetEmail(
                                                    auth,
                                                    currentUser?.email!
                                                ).then(() => {
                                                    setReAuthenticateNotifications(
                                                        ['email-sent']
                                                    );
                                                });
                                            }}
                                            className="text-blue-500"
                                        >
                                            Reset Password
                                        </button>
                                    </div>
                                )}
                                {reAuthenticateNotifications.includes(
                                    'email-sent'
                                ) && (
                                    <p className="text-green-500">Email Sent</p>
                                )}
                                <form
                                    className="flex flex-col items-start"
                                    onSubmit={ReAuthenticate}
                                >
                                    <label htmlFor="previousEmail">
                                        Enter Previous Email:{' '}
                                        <input
                                            type="text"
                                            id="previousEmail"
                                            placeholder="previous email"
                                            onChange={(e) =>
                                                setPreviousEmail(e.target.value)
                                            }
                                        />
                                    </label>
                                    <label htmlFor="password">
                                        Enter Password:{' '}
                                        <input
                                            type="text"
                                            id="password"
                                            placeholder="password"
                                            onChange={(e) =>
                                                setUserPassword(e.target.value)
                                            }
                                        />
                                    </label>
                                    <button
                                        className="border border-black rounded-sm p-2"
                                        type="submit"
                                    >
                                        Update
                                    </button>
                                </form>
                            </div>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    UpdateEmail();
                                }}
                            >
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
                                    className="border border-black rounded-sm p-2"
                                    type="submit"
                                >
                                    Update Email
                                </button>
                            </form>
                        </section>
                        <section className="flex flex-col gap-4">
                            <h2 className="text-2xl font-bold">Connections</h2>
                            <button
                                onClick={
                                    isGithubConnected
                                        ? DisconnectGithub
                                        : ConnectGithub
                                }
                            >
                                {isGithubConnected
                                    ? 'Disconnect Github'
                                    : 'Connect GitHub'}
                            </button>
                        </section>
                        <section className="flex flex-col gap-4">
                            <h2 className="text-2xl font-bold">Danger</h2>
                            <button onClick={logout}>Logout</button>
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
