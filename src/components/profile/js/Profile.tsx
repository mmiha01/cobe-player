import * as React from 'react'
import { NetworkService } from '@/services/Network'
import images from '@/images'

interface State {
    country: string,
    display_name: string,
    email: string,
    images: Images[],
    product: string,
    followers: Followers
}

interface Followers {
    href?: string,
    total?: number,
}

interface Images {
    url: string,
}

export class Profile extends React.Component<{}, State> {

    state = {
        country: '',
        display_name: '',
        email: '',
        images: [] as Images[],
        product: '',
        followers: {
            href: '',
            total: 0,
        }
    }

    parseProfileData = (data: State) => {
        const { display_name, country, email, images, product, followers } = data
        this.setState({
            display_name,
            country,
            email,
            images,
            product,
            followers
        })
    }

    componentWillMount() {
        NetworkService.makeRequest('/me').then(this.parseProfileData)
    }

    render() {
        const image = this.state.images[0] ? this.state.images[0].url : images.userIcon
        const classToSet = this.state.images[0] ? 'profile-image' : 'profile-image no-border'
        return (
            <div className='hero'>
                <div className='hero-item'>
                    <div className={classToSet}>
                        <img src={image} />
                    </div>
                    <h1>{this.state.display_name}</h1>
                    <p className='product-type-text'>
                        {this.state.country} | {this.state.product} | {this.state.followers.total || 0}x Followers</p>
                    <h3>{this.state.email}</h3>
                </div>
            </div>
        )
    }
}