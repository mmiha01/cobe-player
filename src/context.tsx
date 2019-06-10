import * as React from 'react'
import { ErrorInterface } from './interfaces/ErrorInterface';

export interface GlobalState {
    toggleMenu: () => void,
    isAuthorized: boolean,
    menuOpened: boolean,
    userName: string,
    productType: string,
    imageURL: string,
    currentRoute: string,
    pushRoute: (a: string) => void,
    parseResponseError: (err: ErrorInterface, fn: () => void) => void,
    activatePlayer: () => void,
}

export const Context = React.createContext<GlobalState>(undefined)