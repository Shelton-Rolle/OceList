import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { PageLayout } from '@/layouts/PageLayout';
import GetProjects from '@/database/GetProjects';
import GetIssues from '@/database/GetIssues';
import { Issue, Project } from '@/types/dataObjects';

export default function Home() {
    const { currentUserData } = useAuth();

    async function Shuffle(
        array: (Project | Issue)[]
    ): Promise<(Project | Issue)[]> {
        let currentIndex = array.length,
            randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex != 0) {
            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex],
                array[currentIndex],
            ];
        }

        return array;
    }

    async function GenerateFeed() {
        const projects = await GetProjects();
        const issues = await GetIssues();
        const feedData: (Project | Issue)[] = await Shuffle([
            ...projects,
            ...issues,
        ]);

        console.log('Feed Data: ', feedData);
    }

    useEffect(() => {
        console.log('Current User Database Data: ', currentUserData);
        if (currentUserData) {
            GenerateFeed();
        }
    }, [currentUserData]);

    return (
        <>
            <Head>
                <title>Simu</title>
                <meta name="description" content="Landing Page" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <PageLayout>
                <section className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-black my-3">
                        Welcome to Simu!
                    </h1>
                    <p className="text-lg leading-8">
                        I&apos;d like to start by first saying thank you for
                        taking the time to alpha test my project. I&apos;d also
                        like to apologize for the current look of the project.
                        It is in very early development so the main focus so far
                        has been functionality. I&apos;ll start with a brief
                        introduction to what Simu is but feel free to skip ahead
                        to the test instructions.
                    </p>
                    <h2 className="text-2xl font-bold text-black my-3">
                        What is Simu?
                    </h2>
                    <p className="text-lg leading-8">
                        Simu is a community-driven social platform for
                        developers to browse and share Open Source projects.
                        Users can browse a database of open source projects
                        provided by other users on the platform as well as list
                        projects of their own for other developers to find. The
                        goal is to provide a centralized space for developers to
                        better explore the world of open source easier.
                    </p>
                    <h2 className="text-2xl font-bold text-black my-3">
                        The Instructions
                    </h2>
                    <p className="text-lg leading-8">
                        Below are some tasks that I’d like you to try and
                        complete in the application. These are basic
                        functionalities that the application will have and my
                        goal is to ensure they work up to standard before moving
                        onto the next stage of development.
                        <br />
                        Note: Feel free to contact me on discord -{' '}
                        <strong>chovbee#0273</strong> - to let me know any
                        opinions you might have on the application such as
                        advice on what could be better, even if it might not be
                        in the scope of this test. I’m open to any and all
                        input!
                    </p>
                    <ul className="my-10 list-decimal">
                        <li className="my-5">
                            Create an Account - Navigate to the login page to
                            link your github and create an account. When loggin
                            in for the first time, you will be navigated to a
                            profile-setup page to complete setting up your
                            profile. There you will be prompted to select some
                            of your public github repos to add as &quot;Open
                            Source Projects&quot;. It is not required, but
                            encouraged to add at least 1 project for the sake of
                            the test.
                        </li>
                        <li className="my-5">
                            View Your Profile - Navigate to the profile page
                            just to ensure the data shown matches the data
                            you&apos;ve provided, including any public issues
                            you are currently assigned to.
                        </li>
                        <li className="my-5">
                            Update Your Profile - Navigate to the settings page
                            and try updating your avatar! By default your avatar
                            should be the same as your github but feel free to
                            switch it up a bit!
                        </li>
                        <li className="my-5">
                            Add a new project - Navigate back to your profile
                            page and try adding a new project. This should open
                            a modal showing all your public repos where you can
                            just check which ones you want to add. Note: This
                            modal does not allow you to remove projects that
                            were already added.
                        </li>
                        <li className="my-5">
                            Logging Out and Back In - The final functionality I
                            would like you to try out is logging out and back
                            in. Once you log out, navigate back to the same
                            login page, however, since we have a record of your
                            account, you should be navigated back to the landing
                            page instead of the profile-setup page.
                        </li>
                    </ul>
                </section>
            </PageLayout>
        </>
    );
}
