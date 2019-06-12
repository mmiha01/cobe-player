import * as React from 'react'
import { ErrorInterface } from './interfaces/ErrorInterface'

export interface GlobalState {
    toggleMenu: () => void,
    isAuthorized: boolean,
    menuOpened: boolean,
    userName: string,
    productType: string,
    imageURL: string,
    currentRoute: string,
    pushRoute: (a: string) => void,
    activatePlayer: () => void,
    setWaitModalDisplay: (a: boolean) => void,
    showModal: boolean,
}

export const Context = React.createContext<GlobalState>(undefined)