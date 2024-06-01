// client side javascript

fetch('/api/product')
.then(response => response.json())
.then(json =>{
    let h1 = document.createElement('h1')
    h1.textContent = json.name
    document.body.appendChild(h1)
    // HW1: finish the templateusing DOM comands
    let img = document.createElement('img')
    img.src = json.image
    document.body.appendChild(img)

    let h2 = document.createElement('h2')
    h2.textContent = json.subtitle
    document.body.appendChild(h2)

    let h4 = document.createElement('h4')
    h4.textContent = json.description
    document.body.appendChild(h4)

    let ul = document.createElement('ul')
    json.tags.forEach(tag => {
        let li = document.createElement('li')
        li.textContent = tag
        ul.appendChild(li)
    })
    document.body.appendChild(ul)

    let p = document.createElement('p')
    p.textContent = json.price.Amount        
    document.body.appendChild(p) 

    p = document.createElement('p')
    p.textContent = json.price.Currency
    document.body.appendChild(p)

    let button = document.createElement('button')
    button.textContent = 'ORDER'
    document.body.appendChild(button)



   //When USER clics - Order
    button.addEventListener('click', orderProduct )
    //When USER clics - Order

    //HW2*:what if the endpoint would offer XML data

})

const orderProduct = () => {
    //GET -default
//     fetch('/api/order',{
//         method: 'POST'
//     })
//    .then(response => response.json())
//    .then(json =>{
//        alert(json.message)
//    })
//    .catch(error => {
//        alert(error)
//    })

let form = document.createElement('form')
let input = document.createElement('input')
let label = document.createElement('label')
label.textContent = 'Enter your email'
form.append(label)
form.append(input)

input = document.createElement('input')
label = document.createElement('label')
label.textContent = 'Enter quantity'
input.type = 'number'
input.min = 1
form.append(label)
form.append(input)

input = document.createElement('input')
label = document.createElement('label')
label.textContent = 'Enter your phone'
form.append(label)
form.append(input)

input = document.createElement('input')
label = document.createElement('label')
label.textContent = 'Enter your name'
form.append(label)
form.append(input)

input = document.createElement('input')
label = document.createElement('label')
label.textContent = 'Enter your address'
form.append(label)
form.append(input)

input = document.createElement('input')
label = document.createElement('label')
label.textContent = 'Enter your city'
form.append(label)
form.append(input)

let button = document.createElement('button')
button.textContent = 'CONFIRM ORDER'
form.append(button)

button.addEventListener('click', () => {
    fetch('/api/order', {
        method: 'POST'       
    })
    .then(response => response.json())
    .then(json =>{
        alert(json.message)
    })
    .catch(err => {
        alert("Error")
    })
})


document.body.replaceChild(form,document.body.lastElementChild)
   

}