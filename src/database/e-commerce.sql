-- Active: 1690845624871@@127.0.0.1@3306

-- USERS TABLE

CREATE TABLE
    users (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TEXT NOT NULL
    );

SELECT * FROM users;

PRAGMA table_info('users');

INSERT INTO
    users (
        id,
        name,
        email,
        password,
        created_at
    )
VALUES (
        'u003',
        'leia',
        'leia@email.com',
        'leia_123abc',
        '2023-08-01T00:13:09.616Z'
    ), (
        'u004',
        'luke',
        'luke@email.com',
        'luke_123abc',
        '2023-08-01T00:13:09.616Z'
    ), (
        'u005',
        'baleia',
        'baleia@email.com',
        'baleia_123abc',
        '2023-08-01T00:13:09.616Z'
    ), (
        'u006',
        'buda',
        'buda@email.com',
        'buda_123abc',
        '2023-08-01T00:13:09.616Z'
    );

-- PRODUCTS TABLE

CREATE TABLE
    products (
        id TEXT PRIMARY KEY UNIQUE NOT NULL,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL
    );

SELECT * FROM products;

PRAGMA table_info('products');

INSERT INTO
    products (
        id,
        name,
        price,
        description,
        image_url
    )
VALUES (
        'p001',
        'isqueiro verde',
        5,
        'isqueiro verde bic - usado',
        'https://picsum.photos/300'
    );

INSERT INTO
    products (
        id,
        name,
        price,
        description,
        image_url
    )
VALUES (
        'p002',
        'lápis laranja',
        1.5,
        'lápis de cor faber castell na cor laranja - ponta chata',
        'https://picsum.photos/300'
    ), (
        'p003',
        'régua de acrílico transparente - 30cm',
        3,
        'o terror do mbl',
        'https://picsum.photos/300'
    ), (
        'p004',
        'caixinha de som exbom',
        80,
        'caixinha de som bluetooth vermelha',
        'https://picsum.photos/300'
    ), (
        'p005',
        'ipad relíquia',
        600,
        'ipad generation boomer, maioria dos apps não funciona',
        'https://picsum.photos/300'
    );