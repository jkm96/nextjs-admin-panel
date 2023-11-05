export function calculateTokenExpiration(dateString:string) {
    const expirationDate = new Date(dateString);
    const currentDate = new Date();

    const timeDifference = expirationDate.getTime() - currentDate.getTime();

    return Math.floor(timeDifference / 1000);//seconds
}