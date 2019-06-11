import * as React from 'react'

export interface WaitModalProps {
    setWaitModalDisplay: (a: boolean) => void,
    showModal: boolean,
}

interface State {
    progress: number,
}

export class WaitModal extends React.Component<WaitModalProps, State> {

    modal = React.createRef<HTMLDivElement>()

    setModalDisplay = () => {
        if (!this.props.showModal) {
            this.modal.current.classList.add('hide-wait-modal')
            return
        }
        this.modal.current.classList.remove('hide-wait-modal')
    }

    componentDidUpdate() {
        this.setModalDisplay()
    }

    componentDidMount() {
        this.setModalDisplay()
    }

    render() {
        return (
            <div className='hero wait-modal hide-wait-modal' ref={this.modal}>
                <div className='hero-item'>
                    <p>You've sent too many requests, please try again later!</p>
                    <button className='red-button smaller-button'
                        onClick={() => this.props.setWaitModalDisplay(false) }>
                            Ok
                    </button>
                </div>
            </div>
        )
    }
}