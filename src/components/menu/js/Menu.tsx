import * as React from 'react'
import images from '../../../images';

export interface MenuInterface {
    menuOpened: boolean,
    toggleMenu: () => void,
}

/**
 * Ovdje ubaciti state za menu otvaranje
 */

export class Menu extends React.Component<MenuInterface, {}> {

    HTMLElementMenu = React.createRef<HTMLDivElement>()

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
                    <h1 className='pointer'>Player</h1>
                    <h1 className='pointer'>Explore</h1>
                    <h1 className='pointer'>Profile</h1>
                </div>
            </div>
        )
    }
}