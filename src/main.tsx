import * as React from 'react'
const logoMedium = require('./logo-medium.png')

export interface MainProps { compiler: string; framework: string; }

interface State {
    currentlyPlaying: string,
    isAuthorized: boolean,
    didCheckAuthState: boolean,
    playerID: string,
    playerName: string,
}

interface DevicesList {
    id: number,
    name: string,
 }

export class Main extends React.Component<MainProps, State, DevicesList> {

    state = {
        currentlyPlaying: '',
        didCheckAuthState: false,
        isAuthorized: false,
        playerID: '',
        playerName: '',
    }

    redirectToLogin = () => {
        // tslint:disable-next-line: max-line-length
        const scopes = encodeURIComponent('user-read-private user-read-email user-read-playback-state user-read-currently-playing')
        const redirectURL = encodeURIComponent('http://localhost:3000/auth')
        const clientID = '156f1e1dec944ef78fb5d38131610afb'
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
            return false
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
                this.setState({ didCheckAuthState: true })
                return
            }
            this.setState({ isAuthorized: true })
            this.setState({ didCheckAuthState: true })
        })
    }

    findTargetedDevice = (devices: DevicesList[], deviceName: string = 'COBE’s Mac mini (3)') => {
        for (const i of devices) {
            if (i.name === deviceName) {
                return i
            }
        }
    }

    getDevice = () => {
        fetch(`https://api.spotify.com/v1/me/player/devices`, {
            headers: {
                'Authorization': 'Bearer ' + this.getTokenFromCookie()
            }
        }).then((res) => res.text()).then((res) => {
            const resData = JSON.parse(res)
            if (resData.error) {
                this.setState({ isAuthorized: false })
                return
            }
            const { id, name } = this.findTargetedDevice(resData.devices)
            this.setState({ playerID: id.toString() })
            this.setState({ playerName: name })
        })
    }

    getPlayingTrack = () => {
        fetch(`https://api.spotify.com/v1/me/player/currently-playing`, {
            headers: {
                'Authorization': 'Bearer ' + this.getTokenFromCookie()
            }
        }).then((res) => res.text()).then((res) => {
            console.log(res)
        })
    }

    getAllInfo = () => {
        console.log('Getting info')
        if (this.state.playerID.length > 0) {
            return false
        }

        this.getDevice()
        //this.getPlayingTrack()
    }

    componentWillMount() {
        this.isUserLoggedIn()
    }

    shouldComponentUpdate() {
        return this.state.didCheckAuthState
    }

    render() {
        console.log(this.state)
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
            this.getAllInfo()
            return (<div><button onClick={this.getPlayingTrack}>Get devices</button></div>)
        }
    }
}