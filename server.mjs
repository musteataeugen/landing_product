// 1. import http funcionality

import http from "node:http";
import fs from "node:fs";

// HW: modify the HTML file
//     and the server logic
//     so you load a favicon / logo into the page

// 2. create the server object

const server = http.createServer((req, res) => {

    if (req.url == "/") { //if (req.url == "/index.html") {

    // static file serving
    fs.readFile("index.html", (err, data) => {
      res.write(data)
      res.end()    
    }) 
    } else if (req.url == "/style.css") {  
    fs.readFile("style.css", (err, data) => {
      res.write(data)
      res.end()    
    })    
    } else if (req.url == "/favicon/black_friday.png") {  
    fs.readFile("favicon/black_friday.png", (err, data) => {
      res.write(data)
      res.end()    
    })
    }
     else {
        res.write("Not found")
        res.end()
    }
})

// 3. start the server

server.listen(8080)