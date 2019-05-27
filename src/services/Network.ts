import { CookieService } from './Cookie'

export class NetworkService {
    static makeRequest = (requestPath: string, method: string = 'GET') => {
        return fetch(`https://api.spotify.com/v1${requestPath}`, {
            method,
            headers: {
                'Authorization': 'Bearer ' + CookieService.getTokenFromCookie()
            },
        }).then((res) => res.text()).then((res) => {
            return res.length > 0 ? JSON.parse(res) : null
        })
    }

    static checkWaitTime = () => {
        return fetch('https://api.spotify.com/v1', {
            headers: {
                'Authorization': 'Bearer ' + CookieService.getTokenFromCookie()
            },
        }).then((res: Response) => {
            return res.headers.get('Retry-After')
        })
    }
}
/**
 * HEADERI ZA FETCH
 */