import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export const PageLoader = () => {
    return (
        <div className="h-full flex justify-center items-center animate-spin">
            <AiOutlineLoading3Quarters size={60} color="#FDF5BF" />
        </div>
    );
};
