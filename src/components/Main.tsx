import * as React from 'react'
import { AuthService } from '../services/Auth'
import { Loader } from './loader/js/Loader';
import { Login } from './login/js/Login';
import { RouteService } from '@/services/RouteService'
import { UserInterface } from '@/interfaces/UserInfo'
import { ErrorInterface } from '@/interfaces/ErrorInterface'
import { Context } from '@/context'
import { Route } from './Route/js/Route'
import { PlayerMain } from './PlayerMain'
import { LoginSuccess } from './LoginSuccess'
import { ExploreMain } from './ExploreMain'
import { ProfileMain } from './ProfileMain'
import { Burger } from './burger/js/Burger';
import { Menu } from './menu/js/Menu';

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

    parseResponseError = (err: ErrorInterface, fn?: () => void) => {
        if (err.status === 401) {
            this.setState({ isAuthorized: false })
        } else if (err.status === 429) {
            console.log(429)
        }
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

    activatePlayer = () => {
        this.setState({  currentRoute: 'player' })
    }

    componentWillMount() {
        this.checkAuth()
    }

    shouldComponentUpdate(a: {}, b: { didCheckAuthState: boolean, }) {
        return b.didCheckAuthState === true;
    }

    render() {
        if (!this.state.didCheckAuthState) {
            return (
                <Loader />
            )
        } else if (!this.state.isAuthorized && !this.routeUpdater.isRoute('auth')) {
            return (
                <Login redirectFn={AuthService.redirectToLogin} />
            )
        }

        const contextValue = {
            toggleMenu: this.toggleMenu,
            pushRoute: this.pushRoute,
            parseResponseError: this.parseResponseError,
            activatePlayer: this.activatePlayer,
            ...this.state,
        }

        return (
            <Context.Provider value={contextValue}>
                <div id='main-inner'>
                    <Burger toggleMenu={this.toggleMenu} />
                    <Menu
                        menuOpened={this.state.menuOpened}
                        toggleMenu={this.toggleMenu}
                        pushRoute={this.pushRoute}
                    />
                    <Route route={'auth'}
                        component={<LoginSuccess />}
                        isRoute={this.routeUpdater.isRoute}
                    />
                    <Route route={'player'}
                        component={<PlayerMain />}
                        isRoute={this.routeUpdater.isRoute}
                    />
                    <Route route={'explore'}
                        component={<ExploreMain />}
                        isRoute={this.routeUpdater.isRoute}
                    />
                    <Route route={'profile'}
                        component={<ProfileMain />}
                        isRoute={this.routeUpdater.isRoute}
                    />
                </div>
            </Context.Provider>
        )
    }
}