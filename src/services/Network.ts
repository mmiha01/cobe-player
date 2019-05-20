import { CookieService } from './Cookie'

interface Headers {
    'Retry-After': number, 
}

interface CustomResponse {
    headers: Headers | PromiseLike<Headers>
}

export class NetworkService {
    static makeRequest = (requestPath: string, method: string = 'GET') => {
        return fetch(`https://api.spotify.com/v1/me${requestPath}`, {
            method,
            headers: {
                'Authorization': 'Bearer ' + CookieService.getTokenFromCookie()
            },
        }).then((res) => res.text()).then((res) => {
            return res.length > 0 ? JSON.parse(res) : null
        })
    }

    static checkWaitTime = () => {
        return fetch('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': 'Bearer ' + CookieService.getTokenFromCookie()
            },
        }).then((res) => {
            return res.headers
        })
    }
}
/**
 * HEADERI ZA FETCH
 */