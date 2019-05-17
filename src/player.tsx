import * as React from 'react'
const devicesIcon = require('./images/devices.svg')
const playIcon = require('./images/play.svg')
const pauseIcon = require('./images/pause.svg')
const shuffleIcon = require('./images/shuffle.svg')
const repeatIcon = require('./images/repeat.svg')
const nextIcon = require('./images/next.svg')
const prevIcon = require('./images/previous.svg')

/**
 * Object type for fn?
 */
export interface PlayerProps {
    isActive: boolean,
    isAuthorized: boolean,
    isPlaying: boolean,
    currentlyPlaying: string,
    album: string,
    artists: string,
    progress: number,
    duration: number,
    volume: number,
    updaterFn: any,
    togglePlayerFn: any,
    repeatFn: any,
    nextFn: any,
    prevFn: any,
}

export class Player extends React.Component<PlayerProps, {}> {
    render() {
        // const updateInterval = () => setInterval(() => {
        //     this.props.updaterFn()
        // }, 30000)

        /**
         * Too many calls to API
         * SOLUTION (??): SetTimeout of (DURATION-PROGRESS), then update
         */
        // updateInterval()

        if (!this.props.isActive) {
            return (
                <div className='hero'>
                    <div className='hero-item'>
                        <h1>No devices connected</h1>
                        <div className='round-icon'>
                            <img src={devicesIcon} alt='' />
                        </div>
                    </div>
                </div>
            )
        }
        const iconToUseForPlay = this.props.isPlaying === true ? pauseIcon : playIcon
        return (
            <div className='hero'>
                <div className='hero-item' style={{width: '100%', height: '80%'}}>
                    <div className='hero' style={{width: '40%', position: 'absolute'}}>
                        <div className='hero-item'>
                            <div className='round-icon pointer' onClick={this.props.togglePlayerFn}>
                                <img src={iconToUseForPlay} alt='' />
                            </div>
                        </div>
                    </div>
                    <div className='hero' style={{width: '50%', position: 'absolute', left: '50%'}}>
                        <div className='hero-item'>
                            <p>{this.props.artists  }</p>
                            <h1>{this.props.currentlyPlaying}</h1>
                            <img src={prevIcon}
                            alt='Prethodna pjesma'
                            className='small-icon pointer'
                            onClick={this.props.prevFn}
                            />
                            <img src={nextIcon}
                            alt='Sljedeća pjesma'
                            className='small-icon pointer'
                            onClick={this.props.nextFn} />
                            <img src={repeatIcon} alt='Ponavljaj pjesmu' className='small-icon pointer' />
                            <img src={shuffleIcon} alt='Nasumična pjesma' className='small-icon pointer' />
                        </div>
                    </div>
                    <div id='volume-slider-container'
                        className='hero pointer'
                        style={{width: '10%', position: 'absolute', left: '90%', padding: '18px 0'}}
                    >
                        <div id='volume-slider'>
                            <div id='volume-slider-handle'
                            style={{top: (100 - this.props.volume) + '%'}}
                            >

                            </div>
                        </div>
                    </div>
                </div>
                <div id='progress-bar' style={{width: (this.props.progress / this.props.duration) * 100 + '%'}}></div>
            </div>
        )
    }
}