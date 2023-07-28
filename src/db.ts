import { Product, User } from './types'

export const users: User[] = [
    {
        id: 'u001',
        name: 'mack',
        email: 'mack@email.com',
        password: '123abc',
        createdAt: new Date().toISOString()
    },
    {
        id: 'u002',
        name: 'laura',
        email: 'laura@email.com',
        password: 'laura_123abc',
        createdAt: new Date().toISOString()
    },
    {
        id: 'u003',
        name: 'leia',
        email: 'leia@email.com',
        password: 'leia_123abc',
        createdAt: new Date().toISOString()
    },
    {
        id: 'u004',
        name: 'luke',
        email: 'luke@email.com',
        password: 'luke_123abc',
        createdAt: new Date().toISOString()
    },
    {
        id: 'u005',
        name: 'baleia',
        email: 'baleia@email.com',
        password: 'baleia_123abc',
        createdAt: new Date().toISOString()
    },
    {
        id: 'u006',
        name: 'buda',
        email: 'buda@email.com',
        password: 'buda_123abc',
        createdAt: new Date().toISOString()
    }
]

export const products: Product[] = [
    {
        id: 'p001',
        name: 'isqueiro verde',
        price: 5,
        description: 'isqueiro verde bic - usado',
        imageUrl: 'https://picsum.photos/300'
    },
    {
        id: 'p002',
        name: 'lápis laranja',
        price: 1.5,
        description: 'lápis de cor faber castell na cor laranja - ponta chata',
        imageUrl: 'https://picsum.photos/300'
    },
    {
        id: 'p003',
        name: 'régua de acrílico transparente - 30cm',
        price: 3,
        description: 'o terror do mbl',
        imageUrl: 'https://picsum.photos/300'
    },
    {
        id: 'p004',
        name: 'caixinha de som exbom',
        price: 80,
        description: 'caixinha de som bluetooth vermelha',
        imageUrl: 'https://picsum.photos/300'
    }
]