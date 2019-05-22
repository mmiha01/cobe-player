import * as React from 'react'
import images from '../../../images'
import '../css/login.scss'

export interface LoginProps {
    redirectFn: () => void,
}

export class Login extends React.Component<LoginProps, {}> {
    render() {
        document.title = 'Cobe player - Prijava'
        return (
            <div className='hero'>
                <div id='logo-login-banner'>
                    <img src={images.logoMedium} alt='' />
                </div>
                <div className='hero-item'>
                    <h1>COBE player</h1>
                    <button className='red-button' onClick={this.props.redirectFn}>Prijava</button>
                </div>
            </div>
        )
    }
}