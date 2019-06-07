import * as React from 'react'
import images from '../../../images'

export interface LoginProps {
    redirectFn: () => void,
}

export class Login extends React.Component<LoginProps, {}> {

    componentDidMount() {
        document.title = 'Cobe player - Log in'
    }

    render() {
        return (
            <div className='hero'>
                <div id='logo-login-banner'>
                    <img src={images.logoMedium} alt='' />
                </div>
                <div className='hero-item'>
                    <h1>COBE player</h1>
                    <button className='red-button' onClick={this.props.redirectFn}>Log in</button>
                </div>
            </div>
        )
    }
}