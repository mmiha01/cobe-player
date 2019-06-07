import { CookieService } from './Cookie'
import { request } from 'https';

export class NetworkService {
    // tslint:disable-next-line: no-any
    static makeRequest = (requestPath: string, method: string = 'GET', bodyParams: any = {}) => {

        // tslint:disable-next-line: no-any
        const requestBody: any = {
            method,
            headers: {
                'Authorization': 'Bearer ' + CookieService.getTokenFromCookie()
            },
            ...bodyParams
        }

        // for (const param in bodyParams) {
        //     if (requestBody.hasOwnProperty(param)) {
        //         requestBody[param] = bodyParams[param]
        //     }
        // }
        console.log(requestBody)
        return fetch(`https://api.spotify.com/v1${requestPath}`, requestBody).then((res) => res.text()).then((res) => {
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