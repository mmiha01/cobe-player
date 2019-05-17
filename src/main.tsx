import * as React from 'react'
import { Player } from './player'
const logoMedium = require('./images/logo-medium.png')

export interface MainProps { compiler: string; framework: string; }

interface State {
    currentlyPlaying: string,
    isAuthorized: boolean,
    didCheckAuthState: boolean,
    playerID: string,
    playerName: string,
    isPlaying: boolean,
    isActive: boolean,
    album: string,
    artists: string,
    duration: number,
    progress: number,
    gotPlayerInfo: boolean,
    volume: number,
    repeatMode: string,
    shuffle: boolean,
}

interface DevicesList {
    id: number,
    is_active: boolean,
    name: string,
    volume_percent: number,
 }

export class Main extends React.Component<MainProps, State, DevicesList> {

    state = {
        currentlyPlaying: '',
        didCheckAuthState: false,
        isActive: false,
        isAuthorized: false,
        isPlaying: false,
        playerID: '',
        playerName: '',
        album: '',
        artists: '',
        duration: 0,
        progress: 0,
        gotPlayerInfo: false,
        volume: 0,
        repeatMode: '',
        shuffle: false,
    }

    redirectToLogin = () => {
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
        return new Promise((resolve) => {
            if (!this.getTokenFromCookie()) {
                this.setState({ isAuthorized: false })
                this.setState({ didCheckAuthState: true })
                this.setState({ gotPlayerInfo: true })
                resolve(false)
                return false
            } else {
                this.checkAuthWithSpotify().then(resolve)
            }
        })
    }

    checkAuthWithSpotify = () => {
        return fetch('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': 'Bearer ' + this.getTokenFromCookie()
            }
        }).then((res) => res.text()).then((res) => {
            const resData = res.length > 0 ? JSON.parse(res) : null
            if (resData && resData.error) {
                this.setState({ isAuthorized: false })
                this.setState({ didCheckAuthState: true })
                this.setState({ gotPlayerInfo: true })
                return false
            }
            this.setState({ isAuthorized: true })
            this.setState({ didCheckAuthState: true })
            return true
        })
    }

    areThereActiveDevices(devices: DevicesList[]) {
        for (const i of devices) {
            if (i.is_active === true) {
                return true
            }
        }
        return false
    }

    findActiveDevice = (devices: DevicesList[]) => {
        for (const i of devices) {
            if (i.is_active === true) {
                return i
            }
        }
    }

    getShuffleAndRepeat = (allow: boolean = true) => {
        if (!allow) {
            return false
        }
        return fetch(`https://api.spotify.com/v1/me/player/`, {
            headers: {
                'Authorization': 'Bearer ' + this.getTokenFromCookie()
            }
        }).then((res) => res.text()).then((res) => {
            const resData = res.length > 0 ? JSON.parse(res) : null
            if (resData && resData.error) {
                this.setState({ isAuthorized: false })
                this.setState({ gotPlayerInfo: true })
                return false
            }
            this.setState({repeatMode: resData.repeat_state})
            this.setState({shuffle: resData.shuffle_state})
            return true
        })
    }

    getDevice = (allow: boolean = true) => {
        if (!allow) {
            return false
        }
        return fetch(`https://api.spotify.com/v1/me/player/devices`, {
            headers: {
                'Authorization': 'Bearer ' + this.getTokenFromCookie()
            }
        }).then((res) => res.text()).then((res) => {
            const resData = res.length > 0 ? JSON.parse(res) : null
            if (resData && resData.error) {
                this.setState({ isAuthorized: false })
                this.setState({ gotPlayerInfo: true })
                return false
            }
            if (!this.areThereActiveDevices(resData.devices)) {
                this.setState({ gotPlayerInfo: true })
                return false
            }
            const {id, name, is_active, volume_percent } = this.findActiveDevice(resData.devices)
            this.setState({ playerID: id.toString() })
            this.setState({ playerName: name })
            this.setState({ isActive: is_active })
            this.setState({ volume: volume_percent})
            return true
        })
    }

    getPlayingTrack = (allow: boolean = true) => {
        if (!allow) {
            return false
        }
        return fetch(`https://api.spotify.com/v1/me/player/currently-playing`, {
            headers: {
                'Authorization': 'Bearer ' + this.getTokenFromCookie()
            }
        }).then((res) => res.text()).then((res) => {
            const resData = res.length > 0 ? JSON.parse(res) : null
            if (resData && resData.error) {
                this.setState({ isAuthorized: false })
                this.setState({ gotPlayerInfo: true })
                return false
            }
            this.parseTrackObject(resData)
            return true
        })
    }

    parseTrackObject = (data: any) => {
        const album = data.item.album.name
        const isPlaying = data.is_playing
        const item = data.item.name
        const duration = data.item.duration_ms
        const progress = data.progress_ms
        // tslint:disable-next-line: prefer-const
        let artists = ''
        for (const a of data.item.artists) {
            artists += `${a.name} & `
        }

        // tslint:disable-next-line: object-literal-shorthand
        this.setState({isPlaying: isPlaying})
        // tslint:disable-next-line: object-literal-shorthand
        this.setState({currentlyPlaying: item})
        // tslint:disable-next-line: object-literal-shorthand
        this.setState({duration: duration})
        // tslint:disable-next-line: object-literal-shorthand
        this.setState({progress: progress})
        // tslint:disable-next-line: object-literal-shorthand
        this.setState({artists: artists.slice(0, -2) })
        // tslint:disable-next-line: object-literal-shorthand
        this.setState({album: album })
    }

    /**
     * Player commands
     */
    togglePlayer = () => {
        const newState = this.state.isPlaying ? false : true
        this.setState({ isPlaying: newState})

        if (!this.state.isPlaying) {
            fetch('https://api.spotify.com/v1/me/player/play', {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + this.getTokenFromCookie()
                }
            }).then((res) => res.text()).then((res) => {
                const resData = res.length > 0 ? JSON.parse(res) : null
                if (resData && resData.error) {
                    this.setState({ isAuthorized: false })
                    return false
                }
            })
        } else {
            if (this.state.isPlaying) {
                fetch('https://api.spotify.com/v1/me/player/pause', {
                    method: 'PUT',
                    headers: {
                        'Authorization': 'Bearer ' + this.getTokenFromCookie()
                    }
                }).then((res) => res.text()).then((res) => {

                    const resData = res.length > 0 ? JSON.parse(res) : null
                    if (resData && resData.error) {
                        this.setState({ isAuthorized: false })
                        return false
                    }
                })
            }
        }
    }

    playerRepeat = () => {
        return
    }

    nextSong = (allow: boolean = true) => {
        if (!allow) {
            return false
        }
        return fetch(`https://api.spotify.com/v1/me/player/next`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + this.getTokenFromCookie()
            }
        }).then((res) => res.text()).then((res) => {
            const resData = res.length > 0 ? JSON.parse(res) : null
            if (resData && resData.error) {
                this.setState({ isAuthorized: false })
                return false
            }
            setTimeout(this.getPlayingTrack, 200)
            return true
        })
    }

    prevSong = (allow: boolean = true) => {
        if (!allow) {
            return false
        }
        return fetch(`https://api.spotify.com/v1/me/player/previous`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + this.getTokenFromCookie()
            }
        }).then((res) => res.text()).then((res) => {
            const resData = res.length > 0 ? JSON.parse(res) : null
            if (resData && resData.error) {
                this.setState({ isAuthorized: false })
                return false
            }
            setTimeout(this.getPlayingTrack, 200)
            return true
        })
    }

    checkAuthAndPlayer = () => {
        this.isUserLoggedIn().
        then(this.getDevice).
        then(this.getShuffleAndRepeat).
        then(this.getPlayingTrack).
        then(() => {
            this.setState({ gotPlayerInfo: true })
        })
    }

    componentWillMount() {
        this.checkAuthAndPlayer()
    }

    /** !!! */
    shouldComponentUpdate(a: any, b: any) {
        if (b.gotPlayerInfo === true && b.didCheckAuthState === true) {
            return true
        } else {
            return false
        }
    }

    render() {
        if (window.location.pathname === '/auth') {
            this.getTokenFromLocationHash()
            window.location.href = window.location.origin
            return (<div>Pričekajte trenutak...</div>)
        }

        if (!this.state.didCheckAuthState || !this.state.gotPlayerInfo) {
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
            return (
                <Player
                isActive={this.state.isActive}
                isAuthorized={this.state.isAuthorized}
                isPlaying={this.state.isPlaying}
                currentlyPlaying={this.state.currentlyPlaying}
                album={this.state.album}
                artists={this.state.artists}
                progress={this.state.progress}
                duration={this.state.duration}
                volume={this.state.volume}
                updaterFn={this.checkAuthAndPlayer}
                togglePlayerFn={this.togglePlayer}
                repeatFn={this.playerRepeat}
                nextFn={this.nextSong}
                prevFn={this.prevSong}
                />
            )
        }
    }
}