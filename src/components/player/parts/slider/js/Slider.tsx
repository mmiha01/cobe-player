import * as React from 'react'
import { PlayerNetworkService } from '@/services/PlayerNetwork'

export interface SliderProps {
    volume: number,
}

interface State {
    volume: number,
}

export class Slider extends React.Component<SliderProps, State> {

    state = {
        volume: this.props.volume,
    }

    mainContainer = React.createRef<HTMLDivElement>()
    container = React.createRef<HTMLDivElement>()
    sliderHandle = React.createRef<HTMLDivElement>()
    allowMoving = false
    currentY = 0
    currentPercentage = this.props.volume

    updatePositions = (currentY: number) => {
        this.currentY = currentY - this.getAbsPos()
        const percentageToSet = Math.floor(((this.currentY / this.container.current.offsetHeight) * 100))
        const forceBellowHundred = 100 - Math.max(percentageToSet, 0)
        this.setState({  volume: Math.max(0, forceBellowHundred) })
    }

    getAbsPos = () => {
        return this.mainContainer.current.parentElement.offsetTop + this.mainContainer.current.offsetTop
    }

    startHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        this.allowMoving = true
        this.updatePositions(e.pageY)
    }

    moveHandler = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!this.allowMoving) {
            return false
        }
        this.updatePositions(e.pageY)
    }

    endHandler = () => {
        if (this.allowMoving) {
            PlayerNetworkService.setVolume(this.state.volume)
        }
        this.allowMoving = false
    }

    render() {
        return (
            <div
                ref={this.mainContainer}
                id='volume-slider-container'
                className='hero abs-pos-hero right-side-hero pointer'
                onMouseDown={this.startHandler}
                onMouseMove={this.moveHandler}
                onMouseUp={this.endHandler}
                onMouseLeave={this.endHandler}
            >
            <div id='volume-slider' ref={this.container}>
                <div id='volume-slider-handle'
                    style={{top: (100 - this.state.volume) + '%'}}
                    ref={this.sliderHandle}
                >
                    <div id='volume-text-display'><p>{this.state.volume + '%'}</p></div>
                </div>
            </div>
        </div>
        )
    }
}