export class RouteService {

    routeUpdater?: (currentRoute: string) => void
    currentRoute: string
    defaultRoute: string

    constructor(routeUpdater?: (currentRoute: string) => void, defaultRoute: string = '') {
        this.routeUpdater = routeUpdater || null
        this.defaultRoute = defaultRoute
        this.currentRoute = this.getCurrentRoute()

        if (this.routeUpdater) {
            window.onpopstate = () => {
                this.routeUpdater(this.getCurrentRoute())
            }
        }
    }

    pushRoute(route: string) {
        window.history.pushState(null, '', route)
        if (this.routeUpdater) {
            this.routeUpdater(route)
        }
    }

    isRoute = (route: string) => {
        return route === this.getCurrentRoute()
    }

    getCurrentRoute() {
        const cutSlash = window.location.pathname.substring(1)
        return cutSlash.length ? cutSlash : this.defaultRoute
    }
}