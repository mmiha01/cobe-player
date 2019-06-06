import * as React from 'react'
import { NetworkService } from '@/services/Network'
import { ErrorInterface } from '@/interfaces/ErrorInterface'
import { CategorySingle } from '../CategorySingle';
import { Interface } from 'readline';
import { string, number } from 'prop-types';

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
}

interface Image {
    url: string,
}

interface StateCategory {
    id: number,
    name: string,
    image: string,
    artists: string
}

interface State {
    items: StateCategory[],
}

export class Category extends React.Component<CategoryInterface, State> {
    state = {
        items: [] as StateCategory[],
    }

    getRecommended = () => {
        NetworkService.makeRequest('/browse/new-releases?limit=50').then((a) => {
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
                image: a.images[1].url,
                artists: artists.slice(0, -2),
            }
            arr.push(item)
            i++
        }
        this.setState({ items: arr })
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