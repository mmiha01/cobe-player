import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './index.scss'

import { Main } from './Hello'

ReactDOM.render(
    <Main compiler='TypeScript' framework='React' />,
    document.getElementById('main')
)