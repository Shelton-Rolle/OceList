import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

export default function Settings() {
    const { currentUser } = useAuth();

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

                        <section>
                            <h2>Edit Profile</h2>
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
                        </section>
                        <section>
                            <h2>Connections</h2>
                        </section>
                        <section>
                            <h2>Danger</h2>
                        </section>
                    </>
                ) : (
                    <div>Loading</div>
                )}
            </main>
        </>
    );
}
