import * as React from 'react'

export interface SliderProps {
    volume: number,
}

export class Slider extends React.Component<SliderProps, {}> {
    render() {
        return (
            <div id='volume-slider-container'
            className='hero abs-pos-hero right-side-hero pointer'>
            <div id='volume-slider'>
                <div id='volume-slider-handle' style={{top: (100 - this.props.volume) + '%'}}></div>
            </div>
        </div>
        )
    }
}