import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { FormEvent, useState } from 'react';
import UpdateUser from '@/database/UpdateUser';
import { IUser } from '@/types/dataObjects';
import { useRouter } from 'next/router';
import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    sendPasswordResetEmail,
} from 'firebase/auth';
import auth from '@/firebase/auth/authInit';
import { PageLayout } from '@/layouts/PageLayout';
import { PageLoader } from '@/components/PageLoader';
import Script from 'next/script';
import { IoNotificationsSharp } from 'react-icons/io5';

export default function Settings() {
    const router = useRouter();
    const {
        currentUser,
        currentUserData,
        updateUserEmail,
        logout,
        DeleteAccount,
    } = useAuth();

    const [previousEmail, setPreviousEmail] = useState<string>();
    const [userPassword, setUserPassword] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [reAuthenticateErrors, setReAuthenticateErrors] = useState<string[]>(
        []
    );
    const [reAuthenticateNotifications, setReAuthenticateNotifications] =
        useState<string[]>([]);
    const [requiresReAuthenticate, setRequiresReAuthenticate] =
        useState<boolean>(false);

    async function UpdateEmail() {
        console.log('CUrrent User Darta in email Update: ', currentUserData);
        // If the email was changed, update the email on the users auth profile before updating the database
        if (email && email !== currentUser?.email) {
            const error = await updateUserEmail(email!);
            if (error) {
                if (error == 'auth/requires-recent-login') {
                    setRequiresReAuthenticate(true);
                }
            } else {
                const updatedUser: IUser = {
                    ...currentUserData!,
                    email,
                };
                await UpdateUser(updatedUser).then(({ result }) => {
                    if (result?.updated) {
                        router.reload();
                    } else {
                        console.log('Error Updating');
                    }
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

    return (
        <>
            <Head>
                <title>Settings</title>
                <meta
                    name="description"
                    content={`Settings page for ${currentUser?.displayName}`}
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
            </Head>
            <Script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1203308068531230"
                crossOrigin="anonymous"
            ></Script>
            <PageLayout>
                {currentUser ? (
                    <>
                        <section>
                            <h1 className="font-title font-medium text-2xl mb-4">
                                Change Email
                            </h1>
                            <form
                                className="flex flex-col md:flex-row gap-4"
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    UpdateEmail();
                                }}
                            >
                                <input
                                    type="text"
                                    id="email"
                                    className="px-4 py-2 border-2 border-accent-dark rounded-md bg-transparent font-paragraph font-light text-sm placeholder:font-paragraph placeholder:font-light placeholder:text-sm placeholder:opacity-40 outline-none placeholder:text-gray-500"
                                    placeholder={currentUser?.email!}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    disabled={email ? false : true}
                                    className="bg-accent-dark text-default-dark px-4 py-3 rounded-md max-md:mt-5"
                                >
                                    Update Email
                                </button>
                            </form>
                        </section>
                        {requiresReAuthenticate && (
                            <section className="my-4 pl-4 py-4 border-l-2 border-accent-light">
                                <h2 className="font-roboto font-bold text-lg">
                                    Whoops!
                                </h2>
                                <p className="font-poppins font-normal leading-8 text-base">
                                    We&apos;ll need you to re-authenticate
                                    before you can update the email.
                                </p>
                                <p className="font-poppins font-light leading-6 text-sm">
                                    If you haven&apos;t set a password yet,
                                    click forgot password
                                </p>
                                {reAuthenticateErrors.includes(
                                    'auth/wrong-password'
                                ) && (
                                    <div className="my-3 text-default-light max-w-xs">
                                        <div className="flex items-center gap-5">
                                            <p className="font-poppins font-medium text-lg">
                                                Incorrect Password
                                            </p>
                                            {reAuthenticateNotifications.includes(
                                                'email-sent'
                                            ) && (
                                                <p className="flex items-center gap-2 text-green-500">
                                                    <IoNotificationsSharp />
                                                    Email Sent
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            className="font-poppins font-light text-sm underline hover:text-secondary-light"
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
                                        >
                                            Reset Password
                                        </button>
                                    </div>
                                )}
                                <form
                                    onSubmit={ReAuthenticate}
                                    className="flex flex-col gap-2 mt-5"
                                >
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="text"
                                            id="previousEmail"
                                            placeholder="Email"
                                            onChange={(e) =>
                                                setPreviousEmail(e.target.value)
                                            }
                                            className="text-default-light px-3 py-1 rounded-sm text-base bg-transparent border border-default-light placeholder:text-accent-light outline-none"
                                        />
                                        <input
                                            type="password"
                                            id="password"
                                            placeholder="Password"
                                            onChange={(e) =>
                                                setUserPassword(e.target.value)
                                            }
                                            className="text-default-light px-3 py-1 rounded-sm text-base bg-transparent border border-default-light placeholder:text-accent-light outline-none"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-fit px-4 py-2 rounded-md text-sm mt-3 border-2 border-primary-light text-primary-light hover:text-background-light hover:bg-primary-light duration-200"
                                    >
                                        Authenticate
                                    </button>
                                    <button
                                        className="font-poppins font-light text-sm underline hover:text-secondary-light w-fit"
                                        onClick={async () => {
                                            await sendPasswordResetEmail(
                                                auth,
                                                currentUser?.email!
                                            ).then(() => {
                                                setReAuthenticateNotifications([
                                                    'email-sent',
                                                ]);
                                            });
                                        }}
                                    >
                                        Forgot Password
                                    </button>
                                </form>
                            </section>
                        )}
                        <section className="mt-10">
                            <h3 className="font-title font-medium text-xl mb-4 md:text-2xl">
                                Why can I not change my username?
                            </h3>
                            <p className="font-paragraph font-light leading-8 text-sm md:text-base">
                                To ensure consistency between projects and
                                users, we require that your username match your
                                github username. This helps prevent users from
                                taking usernames that might belong to someone
                                else on github thus preventing confusion on who
                                owns which projects here on OceList.
                            </p>
                        </section>
                        <section className="mt-10">
                            <h4 className="font-title font-medium text-2xl text-red-500 mb-8">
                                Danger Zone
                            </h4>
                            <div className="flex flex-col gap-4 md:flex-row">
                                <button
                                    className="px-6 py-3 rounded-md bg-red-500 text-default-dark"
                                    onClick={logout}
                                >
                                    Logout
                                </button>
                                <button
                                    className="px-6 py-3 rounded-md bg-red-500 text-default-dark"
                                    onClick={deleteUserAccount}
                                >
                                    Delete Account
                                </button>
                            </div>
                        </section>
                    </>
                ) : (
                    <PageLoader size={60} color="#9381FF" />
                )}
            </PageLayout>
        </>
    );
}
