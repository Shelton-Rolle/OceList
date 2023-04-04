import { BsTwitter } from 'react-icons/bs';
import { MdOutlineEmail } from 'react-icons/md';

export default function PageFooter() {
    return (
        <footer className="bg-default-light text-background-light w-screen py-8 px-6">
            <div className="md:max-w-tablet lg:max-w-desktop mx-auto">
                <h5 className="font-roboto text-lg lg:text-4xl">Contact</h5>
                <div className="mt-6 font-light flex flex-col gap-2">
                    <a
                        href="https://twitter.com/dev_rolle"
                        className="flex items-center gap-2"
                    >
                        <BsTwitter /> @dev_rolle
                    </a>
                    <p className="flex items-center gap-2">
                        <MdOutlineEmail /> sheltonrolle7@gmail.com
                    </p>
                </div>
                <section
                    id="copyright"
                    className="w-full pt-8 flex justify-center items-center"
                >
                    <p className="font-poppins font-light text-xs">
                        &copy; 2023, OceList
                    </p>
                </section>
            </div>
        </footer>
    );
}
