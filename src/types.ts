export type User = {
    id: string,
    name: string,
    email: string,
    password: string,
    createdAt: string
}

export type Product = {
    id: string,
    name: string,
    price: number,
    description: string,
    imageUrl: string
}

export type Purchase = {
    id: string,
    buyer: string,
    totalPrice: number,
    createdAt: string
}

export type ProductFromPurchase = {
    id: string,
    quantity: number
}