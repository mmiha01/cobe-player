import * as React from 'react'

export interface WaitModalProps {
    setWaitModalDisplay: (a: boolean) => void,
    showModal: boolean,
}

interface State {
    progress: number,
}

export class WaitModal extends React.Component<WaitModalProps, State> {

    setClassNames = () => {
        const constantClass = 'hero wait-modal'
        return this.props.showModal ? constantClass : constantClass + ' hide-wait-modal'
    }

    hideModal = () => {
        this.props.setWaitModalDisplay(false)
    }

    render() {
        return (
            <div className={this.setClassNames()}>
                <div className='hero-item'>
                    <p>You've sent too many requests, please try again later!</p>
                    <button className='red-button smaller-button'
                        onClick={this.hideModal}>
                            Ok
                    </button>
                </div>
            </div>
        )
    }
}