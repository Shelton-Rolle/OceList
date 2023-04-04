import Head from 'next/head';
import { PageLayout } from '@/layouts/PageLayout';
import Link from 'next/link';
import { BiLogIn } from 'react-icons/bi';

export default function Home() {
    return (
        <>
            <Head>
                <title>Home</title>
                <meta
                    name="description"
                    content="Landing page to introduce the user to the platform."
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <PageLayout>
                <section id="welcome" className="mb-12 lg:mb-32 lg:pt-20">
                    <div id="heading" className="mb-3 lg:mb-6">
                        <h1 className="font-roboto font-bold text-accent-light text-sm uppercase lg:text-xl">
                            Welcome To
                        </h1>
                        <h2 className="font-poppins font-bold text-primary-light text-4xl lg:text-5xl">
                            OceList
                        </h2>
                    </div>
                    <p className="font-poppins font-light leading-7 text-xs lg:text-base lg:w-3/4 lg:leading-8">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla pariatur.
                    </p>
                </section>
                <section
                    id="why-ocelist"
                    className="relative text-background-light mb-12 py-6 -z-10 lg:mb-32 lg:py-20"
                >
                    <h3 className="font-poppins font-bold text-lg mb-3 lg:text-[40px]">
                        Why OceList?
                    </h3>
                    <p className="font-poppins font-light leading-7 text-xs lg:text-base lg:leading-8 lg:w-3/4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla pariatur.
                    </p>
                </section>
                <section id="find-contributors" className="mb-12 lg:mb-32">
                    <h4 className="font-poppins font-bold text-lg mb-3 text-secondary-light lg:text-[40px]">
                        Looking For Contributors?
                    </h4>
                    <p className="font-poppins font-light leading-7 text-xs lg:text-base lg:leading-8 lg:w-3/4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla pariatur.
                    </p>
                    <Link
                        href="/login"
                        className="flex items-center gap-2 w-fit ml-auto mt-7 font-poppins text-sm text-primary-light lg:text-xl lg:mr-auto lg:ml-0"
                    >
                        Login <BiLogIn size={24} />
                    </Link>
                </section>
            </PageLayout>
        </>
    );
}
