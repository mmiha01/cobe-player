import * as React from 'react'
import images from '../../../../../images'

export class NoDevices extends React.Component<{}> {
    render() {
        return(
            <div className='hero'>
                <div className='hero-item'>
                    <h1>No devices connected</h1>
                    <div className='round-icon'>
                        <img src={images.devicesIcon} alt='' />
                    </div>
                </div>
            </div>
        )
    }
}