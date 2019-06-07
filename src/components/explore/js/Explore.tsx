import * as React from 'react'
import { ErrorInterface } from '@/interfaces/ErrorInterface'
import { UserInfo } from '@/components/userInfo/js/UserInfo'
import { Category } from '../parts/category/js/Category'

export interface ExploreInterface {
    userName: string,
    productType: string,
    imageURL: string,
    isAuthorized: boolean,
    parseResponseError: (err: ErrorInterface, fn: () => void) => void,
    activatePlayer: () => void,
}

export class Explore extends React.Component<ExploreInterface, {}> {

    componentWillMount() {
        document.title = 'Cobe player - Explore'
    }

    render() {
        return (
            <div className='hero'>
                <UserInfo
                    userName={this.props.userName}
                    imageURL={this.props.imageURL}
                    productType={this.props.productType}
                />
                <div className='hero-item large-hero'>
                    <h1>Explore</h1>
                    <Category
                        isAuthorized={this.props.isAuthorized}
                        parseResponseError={this.props.parseResponseError}
                        activatePlayer={this.props.activatePlayer}
                    />
                </div>
            </div>
        )
    }
}