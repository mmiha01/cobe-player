import { CookieService } from './Cookie'
import { NetworkService } from './Network'

export class PlayerNetworkService {
    static getPlayerInformation = () => {
        return NetworkService.makeRequest('/player').then((response) => {
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
}