import * as React from 'react'
import images from '../../../images'

export interface TogglerProps {
    togglePlayerFn: () => void,
    isPlaying: boolean,
}

export class Toggler extends React.Component<TogglerProps, {}> {
    render() {
        const iconToUseForPlay = this.props.isPlaying === true ? images.pauseIcon : images.playIcon
        return (
            <div className='hero abs-pos-hero left-side-hero'>
                <div className='hero-item'>
                    <div className='round-icon pointer' onClick={this.props.togglePlayerFn}>
                        <img src={iconToUseForPlay} alt='' />
                    </div>
                </div>
            </div>
        )
    }
}