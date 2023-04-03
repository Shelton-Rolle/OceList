import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { NavItemProps } from '@/types/props';
import { useRouter } from 'next/router';

export const PageHeader = () => {
    const router = useRouter();
    const { currentUser } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const NavItem = ({ label, href, active }: NavItemProps) => (
        <a className={`${active && 'text-secondary-light'}`} href={href}>
            {label}
        </a>
    );

    return (
        <header className="relative p-6">
            <button
                className=" w-12 flex flex-col gap-1 ml-auto md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                <div className="w-full h-1 bg-black rounded-full ml-auto" />
                <div className="w-1/2 h-1 bg-black rounded-full ml-auto" />
                <div className="w-1/4 h-1 bg-black rounded-full ml-auto" />
            </button>
            <nav
                className={`absolute top-0 ${
                    isMenuOpen ? 'left-0' : '-left-full'
                } w-full h-screen bg-background-light`}
            >
                <div>
                    <NavItem
                        label="Ocelist"
                        href="/"
                        active={router.asPath === '/'}
                    />
                    <NavItem
                        label="Browse"
                        href="/browse"
                        active={router.asPath.split('/')[1] === 'browse'}
                    />
                    {currentUser ? (
                        <>
                            <NavItem
                                label="Profile"
                                href={`/${currentUser?.displayName}`}
                                active={router.query.username ? true : false}
                            />
                            <NavItem
                                label="Favorites"
                                href="/favorites"
                                active={
                                    router.asPath.split('/')[1] === 'favorites'
                                }
                            />
                            <div className="mt-14 lg:mt-20">
                                <NavItem
                                    label="Settings"
                                    href="/profile/settings"
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
                            active={router.asPath.split('/')[1] === 'login'}
                        />
                    )}
                </div>
            </nav>
        </header>
    );
};
