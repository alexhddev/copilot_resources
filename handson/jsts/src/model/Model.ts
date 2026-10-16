export type menu_entry = {
    name: string,
    description: string,
    imageUrl: string
}

export type order = {
    id: string,
    sender: string,
    status: 'RECEIVED' | 'DELIVERING' | 'DELIVERED' | 'CANCELED'
    contents: {
        name: string,
        quantity: number
    }[]
}