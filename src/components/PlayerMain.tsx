import * as React from 'react'
import { AuthService } from '@/services/Auth';
import { Burger } from './burger/js/Burger';
import { Menu } from './menu/js/Menu';
import { Player } from './player/js/Player';

export class AuthSuccess extends React.Component<{}> {
    render() {
        return (
            <div id='main-inner'>
                <Burger toggleMenu={this.toggleMenu} />
                <Menu
                    menuOpened={this.state.menuOpened}
                    toggleMenu={this.toggleMenu}
                    pushRoute={this.pushRoute}
                />
                <Player
                userName={this.state.userName}
                productType={this.state.productType}
                imageURL={this.state.imageURL}
                parseResponseError={this.parseResponseError}
                isAuthorized={this.state.isAuthorized}
                />
            </div>
        )
    }
}