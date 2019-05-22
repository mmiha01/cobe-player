import * as React from 'react'
import '../css/spiner.scss'

export class Loader extends React.Component<{}> {
    render() {
        return (
            <div className='hero'>
                <div className='hero-item'>
                    <p>Aplikacija se učitava...</p>
                    <div className='lds-ellipsis'><div></div><div></div><div></div><div></div></div>
                </div>
        </div>
        )
    }
}