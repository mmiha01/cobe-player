import * as React from 'react'
import { NoDevices } from '../parts/noDevices/js/NoDevices'
import { Toggler } from '../parts/toggler/js/Toggler'
import { MiddleComponent } from '../parts/middleComponent/js/MiddleComponent'
import { ProgressBar } from '../parts/progressBar/js/ProgressBar'
import { Slider } from '../parts/slider/js/Slider'
import { UserInfo } from '../../userInfo/js/UserInfo'
import { PlayerNetworkService } from '@/services/PlayerNetwork'

export interface PlayerProps {
    userName: string,
    productType: string,
    imageURL: string,
    isAuthorized: boolean,
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
    realStartTime: number,
    isUserInteractingWithProgressBar: boolean,
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
        realStartTime: 0,
        isUserInteractingWithProgressBar: false,
    }

    progressBarTimeout: ReturnType<typeof setTimeout>

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
            this.setState({ realStartTime: Date.now() })
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

    updatePlayerInformation = () => {
        return PlayerNetworkService.getPlayerInformation().then((response) => {
            this.parseValidPlayerResponse(response)
            this.progressUpdater()
        }).catch(console.log)
    }

    shouldSetPlayerTrack = () => {
        return location.hash.indexOf('#newtrack=') > -1
    }

    getNewTrackURI = () => {
        return decodeURI(location.hash.replace('#newtrack=', ''))
    }

    playNextSong = () => {
        PlayerNetworkService.playNextTrack().then(() => {
            const waitBeforeNewRequest = 500
            setTimeout(this.updatePlayerInformation, waitBeforeNewRequest)
        }).catch(console.log)
    }

    playPreviousSong = () => {
        PlayerNetworkService.playPreviousTrack().then(() => {
            const waitBeforeNewRequest = 500
            setTimeout(this.updatePlayerInformation, waitBeforeNewRequest)
        }).catch(console.log)
    }

    setPlayerRepeat = () => {
        if (this.state.repeatMode === 'off') {
            PlayerNetworkService.changeRepeatMode('context').then(() => {
                this.setState({ repeatMode: 'context' })
            }).catch(console.log)
        } else if (this.state.repeatMode === 'context') {
            PlayerNetworkService.changeRepeatMode('track').then(() => {
                this.setState({ repeatMode: 'track' })
            }).catch(console.log)
        } else {
            PlayerNetworkService.changeRepeatMode('off').then(() => {
                this.setState({ repeatMode: 'off' })
            }).catch(console.log)
        }
    }

    playerShuffle = () => {
        if (this.state.shuffle) {
            PlayerNetworkService.toggleShuffle(false).then(() => {
                this.setState({ shuffle: false })
            }).catch(console.log)
        } else {
            PlayerNetworkService.toggleShuffle(true).then(() => {
                this.setState({ shuffle: true })
            }).catch(console.log)
        }
    }

    togglePlayer = () => {
        if (this.state.isPlaying === true) {
            PlayerNetworkService.pausePlayer().then(() => {
                this.setState({ isPlaying: false, })
                clearTimeout(this.progressBarTimeout)
            }).catch(console.log)
            return
        }
        PlayerNetworkService.resumePlayer().then(() => {
            this.setState({ isPlaying: true, realStartTime: Date.now() })
            setTimeout(this.progressUpdater, 0)
        }).catch(console.log)
    }

    getProgressTimeDiff = () => {
        const timeNow = Date.now()
        const timeStart = this.state.realStartTime
        const timeDiff = timeNow - timeStart
        return {
            newProgress: this.state.progress + timeDiff,
            newStartTime: timeNow,
        }
    }

    progressUpdater = () => {
        if (!this.state.isPlaying) {
            return
        }

        const newTimes = this.getProgressTimeDiff()

        if (!this.state.isUserInteractingWithProgressBar) {
            this.setState({
                progress: newTimes.newProgress,
                realStartTime: newTimes.newStartTime,
            })
        }
        if (newTimes.newProgress >= this.state.duration) {
            clearTimeout(this.progressBarTimeout)

            /**
             * Možda ovdje sačekati malo dok server update napravi
             */
            this.updatePlayerInformation()
        } else {
            const refreshFrequency = 100
            this.progressBarTimeout = setTimeout(this.progressUpdater, refreshFrequency);
        }
    }

    stateProgressUpdater = (progress: number) => {
        this.setState({ progress })
    }

    changeProgressInteractState = (active: boolean) => {
        this.setState({ isUserInteractingWithProgressBar: active, realStartTime: Date.now() })
    }

    componentDidMount() {
        this.updatePlayerInformation().then(() => {
            if (this.shouldSetPlayerTrack()) {
                const trackURI = this.getNewTrackURI()
                location.hash = ''
                PlayerNetworkService.setTrack(trackURI).then(() => {
                    const howMuchToWaitResponse = 500
                    setTimeout(this.updatePlayerInformation, howMuchToWaitResponse)
                }).catch(console.log)
            }
        })
        document.title = 'Cobe player'
        window.addEventListener('focus', this.updatePlayerInformation)
    }

    componentWillUnmount() {
        window.removeEventListener('focus', this.updatePlayerInformation)
        clearTimeout(this.progressBarTimeout)
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
                    stateProgressUpdater={this.stateProgressUpdater}
                    changeInterActiveState={this.changeProgressInteractState}
                />
            </div>
        )
    }
}