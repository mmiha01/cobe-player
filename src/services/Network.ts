import { CookieService } from './Cookie'
import { ErrorInterface } from '@/interfaces/ErrorInterface'

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
            if (res.length === 0) {
                return Promise.reject()
            }
            const parsedResponse = JSON.parse(res)
            if (parsedResponse.error) {
                const errorInfo: CustomEventInit<ErrorInterface> = {
                    detail: {
                        status: parsedResponse.error.status
                    }
                }
                const event = new CustomEvent('networkerror', errorInfo)
                window.dispatchEvent(event)
                return Promise.reject()
            }
            return parsedResponse
        }).catch(console.log)
    }
}