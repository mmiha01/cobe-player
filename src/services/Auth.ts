import { CookieService } from './Cookie'
import { NetworkService } from './Network';

export class AuthService {
    static redirectToLogin = () => {
        // tslint:disable-next-line: max-line-length
        const scopes = encodeURIComponent('user-read-private user-read-email user-read-playback-state user-read-currently-playing user-modify-playback-state')
        const redirectURL = encodeURIComponent('http://localhost:3000/auth')
        const clientID = '156f1e1dec944ef78fb5d38131610afb'
        const spotifyAuth = 'https://accounts.spotify.com/authorize?response_type=token' +
        '&client_id=' + clientID +
        '&scope=' + scopes +
        '&redirect_uri=' + redirectURL
        window.location.href = spotifyAuth
    }

    static getTokenFromLocationHash = () => {
        const splitedHash = location.hash.substring(1).split('&')
        CookieService.storeAccesToken(splitedHash[0].replace('access_token=', ''))
    }

    static checkAuthWithSpotify = () => {
        return NetworkService.makeRequest('/me').then((response) => {
            if (response && response.error) {
                return false
            }
            return response
        })
    }

    static isUserLoggedIn = () => {
        return new Promise((resolve) => {
            if (!CookieService.getTokenFromCookie()) {
                resolve(false)
            } else {
                AuthService.checkAuthWithSpotify().then(resolve)
            }
        })
    }
}