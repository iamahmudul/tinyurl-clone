export function generateShortlink(n: number): string {
    let result = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charLength = chars.length;
    for ( let i = 0; i < n; i++ ) {
        result += chars.charAt(Math.floor(Math.random() * charLength));
    }
    return result;
}