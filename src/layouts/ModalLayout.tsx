import { ModalLayoutProps } from '@/types/props';

export const ModalLayout = ({ children }: ModalLayoutProps) => {
    return (
        <article className="fixed top-0 left-0 w-full h-screen z-30">
            <div className="overlay absolute top-0 left-0 w-full h-screen bg-black bg-opacity-75" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 h-4/5 md:h-3/5 bg-background-light p-6 rounded-md md:w-1/2 md:p-9">
                {children}
            </div>
        </article>
    );
};
