import { ModalLayoutProps } from '@/types/props';

export const ModalLayout = ({ children }: ModalLayoutProps) => {
    return (
        <article className="absolute top-0 left-0 w-full h-screen">
            <div className="overlay absolute top-0 left-0 w-full h-screen bg-black bg-opacity-75" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-white">
                {children}
            </div>
        </article>
    );
};
