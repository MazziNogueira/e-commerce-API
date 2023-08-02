import express, { Request, Response } from 'express'
import cors from 'cors'

import { db } from './database/knex'

import { Product, Purchase, User } from "./types"

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log('Server running on port 3003')
})

// FIRST ENDPOINT
app.get('/ping', (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: 'Pong, human (:' })
    } catch (error) {
        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send('Erro inesperado!')
        }
    }

})

// GET All Users
app.get('/users', async (req: Request, res: Response) => {
    try {
        const result = await db.raw(`
            SELECT * FROM users;
        `)
        res.status(200).send(result)
    } catch (error) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }

        res.status(400).send('Erro inesperado')
    }

})

// GET All Products
// app.get('/products', (req: Request, res: Response) => {
//     res.status(200).send(productsList)
// })

// GET All Products By Name
app.get('/products', async (req: Request, res: Response) => {
    const productsFromDb: Product[] = await db.raw(`
    SELECT * FROM products
`)
    try {
        const productName = req.query.name as string

        if (productName) {
            if (productName.length < 2) {
                res.statusCode = 400
                throw new Error('O termo buscado deve ter pelo menos dois caracteres.')
            }

            const filteredProductsFromDB = productsFromDb.filter((product) => {
                return product.name.toLowerCase().includes(productName.toLowerCase())
            })

            if (filteredProductsFromDB.length === 0) {
                res.statusCode = 404
                throw new Error('Não há nenhum produto com o termo buscado.')
            }

            res.status(200).send(filteredProductsFromDB)
        } else {
            res.status(200).send(productsFromDb)
        }
    } catch (error) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.status(200).send(productsFromDb)
        }
    }
})

// CREATE User
app.post('/users', async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            res.statusCode = 406
            throw new Error('É obrigatório enviar "name", "email" e "password" no corpo da requisição.')
        }

        if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
            res.statusCode = 406
            throw new Error('Os dados "name", "email" e "password" devem estar no formato "string".')
        }

        const usersFromDb: User[] = await db.raw(`
            SELECT * FROM users
        `)

        const checkEmail = usersFromDb.filter((userFromDb) => {
            return userFromDb.email === email
        })

        // filter retorna um array vazio caso não encontre nenhum user com email igual
        if (checkEmail.length > 0) {
            res.statusCode = 409
            throw new Error('O email enviado já foi cadastrado.')
        }

        const newUser: User = {
            id: new Date().toISOString(),
            name: name,
            email: email,
            password: password,
            createdAt: new Date().toISOString()
        }

        await db.raw(`
            INSERT INTO users (id, name, email, password, created_at)
            VALUES ('${newUser.id}', '${newUser.name}', '${newUser.email}', '${newUser.password}', '${newUser.createdAt}')
        `)

        res.status(201).send({ message: 'Cadastro realizado com sucesso' })
    } catch (error) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send('Erro inesperado.')
        }
    }
})

// CREATE Product
app.post('/products', async (req: Request, res: Response) => {
    try {
        const { name, price, description, imageUrl } = req.body

        if (!name || !price || !description || !imageUrl) {
            res.statusCode = 406
            throw new Error('É obrigatório enviar "name", "price", "description" e "imageUrl" no corpo da requisição.')
        }

        if (typeof name !== 'string' || typeof description !== 'string' || typeof imageUrl !== 'string') {
            res.statusCode = 406
            throw new Error('Os dados "name", "description" e "imageUrl" devem estar no formato "string".')
        }

        if (typeof price !== 'number') {
            res.statusCode = 406
            throw new Error('O dado "price" deve estar no formato "number"')
        }

        const newProduct: Product = {
            id: new Date().toISOString(),
            name: name,
            price: price,
            description: description,
            imageUrl: imageUrl
        }

        await db.raw(`
            INSERT INTO products (id, name, price, description, image_url)
            VALUES ('${newProduct.id}', '${newProduct.name}', '${newProduct.price}', '${newProduct.description}', '${newProduct.imageUrl}');
        `)

        res.status(201).send({ message: 'Produto cadastrado com sucesso' })
    } catch (error) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send('Erro inesperado.')
        }

    }

})

// CREATE Purchase
app.post('/purchases', async (req: Request, res: Response) => {
    try {
        const { buyer, products } = req.body

        if (!buyer || !products || products.length === 0) {
            res.statusCode = 406
            throw new Error('É obrigatório enviar "buyer" e "products" no corpo da requisição.')
        }

        if (typeof buyer !== 'string') {
            res.statusCode = 406
            throw new Error('O dado "buyer" deve estar no formato "string".')
        }

        const checkProductsArray = Array.isArray(products)
        if (!checkProductsArray) {
            res.statusCode = 406
            throw new Error('O dado "produtos" deve ser um array.')
        }

        const usersFromDb: User[] = await db.raw(`
            SELECT * FROM users
        `)

        // verificação de user cadastrado no db
        const checkUserId = usersFromDb.filter((userFromDb) => {
            return userFromDb.id === buyer
        })

        if (checkUserId.length === 0) {
            res.statusCode = 406
            throw new Error('Não há nenhum buyer cadastrado com a id informada.')
        }

        // verificação de produtos cadastrados no db
        const productsFromDb: Product[] = await db.raw(`
            SELECT * FROM products
        `)

        for (let product of products) {
            const filteredProducts = productsFromDb.filter((productFromDb) => {
                return productFromDb.id === product.id
            })

            if (filteredProducts.length === 0) {
                res.statusCode = 406
                throw new Error(`Não existe nenhum produto com a id "${product.id}".`)
            }
        }

        // lógica de preço total
        let totalPrice = 0

        for (let product of products) {
            const productFromDb = await db.raw(`
                SELECT * FROM products
                WHERE id = '${product.id}'
            `)

            const productPrice = productFromDb[0].price

            const productTotalPrice = productPrice * product.quantity

            totalPrice += productTotalPrice
        }

        console.log(totalPrice)

        const newPurchase: Purchase = {
            id: new Date().toISOString(),
            buyer: buyer,
            totalPrice: totalPrice,
            createdAt: new Date().toISOString()
        }

        await db.raw(`
            INSERT INTO purchases (id, buyer, total_price, created_at)
            VALUES ('${newPurchase.id}', '${newPurchase.buyer}', '${newPurchase.totalPrice}', '${newPurchase.createdAt}')
        `)

        for (let product of products) {
            await db.raw(`
            INSERT INTO purchases_products (purchase_id, product_id, quantity)
            VALUES ('${newPurchase.id}', '${product.id}', '${product.quantity}')
        `)
        }

        res.status(201).send({ message: 'Pedido cadastrado com sucesso' })

    } catch (error) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send('Erro inesperado.')
        }
    }
})

// EDIT Product By Id
app.put('/products/:id', async (req: Request, res: Response) => {
    try {
        const idToEdit: string = req.params.id

        const { name, price, description, imageUrl } = req.body

        const productsFromDb: Product[] = await db.raw(`
            SELECT * FROM products;
        `)

        const productToEdit = productsFromDb.find((productFromDb) => {
            return productFromDb.id === idToEdit
        })

        if (!productToEdit) {
            res.statusCode = 404
            throw new Error('Ná nenhum produto cadastrado com essa "id".')
        }

        if (typeof name !== 'undefined' && typeof name !== 'string') {
            res.statusCode = 406
            throw new Error('"name" deve ser uma "string".')
        }

        if (typeof description !== 'undefined' && typeof description !== 'string') {
            res.statusCode = 406
            throw new Error('"description" deve ser uma "string".')
        }

        if (typeof imageUrl !== 'undefined' && typeof imageUrl !== 'string') {
            res.statusCode = 406
            throw new Error('"imageUrl" deve ser uma "string".')
        }

        if (typeof price !== 'undefined' && typeof price !== 'number') {
            res.statusCode = 406
            throw new Error('O dado "price" deve estar no formato "number".')
        }

        const editedProduct: Product = {
            id: idToEdit,
            name: name || productToEdit.name,
            price: price || productToEdit.price,
            description: description || productToEdit.description,
            imageUrl: imageUrl || productToEdit.imageUrl
        }

        // console.log('PRODUTO EDITADO', editedProduct)

        if (productToEdit) {
            await db.raw(`
                UPDATE products
                SET
                    name = '${editedProduct.name}',
                    price = '${editedProduct.price}',
                    description = '${editedProduct.description}',
                    image_url = '${editedProduct.imageUrl}'
                WHERE id = '${idToEdit}';
            `)
        }

        res.status(200).send('Atualização realizada com sucesso')
    } catch (error) {
        if (res.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

// DELETE User By Id
app.delete('/users/:id', async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id

        const usersFromDb: User[] = await db.raw(`
            SELECT * FROM users
        `)

        const userToBeDeletedArray: User[] = usersFromDb.filter((userFromDb) => {
            return userFromDb.id === id
        })

        if (userToBeDeletedArray.length === 0) {
            res.statusCode = 404
            throw new Error('Não há nenhum user cadastrado com essa "id".')
        }

        await db.raw(`
            DELETE FROM users
            WHERE id = '${id}';
        `)

        res.status(200).send('User deletado com sucesso')

    } catch (error) {
        if (res.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }

})

// DELETE Product By Id
app.delete('/products/:id', async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id

        const productsFromDb: Product[] = await db.raw(`
            SELECT * FROM products
        `)

        const productToBeDeletedArray: Product[] = productsFromDb.filter((productFromDb: Product) => {
            return productFromDb.id === id
        })

        if (productToBeDeletedArray.length === 0) {
            res.statusCode = 404
            throw new Error('Não há nenhum produto cadastrado com essa "id".')
        }

        await db.raw(`
            DELETE FROM products
            WHERE id = '${id}'
        `)

        res.status(200).send('Produto deletado com sucesso')
    } catch (error) {
        if (res.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }

})

// DELETE Purchase By Id
app.delete('/purchases/:id', async (req: Request, res: Response) => {
    try {
        const id: string = req.params.id

        const purchasesFromDb: Purchase[] = await db.raw(`
            SELECT * FROM purchases
        `)

        const purchaseToBeDeletedArray = purchasesFromDb.filter((purchaseFromDb) => {
            return purchaseFromDb.id === id
        })

        if (purchaseToBeDeletedArray.length === 0) {
            res.statusCode = 404
            throw new Error('Não há nenhum pedido com a id informada')
        }

        await db.raw(`
            DELETE FROM purchases
            WHERE id = '${id}';
        `)

        res.status(200).send({ message: 'Pedido cancelado com sucesso.' })
    } catch (error) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send('Erro inesperado')
        }
    }
})