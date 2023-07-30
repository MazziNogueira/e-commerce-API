import express, { Request, Response } from 'express'
import cors from 'cors'

import { products, users } from "./db"
import { Product, User } from "./types"

const usersList: User[] = users
const productsList: Product[] = products

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log('Server running on port 3003')
})

// FIRST ENDPOINT
app.get('/ping', (req: Request, res: Response) => {
    res.send('Pong, human (:')
})

// GET All Users
app.get('/users', (req: Request, res: Response) => {
    try {
        res.status(200).send(usersList)
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
app.get('/products', (req: Request, res: Response) => {
    try {
        const productName = req.query.name as string

        if (productName) {
            if (productName.length < 2) {
                res.statusCode = 400
                throw new Error('O termo buscado deve ter pelo menos dois caracteres.')
            }

            const result = productsList.filter((product) => {
                return product.name.toLowerCase().includes(productName.toLowerCase())
            })

            res.status(200).send(result)
        } else {
            res.status(200).send(productsList)
        }
    } catch (error) {
        console.log(error)

        if (res.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.status(200).send(productsList)
        }
    }
})

// CREATE User
app.post('/users', (req: Request, res: Response) => {
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

        const checkEmail = usersList.filter((user) => {
            return user.email === email
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

        usersList.push(newUser)

        res.status(201).send('Cadastro realizado com sucesso')
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
app.post('/products', (req: Request, res: Response) => {
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

        productsList.push(newProduct)

        res.status(201).send('Produto cadastrado com sucesso')

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

// DELETE User By Id
app.delete('/users/:id', (req: Request, res: Response) => {
    const id = req.params.id

    const userToBeDeletedIndex = usersList.findIndex((user) => {
        return user.id === id
    })

    if (userToBeDeletedIndex >= 0) {
        usersList.splice(userToBeDeletedIndex, 1)
    }

    res.status(200).send('User deletado com sucesso')
})

// DELETE Product By Id
app.delete('/products/:id', (req: Request, res: Response) => {
    const id = req.params.id

    const productToBeDeletedIndex = productsList.findIndex((product) => {
        return product.id === id
    })

    if (productToBeDeletedIndex >= 0) {
        productsList.splice(productToBeDeletedIndex, 1)
    }

    res.status(200).send('Produto deletado com sucesso')
})

// EDIT Product By Id
app.put('/products/:id', (req: Request, res: Response) => {
    const idToEdit = req.params.id

    const { id, name, price, description, imageUrl } = req.body

    const productToEdit = productsList.find((product) => {
        return product.id === idToEdit
    })

    if (productToEdit) {
        productToEdit.id = id || productToEdit.id
        productToEdit.name = name || productToEdit.name
        productToEdit.price = price || productToEdit.price
        productToEdit.description = description || productToEdit.description
        productToEdit.imageUrl = imageUrl || productToEdit.imageUrl
    }

    res.status(200).send('Atualização realizada com sucesso')
})