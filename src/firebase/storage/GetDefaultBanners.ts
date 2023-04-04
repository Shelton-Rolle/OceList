import GetImageURL from './GetImage';

export default async function GetDefaultBanners(): Promise<string[]> {
    const defaultBanners: string[] = [];
    const defaultPaths = [
        'images/banners/default/balloons.jpg',
        'images/banners/default/beach.jpg',
        'images/banners/default/bridge.jpg',
        'images/banners/default/mountains.jpg',
    ];

    for (let i = 0; i < defaultPaths.length; i++) {
        await GetImageURL(defaultPaths[i]).then((url) => {
            defaultBanners.push(url!);
        });
    }

    return defaultBanners;
}
