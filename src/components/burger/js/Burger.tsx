import * as React from 'react'
import images from '@/images'

export interface BurgerProps {
    toggleMenu: () => void,
}

export class Burger extends React.Component<BurgerProps> {
    render() {
        return (
            <div className='pointer menu-opener' onClick={this.props.toggleMenu} >
                <img src={images.menuIcon} alt='' />
             </div>
        )
    }
}