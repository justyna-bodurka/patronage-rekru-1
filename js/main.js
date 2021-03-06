/*******************************
 * ASYNC FETCH
*******************************/

// Fetch data and initailize application or handle error
function appStart () {
  fetch("https://raw.githubusercontent.com/alexsimkovich/patronage/main/api/data.json")
  .then((resp) => resp.json())
  .then((resp) => renderApp(resp))
  .catch(() => renderErrorMessage());
}

/*******************************
 * RENDERS
*******************************/

// Render fetched products and add click listeners
function renderApp(productsList) {
  PRODUCTS_LIST = productsList;

  renderProducts();
  addProductListeners();
  addLayoutChangeListeners();
}

// Render products
function renderProducts() {
  PRODUCTS_LIST.forEach((element) => {
    const list = document.querySelector(".products__list");

    list.insertAdjacentHTML(
      "beforeend",
      `<div class="product">
        <div  class="product__image"> <img
        
        src='${element.image}'
        alt="">
      </div>
        <div class="product__desc">
          <div class="product__title">${element.title}</div>
          <div class="product__price">${element.price.toFixed(2)} zł</div>
          <div class="product__ingredients">${element.ingredients.join(", ")}</div>
          <button class="button button--add" data-product-id="${element.id}">zamów</button>
      </div>
    </div> `
    );
  });
}

// Render Basket and add basket items listeneres
function renderBasket() {
  const basketList = document.querySelector(".basket__list");
  basketList.innerHTML = "";

  BASKET.forEach((product) => {
    basketList.insertAdjacentHTML(
      "beforeend",
      `<div class="basket__item">
        <div class="basket__item-name">${product.title}</div>
        <div class="basket__item-price">${product.price.toFixed(2)}</div>
        <div class="basket__item-quantity">${product.quantity}</div>
        <div class="basket__item-options"><button class="button button--remove" data-basket-id="${product.id}">usuń</button></div>
      </div>`
    );
  });

  renderBasketSum()
  handleBasketState()
  addBasketListeners();
}

// Handle visibility of basket layout on empty/not-empty state
function handleBasketState () {
  const basketElement = document.querySelector('.basket')

  if (BASKET.length) {
    basketElement.classList.remove('basket--empty')
  } else {
    basketElement.classList.add('basket--empty')
  }
}

// Render summary price of all products in basket
function renderBasketSum () {
  const basketFooterPrice = document.querySelector(".basket__footer-price");
  let sum = 0;

  BASKET.forEach((product) => { sum = sum + product.price * product.quantity; });
  
  basketFooterPrice.textContent= `${sum.toFixed(2)} zł`
}

/*******************************
 * LISTENERS
*******************************/

// Add removeProduct listeners to basket items
function addBasketListeners() {
  const buttonsRemove = document.querySelectorAll(".basket .button--remove");
  buttonsRemove.forEach((button) =>
    button.addEventListener("click", removeFromBasket)
  );
}

// Add listener for layout change button
function addLayoutChangeListeners() {
  const button = document.querySelector(".button--change");
  const productsList = document.querySelector(".products__list");

  button.addEventListener("click", () => productsList.classList.toggle("products__list--center"));
}

// Add click listeners to products
function addProductListeners() {
  const buttons = document.querySelectorAll(".product .button");
  buttons.forEach((button) => button.addEventListener("click", addToBasket));
}

// Render error message and hide basket on error
function renderErrorMessage() {
  const errorMessage = document.querySelector(".error");
  const basket = document.querySelector(".basket");

  errorMessage.removeAttribute("hidden");  
  basket.setAttribute("hidden", "true");
}

/*******************************
 * EVENT HANDLERS
*******************************/

// Add to basket triggered on click event
function addToBasket(e) {
  const productId = parseInt(e.target.getAttribute("data-product-id"));
  const product = isProductInList(PRODUCTS_LIST, productId);

  if (!product) return alert("Coś poszło nie tak :-)");

  const productInBasket = isProductInList(BASKET, productId);
 
  if (productInBasket) {
    productInBasket.quantity++;
  } else {
    BASKET.push({
      id: product.id,
      price: product.price,
      title: product.title,
      quantity: 1,
    });
  }

  renderBasket();
}

function isProductInList (list, productId) {
  return list.find((el) => el.id === productId)
}

// Remove from basket function triggered on click event
function removeFromBasket(e) {
  const productId = parseInt(e.target.getAttribute("data-basket-id"));
  const productInBasket = BASKET.find((el) => el.id === productId);

  if (productInBasket.quantity > 1) {
    productInBasket.quantity--;
  } else {
    BASKET = BASKET.filter((el) => el.id !== productInBasket.id);
  }
  
  renderBasket();
}

/*******************************
 * CODE EXECUTE
*******************************/

let BASKET = [];
let PRODUCTS_LIST = [];

appStart();