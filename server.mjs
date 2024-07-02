// 1. import http funcionality

import http from "node:http";
import fs from "node:fs";
import querystring from "node:querystring";

import { randomUUID } from "node:crypto";

import postgres from "postgres";

import fetch from "node-fetch";


const sql = postgres('postgres://postgres:140588@localhost:5432/landing_product_db');

const routes = {
  "/": "index.html",
  "/style.css": "style.css",
  "/app.js": "js/app.js",
  "/favicon/black_friday.png": "favicon/black_friday.png",
  "/images/product.jpg": "images/product.jpg",
  "/images/product1.jpg": "images/product1.jpg",
  "/images/product2.webp": "images/product2.webp",
}

const server = http.createServer((req, res) => {
  //page router  
  if (routes[req.url]) {
    fs.readFile(routes[req.url], (err, data) => {
      res.write(data)
      res.end()
    })
  } else if (req.url == "/api/product") {
    sql`SELECT * FROM products`.then(data => {
      res.write(JSON.stringify(data))
      res.end()
    })
    // fs.readFile("data/product.json", (err, dataJSON) => {
    //   res.write(dataJSON)
    //   res.end()
    // })

  } // HW6: rewrite the logic using SQL
  else if (req.url.startsWith("/api/orderinfo")) {

    let queryString = req.url.split("?")[1]
    let params = querystring.parse(queryString)

    //--------------------------------------------------------------------------------
    sql`SELECT * FROM orders 
    WHERE pin = ${params.pin} 
    AND id::varchar ILIKE ${params.order_id + "%"}`
      .then(data => {
        res.write(JSON.stringify(data))
        res.end()
      })

    // fs.readdir('data/orders/', (err, files) => {
    //   files.forEach(files => {
    //     if (files.startsWith(params.order_id)) {
    //       fs.readFile(`data/orders/${files}`, (err, dataJSON) => {
    //         if (err) {
    //           res.write("Not found")
    //           res.end()
    //         }else {
    //           let data = JSON.parse(dataJSON)
    //           if (data.pin == params.pin) {
    //             res.write(dataJSON)         
    //           }  else {
    //             res.write('Not autorized')
    //           } 
    //           res.end() 
    //         }       

    //       })
    //     }
    //   })
    // })

    //-----------------------------------------------------------------------  
    // HW6: rewrite the logic using SQL
  } else if (req.url == "/api/order") {
    //extract data from request body
    let body = ''
    req.on('data', chunk => {
      body += chunk
    })

    req.on('end', () => {
      let data = JSON.parse(body)
      let uuid = randomUUID()
      data.id = uuid

      sql`INSERT INTO orders VALUES (       
        ${data.id},
        ${data.pin},
        ${data.quantity},
        ${data.name},
        ${data.phone},
        ${data.email},
        ${data.address},
        ${data.city},
        ${data.productId}
        
      )`.execute()
        .then(() => {
          res.write(JSON.stringify({
            message: "Order placed!",
            id: data.id
          }))
          res.end()
        })


      // fs.writeFile(`data/orders/${uuid}.json`, JSON.stringify(data), (err) => {
      //   res.write(JSON.stringify({
      //     message: "Order placed!"
      //   }))
      //   res.end()
      // })
    })
  }else if (req.url.startsWith("/api/pay/success")) {
    let orderID = req.url.split('/').pop().split('?')[0];
    console.log(`Client paid for order ${orderID}`)
  } 
  else if (req.url.startsWith("/api/pay")) {
    let orderId = req.url.split('/').pop();
    // 2. get access to paypal using credentials from our app
    fetch(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          "Authorization": `Basic ${Buffer.from('AXhu6-DdoMH8HnVqgQYKsVWZeB-Phid-t2NyN7VUJedWEGvjVSD_Pa0qaQJWTbzjoCxTtuA71Zott2dS:EGDLlggWDglPnhXRokDcb_QkkL2HGu5grc62dfUax23XETvEC8Cd8jwuDyg_LagS9nlGDi5UkaxYXviL').toString('base64')} `
        },
        body: "grant_type=client_credentials"
      }
    ).then(res => {
      return res.json()
    })
      .then(json => {
        // 3. using the access token and order data -> place order
        let token = json.access_token

        fetch(
          'https://api-m.sandbox.paypal.com/v2/checkout/orders',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              // 'PayPal-Request-Id': '7b92603e-77ed-4896-8e78-5dea2050476a',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(
              {
                intent: "CAPTURE",
                purchase_units:
                  [
                    {
                      items: [
                        {
                          name: "Test Book Title",
                          description: "Test Book Description",
                          quantity: "1",
                          unit_amount: {
                            currency_code: "USD",
                            value: "1.00"
                          }
                        }
                      ],
                      amount: {
                        currency_code: "USD",
                        value: "1.00",
                        breakdown: {
                          item_total: {
                            currency_code: "USD",
                            value: "1.00"
                          }
                        }
                      },
                    }
                  ],
                application_context: {
                  return_url: `http://localhost:8080/api/pay/success/${orderId}`,
                  cancel_url: "http://localhost:8080/api/pay/cancel",
                  shipping_preference: "NO_SHIPPING",
                  user_action: "PAY_NOW"
                }
              })
          }).then(res => {
            return res.json()
          })
          .then(json => {
            //check if success
            let url = json.links.find(link => link.rel === "approve").href
            res.setHeader('Refresh', `0; URL=${url}`)
           // res.write(`<meta http-equiv="Refresh" content="0; url=${url}" />`)
            res.end()
          })
      })
  } 
  else {
    res.write("Not found")
    res.end()
  }
})

// 3. start the server

server.listen(8080)