export class RouteService {

    routeUpdater?: (currentRoute: string) => void
    currentRoute: string

    constructor(routeUpdater?: (currentRoute: string) => void) {
        this.routeUpdater = routeUpdater || null
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
        return cutSlash.length ? cutSlash : 'player'
    }
}