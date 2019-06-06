import * as React from 'react'
import { Player } from '@/components/player/js/player'

export interface RouteProps {
    route: string,
    component: string,
    isRoute: (a: string) => boolean,
}

interface State {
    Player: React.Component
}

export class Route extends React.Component<RouteProps, State> {

    /**
     * string based rendering ?
     */
    // state = {
    //     Player,
    // }

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