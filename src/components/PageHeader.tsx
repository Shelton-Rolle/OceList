import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { NavItemProps } from '@/types/props';
import { useRouter } from 'next/router';

export const PageHeader = () => {
    const router = useRouter();
    const { currentUser } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const NavItem = ({ label, href, active }: NavItemProps) => (
        <a
            className={`${
                active && 'text-secondary-light'
            } font-title font-bold max-md:uppercase text-2xl md:font-paragraph ${
                href === '/'
                    ? 'md:font-bold mt:text-3xl lg:text-4xl'
                    : 'md:font-normal md:text-lg'
            }`}
            href={href}
        >
            {label}
        </a>
    );

    return (
        <header className="relative p-6">
            <div className="fixed right-0 top-0 w-full px-6 py-6 bg-opacity-80 bg-background-light backdrop-blur-sm z-10 md:hidden">
                <button
                    className="relative w-12 flex flex-col gap-1 ml-auto md:hidden z-20"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <div
                        className={`w-full h-1 bg-default-light rounded-full ml-auto ${
                            isMenuOpen
                                ? 'animate-open-line-1'
                                : 'animate-close-line-1'
                        }`}
                    />
                    <div
                        className={`w-1/2 h-1 bg-default-light rounded-full ml-auto ${
                            isMenuOpen
                                ? 'animate-open-line-2'
                                : 'animate-close-line-2'
                        }`}
                    />
                    <div
                        className={`w-1/4 h-1 bg-default-light rounded-full ml-auto ${
                            isMenuOpen
                                ? 'animate-open-line-3'
                                : 'animate-close-line-3'
                        }`}
                    />
                </button>
            </div>
            <nav
                className={`max-md:absolute top-0 ${
                    isMenuOpen ? 'left-0' : '-left-full'
                } w-full h-screen bg-background-light flex items-center p-6 md:w-full md:h-fit md:fixed md:top-0 md:left-0`}
            >
                <div className="flex flex-col gap-4 md:flex-row md:justify-between md:w-full md:max-w-tablet md:mx-auto lg:max-w-desktop lg:gap-7">
                    <div>
                        <NavItem
                            label="Ocelist"
                            href="/"
                            active={router.asPath === '/'}
                        />
                    </div>
                    <div className="flex flex-col gap-4 md:flex-row lg:gap-7">
                        <NavItem
                            label="Browse"
                            href="/browse"
                            active={router.asPath.split('/')[1] === 'browse'}
                        />
                        {currentUser ? (
                            <>
                                <NavItem
                                    label="Favorites"
                                    href="/favorites"
                                    active={
                                        router.asPath.split('/')[1] ===
                                        'favorites'
                                    }
                                />
                                <NavItem
                                    label="Profile"
                                    href={`/${currentUser?.displayName}`}
                                    active={
                                        router.query.username ? true : false
                                    }
                                />
                            </>
                        ) : (
                            <NavItem
                                label="Login"
                                href="/login"
                                active={router.asPath.split('/')[1] === 'login'}
                            />
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
};
