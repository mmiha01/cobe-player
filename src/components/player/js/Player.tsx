import * as React from 'react'
import { NoDevices } from '../parts/noDevices/js/NoDevices'
import { Toggler } from '../parts/toggler/js/Toggler'
import { MiddleComponent } from '../parts/middleComponent/js/MiddleComponent'
import { ProgressBar } from '../parts/progressBar/js/ProgressBar'
import { Slider } from '../parts/slider/js/Slider'
import { UserInfo } from '../parts/userInfo/js/UserInfo'
import ProgressBarService from '@/services/ProgressBarService'

export interface PlayerProps {
    userName: string,
    productType: string,
    imageURL: string,
    isActive: boolean,
    isAuthorized: boolean,
    isPlaying: boolean,
    currentlyPlaying: string,
    album: string,
    artists: string,
    progress: number,
    duration: number,
    volume: number,
    shuffle: boolean,
    repeatMode: string,
    updaterFn: () => void,
    togglePlayerFn: () => void,
    repeatFn: () => void,
    shuffleFn: () => void,
    nextFn: () => void,
    prevFn: () => void,
}

export class Player extends React.Component<PlayerProps, {}> {

    render() {
        if (!this.props.isActive) {
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
                    <Toggler togglePlayerFn={this.props.togglePlayerFn} isPlaying={this.props.isPlaying} />
                    <MiddleComponent
                        artists={this.props.artists}
                        currentlyPlaying={this.props.currentlyPlaying}
                        shuffle={this.props.shuffle}
                        repeatMode={this.props.repeatMode}
                        shuffleFn={this.props.shuffleFn}
                        repeatFn={this.props.repeatFn}
                        nextFn={this.props.nextFn}
                        prevFn={this.props.prevFn}
                    />
                    <Slider volume={this.props.volume} />
                </div>
                <ProgressBar
                progress={this.props.progress}
                duration={this.props.duration}
                />
            </div>
        )
    }
}