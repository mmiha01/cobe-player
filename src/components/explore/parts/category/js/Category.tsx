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
}

export class Category extends React.Component<CategoryInterface, State> {
    state = {
        items: [] as StateCategory[],
    }

    getRecommended = (offset: number = 0) => {
        NetworkService.makeRequest('/browse/new-releases?limit=50&offset=' + offset, 'GET').then((a) => {
            this.parseRecommendeds(a.albums.items)
        })
    }

    parseRecommendeds = (items: CategoryItemFromResponse[]) => {
        const arr = []
        let i = 0
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
        this.setState({ items: arr })
    }

    foo = () => {
        console.log(123)
    }

    componentWillMount() {
        this.getRecommended()
    }

    render() {
        return (
            <div className='explore-category'>
                <CategorySingle items={this.state.items} />
            </div>
        )
    }
}