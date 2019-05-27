export class RouteService {

    routeUpdater: (currentRoute: string) => void
    currentRoute: string

    constructor(routeUpdater: (currentRoute: string) => void) {
        this.routeUpdater = routeUpdater
        this.currentRoute = this.getCurrentRoute()

        window.onpopstate = () => {
            this.routeUpdater(this.getCurrentRoute())
        }
    }

    pushRoute(route: string) {
        window.history.pushState(null, '', route)
        this.routeUpdater(route)
    }

    isRoute = (route: string) => {
        return route === this.getCurrentRoute()
    }

    getCurrentRoute() {
        return window.location.pathname.substring(1)
    }
}