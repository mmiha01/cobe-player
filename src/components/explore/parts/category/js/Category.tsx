import * as React from 'react'
import { NetworkService } from '@/services/Network'
import { ErrorInterface } from '@/interfaces/ErrorInterface'
import { CategorySingle } from '../CategorySingle';

export interface CategoryInterface {
    isAuthorized: boolean,
    parseResponseError: (err: ErrorInterface, fn: () => void) => void,
}

interface Artist {
    name: string,
}

interface CategoryItemFromResponse {
    id: number,
    name: string,
    images?: Image[]
    artists: Artist[]
    uri: string,
}

interface Image {
    url: string,
}

interface StateCategory {
    id: number,
    name: string,
    image: string,
    artists: string,
    trackURI: string,
}

interface State {
    items: StateCategory[],
    offset: number,
    trackID: number,
}

export class Category extends React.Component<CategoryInterface, State> {
    state = {
        items: [] as StateCategory[],
        offset: 0,
        trackID: 0,
    }

    categoryContainer = React.createRef<HTMLDivElement>()

    getRecommended = (offset: number = 0) => {
        NetworkService.makeRequest('/browse/new-releases?limit=50&offset=' + offset, 'GET').then((a) => {
            this.parseRecommendeds(a.albums.items)
        })
    }

    parseRecommendeds = (items: CategoryItemFromResponse[]) => {
        const arr = []
        let i = this.state.trackID
        for (const a of items) {
            let artists = ''
            for (const artist of a.artists) {
                artists += `${artist.name} & `
            }
            const item = {
                id: i,
                name: a.name,
                image: a.images[0].url,
                artists: artists.slice(0, -2),
                trackURI: a.uri,
            }
            arr.push(item)
            i++
        }
        const mergedArray = this.state.items.concat(arr)
        this.setState({
            items: mergedArray,
            offset: this.state.offset + 50,
            trackID: i,
        })
        console.log(this.state)
    }

    scrollHandler = () => {


        /**
         * Ne radi kako treba uvijek, provjeriti dodatno!
         */
        const currentScroll = window.scrollY
        const documentHeight = Number(window.getComputedStyle(document.body).height.replace('px', ''))
        if ((currentScroll + window.innerHeight) === Math.round(documentHeight)) {
            this.getRecommended(this.state.offset)
            console.log(123)
        }

    }

    getCategoryContainerOffset = () => {
        return this.categoryContainer.current.offsetTop + this.categoryContainer.current.parentElement.offsetTop
    }

    componentWillMount() {
        this.getRecommended()
    }

    componentDidMount() {
        document.addEventListener('scroll', this.scrollHandler)
    }

    render() {
        return (
            <div className='explore-category' ref={this.categoryContainer}>
                <CategorySingle items={this.state.items} />
            </div>
        )
    }
}