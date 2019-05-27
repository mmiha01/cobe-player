interface UserInterface {
    display_name: string,
    product: string,
    images: UserImages[],
}

interface UserImages {
    url: string,
}

export { UserInterface }