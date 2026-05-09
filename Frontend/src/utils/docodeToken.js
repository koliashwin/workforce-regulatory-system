export const decodeToken = (token) => {
    try {
        const base64Payload = token.split('.')[1];
        const decoded = JSON.parse(atob(base64Payload));
        return decoded;
    } catch (error) {
        return null;
    }
}