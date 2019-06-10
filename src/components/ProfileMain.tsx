import * as React from 'react'
import { Context } from '@/context'
import { Profile } from './profile/js/Profile'

export class ProfileMain extends React.Component<{}> {
    render() {
        return (
            <Context.Consumer>
                { (value) => (
                        <Profile />
                    )
                }
            </Context.Consumer>
        )
    }
}