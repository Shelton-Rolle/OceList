import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ReactNode, useState } from 'react';
import { AiOutlineHome } from 'react-icons/ai';
import { BiSearchAlt } from 'react-icons/bi';
import { CgProfile } from 'react-icons/cg';
import { MdFavorite } from 'react-icons/md';
import { IoMdSettings } from 'react-icons/io';
import { NavItemProps } from '@/types/props';
import { useRouter } from 'next/router';

export const PageHeader = () => {
    const router = useRouter();
    const { currentUser } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const NavItem = ({ label, href, icon, active }: NavItemProps) => (
        <a
            className={`relative font-title text-h6 flex items-center justify-end gap-5 ${
                active && 'text-secondary-dark'
            }`}
            href={href}
        >
            {label} {icon}
        </a>
    );

    return (
        <header className="fixed top-0 left-0 w-full h-16 bg-background-dark bg-opacity-75 backdrop-blur-sm p-2 flex justify-end items-center md:relative md:col-span-4 md:border-r-2 md:border-default-dark md:border-opacity-10 md:h-screen">
            <button
                className={`relative flex flex-col gap-2 justify-between lg:hidden w-12 z-20 ${
                    isMenuOpen ? 'items-end' : 'items-start'
                } md:hidden`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                <div
                    className={`h-1 bg-white rounded-sm ${
                        isMenuOpen
                            ? 'animate-open-line-1'
                            : 'animate-close-line-1'
                    }`}
                />
                <div
                    className={`h-1 bg-white rounded-sm ${
                        isMenuOpen
                            ? 'animate-open-line-2'
                            : 'animate-close-line-2'
                    }`}
                />
                <div
                    className={`h-1 bg-white rounded-sm ${
                        isMenuOpen
                            ? 'animate-open-line-3'
                            : 'animate-close-line-3'
                    }`}
                />
            </button>
            <nav
                className={`absolute top-0 left-0 bg-background-dark w-full h-screen p-7 ${
                    !isMenuOpen ? 'max-md:hidden' : 'max-md:block'
                } md:block`}
            >
                <div className="flex flex-col gap-11 mt-14">
                    {currentUser && (
                        <NavItem
                            label="Home"
                            href="/"
                            icon={<AiOutlineHome />}
                            active={router.asPath === '/'}
                        />
                    )}
                    <NavItem
                        label="Browse"
                        href="/browse"
                        icon={<BiSearchAlt />}
                        active={router.asPath.split('/')[1] === 'browse'}
                    />
                    {currentUser ? (
                        <>
                            <NavItem
                                label="Profile"
                                href={`/${currentUser?.displayName}`}
                                icon={<CgProfile />}
                                active={router.query.username ? true : false}
                            />
                            <NavItem
                                label="Favorites"
                                href="/favorites"
                                icon={<MdFavorite />}
                                active={
                                    router.asPath.split('/')[1] === 'favorites'
                                }
                            />
                            <div className="mt-14 lg:mt-20">
                                <NavItem
                                    label="Settings"
                                    href="/profile/settings"
                                    icon={<IoMdSettings />}
                                    active={
                                        router.asPath.split('/')[2] ===
                                        'settings'
                                    }
                                />
                            </div>
                        </>
                    ) : (
                        <NavItem
                            label="Login"
                            href="/login"
                            icon={<AiOutlineHome />}
                            active={router.asPath.split('/')[1] === 'login'}
                        />
                    )}
                </div>
            </nav>
        </header>
    );
};
