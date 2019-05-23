import * as React from 'react'

export interface ProgressBarProps {
    progress: number,
    duration: number,
}

export class ProgressBar extends React.Component<ProgressBarProps, {}> {
    render() {
        return (
            <div id='progress-bar'>
                <div id='progress-inner' style={{width: (this.props.progress / this.props.duration) * 100 + '%'}}></div>
            </div>
        )
    }
}