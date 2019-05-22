import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './css/index.scss'

import { Main } from './components/Main'

ReactDOM.render(
    <Main compiler='TypeScript' framework='React' />,
    document.getElementById('main')
)