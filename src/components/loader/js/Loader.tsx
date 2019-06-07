import * as React from 'react'

export class Loader extends React.Component<{}> {
    render() {
        return (
            <div className='hero'>
                <div className='hero-item'>
                    <p>Application is being loaded...</p>
                    <div className='lds-ellipsis'><div></div><div></div><div></div><div></div></div>
                </div>
        </div>
        )
    }
}