import * as React from 'react'
import { Burger } from './burger/js/Burger'
import { Menu } from './menu/js/Menu'
import { Context } from '@/context'
import { Profile } from './profile/js/Profile'

export class ProfileMain extends React.Component<{}> {
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
                        <Profile />
                    </div>
                    )
                }
            </Context.Consumer>
        )
    }
}