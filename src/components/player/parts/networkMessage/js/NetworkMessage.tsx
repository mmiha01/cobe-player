import * as React from 'react'

export interface NetworkMessageProps {
    show: boolean
}

export class NetworkMessage extends React.Component<NetworkMessageProps, {}> {
    getClassName = () => {
        const constantClassNames = 'network-message'
        return this.props.show ? constantClassNames + ' network-message-visible' : constantClassNames
    }

    render() {
        return (
            <div className={this.getClassName()}>
                <p>Getting new data...</p>
            </div>
        )
    }
}