import * as React from 'react'
import { CookieService } from '../services/Cookie'
import { AuthService } from '../services/Auth'
import { Player } from './player/Player'
import { NetworkService } from '../services/Network'
import { PlayerNetworkService } from '../services/PlayerNetwork'
import images from '../images'

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

    areThereActiveDevices = (devices: DevicesList[]) => devices.some((device) => device.is_active)

    findActiveDevice = (devices: DevicesList[]) => devices.find((device) => device.is_active)

    parseValidPlayerResponse = (response: any) => {
        if (this.areThereActiveDevices(response.devices)) {
            const {id, name, is_active, volume_percent } = this.findActiveDevice(response.devices)
            this.setState({
                playerID: id.toString(),
                playerName: name,
                isActive: is_active,
                volume: volume_percent,
                repeatMode: response.repeat_state,
                shuffle: response.shuffle_state,
                isPlaying: response.is_playing,
                album: response.album,
                progress: response.progress,
            })
            this.parseTrackObject(response.item)
        }
    }

    parseTrackObject = (data: any) => {
        const album = data.album.name
        const item = data.name
        const duration = data.duration_ms
        let artists = ''
        for (const a of data.artists) {
            artists += `${a.name} & `
        }
        this.setState({
            currentlyPlaying: item,
            duration,
            artists: artists.slice(0, -2),
            album,
        })
    }

    parseResponseError = (err: any, fn: () => void) => {
        if (err.status === 401) {
            this.setState({isAuthorized: false})
        } else if (err.status === 429) {
            console.log(429)
        }
        console.log(err)
    }

    checkAuthAndPlayer = () => {
        AuthService.isUserLoggedIn().then((response) => {
            if (!response) {
                this.setState({
                    isAuthorized: false,
                    didCheckAuthState: true,
                    gotPlayerInfo: true,
                })
                return false
            }
            this.setState({ 
                isAuthorized: true,
                didCheckAuthState: true,
            })
            return true
        }).then((passedAuthorization) => {
            if (passedAuthorization) {
                return PlayerNetworkService.getPlayerInformation()
            }
            return false
        }).then((response) => {
            if (response) {
                if (response.error) {
                    this.parseResponseError(response.error, PlayerNetworkService.getPlayerInformation)
                    return false
                }
                this.parseValidPlayerResponse(response)
            }
            this.setState({ gotPlayerInfo: true })
        })
    }

    updatePlayerInformation = () => {
        PlayerNetworkService.getPlayerInformation().then((response) => {
            if (response) {
                if (response.error) {
                    this.parseResponseError(response.error, () => {})
                    return false
                }
                this.parseValidPlayerResponse(response)
            }
        })
    }

    playNextSong = () => {
        NetworkService.makeRequest('/player/next', 'POST').then(() => {
            setTimeout(this.updatePlayerInformation, 200)
        })
    }

    playPreviousSong = () => {
        NetworkService.makeRequest('/player/previous', 'POST').then(() => {
            setTimeout(this.updatePlayerInformation, 200)
        })
    }

    setPlayerRepeat = () => {

    }

    playerShuffle = () => {
        
    }

    togglePlayer = () => {
        if (this.state.isPlaying === true) {
            NetworkService.makeRequest('/player/pause', 'PUT')
            this.setState({ isPlaying: false })
            return
        }
        NetworkService.makeRequest('/player/play', 'PUT')
        this.setState({ isPlaying: true })
    }

    componentWillMount() {
        this.checkAuthAndPlayer()
    }

    shouldComponentUpdate(a: any, b: any) {
        if (b.gotPlayerInfo === true && b.didCheckAuthState === true) {
            return true
        } else {
            return false
        }
    }

    render() {

        // NetworkService.checkWaitTime()

        if (window.location.pathname === '/auth') {
            AuthService.getTokenFromLocationHash()
            window.location.href = window.location.origin
            return (<div>Pričekajte trenutak...</div>)
        }

        // Isčupati dvije komponente van
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
                        <img src={images.logoMedium} alt='' />
                    </div>
                    <div className='hero-item'>
                        <h1>COBE player</h1>
                        <button className='red-button' onClick={AuthService.redirectToLogin}>Prijava</button>
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
                repeatFn={this.setPlayerRepeat}
                nextFn={this.playNextSong}
                prevFn={this.playPreviousSong}
                shuffleFn={this.playerShuffle}
                />
            )
        }
    }
}