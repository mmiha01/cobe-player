import * as React from 'react'
import { Burger } from './burger/js/Burger'
import { Menu } from './menu/js/Menu'
import { Context } from '@/context'
import { Player } from './player/js/Player'

export class PlayerMain extends React.Component<{}> {
    render() {
        return (
            <Context.Consumer>
                { (value) => (
                    <div id='main-inner'>
                        <Burger toggleMenu={value.toggleMenu} />
                        <Menu
                            menuOpened={value.menuOpened}
                            toggleMenu={value.toggleMenu}
                            pushRoute={value.pushRoute}
                        />
                        <Player
                        userName={value.userName}
                        productType={value.productType}
                        imageURL={value.imageURL}
                        parseResponseError={value.parseResponseError}
                        isAuthorized={value.isAuthorized}
                        />
                    </div>
                    )
                }
            </Context.Consumer>
        )
    }
}