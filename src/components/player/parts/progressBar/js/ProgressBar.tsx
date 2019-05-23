import * as React from 'react'

export interface ProgressBarProps {
    progress: number,
    duration: number,
    changeFn: (e: React.MouseEvent<HTMLInputElement>) => void,
    updateFn: () => void,
}

export class ProgressBar extends React.Component<ProgressBarProps, {}> {

    componentDidMount() {
        this.props.updateFn()
    }

    render() {
        return (
            <div id='progress-bar' onMouseDown={this.props.changeFn}>
                <div id='progress-inner' style={{width: (this.props.progress / this.props.duration) * 100 + '%'}}></div>
            </div>
        )
    }
}