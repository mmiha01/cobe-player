import * as React from 'react'
import images from '@/images'

export interface UserInfoProps {
    userName: string,
    imageURL: string,
    productType: string,
}

export class UserInfo extends React.Component<UserInfoProps, {}> {
    render() {
        return (
            <div id='user-info-container'>
                <div id='user-info-image'>
                    <img src={this.props.imageURL} alt='' />
                </div>
                <div id='user-info-text'>
                    <div id='user-info-username'>
                        <p>{this.props.userName}</p>
                        <p><span id='user-info-product-type'>{this.props.productType}</span></p>
                    </div>
                </div>
            </div>
        )
    }
}