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
import { RouteService } from '@/services/RouteService';
import { Explore } from './explore/js/Explore';
import { UserInterface } from '@/interfaces/UserInfo'
import { ErrorInterface } from '@/interfaces/ErrorInterface'
import { Burger } from './burger/js/Burger';
import { Route } from './Route/js/Route';
import { Profile } from './profile/js/Profile';

export interface MainProps { compiler: string; framework: string; }

interface State {
    isAuthorized: boolean,
    didCheckAuthState: boolean,
    menuOpened: boolean,
    userName: string,
    productType: string,
    imageURL: string,
    currentRoute: string,
}

export class Main extends React.Component<MainProps, State> {

    state = {
        didCheckAuthState: false,
        isAuthorized: false,
        menuOpened: false,
        userName: '',
        productType: '',
        imageURL: '',
        currentRoute: ''
    }

    routeUpdaterCallback = (currentRoute: string) => {
        this.setState({ currentRoute, menuOpened: false })
    }

    // tslint:disable-next-line: member-ordering
    routeUpdater: RouteService = new RouteService(this.routeUpdaterCallback)

    pushRoute = (route: string) => {
        this.routeUpdater.pushRoute(route)
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
            this.setState({ isAuthorized: false })
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

        // return (
        //     <Route route={'player'} component={'Burger'} isRoute={this.routeUpdater.isRoute} />
        // )

        if (this.routeUpdater.isRoute('auth')) {
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
        } else if (this.routeUpdater.isRoute('player') || this.routeUpdater.isRoute('') ) {
            return (
                <div id='main-inner'>
                    <Burger toggleMenu={this.toggleMenu} />
                    <Menu
                        menuOpened={this.state.menuOpened}
                        toggleMenu={this.toggleMenu}
                        pushRoute={this.pushRoute}
                    />
                    <Player
                    userName={this.state.userName}
                    productType={this.state.productType}
                    imageURL={this.state.imageURL}
                    parseResponseError={this.parseResponseError}
                    isAuthorized={this.state.isAuthorized}
                    />
                </div>
            )
        } else if (this.routeUpdater.isRoute('explore')) {
            return (
                <div id='main-inner'>
                    <Burger toggleMenu={this.toggleMenu} />
                    <Menu
                        menuOpened={this.state.menuOpened}
                        toggleMenu={this.toggleMenu}
                        pushRoute={this.pushRoute}
                    />
                    <Explore
                        userName={this.state.userName}
                        productType={this.state.productType}
                        imageURL={this.state.imageURL}
                        parseResponseError={this.parseResponseError}
                        isAuthorized={this.state.isAuthorized}
                    />
                </div>
            )
        } else if (this.routeUpdater.isRoute('profile')) {
            return (
                <div id='main-inner'>
                    <Burger toggleMenu={this.toggleMenu} />
                    <Menu
                        menuOpened={this.state.menuOpened}
                        toggleMenu={this.toggleMenu}
                        pushRoute={this.pushRoute}
                    />
                    <Profile />
                </div>
            )
        }
    }
}