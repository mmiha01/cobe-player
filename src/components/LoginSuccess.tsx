import * as React from 'react'
import { AuthService } from '../services/Auth'

export class LoginSuccess extends React.Component<{}> {
    render() {
        console.log(123321)
        AuthService.getTokenFromLocationHash()
        window.location.href = window.location.origin
        return (<></>)
    }
}