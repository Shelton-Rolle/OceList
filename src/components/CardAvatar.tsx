import { CardAvatarProps } from '@/types/props';
import Image from 'next/image';

export default function CardAvatar({ src, alt }: CardAvatarProps) {
    return (
        <div className="relative w-full h-full max-w-[35px] max-h-[35px] rounded-full overflow-hidden col-span-2 -z-10">
            <Image src={src} alt={alt} fill />
        </div>
    );
}
