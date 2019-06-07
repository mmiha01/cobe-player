import * as React from 'react'
import images from '../../../../../images'

export interface MiddleProps {
    artists: string,
    currentlyPlaying: string,
    shuffle: boolean,
    repeatMode: string,
    shuffleFn: () => void,
    repeatFn: () => void,
    nextFn: () => void,
    prevFn: () => void,
}

export class MiddleComponent extends React.Component<MiddleProps, {}> {

    getShuffleIconColor = () => {
        if (this.props.shuffle) {
            return {
                background: '#fb6c6c',
            }
        }
        return {
            background: 'white',
        }
    }

    getRepeatIconColor = () => {
        if (this.props.repeatMode === 'off') {
            return {
                background: 'white'
            }
        } else if (this.props.repeatMode === 'context') {
            return {
                background: '#fb6c6c'
            }
        } else {
            return {
                background: '#005b96'
            }
        }
    }

    render() {
        return (
            <div className='hero abs-pos-hero middle-side-hero'>
                <div className='hero-item'>
                    <p id='player-artists'>{this.props.artists  }</p>
                    <h1 id='player-playing'>{this.props.currentlyPlaying}</h1>
                    <img src={images.previousIcon}
                    alt='Previous song'
                    className='small-icon pointer'
                    onClick={this.props.prevFn}
                    />
                    <img src={images.nextIcon}
                    alt='Next song'
                    className='small-icon pointer'
                    onClick={this.props.nextFn} />
                    <img src={images.repeatIcon}
                        style={this.getRepeatIconColor()}
                        alt='Shuffle'
                        className='small-icon pointer'
                        onClick={this.props.repeatFn} />
                    <img src={images.shuffleIcon}
                        style={this.getShuffleIconColor()}
                        alt='Random'
                        className='small-icon pointer'
                        onClick={this.props.shuffleFn} />
                </div>
            </div>
        )
    }
}
