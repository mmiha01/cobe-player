import * as React from 'react'
import VolumeSliderService from '@/services/VolumeSliderService';

export interface SliderProps {
    volume: number,
    volumeUpdateCallBack: (a: number) => void,
}

export class Slider extends React.Component<SliderProps, {}> {

    sliderService = new VolumeSliderService(this.props.volumeUpdateCallBack)

    componentDidMount() {
        this.sliderService.updateElements()
    }

    render() {
        return (
            <div id='volume-slider-container'
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