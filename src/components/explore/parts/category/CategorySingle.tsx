import * as React from 'react'

export interface CategorySingleInterface {
    // tslint:disable-next-line: no-any
    items: any
}

interface CategoryItem {
    id: number,
    name: string,
    image: string,
    artists: string,
}

export class CategorySingle extends React.Component<CategorySingleInterface, {}> {

    render() {
        if (!this.props.items[0]) {
            return (
                <div></div>
            )
        }
        return this.props.items.map((item: CategoryItem) => (
            <div key={item.id} className='explore-child pointer'>
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