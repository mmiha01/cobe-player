import * as React from 'react'

interface PlayerProps {
    isActive: boolean,
    isAuthorized: boolean,
    isPlaying: boolean,
    currentlyPlaying: string,
}

export class Player extends React.Component<PlayerProps, {}> {
    render() {
        if (!this.props.isActive) {
            return (
                <div className='hero'>
                    <div className='hero-item' style={{width: '100%', height: '80%'}}>
                        <h1>No devices connected</h1>
                    </div>
                </div>
            )
        }

        return (
            <div className='hero'>
                <div className='hero-item' style={{width: '100%', height: '80%'}}>
                    123
                </div>
            </div>
        )
    }
}