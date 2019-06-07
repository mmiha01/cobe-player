import * as React from 'react'

interface InitialState {
    isAuthorized: boolean,
    menuOpened: boolean,
    userName: string,
    productType: string,
    imageURL: string,
    currentRoute: string,

}

const initialState = {
    isAuthorized: false,
    menuOpened: false,
    userName: '',
    productType: '',
    imageURL: '',
    currentRoute: ''
}

export const Context = React.createContext(initialState)