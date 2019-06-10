import * as React from 'react'
import { PlayerNetworkService } from '@/services/PlayerNetwork'

export interface ProgressBarProps {
    progress: number,
    duration: number,
    stateProgressUpdater: (a: number) => void,
}

interface State {
    progress: number,
}

export class ProgressBar extends React.Component<ProgressBarProps, {}> {

    currentX = 0
    allowMoving = false

    mainContainer = React.createRef<HTMLDivElement>()
    progressBar = React.createRef<HTMLDivElement>()

    updatePositions = (currentX: number) => {
        this.currentX = currentX
        const newProgress = Math.floor((this.currentX / window.innerWidth) * this.props.duration)
        this.props.stateProgressUpdater(newProgress)
    }

    startHandler = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        this.allowMoving = true
        this.updatePositions(this.getPageX(e))
    }

    moveHandler =  (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        if (!this.allowMoving) {
            return false
        }
        this.updatePositions(this.getPageX(e))
    }

    endHandler = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        if (this.allowMoving) {
            PlayerNetworkService.changeProgress(this.props.progress)
        }
        this.allowMoving = false
    }

    getPageX(e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) {
        if (e.nativeEvent instanceof TouchEvent) {
            return e.nativeEvent.touches[0].pageX
        }
        return e.nativeEvent.pageX
    }

    render() {
        const progressWidthVal = (this.props.progress / this.props.duration) * 100
        return (
            <div id='progress-bar'
                ref={this.mainContainer}
                onMouseDown={this.startHandler}
                onMouseMove={this.moveHandler}
                onMouseUp={this.endHandler}
                onMouseLeave={this.endHandler}
                onTouchStart={this.startHandler}
                onTouchMove={this.moveHandler}
                onTouchEnd={this.endHandler}
            >
                <div id='progress-inner' style={{width: progressWidthVal + '%'}} ref={this.progressBar} ></div>
            </div>
        )
    }
}