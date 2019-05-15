import * as React from 'react'
// import logo from './logo-black.png'
const logo = require('./logo-black.png')
// import logo from './images'

// import React from 'react'
// import ReactDOM from 'react-dom'

export interface HelloProps { compiler: string; framework: string; }

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export class Hello extends React.Component<HelloProps, {}> {
    render() {
        return (
            <div>
                <h1>Cobe player setting up</h1>
                <p>Setting up</p>
                <img src={logo} alt='Logo image' />
            </div>
        )
    }
}