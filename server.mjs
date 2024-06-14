// 1. import http funcionality

import http from "node:http";
import fs from "node:fs";
import querystring from "node:querystring";

import { randomUUID } from "node:crypto";

import postgres from "postgres";

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
    fs.readFile("data/product.json", (err, dataJSON) => {
      res.write(dataJSON)
      res.end()
    })

  }
  else if (req.url.startsWith("/api/orderinfo")) {

    let queryString = req.url.split("?")[1]
    let params = querystring.parse(queryString)   
    fs.readdir('data/orders/', (err, files) => {
      files.forEach(files => {
        if (files.startsWith(params.order_id)) {
          fs.readFile(`data/orders/${files}`, (err, dataJSON) => {
            if (err) {
              res.write("Not found")
              res.end()
            }else {
              let data = JSON.parse(dataJSON)
              if (data.pin == params.pin) {
                res.write(dataJSON)         
              }  else {
                res.write('Not autorized')
              } 
              res.end() 
            }       
            
          })
        }
      })
    })

    

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
      fs.writeFile(`data/orders/${uuid}.json`, JSON.stringify(data), (err) => {
        res.write(JSON.stringify({
          message: "Order placed!"
        }))
        res.end()
      })
    })
  } else {
    res.write("Not found")
    res.end()
  }
})

// 3. start the server

server.listen(8080)