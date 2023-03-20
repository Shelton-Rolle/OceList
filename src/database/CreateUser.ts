export default async function CreateUser(user: any) {
    const data = {
        apiKey: 'test123456',
        user,
    };

    await fetch('http://localhost:3001/users/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}
