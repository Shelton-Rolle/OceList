import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

export const PageHeader = () => {
    const { currentUser } = useAuth();

    return (
        <header className="col-span-3 max-h-[50vh] rounded-md bg-slate-400 overflow-hidden">
            <nav className="h-full flex flex-col font-medium text-lg text-white">
                <Link
                    href="/"
                    className="pt-6 pb-3 px-6 duration-200 hover:bg-gray-800"
                >
                    Home
                </Link>
                <Link
                    href="/browse"
                    className="py-3 px-6 duration-200 hover:bg-gray-800"
                >
                    Browse
                </Link>
                {currentUser ? (
                    <>
                        <a
                            href={`/${currentUser?.displayName}`}
                            className="py-3 px-6 duration-200 hover:bg-gray-800"
                        >
                            Profile
                        </a>
                        <Link
                            href="/favorites"
                            className="py-3 px-6 duration-200 hover:bg-gray-800"
                        >
                            Favorites
                        </Link>
                        <Link
                            href={`/profile/settings`}
                            className="mt-auto py-3 px-6 duration-200 hover:bg-gray-800"
                        >
                            Settings
                        </Link>
                    </>
                ) : (
                    <>
                        <Link
                            href="/login"
                            className="py-3 px-6 duration-200 hover:bg-gray-800"
                        >
                            Login
                        </Link>
                    </>
                )}
            </nav>
        </header>
    );
};
