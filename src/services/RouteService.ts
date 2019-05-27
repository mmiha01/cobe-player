export class RouteService {

    currentRoute: string

    constructor() {
        this.currentRoute = window.location.pathname
    }

    pushRoute(route: string) {
        window.history.pushState(null, route)
    }
}