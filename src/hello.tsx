import * as React from 'react'
const logo = require('./logo-black.png')

export interface MainProps { compiler: string; framework: string; }

interface State { isAuthorized: boolean }

// interface authInfo { clientID: string, clientSecret: string, code: string | boolean }

export class Main extends React.Component<MainProps, State> {

    /**
     * Main states
     */
    state = {
        isAuthorized: false,
    }

    getTokenFromLocationHash = () => {
        const splitedHash = location.hash.substring(1).split('&')
        this.storeAccesToken(splitedHash[0].replace('access_token=',''))
    }

    storeAccesToken = (token: string) => {
        document.cookie = `token=${token}; expires=Thu, 18 Dec 2028 12:00:00 UTC`
    }

    getToken = () => {
        return document.cookie.replace('token=','')
    }

    redirectToLogin = () => {
        const scopes = encodeURIComponent('user-read-private user-read-email')
        const redirectURL = encodeURIComponent('http://localhost:3000/auth')
        const clientID = '55d72038af6c4929adb6dd70085b4e59'
        const spotifyAuth = 'https://accounts.spotify.com/authorize?response_type=token' +
        '&client_id=' + clientID +
        '&scope=' + scopes +
        '&redirect_uri=' + redirectURL
        window.location.href = spotifyAuth
    }

    checkAuthWithSpotify = () => {
        return fetch('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': 'Bearer ' + this.getToken()
            }
        })
    }

    userLoggedIn = () => {
        if (this.getToken().length === 0) {
            return false;
        }
        this.checkAuthWithSpotify().then((res) => { return res.text(); }).then((res) => {  console.log(res) })
    }

    render() {
        this.getTokenFromLocationHash()
        return (
            <div>
                <h1>Cobe player setting up</h1>
                <p>Setting up</p>
                <img src={logo} />
                <button onClick={this.userLoggedIn}>Log in</button>
            </div>
        )
    }
} 