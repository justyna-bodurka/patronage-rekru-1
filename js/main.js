const BASKET = []
let PRODUCTS_LIST

fetch("https://raw.githubusercontent.com/alexsimkovich/patronage/main/api/data.json")
  .then((resp) => resp.json())
  .then((resp) => initialize(resp))
  .catch((error) => console.log("nie udało się pobrać"));

function initialize (array) {
  PRODUCTS_LIST = array

  renderProducts()
  addProductListeners()
}

function addProductListeners () {
  const buttons = document.querySelectorAll('.product .button')
  buttons.forEach(button => button.addEventListener('click', addToBasket))
}

function renderProducts () {
  PRODUCTS_LIST.forEach((element) => {
    const list = document.querySelector(".products-list");
    
    list.insertAdjacentHTML("beforeend",`
      <div class="product">
        <div  class="product__image" style="background-image: url('${element.image}');"></div>
        <div class="product__desc">
          <div class="product__title">${element.title}</div>
          <div class="product__price">${element.price}</div>
          <div class="product__ingredients">${element.ingredients.join(", ")}</div>

          <button class="button" data-product-id="${element.id}">zamów</button>
      </div>
    </div> `);
  }) 
}


function addToBasket (e) {
  const productId = parseInt(e.target.getAttribute('data-product-id'))
  const product = PRODUCTS_LIST.find(el => el.id === productId)

  if(!product) return alert('siem nie udao')

  const productInBasket = BASKET.find(el => el.id === productId)
  
  if (productInBasket) {
    productInBasket.quantity++
  } else {
    BASKET.push({
      id: product.id,
      price: product.price,
      title: product.title,
      quantity: 1
    })
  }

  renderBasket()
}

function renderBasket () {
  const basketList = document.querySelector('.basket__list')
  basketList.innerHTML = ''
  console.log('renderBasket', BASKET)
  BASKET.forEach(product => {
    basketList.insertAdjacentHTML("beforeend",`<div class="basket__item">
    <div class="basket__item-name">${product.title}</div>
    <div class="basket__item-price">${product.price}</div>
    <div class="basket__item-quantity">${product.quantity}</div>
    <div class="basket__item-options"><button>usun</button></div>
  </div>`)
  })
}