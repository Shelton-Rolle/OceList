import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { NavItemProps } from '@/types/props';
import { useRouter } from 'next/router';
import Image from 'next/image';

export const PageHeader = () => {
    const router = useRouter();
    const { currentUser } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [openProfileMenu, setOpenProfileMenu] = useState<boolean>(false);

    const NavItem = ({ label, href, active }: NavItemProps) => (
        <a
            className={`relative ${
                active && 'text-secondary-light'
            } font-roboto font-bold max-md:uppercase text-2xl md:font-poppins ${
                href === '/'
                    ? 'md:font-bold mt:text-3xl lg:text-4xl'
                    : 'md:font-normal md:text-lg'
            } duration-150 hover:text-secondary-light`}
            href={href}
        >
            {label}
        </a>
    );

    return (
        <header className="relative p-6 z-20">
            <div className="fixed right-0 top-0 w-full px-6 py-6 bg-opacity-80 bg-background-light backdrop-blur-sm z-10 md:hidden">
                <button
                    id="menu button"
                    className="relative w-12 flex flex-col gap-1 ml-auto md:hidden z-20"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    <div
                        className={`w-full h-1 bg-secondary-light rounded-full ml-auto ${
                            isMenuOpen
                                ? 'animate-open-line-1'
                                : 'animate-close-line-1'
                        }`}
                    />
                    <div
                        className={`w-1/2 h-1 bg-secondary-light rounded-full ml-auto ${
                            isMenuOpen
                                ? 'animate-open-line-2'
                                : 'animate-close-line-2'
                        }`}
                    />
                    <div
                        className={`w-1/4 h-1 bg-secondary-light rounded-full ml-auto ${
                            isMenuOpen
                                ? 'animate-open-line-3'
                                : 'animate-close-line-3'
                        }`}
                    />
                </button>
            </div>
            <nav
                className={`max-md:fixed top-0 ${
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
                    <div className="flex flex-col gap-4 md:flex-row md:items-center lg:gap-7">
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
                                <div className="md:hidden flex flex-col gap-4">
                                    <NavItem
                                        label="Profile"
                                        href={`/${currentUser?.displayName}`}
                                        active={false}
                                    />
                                    <NavItem
                                        label="Settings"
                                        href="/profile/settings"
                                        active={
                                            router.asPath.split('/')[3] ===
                                            'settings'
                                        }
                                    />
                                </div>
                                <div className="relative max-md:hidden">
                                    <button
                                        className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-default-light duration-300 hover:border-secondary-light"
                                        onClick={() =>
                                            setOpenProfileMenu(!openProfileMenu)
                                        }
                                    >
                                        {currentUser ? (
                                            <Image
                                                src={currentUser?.photoURL!}
                                                alt="user avatar image"
                                                fill
                                                sizes="100%"
                                            />
                                        ) : (
                                            <div className="absolute top-0 left-0 w-full h-full bg-slate-400 animate-pulse" />
                                        )}
                                    </button>
                                    {openProfileMenu && (
                                        <div className="absolute -bottom-full translate-y-3/4 right-0 flex flex-col items-end gap-5 bg-background-light backdrop-blur-sm bg-opacity-90 p-6 rounded-sm">
                                            <NavItem
                                                label="Profile"
                                                href={`/${currentUser?.displayName}`}
                                                active={false}
                                            />
                                            <NavItem
                                                label="Settings"
                                                href="/profile/settings"
                                                active={
                                                    router.asPath.split(
                                                        '/'
                                                    )[3] === 'settings'
                                                }
                                            />
                                        </div>
                                    )}
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
                </div>
            </nav>
        </header>
    );
};
