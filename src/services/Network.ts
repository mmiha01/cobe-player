import { CookieService } from './Cookie'

export class NetworkService {

    // tslint:disable-next-line: no-any
    static getRequestBody = (method: string = 'GET', bodyParams: any = {}) => {
        if (method !== 'GET') {
            return {
                method,
                headers: {
                    'Authorization': 'Bearer ' + CookieService.getTokenFromCookie()
                },
                body: JSON.stringify(bodyParams)
            }
        }
        return {
            method,
            headers: {
                'Authorization': 'Bearer ' + CookieService.getTokenFromCookie()
            },
        }
    }

    // tslint:disable-next-line: no-any
    static makeRequest = (requestPath: string, method: string = 'GET', bodyParams: any = {}) => {

        // tslint:disable-next-line: no-any
        const requestBody: any = NetworkService.getRequestBody(method, bodyParams)

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