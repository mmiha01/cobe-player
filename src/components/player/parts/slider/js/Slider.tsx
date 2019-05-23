import * as React from 'react'
import VolumeSliderService from '@/services/VolumeSliderService';

export interface SliderProps {
    volume: number,
    volumeUpdateCallBack: (a: number) => void,
}

export class Slider extends React.Component<SliderProps, {}> {
    sliderService = new VolumeSliderService(this.props.volumeUpdateCallBack)
    container = React.createRef<HTMLDivElement>()

    componentDidMount() {
        this.sliderService.updateElements()
    }


    // startHandler = (e: React.MouseEvent<HTMLDivElement>) => {
    //     this.allowMoving = true
    //     this.currentY =  e.pageY - this.getAbsPos()
    //     const valToSet = Math.max(0, ((this.currentY / this.container.current.offsetHeight) * 100))
    //     this.volumeHandle.style.top = valToSet.toString() + '%'

    //     document.getElementById('volume-text-display').textContent = Math.floor((100 - valToSet)).toString() + '%'
    // }

    render() {
        return (
            <div
                ref={this.container}
                id='volume-slider-container'
                className='hero abs-pos-hero right-side-hero pointer'
                onMouseMove={this.sliderService.moveHandler}
                onMouseUp={this.sliderService.endHandler}
                onMouseDown={this.sliderService.startHandler}
            >
            <div id='volume-slider'>
                <div id='volume-slider-handle'
                    style={{top: (100 - this.props.volume) + '%'}}
                >
                    <div id='volume-text-display'><p>{this.props.volume + '%'}</p></div>
                </div>
            </div>
        </div>
        )
    }
}