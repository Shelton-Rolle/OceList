import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { FormEvent, useEffect, useState } from 'react';
import UploadImage from '@/firebase/storage/UploadImage';
import GetImageURL from '@/firebase/storage/GetImage';

export default function Home() {
    const [file, setFile] = useState<any>();
    const { currentUser, githubData, currentUserData, logout } = useAuth();

    // useEffect(() => {
    //     console.log('Current User: ', currentUser);
    //     console.log('Github Data: ', githubData);
    //     console.log('Current User Database Data: ', currentUserData);
    // }, [currentUser, githubData, currentUserData]);

    async function FileSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        await UploadImage(file).then((url) => {
            console.log('File URL: ', url);
        });
    }

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
                <h1>Landing Page</h1>

                <div>
                    <a href={`/profile/${currentUserData?.login}`}>Profile</a>
                </div>
                <button onClick={logout}>Logout</button>
                <br />
                <br />
                <form onSubmit={FileSubmit}>
                    <input
                        type="file"
                        accept="images/jpg images/jpeg images/png"
                        onChange={(e) =>
                            setFile(e.target.files && e.target.files[0])
                        }
                    />
                    <button type="submit">Upload</button>
                </form>
            </main>
        </>
    );
}
