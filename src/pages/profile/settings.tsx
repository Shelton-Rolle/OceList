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

export default function Settings() {
    const router = useRouter();
    const {
        currentUser,
        currentUserData,
        updateUserEmail,
        logout,
        setGithubData,
        DeleteAccount,
        UpdateProfile,
    } = useAuth();

    const [previousEmail, setPreviousEmail] = useState<string>();
    const [userPassword, setUserPassword] = useState<string>();
    const [avatar, setAvatar] = useState<any>();
    const [email, setEmail] = useState<string>();
    const [profileChanged, setProfileChanged] = useState<boolean>(false);
    const [isGithubConnected, setIsGithubConnected] = useState<boolean>();
    const [reAuthenticateErrors, setReAuthenticateErrors] = useState<string[]>(
        []
    );
    const [reAuthenticateNotifications, setReAuthenticateNotifications] =
        useState<string[]>([]);
    const [requiresReAuthenticate, setRequiresReAuthenticate] =
        useState<boolean>(false);

    async function UpdateUserProfile(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        let newAvatarURL: string | undefined;

        if (avatar) {
            await UploadImage(avatar, currentUser?.displayName!).then((url) => {
                newAvatarURL = url;
            });
        }

        // Create a clone of the currentUserData object with the updated data and update the database
        const updatedUser: IUser = {
            ...currentUserData!,
            photoURL: avatar ? newAvatarURL : currentUser?.photoURL,
        };

        await UpdateProfile(
            currentUser?.displayName!,
            avatar ? newAvatarURL : currentUser?.photoURL!
        ).then((error) => {
            UpdateUser(updatedUser).then(() => {
                router.reload();
            });
        });
    }

    async function UpdateEmail() {
        const updatedUser: IUser = {
            ...currentUserData!,
            email: email ? email : currentUser?.email,
        };

        // If the email was changed, update the email on the users auth profile before updating the database
        if (email && email !== currentUser?.email) {
            const error = await updateUserEmail(email!);

            if (error == 'auth/requires-recent-login') {
                setRequiresReAuthenticate(true);
            } else {
                await UpdateUser(updatedUser).then(() => {
                    router.reload();
                });
            }
        }
    }

    async function deleteUserAccount() {
        const error = await DeleteAccount();

        if (error == 'auth/requires-recent-login') {
            setRequiresReAuthenticate(true);
        } else {
            await DeleteAccount();
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
                router.reload();
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
                    assignedIssues: [],
                };
                await UpdateUser(userData).then(async ({ result }) => {
                    if (result?.updated) {
                        await RemoveProjects(
                            currentUserData?.projects as DatabaseProjectData[]
                        ).then((result: any) => {
                            if (result?.deleted) {
                                router.reload();
                            } else {
                                console.log('errors: ', result.errors);
                            }
                        });
                    }
                });
            })
            .catch((error) => {
                console.log('Error Code: ', error.code);
            });
    }

    useEffect(() => {
        let detectedChanges = false;

        if (avatar) {
            detectedChanges = true;
        }

        setProfileChanged(detectedChanges);
    }, [avatar]);

    useEffect(() => {
        console.log('Current User: ', currentUser);
        console.log('Current User Data: ', currentUserData);
    }, [currentUser, currentUserData]);

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
                {currentUser ? (
                    <>
                        <h1>Settings</h1>

                        <section className="flex flex-col gap-2">
                            <h2 className="text-2xl font-bold">Edit Profile</h2>
                            <form
                                onSubmit={UpdateUserProfile}
                                className="flex flex-col gap-4"
                            >
                                <label htmlFor="avatar">
                                    {/* Having the image in the label allows the user to click it to open the file explorer */}
                                    <Image
                                        src={
                                            currentUser?.photoURL
                                                ? currentUser?.photoURL!
                                                : process.env
                                                      .NEXT_PUBLIC_DEFAULT_IMAGE!
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
                        <section className="my-7">
                            <h2 className="text-2xl font-bold">
                                View Profile Information
                            </h2>
                            <p>Username: {currentUser?.displayName}</p>
                            <h4 className="text-xl font-bold">
                                Why can I not change my username?
                            </h4>
                            <p className="text-sm text-gray-400">
                                We require your username here to match the
                                username with the github account you've
                                connected to try and help ensure project owners
                                can secure the same username they have listed on
                                their projects.
                            </p>
                        </section>
                        <section>
                            <h2 className="text-2xl font-bold">Contact Info</h2>
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
                                        placeholder={currentUser?.email!}
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
                            <button onClick={deleteUserAccount}>
                                Delete Account
                            </button>
                        </section>
                        {requiresReAuthenticate && (
                            <div>
                                <h1>
                                    You need to re-authenticate to complete that
                                </h1>
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
                        )}
                    </>
                ) : (
                    <div>Loading</div>
                )}
            </main>
        </>
    );
}
