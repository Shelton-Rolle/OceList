import { PageLoaderProps } from '@/types/props';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export const PageLoader = ({ size, color }: PageLoaderProps) => {
    return (
        <div className="h-full flex justify-center items-center animate-spin">
            <AiOutlineLoading3Quarters size={size} color={color} />
        </div>
    );
};
