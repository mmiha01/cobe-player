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
import { WaitModal } from './waitModal/js/WaitModal'

export interface MainProps { compiler: string; framework: string; }

interface State {
    isAuthorized: boolean,
    didCheckAuthState: boolean,
    menuOpened: boolean,
    userName: string,
    productType: string,
    imageURL: string,
    currentRoute: string,
    showModal: boolean,
}

export class Main extends React.Component<MainProps, State> {

    state = {
        didCheckAuthState: false,
        isAuthorized: false,
        menuOpened: false,
        userName: '',
        productType: '',
        imageURL: '',
        currentRoute: '',
        showModal: false,
    }

    routeUpdaterCallback = (currentRoute: string) => {
        this.setState({ currentRoute, menuOpened: false })
    }

    routeUpdater: RouteService = new RouteService(this.routeUpdaterCallback, 'player')

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
            this.setState({
                isAuthorized: true,
                didCheckAuthState: true,
            })
            this.parseUserInfo(response)
            return true
        }).catch(console.log)
    }

    activatePlayer = () => {
        this.setState({  currentRoute: 'player' })
    }

    setWaitModalDisplay = (showModal: boolean) => {
        this.setState({ showModal })
    }

    shouldComponentUpdate(a: {}, b: { didCheckAuthState: boolean, }) {
        return b.didCheckAuthState === true
    }

    componentDidMount() {
        this.checkAuth()
        window.addEventListener('networkerror', (e: CustomEvent) => {
            if (e.detail.status === 401 || e.detail.status === 400) {
                this.setState({
                    isAuthorized: false,
                    didCheckAuthState: true,
                })
                return
            }
            if (e.detail.status === 429) {
                this.setState({ showModal: true })
            }
        })
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
            activatePlayer: this.activatePlayer,
            setWaitModalDisplay: this.setWaitModalDisplay,
            ...this.state,
        }

        return (
            <Context.Provider value={contextValue}>
                <div id='main-inner'>
                    <WaitModal setWaitModalDisplay={this.setWaitModalDisplay} showModal={this.state.showModal} />
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