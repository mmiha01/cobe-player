import * as React from 'react'

interface CategoryItem {
    id: number,
    name: string,
    image: string,
    artists: string,
    trackURI: string,
}

export interface CategorySingleInterface {
    items: CategoryItem[],
    getSpotifyTrackURI: (x: number) => void,
}

export class CategorySingle extends React.Component<CategorySingleInterface, {}> {
    render() {
        if (!this.props.items[0]) {
            return (
                <div></div>
            )
        }
        return this.props.items.map((item: CategoryItem) => (
            // tslint:disable-next-line: max-line-length
            <div key={item.id} className='explore-child pointer' onClick={ () => this.props.getSpotifyTrackURI(item.id) }>
                <img src={item.image} alt='' />
                <div className='black-overlay hero'>
                    <div className='hero-item'>
                        <h3>{item.name}</h3>
                        <p>{item.artists}</p>
                    </div>
                </div>
            </div>
        ));
    }
}