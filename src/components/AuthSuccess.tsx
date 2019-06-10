import * as React from 'react'
import { AuthService } from '@/services/Auth'

export class AuthSuccess extends React.Component<{}> {
    render() {
        AuthService.getTokenFromLocationHash()
        window.location.href = window.location.origin
        return (<div>Pričekajte trenutak...</div>)
    }
}