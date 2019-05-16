import * as React from 'react'
const logoMedium = require('./logo-medium.png')

export interface MainProps { compiler: string; framework: string; }

interface State { isAuthorized: boolean, didCheckAuthState: boolean }

export class Main extends React.Component<MainProps, State> {

    state = {
        didCheckAuthState: false,
        isAuthorized: false,
        player: {
            track: ''
        }
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

    getTokenFromLocationHash = () => {
        const splitedHash = location.hash.substring(1).split('&')
        // tslint:disable-next-line: whitespace
        this.storeAccesToken(splitedHash[0].replace('access_token=',''))
    }

    storeAccesToken = (token: string) => {
        document.cookie = `token=${token}; expires=Thu, 18 Dec 2028 12:00:00 UTC`
    }

    getTokenFromCookie = () => {
        // tslint:disable-next-line: whitespace
        return document.cookie.replace('token=','')
    }

    isUserLoggedIn = () => {
        if (!this.getTokenFromCookie()) {
            this.setState({ isAuthorized: false })
            this.setState({ didCheckAuthState: true })
            return false;
        }
        this.checkAuthWithSpotify()
    }

    checkAuthWithSpotify = () => {
        fetch('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': 'Bearer ' + this.getTokenFromCookie()
            }
        }).then((res) => res.text()).then((res) => {
            const resData = JSON.parse(res)
            if (resData.error) {
                this.setState({ isAuthorized: false })
                return
            }
            this.setState({ isAuthorized: true })
            this.setState({ didCheckAuthState: true })
        })
    }

    componentWillMount() {
        this.isUserLoggedIn()
    }

    shouldComponentUpdate() {
        return this.state.didCheckAuthState
    }

    render() {
        // console.log(this.state)
        if (window.location.pathname === '/auth') {
            this.getTokenFromLocationHash()
            window.location.href = window.location.origin
            return (<div>Pričekajte trenutak...</div>)
        }
        if (!this.state.didCheckAuthState) {
            this.checkAuthWithSpotify()
            return (
                <div className='hero'>
                    <div className='hero-item'>
                        <p>Aplikacija se učitava...</p>
                        <div className='lds-ellipsis'><div></div><div></div><div></div><div></div></div>
                    </div>
                </div>
            )
        } else if (!this.state.isAuthorized) {
            document.title = 'Cobe player - Prijava'
            return (
                <div className='hero'>
                    <div id='logo-login-banner'>
                        <img src={logoMedium} alt='' />
                    </div>
                    <div className='hero-item'>
                        <h1>COBE player</h1>
                        <button className='red-button' onClick={this.redirectToLogin}>Prijava</button>
                    </div>
                </div>
            )
        } else {
            return (<div>auth success</div>)
        }
    }
}