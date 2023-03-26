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
import { PageLayout } from '@/layouts/PageLayout';

export default function Settings() {
    const router = useRouter();
    const {
        currentUser,
        currentUserData,
        setCurrentUserData,
        updateUserEmail,
        logout,
        DeleteAccount,
        UpdateProfile,
    } = useAuth();

    const [previousEmail, setPreviousEmail] = useState<string>();
    const [userPassword, setUserPassword] = useState<string>();
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

    async function UpdateEmail() {
        const updatedUser: IUser = {
            ...currentUserData!,
            email: email ? email : currentUser?.email,
        };

        // If the email was changed, update the email on the users auth profile before updating the database
        if (email && email !== currentUser?.email) {
            const error = await updateUserEmail(email!);

            if (error) {
                if (error == 'auth/requires-recent-login') {
                    setRequiresReAuthenticate(true);
                }
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
            router.push('/');
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
            <PageLayout>
                {currentUser ? (
                    <>
                        <section className="w-full mb-7">
                            <h2 className="text-2xl font-bold mb-3">
                                Change Email
                            </h2>
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    UpdateEmail();
                                }}
                            >
                                <input
                                    type="text"
                                    id="email"
                                    placeholder={currentUser?.email!}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="p-3 rounded-md border border-black w-full max-w-md mr-4"
                                />
                                <button
                                    className="border border-black py-3 px-5 rounded-md"
                                    type="submit"
                                    disabled={email ? false : true}
                                >
                                    Update Email
                                </button>
                            </form>
                        </section>
                        <section className="mb-16">
                            <h4 className="text-xl font-medium mb-2">
                                Why can I not change my username?
                            </h4>
                            <p className="text-base font-light text-gray-400 w-3/4 leading-6">
                                To ensure consistency between projects and
                                users, we require that your username match your
                                github username. This helps prevent users from
                                taking usernames that might belong to someone
                                else on github thus preventing confusion on who
                                owns which projects here on Simu.
                            </p>
                        </section>
                        <section className="flex flex-col gap-4">
                            <h2 className="font-medium text-2xl mb-5 text-red-500">
                                Danger Zone
                            </h2>
                            <button
                                onClick={logout}
                                className="rounded-md w-60 py-3 bg-red-500 text-white"
                            >
                                Logout
                            </button>
                            <button
                                onClick={deleteUserAccount}
                                className="rounded-md w-60 py-3 bg-red-500 text-white"
                            >
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
            </PageLayout>
        </>
    );
}
