import * as React from 'react'
import images from '../../../images'

export interface MenuInterface {
    menuOpened: boolean,
    toggleMenu: () => void,
    pushRoute: (a: string) => void,
}

export class Menu extends React.Component<MenuInterface, {}> {

    setRouteUpdates = (route: string) => {
        this.props.pushRoute(route)
    }

    getClassNames = () => {
        const constantClasses = 'hero hero-menu'
        return this.props.menuOpened ? constantClasses + ' opened-menu' : constantClasses
    }

    render() {
        return (
            <div className={this.getClassNames()}>
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