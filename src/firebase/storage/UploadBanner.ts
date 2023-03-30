import storage from './storageInit';
import { ref, uploadBytes } from 'firebase/storage';
import GetImageURL from './GetImage';

export default async function UploadBanner(file: File, username: string) {
    let bannerURL;
    const bannerRef = ref(storage, `images/banners/${username}`);

    await uploadBytes(bannerRef, file).then(async (snapshot) => {
        if (snapshot) {
            const { fullPath } = snapshot.ref;

            await GetImageURL(fullPath).then((url) => {
                bannerURL = url;
            });
        }
    });

    return bannerURL;
}
