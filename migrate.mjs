import postgres from 'postgres';

import fs from 'node:fs';

// const sql = postgres({
//     host: "localhost",
//     port: 5432,
//     user: "postgres",
//     password: "140588",
//     database: "landing_product_db",
// });

const sql = postgres('postgres://postgres:140588@localhost:5432/landing_product_db');

fs.readFile('./data/product.json', (err, dataJSON) => {
    let products = JSON.parse(dataJSON)
    products.forEach(async product => {
        await sql`INSERT INTO products VALUES (
            ${product.id}, 
            ${product.name},          
            ${product.subtitle}, 
            ${product.description}, 
            ${product.image},
            ${product.price.Amount}, 
            ${product.price.Currency}
        )`.execute()
    })
})
