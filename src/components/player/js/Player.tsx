import * as React from 'react'
import { NoDevices } from '../parts/noDevices/js/NoDevices'
import { Toggler } from '../parts/toggler/js/Toggler'
import { MiddleComponent } from '../parts/middleComponent/js/MiddleComponent'
import { ProgressBar } from '../parts/progressBar/js/ProgressBar'
import { Slider } from '../parts/slider/js/Slider'
import { UserInfo } from '../../userInfo/js/UserInfo'
import { AuthService } from '@/services/Auth';
import { PlayerNetworkService } from '@/services/PlayerNetwork';
import { UserInterface } from '@/interfaces/UserInfo'
import { ErrorInterface } from '@/interfaces/ErrorInterface'

export interface PlayerProps {
    userName: string,
    productType: string,
    imageURL: string,
    isAuthorized: boolean,
    parseResponseError: (err: ErrorInterface, fn: () => void) => void,
}

interface DevicesList {
    id: number,
    is_active: boolean,
    name: string,
    volume_percent: number,
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

interface Item {
    album: Album,
    name: string,
    duration_ms: number,
    artists: Artists[],
}

interface Artists {
    name: string,
}

interface Album {
    name: string,
}

interface State {
    playerID: string,
    playerName: string,
    isActive: boolean,
    volume: number,
    repeatMode: string,
    shuffle: boolean,
    isPlaying: boolean,
    album: string,
    progress: number,
    artists: string,
    currentlyPlaying: string,
    isAuthorized: boolean,
    duration: number,
}

export class Player extends React.Component<PlayerProps, State> {

    state = {
        playerID: '',
        playerName: '',
        isActive: false,
        volume: 0,
        repeatMode: '',
        shuffle: false,
        isPlaying: false,
        album: '',
        progress: 0,
        duration: 0,
        artists: '',
        currentlyPlaying: '',
        isAuthorized: this.props.isAuthorized,
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

    checkAuthAndPlayer = () => {
        AuthService.isUserLoggedIn().then((response: UserInterface) => {
            if (!response) {
                this.setState({
                    isAuthorized: false,
                })
                return false
            }
            this.setState({
                isAuthorized: true,
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
                    this.props.parseResponseError(response.error, PlayerNetworkService.getPlayerInformation)
                    return false
                }
                this.parseValidPlayerResponse(response)
            }
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
            const waitBeforeNewRequest = 500
            setTimeout(this.updatePlayerInformation, waitBeforeNewRequest)
        })
    }

    playPreviousSong = () => {
        PlayerNetworkService.playPreviousTrack().then(() => {
            const waitBeforeNewRequest = 500
            setTimeout(this.updatePlayerInformation, waitBeforeNewRequest)
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
        this.updatePlayerInformation()
        document.title = 'Cobe player'
    }

    render() {
        if (!this.state.isActive) {
            return (
                <NoDevices />
            )
        }
        return (
            <div className='hero'>
                <div className='hero-item large-hero'>
                    <UserInfo
                        userName={this.props.userName}
                        imageURL={this.props.imageURL}
                        productType={this.props.productType}
                    />
                    <Toggler togglePlayerFn={this.togglePlayer} isPlaying={this.state.isPlaying} />
                    <MiddleComponent
                        artists={this.state.artists}
                        currentlyPlaying={this.state.currentlyPlaying}
                        shuffle={this.state.shuffle}
                        repeatMode={this.state.repeatMode}
                        shuffleFn={this.playerShuffle}
                        repeatFn={this.setPlayerRepeat}
                        nextFn={this.playNextSong}
                        prevFn={this.playPreviousSong}
                    />
                    <Slider volume={this.state.volume} />
                </div>
                <ProgressBar
                progress={this.state.progress}
                duration={this.state.duration}
                />
            </div>
        )
    }
}