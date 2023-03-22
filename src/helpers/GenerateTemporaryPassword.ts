export default function GenerateTemporaryPassword(): string {
    const chars =
        '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let password: string = '';

    for (let i = 0; i < 16; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password = password + chars[randomIndex];
    }

    return password;
}
