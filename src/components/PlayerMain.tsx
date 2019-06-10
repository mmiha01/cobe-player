import * as React from 'react'
import { Context } from '@/context'
import { Player } from './player/js/Player'

export class PlayerMain extends React.Component<{}> {
    render() {
        return (
            <Context.Consumer>
                { (value) => (
                    <Player
                        userName={value.userName}
                        productType={value.productType}
                        imageURL={value.imageURL}
                        parseResponseError={value.parseResponseError}
                        isAuthorized={value.isAuthorized}
                    />
                    )
                }
            </Context.Consumer>
        )
    }
}