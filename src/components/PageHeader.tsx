import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export const PageHeader = () => {
    const { currentUser } = useAuth();

    return (
        <header className="w-full p-5">
            <div className="flex justify-between items-center">
                <h1>OSM Alpha</h1>
                <nav className="flex gap-9 items-center">
                    <Link href="/">Home</Link>
                    <Link href="/browse">Browse</Link>
                    {currentUser ? (
                        <>
                            <Link href={`/${currentUser?.displayName}`}>
                                Profile
                            </Link>
                            <Link href={`/profile/settings`}>Settings</Link>
                        </>
                    ) : (
                        <>
                            <Link href="/signup">Signup</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};
