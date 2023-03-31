import { IUser, Post } from '@/types/dataObjects';
import GetUser from './GetUser';

export default async function GetFollowedPosts(
    followingUsers: IUser[]
): Promise<Post[]> {
    const posts: Post[] = [];

    for (let i = 0; i < followingUsers.length; i++) {
        const user = await GetUser(followingUsers[i].displayName!);
        if (user?.posts) {
            user?.posts?.map((post) => posts.push(post));
        }
    }

    return posts;
}
