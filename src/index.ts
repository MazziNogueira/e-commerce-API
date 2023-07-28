import { products, users } from "./db"
import { Product, User } from "./types"

const usersList: User[] = users

const productsList: Product[] = products

console.log('usersList', usersList)
console.log('productsList', productsList)