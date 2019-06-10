import * as React from 'react'
import { Burger } from './burger/js/Burger'
import { Menu } from './menu/js/Menu'
import { Context } from '@/context'
import { Explore } from './explore/js/Explore'

export class ExploreMain extends React.Component<{}> {
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
                        <Explore
                            userName={value.userName}
                            productType={value.productType}
                            imageURL={value.imageURL}
                            parseResponseError={value.parseResponseError}
                            isAuthorized={value.isAuthorized}
                            activatePlayer={value.activatePlayer}
                        />
                    </div>
                    )
                }
            </Context.Consumer>
        )
    }
}