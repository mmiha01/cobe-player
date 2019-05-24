import * as React from 'react'
import { PlayerNetworkService } from '@/services/PlayerNetwork';

export interface ProgressBarProps {
    progress: number,
    duration: number,
}

interface State {
    progress: number,
}

export class ProgressBar extends React.Component<ProgressBarProps, State> {

    state = {
        progress: this.props.progress
    }

    currentX = 0
    allowMoving = false

    mainContainer = React.createRef<HTMLDivElement>()
    progressBar = React.createRef<HTMLDivElement>()

    updatePositions = (currentX: number) => {
        this.currentX = currentX
        const newProgress = Math.floor((this.currentX / window.innerWidth) * this.props.duration)
        this.setState({ progress: newProgress })
    }

    startHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        this.allowMoving = true
        this.updatePositions(e.pageX)
    }

    moveHandler =  (e: React.MouseEvent<HTMLDivElement>) => {
        if (!this.allowMoving) {
            return false
        }
        this.updatePositions(e.pageX)
    }

    endHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        if (this.allowMoving) {
            PlayerNetworkService.changeProgress(this.state.progress)
        }
        console.log(this.state.progress)
        this.allowMoving = false
    }

    render() {
        const progressWidthVal = Math.floor((this.state.progress / this.props.duration) * 100)
        return (
            <div id='progress-bar'
                ref={this.mainContainer}
                onMouseDown={this.startHandler}
                onMouseMove={this.moveHandler}
                onMouseUp={this.endHandler}
                onMouseLeave={this.endHandler}
            >
                <div id='progress-inner' style={{width: progressWidthVal + '%'}} ref={this.progressBar} ></div>
            </div>
        )
    }
}