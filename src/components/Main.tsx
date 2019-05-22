import * as React from 'react'
import { CookieService } from '../services/Cookie'
import { AuthService } from '../services/Auth'
import { Player } from './player/Player'
import { NetworkService } from '../services/Network'
import { PlayerNetworkService } from '../services/PlayerNetwork'
import images from '../images'
import { Loader } from './Loader';
import { Login } from './Login';

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

interface Album {
    name: string,
}

interface Artists {
    name: string,
}

interface Item {
    album: Album,
    name: string,
    duration_ms: number,
    artists: Artists[],
}

interface ValidResponse {
    devices: DevicesList[],
    repeat_state: string,
    shuffle_state: boolean,
    is_playing: boolean,
    album: string,
    progress: number,
    item: Item,
 }

interface ErrorInterface {
    status: number,
    message: string,
 }

export class Main extends React.Component<MainProps, State> {

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

    parseValidPlayerResponse = (response: ValidResponse ) => {
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

    parseTrackObject = (data: Item) => {
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

    parseResponseError = (err: ErrorInterface, fn: () => void) => {
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
                    // this.parseResponseError(response.error, () => {})
                    return false
                }
                this.parseValidPlayerResponse(response)
            }
        })
    }

    playNextSong = () => {
        PlayerNetworkService.playNextTrack().then(() => {
            setTimeout(this.updatePlayerInformation, 500)
        })
    }

    playPreviousSong = () => {
        PlayerNetworkService.playPreviousTrack().then(() => {
            setTimeout(this.updatePlayerInformation, 500)
        })
    }

    setPlayerRepeat = () => {
        if (this.state.repeatMode === 'off') {
            PlayerNetworkService.changeRepeatMode('context')
            this.setState({ repeatMode: 'context' })
        } else if (this.state.repeatMode === 'context') {
            PlayerNetworkService.changeRepeatMode('track')
            this.setState({ repeatMode: 'track' })
        } else {
            PlayerNetworkService.changeRepeatMode('off')
            this.setState({ repeatMode: 'off' })
        }
    }

    playerShuffle = () => {
        if (this.state.shuffle) {
            this.setState({ shuffle: false })
            PlayerNetworkService.toggleShuffle(false)
        } else {
            this.setState({ shuffle: true })
            PlayerNetworkService.toggleShuffle(true)
        }
    }

    togglePlayer = () => {
        if (this.state.isPlaying === true) {
            PlayerNetworkService.pausePlayer()
            this.setState({ isPlaying: false })
            return
        }
        PlayerNetworkService.resumePlayer()
        this.setState({ isPlaying: true })
    }

    componentWillMount() {
        this.checkAuthAndPlayer()
    }

    shouldComponentUpdate(a: {}, b: {
        gotPlayerInfo: boolean,
        didCheckAuthState: boolean, }) {
        return b.gotPlayerInfo === true && b.didCheckAuthState === true;
    }

    render() {
        // NetworkService.checkWaitTime()
        if (window.location.pathname === '/auth') {
            AuthService.getTokenFromLocationHash()
            window.location.href = window.location.origin
            return (<div>Pričekajte trenutak...</div>)
        }
        if (!this.state.didCheckAuthState || !this.state.gotPlayerInfo) {
            return (
                <Loader />
            )
        } else if (!this.state.isAuthorized) {
            return (
                <Login redirectFn={AuthService.redirectToLogin} />
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
                shuffle={this.state.shuffle}
                repeatMode={this.state.repeatMode}
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