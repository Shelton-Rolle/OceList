import { ref, uploadBytes } from 'firebase/storage';
import GetImageURL from './GetImage';
import storage from './storageInit';

export default async function UploadImage(file: any, username: string) {
    let imageURL;
    const imageRef = ref(storage, `images/avatars/${username}`);

    await uploadBytes(imageRef, file).then(async (snapshot) => {
        if (snapshot) {
            const { fullPath } = snapshot.ref;

            await GetImageURL(fullPath).then((url) => {
                imageURL = url;
            });
        }
    });

    return imageURL;
}
