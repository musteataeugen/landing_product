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
    button.textContent = 'BUY'
    document.body.appendChild(button)



   //When USER clics - Order
    button.addEventListener('click',() => {orderProduct(json.id)})
    

    //HW2*:what if the endpoint would offer XML data

})

const orderProduct = (productId) => {
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
input.id = 'orderEmail'
let label = document.createElement('label')
label.textContent = 'Enter your email'
form.append(label)
form.append(input)

input = document.createElement('input')
input.type = 'hidden'
input.value = productId
input.id = 'productId'
form.append(input)

input = document.createElement('input')
label = document.createElement('label')
label.textContent = 'Enter quantity'
input.type = 'number'
input.defaultValue = 1
input.min = 1
input.id = 'quantity'
form.append(label)
form.append(input)

input = document.createElement('input')
label = document.createElement('label')
label.textContent = 'Enter your phone'
input.id = 'phone'
form.append(label)
form.append(input)

input = document.createElement('input')
label = document.createElement('label')
label.textContent = 'Enter your name'
input.id = 'name'
form.append(label)
form.append(input)

input = document.createElement('input')
label = document.createElement('label')
label.textContent = 'Enter your address'
input.id = 'address'
form.append(label)
form.append(input)

input = document.createElement('input')
label = document.createElement('label')
label.textContent = 'Enter your city'
input.id = 'city'
form.append(label)
form.append(input)

let button = document.createElement('button')
button.textContent = 'CONFIRM ORDER'
form.append(button)

button.addEventListener('click', (e) => {
    e.preventDefault()

    //HW1: validate so the user doesn't leave empty fields

    form.addEventListener('click', (e) => {
        
        e.preventDefault()
    
        let email = document.getElementById('orderEmail').value
        let quantity = document.getElementById('quantity').value
        let phone = document.getElementById('phone').value
        let name = document.getElementById('name').value
        let address = document.getElementById('address').value
        let city = document.getElementById('city').value
    
        if (!email || !quantity || !phone || !name || !address || !city) {
            alert('Please fill in all fields')
            return
        }    
        fetch('/api/order', {
            method: 'POST',
            body: JSON.stringify({
                productId: document.getElementById('productId').value,
                quantity: quantity,
                email: email,
                phone: phone,
                name: name,
                address: address,
                city: city
            })
        })
        .then(response => response.json())
        .then(json => {
            e.target.innerHTML = json.message
        })
        .catch(err => {
            alert("Error")
        })
    }) 
})
document.body.replaceChild(form,document.body.lastElementChild)  
}