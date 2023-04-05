import Head from 'next/head';
import { PageLayout } from '@/layouts/PageLayout';
import Link from 'next/link';
import { BiLogIn } from 'react-icons/bi';
import Script from 'next/script';

export default function Home() {
    return (
        <>
            <Head>
                <title>OceList</title>
                <meta
                    name="description"
                    content="Landing page to introduce the user to the platform."
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
            </Head>
            <Script
                async
                src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1203308068531230"
                crossOrigin="anonymous"
            ></Script>
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
                        OceList is your new one-stop shop for Open Source
                        projects! With a fully community driven inventory, we
                        provide a wide range of open source projects of all
                        kinds for you to view and start collaborating on, as
                        well as provide a free platform for developers to list
                        their very own open source projects and get new
                        collaborators! Start browsing now!
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
                        OceList is fully community driven, meaning all projects
                        listed were provided by likeminded developers just like
                        you who are looking to be apart of the world of Open
                        Source! We also provide a free and easy platform for
                        developers with their very own open source projects, to
                        get their project in the eyes of other developers
                        looking for new projects to contribute to.
                    </p>
                </section>
                <section id="find-contributors">
                    <h4 className="font-poppins font-bold text-lg mb-3 text-secondary-light lg:text-[40px]">
                        Looking For Contributors?
                    </h4>
                    <p className="font-poppins font-light leading-7 text-xs lg:text-base lg:leading-8 lg:w-3/4">
                        Well you&apos;ve come to the right place. Here on
                        OceList, you can list your open source project
                        completely for free for all users to see. The process is
                        fully automatic and as easy as 1, 2, 3! Head over to the
                        Login page to login with GitHub and get your projects
                        out there!
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
