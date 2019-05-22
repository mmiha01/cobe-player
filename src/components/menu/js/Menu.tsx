import * as React from 'react'
import images from '../../../images';
import '../css/menu.scss'

export interface MenuInterface {
    menuOpened: boolean,
    toggleMenu: () => void,
}

export class Menu extends React.Component<MenuInterface, {}> {

    getRightPos = () => {
        if (this.props.menuOpened) {
            return {
                right: '0'
            }
        }
        return {
            right: '-100%'
        }
    }

    render() {
        return (
            <div className='hero hero-menu' style={this.getRightPos()}>
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