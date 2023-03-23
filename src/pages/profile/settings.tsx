import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { FormEvent, useEffect, useState } from 'react';
import UpdateUser from '@/database/UpdateUser';
import { GithubUserObject, IUser } from '@/types/dataObjects';
import { useRouter } from 'next/router';
import AuthenticateWithGitHub from '@/firebase/auth/gitHubAuth/auth';
import { GetGitHubUser } from '@/firebase/auth/gitHubAuth/octokit';
import { IGithubUser } from '@/types/interfaces';
import { linkWithPopup } from 'firebase/auth';
import auth from '@/firebase/auth/authInit';
import githubProvider from '@/firebase/auth/gitHubAuth/githubInit';
import UploadImage from '@/firebase/storage/UploadImage';

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
    const [avatar, setAvatar] = useState<any>();
    const [username, setUsername] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [profileChanged, setProfileChanged] = useState<boolean>(false);
    const [isGithubConnected, setIsGithubConnected] = useState<boolean>();

    async function UpdateProfile(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        let newAvatarURL: string | undefined;

        if (avatar) {
            await UploadImage(avatar).then((url) => {
                newAvatarURL = url;
            });
        }

        // If the email was changed, update the email on the users auth profile before updating the database
        if (email && email !== currentUserData?.email) {
            updateUserEmail(email!);
        }

        // Create a clone of the currentUserData object with the updated data and update the database
        const updatedUser: IUser = {
            ...currentUserData!,
            photoURL: avatar ? newAvatarURL : currentUserData?.photoURL,
            email: email ? email : currentUserData?.email,
            login: username ? username : currentUserData?.login,
        };

        await UpdateUser(updatedUser).then(() => {
            router.reload();
        });
    }

    async function ConnectGithub() {
        await linkWithPopup(currentUser!, githubProvider).then(
            ({ _tokenResponse }: any) => {
                const { oauthAccessToken } = _tokenResponse;

                GetGitHubUser(oauthAccessToken!).then((user) => {
                    const userData: GithubUserObject = user!;
                    const { html_url, id, login, public_repos } = userData;

                    const userObject: IGithubUser = {
                        html_url,
                        id,
                        login,
                        public_repos,
                        token: oauthAccessToken,
                        projects: [],
                    };

                    setGithubData(userObject);
                    router.push('/signup/profile-setup');
                });
            }
        );
        // await AuthenticateWithGitHub().then(({ token }) => {
        //     GetGitHubUser(token!).then((user) => {
        //         const userData: GithubUserObject = user!;
        //         const { html_url, id, login, public_repos } = userData;

        //         const userObject: IGithubUser = {
        //             html_url,
        //             id,
        //             login,
        //             public_repos,
        //             token,
        //             projects: [],
        //         };

        //         setGithubData(userObject);
        //         router.push('/signup/profile-setup');
        //     });
        // });
    }

    useEffect(() => {
        let detectedChanges = false;

        if (username && username !== '') {
            detectedChanges = true;
        }

        if (email && email !== '') {
            detectedChanges = true;
        }

        if (avatar) {
            detectedChanges = true;
        }

        setProfileChanged(detectedChanges);
    }, [username, email, avatar]);

    useEffect(() => {
        let isConnected = false;
        console.log('Current User: ', currentUser);
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
                        <section className="flex flex-col gap-4">
                            <h2 className="text-2xl font-bold">Connections</h2>
                            <button
                                disabled={isGithubConnected}
                                onClick={ConnectGithub}
                            >
                                {isGithubConnected
                                    ? 'Github Connected'
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
