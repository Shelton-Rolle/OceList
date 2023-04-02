import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ReactNode, useState } from 'react';
import { AiOutlineHome } from 'react-icons/ai';
import { BiSearchAlt } from 'react-icons/bi';
import { CgProfile } from 'react-icons/cg';
import { MdFavorite } from 'react-icons/md';
import { IoMdSettings } from 'react-icons/io';

interface NavItemProps {
    label: string;
    href: string;
    icon: ReactNode;
}

export const PageHeader = () => {
    const { currentUser } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const NavItem = ({ label, href, icon }: NavItemProps) => (
        <a
            className="relative font-title text-h6 flex items-center justify-end gap-5"
            href={href}
        >
            {label} {icon}
        </a>
    );

    return (
        <header className="fixed top-0 left-0 w-full h-16 bg-background-dark bg-opacity-75 backdrop-blur-sm p-2 flex justify-end items-center">
            <button
                className={`relative flex flex-col gap-2 justify-between lg:hidden w-12 z-20 ${
                    isMenuOpen ? 'items-end' : 'items-start'
                }`}
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
                className={`absolute top-0 left-0 bg-background-dark w-full h-screen p-7 flex flex-col justify-center ${
                    !isMenuOpen ? 'hidden' : 'block'
                }`}
            >
                <div className="flex flex-col gap-11">
                    {currentUser && (
                        <NavItem
                            label="Home"
                            href="/"
                            icon={<AiOutlineHome />}
                        />
                    )}
                    <NavItem
                        label="Browse"
                        href="/browse"
                        icon={<BiSearchAlt />}
                    />
                    {currentUser ? (
                        <>
                            <NavItem
                                label="Profile"
                                href={`/${currentUser?.displayName}`}
                                icon={<CgProfile />}
                            />
                            <NavItem
                                label="Favorites"
                                href="/favorites"
                                icon={<MdFavorite />}
                            />
                            <div className="mt-14">
                                <NavItem
                                    label="Settings"
                                    href="/profile/settings"
                                    icon={<IoMdSettings />}
                                />
                            </div>
                        </>
                    ) : (
                        <NavItem
                            label="Login"
                            href="/login"
                            icon={<AiOutlineHome />}
                        />
                    )}
                </div>
            </nav>
        </header>
    );
};
