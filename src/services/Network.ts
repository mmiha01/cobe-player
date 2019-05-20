import { CookieService } from './cookie'

// interface Headers {
//     "Retry-After": number, 
// }

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
        }).then((res) => res.headers)
    }
}

// NetworkService.checkWaitTime().then((a) => {
//     if (a['Retry-After']) {

//     }
// })
