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
