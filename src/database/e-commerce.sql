-- Active: 1690845624871@@127.0.0.1@3306

-- CREATE tables

CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT NOT NULL
    );

CREATE TABLE
    products (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL
    );

CREATE TABLE
    purchases (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        buyer TEXT NOT NULL,
        total_price REAL NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (buyer) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
    );

CREATE TABLE
    purchases_products (
        purchase_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        FOREIGN KEY (purchase_id) REFERENCES purchases (id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products (id) ON UPDATE CASCADE ON DELETE CASCADE
    );

DROP TABLE purchases;

-- CREATE USER

INSERT INTO
    users (
        id,
        name,
        email,
        password,
        created_at
    )
VALUES (
        reqId,
        reqName,
        reqEmail,
        reqPassword,
        reqCreatedAt
    );

-- CREATE PRODUCT

INSERT INTO
    products (
        id,
        name,
        price,
        description,
        image_url
    )
VALUES (
        reqId,
        reqName,
        reqPrice,
        reqDescription,
        reqImageUrl
    );

-- CREATE PURCHASE

INSERT INTO
    purchases(
        id,
        buyer,
        total_price,
        created_at
    )
VALUES (
        'pur002',
        'u002',
        25,
        '1690854106029'
    ), (
        'pur003',
        'u003',
        98,
        '1690854106029'
    ), (
        'pur004',
        'u004',
        12.60,
        '1690854106029'
    ), (
        'pur005',
        'u005',
        9,
        '1690854106029'
    ), (
        'pur006',
        'u006',
        54,
        '1690854106029'
    );

-- INSERT Item to Purchases X Products

INSERT INTO
    purchases_products (
        purchase_id,
        product_id,
        quantity
    )
VALUES ('pur001', 'p003', 3), ('pur001', 'p002', 2), ('pur002', 'p001', 5), ('pur002', 'p002', 1), ('pur003', 'p004', 8), ('pur003', 'p001', 3), ('pur004', 'p002', 4), ('pur004', 'p004', 2), ('pur005', 'p001', 3), ('pur005', 'p003', 1), ('pur006', 'p003', 4), ('pur006', 'p004', 2);

-- READ

-- GET All Users:

SELECT * FROM users;

-- GET All Products:

SELECT * FROM products;

-- GET All Purchases:

SELECT * FROM purchases;

-- GET Purchase by Id

SELECT
    purchases.id AS purchaseId,
    purchases.buyer,
    users.name,
    users.email,
    purchases.total_price,
    purchases.created_at
FROM purchases
    INNER JOIN users ON purchases.buyer = users.id;

-- GET All Products by Name:

SELECT * FROM products WHERE name LIKE '%de%';

-- GET Purchases X Products

SELECT * FROM purchases_products;

-- GET All Columns from purchases_products, purchases e products

SELECT *
FROM purchases_products
    INNER JOIN purchases ON purchases_products.purchase_id = purchases.id
    INNER JOIN products ON purchases_products.product_id = products.id;

-- UPDATE

-- EDIT Product by Id

UPDATE products
SET
    name = reqName,
    price = reqPrice,
    description = reqDescription,
    image_url = reqImageUrl
WHERE id = `${reqId}`;

-- EDIT Purchase Price by Id

UPDATE purchases SET total_price = 64 WHERE id = 'pur001';

-- DELETE

-- DELETE User by Id

DELETE FROM users WHERE id = `${reqId}`;

-- DELETE Product by Id

DELETE FROM products WHERE id = `${reqId}`;