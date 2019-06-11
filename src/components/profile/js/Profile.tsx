import * as React from 'react'
import { NetworkService } from '@/services/Network'
import images from '@/images'

interface State {
    country?: string,
    display_name: string,
    email: string,
    images: Images[],
    product: string,
    followers: Followers,
    didMakeSuccessFullRequest: boolean,
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
        },
        didMakeSuccessFullRequest: false,
    }

    parseProfileData = (data: State) => {
        const { display_name, country, email, product, followers } = data
        const imageData = data.images
        this.setState({
            display_name,
            country,
            email,
            images: imageData,
            product,
            followers,
            didMakeSuccessFullRequest: true
        })
    }

    checkImage = () => {
        if (typeof this.state.images !== 'undefined' && this.state.images.length) {
            return this.state.images[0].url
        }
        return images.userIcon
    }

    checkClassName = () => {
        if (typeof this.state.images !== 'undefined' && this.state.images.length) {
            return 'profile-image'
        }
        return 'profile-image no-border'
    }

    componentWillMount() {
        NetworkService.makeRequest('/me').then(this.parseProfileData)
        document.title = 'Cobe player - My profile'
    }

    render() {
        const image = this.checkImage()
        const classToSet = this.checkClassName()
        return (
            <div className='hero'>
                <div className='hero-item'>
                    <div className={classToSet}>
                        <img src={image} />
                    </div>
                    <h1>{this.state.display_name}</h1>
                    <p className='product-type-text'>
                        {this.state.country} | {this.state.product} | {this.state.followers.total || 0}x Followers</p>
                    <p>{this.state.email}</p>
                </div>
            </div>
        )
    }
}