import { getDownloadURL, ref } from 'firebase/storage';
import storage from './storageInit';

export default async function GetImageURL(
    path: string
): Promise<string | undefined> {
    let url;
    const imageRef = ref(storage, path);

    await getDownloadURL(imageRef)
        .then((fileURL) => {
            url = fileURL;
        })
        .catch((error) => {
            console.log('Error Code: ', error.code);
        });

    return url;
}
