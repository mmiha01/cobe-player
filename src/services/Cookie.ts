export class CookieService {
    static storeAccesToken = (token: string) => {
        document.cookie = `token=${token}; expires=Thu, 18 Dec 2028 12:00:00 UTC`
    }

    static getTokenFromCookie = () => {
        return document.cookie.replace('token=', '')
    }
}