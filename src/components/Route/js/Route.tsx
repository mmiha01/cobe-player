import * as React from 'react'

export interface RouteProps {
    route: string,
    component: React.ReactNode,
    isRoute: (a: string) => boolean,
}
export class Route extends React.Component<RouteProps, {}> {

    render() {
        if (!this.props.isRoute(this.props.route)) {
            return null
        } else {
            return this.props.component
        }
    }
}