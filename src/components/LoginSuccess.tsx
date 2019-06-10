import * as React from 'react'
import { AuthService } from '../services/Auth'

export class LoginSuccess extends React.Component<{}> {
    render() {
        AuthService.getTokenFromLocationHash()
        window.location.href = window.location.origin
        return (<></>)
    }
}