import * as React from 'react'
import '../css/progressBar.scss'

export interface ProgressBarProps {
    progress: number,
    duration: number,
}

export class ProgressBar extends React.Component<ProgressBarProps, {}> {
    render() {
        return (
            <div id='progress-bar' style={{width: (this.props.progress / this.props.duration) * 100 + '%'}}></div>
        )
    }
}