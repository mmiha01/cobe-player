import * as React from 'react'
import { CookieService } from '../services/Cookie'
import { AuthService } from '../services/Auth'
import { Player } from './player/js/Player'
import { NetworkService } from '../services/Network'
import { PlayerNetworkService } from '../services/PlayerNetwork'
import images from '../images'
import { Loader } from './loader/js/Loader';
import { Login } from './login/js/Login';
import { Menu } from './menu/js/Menu';

export interface MainProps { compiler: string; framework: string; }

interface State {
    isAuthorized: boolean,
    didCheckAuthState: boolean,
    menuOpened: boolean,
    userName: string,
    productType: string,
    imageURL: string,
}

interface ErrorInterface {
    status: number,
    message: string,
 }

interface UserInterface {
    display_name: string,
    product: string,
    images: UserImages[],
}

interface UserImages {
    url: string,
}

export class Main extends React.Component<MainProps, State> {

    state = {
        didCheckAuthState: false,
        isAuthorized: false,
        menuOpened: false,
        userName: '',
        productType: '',
        imageURL: '',
    }

    toggleMenu = () => {
        if (this.state.menuOpened) {
            this.setState({ menuOpened: false })
            return
        }
        this.setState({ menuOpened: true })
    }

    parseResponseError = (err: ErrorInterface, fn: () => void) => {
        if (err.status === 401) {
            this.setState({isAuthorized: false})
        } else if (err.status === 429) {
            console.log(429)
        }
        console.log(err)
    }

    parseUserInfo = (user: UserInterface) => {
        const image = (user.images[0] && user.images[0].url) || null
        if (image) {
            this.setState({ imageURL: image })
        }
        this.setState({
            userName: user.display_name,
            productType: user.product,
        })
    }

    checkAuth = () => {
        AuthService.isUserLoggedIn().then((response: UserInterface) => {
            if (!response) {
                this.setState({
                    isAuthorized: false,
                    didCheckAuthState: true,
                })
                return false
            }
            this.setState({
                isAuthorized: true,
                didCheckAuthState: true,
            })
            this.parseUserInfo(response)
            return true
        })
    }

    componentWillMount() {
        this.checkAuth()
    }

    shouldComponentUpdate(a: {}, b: {
        didCheckAuthState: boolean, }) {
        return b.didCheckAuthState === true;
    }

    render() {
        if (window.location.pathname === '/auth') {
            AuthService.getTokenFromLocationHash()
            window.location.href = window.location.origin
            return (<div>Pričekajte trenutak...</div>)
        }
        if (!this.state.didCheckAuthState) {
            return (
                <Loader />
            )
        } else if (!this.state.isAuthorized) {
            return (
                <Login redirectFn={AuthService.redirectToLogin} />
            )
        } else {
            return (
                <div id='main-inner'>
                    <div className='pointer menu-opener' onClick={this.toggleMenu} >
                        <img src={images.menuIcon} alt='' />
                    </div>
                    <Menu menuOpened={this.state.menuOpened} toggleMenu={this.toggleMenu} />
                    <Player
                    userName={this.state.userName}
                    productType={this.state.productType}
                    imageURL={this.state.imageURL}
                    parseResponseError={this.parseResponseError}
                    isAuthorized={this.state.isAuthorized}
                    />
                </div>
            )
        }
    }
}