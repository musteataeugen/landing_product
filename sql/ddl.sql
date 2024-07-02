 psql -U postgres -h localhost -p 5432

CREATE DATABASE landing_product_db;

CREATE TABLE products (
    id int PRIMARY KEY,
    name varchar(100),
    subtitle varchar(1000),
    description varchar(2000),
    image varchar(100),
    price_amount int,
    price_currency varchar(4)
);

CREATE TABLE orders (
    id uuid PRIMARY KEY,
    pin int,
    quantity int,
    name varchar(100),
    phone varchar(20),
    email varchar(100),
    address varchar(100),
    city varchar(100),
    productId int,
    CONSTRAINT fk_product FOREIGN KEY(productId) REFERENCES products(id)
);

SELECT * FROM products;

ALTER TABLE orders
RENAME COLUMN Idproduct TO productId;

sql`SELECT * FROM orders 
    WHERE pin = ${params.pin} 
    AND id::varchar LIKE ${params.order_id + "%"}` 
    .then(data => {
      res.write(JSON.stringify(data))
      res.end()
    })  
