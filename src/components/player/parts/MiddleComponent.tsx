import * as React from 'react'
import images from '../../../images'

export interface MiddleProps {
    artists: string,
    currentlyPlaying: string,
    shuffleFn: () => void,
    repeatFn: () => void,
    nextFn: () => void,
    prevFn: () => void,
}

export class MiddleComponent extends React.Component<MiddleProps, {}> {
    render() {
        return (
            <div className='hero abs-pos-hero middle-side-hero'>
                <div className='hero-item'>
                    <p id='player-artists'>{this.props.artists  }</p>
                    <h1 id='player-playing'>{this.props.currentlyPlaying}</h1>
                    <img src={images.previousIcon}
                    alt='Prethodna pjesma'
                    className='small-icon pointer'
                    onClick={this.props.prevFn}
                    />
                    <img src={images.nextIcon}
                    alt='Sljedeća pjesma'
                    className='small-icon pointer'
                    onClick={this.props.nextFn} />
                    <img src={images.repeatIcon} alt='Ponavljaj pjesmu' className='small-icon pointer' />
                    <img src={images.shuffleIcon} alt='Nasumična pjesma' className='small-icon pointer' />
                </div>
            </div>
        )
    }
}
