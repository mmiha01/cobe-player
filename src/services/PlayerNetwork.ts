import { NetworkService } from './Network'

export class PlayerNetworkService {
    static getPlayerInformation = () => {
        return NetworkService.makeRequest('/me/player').then((response) => {
            if (response && response.error) {
                return response
            } else if (!response) {
                return false
            }
            const responseDevices = response.device || response.devices;
            if (!Array.isArray(responseDevices)) {
                response.device = [responseDevices]
            }
            return {
                album: response.album,
                devices: response.device,
                is_playing: response.is_playing,
                item: response.item,
                progress: response.progress_ms,
                repeat_state: response.repeat_state,
                shuffle_state: response.shuffle_state,
            }
        })
    }

    static playNextTrack = () => {
        return NetworkService.makeRequest('/me/player/next', 'POST')
    }

    static playPreviousTrack = () => {
        return NetworkService.makeRequest('/me/player/previous', 'POST')
    }

    static pausePlayer = () => {
        return NetworkService.makeRequest('/me/player/pause', 'PUT')
    }

    static resumePlayer = () => {
        return NetworkService.makeRequest('/me/player/play', 'PUT')
    }

    static toggleShuffle = (shuffleState: boolean) => {
        return NetworkService.makeRequest(`/me/player/shuffle?state=${shuffleState.toString()}`, 'PUT')
    }

    static changeRepeatMode = (state: string) => {
        return NetworkService.makeRequest(`/me/player/repeat?state=${state}`, 'PUT')
    }

    static changeProgress = (val: number) => {
        return NetworkService.makeRequest(`/me/player/seek?position_ms=${val}`, 'PUT')
    }

    static setVolume = (val: number) => {
        return NetworkService.makeRequest(`/me/player/volume?volume_percent=${val}`, 'PUT')
    }

    static setTrack = (trackURI: string) => {
        return NetworkService.makeRequest(`/me/player/play`, 'PUT', {
            context_uri: trackURI,
            offset: {
                position: 0,
            },
            position_ms: 0,
        })
    }
}