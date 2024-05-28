// 1. import http funcionality

import http from "node:http";
import fs from "node:fs";

const routes = {
  "/": "index.html",
  "/style.css": "style.css",
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
   
  }
   else  {
    res.write("Not found")
    res.end()
  }
})

// 3. start the server

server.listen(8080)