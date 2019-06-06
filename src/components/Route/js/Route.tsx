import * as React from 'react'
import { Burger } from '@/components/burger/js/Burger'

export interface RouteProps {
    route: string,
    component: string,
    isRoute: (a: string) => boolean,
}

export class Route extends React.Component<RouteProps, {}> {
    render() {
        if (!this.props.isRoute(this.props.route)) {
            return (
                <>
                </>
            )
        } else {
            const Comp = this.props.component
            return (
                <Comp />
            )
        }
    }
}