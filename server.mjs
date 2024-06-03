// 1. import http funcionality

import http from "node:http";
import fs from "node:fs";

const routes = {
  "/": "index.html",
  "/style.css": "style.css",
  "/app.js": "js/app.js",
  "/favicon/black_friday.png": "favicon/black_friday.png",
  "/images/product.jpg": "images/product.jpg"
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

  } else if (req.url == "/api/order") {
    //extract data from request body
    let body = ''
    req.on('data', chunk => {
      body += chunk
    })

    req.on('end', () => {
      let data = JSON.parse(body)
      fs.writeFile("data/order.json", JSON.stringify(data), (err) => {
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