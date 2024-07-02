// client side javascript

let products = []
let currentProductIndex = 0

const pageContent = document.querySelector('#pageContent')

fetch('/api/product')
    .then(response => response.json())
    .then(productData => {
        products = productData
        renderProduct(currentProductIndex)
    })

const renderProduct = (index) => {

    pageContent.innerHTML = ''

    let product = products[index];

    let h1 = document.createElement('h1')
    h1.textContent = product.name
    pageContent.append(h1)
    // HW1: finish the templateusing DOM comands
    let img = document.createElement('img')
    img.src = product.image
    pageContent.append(img)

    let h2 = document.createElement('h2')
    h2.textContent = product.subtitle
    pageContent.append(h2)

    let h4 = document.createElement('h4')
    h4.textContent = product.description
    pageContent.append(h4)

    // let ul = document.createElement('ul')
    // product.tags.forEach(tag => {
    //     let li = document.createElement('li')
    //     li.textContent = tag
    //     ul.append(li)
    // })
    // pageContent.append(ul)

    let p = document.createElement('p')
    p.textContent = `Price: ${product.price_amount} ${product.price_currency}`
    pageContent.append(p)    

    let nextButton = document.createElement('button')
    nextButton.classList.add('nextButton')
    nextButton.textContent = 'NEXT'
    pageContent.append(nextButton)

    //HW1: make the previous button
    let previousButton = document.createElement('button')
    previousButton.classList.add('previousButton')
    previousButton.textContent = 'PREVIOUS'
    pageContent.append(previousButton)

    //HW2: put the limit
    nextButton.addEventListener('click', () => {
        if (currentProductIndex < products.length - 1) {
            currentProductIndex++;
        } else {
            currentProductIndex = 0
        }
        renderProduct(currentProductIndex)
    })

    previousButton.addEventListener('click', () => {
        if (currentProductIndex > 0) {
            currentProductIndex--;
        } else {
            currentProductIndex = products.length - 1
        }
        renderProduct(currentProductIndex)
    })

    let button = document.createElement('button')
    button.classList.add('buyButton')
    button.textContent = 'BUY'
    pageContent.append(button)



    //When USER clics - Order
    button.addEventListener('click', () => { orderProduct(product.id) })

    let buttonOrderInfo = document.createElement('button')
    buttonOrderInfo.classList.add('orderInfoButton')
    buttonOrderInfo.textContent = 'ORDER INFO'
    pageContent.append(buttonOrderInfo)

//----------------------------------------------------------------
  //HW5: rewrite the logic using DOM elements
    buttonOrderInfo.addEventListener('click', () => {
        let formresult = document.createElement('form');
        let orderId = document.createElement('input');       
        orderId.placeholder = 'Order ID';
        formresult.append(orderId);
      
        let pin = document.createElement('input');
        pin.type = 'password';
        pin.placeholder = 'Enter PIN';
        formresult.append(pin);        
      
        let submitButton = document.createElement('button');
        submitButton.textContent = 'Submit';
        formresult.append(submitButton);

        pageContent.append(formresult);
      
        submitButton.addEventListener('click', (e) => {
          e.preventDefault();        
      
          let orderIdValue = orderId.value;
          let pinValue = pin.value;
      
          if (!orderIdValue || !pinValue) {
            alert('Please fill in all fields');
            return;
          }
      
          fetch(`/api/orderinfo?order_id=${orderIdValue}&pin=${pinValue}`)
            .then(response => response.json())
            .then(json => {
                
                formresult.innerHTML = '';

                let orderInfo = json[0];

                let resultInfo = document.createElement('div');
                resultInfo.classList.add('resultInfo');
                let orderNameResult = document.createElement('p');
                let productIdResult = document.createElement('p');                
                let quantityResult = document.createElement('p');

                orderNameResult.textContent = `Order Name: ${orderInfo.name}`;
                productIdResult.textContent = `Product ID: ${orderInfo.productid}`;
                quantityResult.textContent = `Quantity: ${orderInfo.quantity}`;

                resultInfo.append(orderNameResult);
                resultInfo.append(productIdResult);
                resultInfo.append(quantityResult);
                pageContent.append(resultInfo);                          
            })
            .catch(err => {
              alert("Invalid order ID or PIN");
            });            
        });
      });

      //---------------------------------------------------  
}
const orderProduct = (productId) => {

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
    input.max = 10
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

    input = document.createElement('input')
    label = document.createElement('label')
    label.textContent = 'Enter your PIN'
    input.type = 'password'
    input.id = 'pin'
    form.append(label)
    form.append(input)

    let button = document.createElement('button')
    button.textContent = 'CONFIRM ORDER'
    form.append(button)

    button.addEventListener('click', (e) => {
        e.preventDefault()      

        form.addEventListener('click', (e) => {
            e.preventDefault()

            let email = document.getElementById('orderEmail').value
            let quantity = document.getElementById('quantity').value
            let phone = document.getElementById('phone').value
            let name = document.getElementById('name').value
            let address = document.getElementById('address').value
            let city = document.getElementById('city').value
            let pin = document.getElementById('pin').value

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
                    city: city,
                    pin: pin
                })
            })
                .then(response => response.json())
                .then(json => {
                    e.target.innerText = json.message
                    
                    //redirect to localhost:8080/api/pay/{id}
                    let a = document.createElement('a')
                    a.href = `/api/pay/${json.id}`
                    a.innerText = 'Pay Now'

                    e.target.parentElement.append(a)
                })
                .catch(err => {
                    alert("Error")
                })
        })
    })
    pageContent.replaceChild(form, pageContent.lastElementChild)
}