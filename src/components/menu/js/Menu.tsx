import * as React from 'react'
import images from '../../../images';

export interface MenuInterface {
    menuOpened: boolean,
    toggleMenu: () => void,
    pushRoute: (a: string) => void,
}

/**
 * Ovdje ubaciti state za menu otvaranje
 */

export class Menu extends React.Component<MenuInterface, {}> {

    HTMLElementMenu = React.createRef<HTMLDivElement>()

    setRouteUpdates = (route: string) => {
        this.props.pushRoute(route)
    }

    componentDidUpdate() {
        if (this.props.menuOpened) {
            this.HTMLElementMenu.current.classList.add('opened-menu')
            return
        }
        this.HTMLElementMenu.current.classList.remove('opened-menu')
        return
    }

    render() {
        return (
            <div className='hero hero-menu' ref={this.HTMLElementMenu}>
                <div className='pointer menu-opener' onClick={this.props.toggleMenu} >
                    <img src={images.closeIcon} alt='' />
                </div>
                <div className='hero-item'>
                    <h1 className='pointer no-select' onClick={() => this.setRouteUpdates('player')}>Player</h1>
                    <h1 className='pointer no-select' onClick={() => this.setRouteUpdates('explore')}>Explore</h1>
                    <h1 className='pointer no-select' onClick={() => this.setRouteUpdates('profile')}>Profile</h1>
                </div>
            </div>
        )
    }
}