"use strict";

/*******************************
 * ASYNC FETCH
 *******************************/

// Fetch data and initailize application or handle error
function appStart() {
  fetch(
    "https://raw.githubusercontent.com/alexsimkovich/patronage/main/api/data.json"
  )
    .then((resp) => resp.json())
    .then((resp) => renderApp(resp))
    .catch((e) => {
      console.log(e);
      renderErrorMessage("appError");
    });
}

/*******************************
 * RENDERS
 *******************************/

// Render fetched products and add click listeners
function renderApp(productsList) {
  PRODUCTS_LIST = productsList;
  CURRENT_PRODUCTS_LIST = [...productsList];

  renderProducts();
  renderBasket();

  addProductListeners();
  addLayoutChangeListeners();
  addsortCurrentListener();

  // ===========
  const input = document.querySelector(".search__item");
  input.addEventListener("keyup", handleSearch);
  // ===========

  function handleSearch() {
    CURRENT_PRODUCTS_LIST = PRODUCTS_LIST.filter(function (product) {
      const typedIngredients = input.value
        .split(",")
        .map((el) => el.trim())
        .filter((el) => el.length);

      return typedIngredients.every((el) => product.ingredients.includes(el));
    });
    if (CURRENT_PRODUCTS_LIST.length) {
      document.querySelector(".error").setAttribute("hidden", true);
    } else {
      renderErrorMessage("emptyError");
    }
    renderProducts();
  }

  // ===========

  const basketMobile = document.querySelector(".basket__mobile");

  const basket = document.querySelector(".basket");
  basketMobile.addEventListener("click", () =>
    basket.classList.add("basket--open")
  );
  const buttonMobile = document.querySelector(".button-mobile");
  buttonMobile.addEventListener("click", () =>
    basket.classList.remove("basket--open")
  );
}

// Render products
function renderProducts() {
  sortCurrentList();
  const list = document.querySelector(".products__list");
  list.innerHTML = "";

  CURRENT_PRODUCTS_LIST.forEach((element) => {
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
          <div class="product__ingredients">${element.ingredients.join(
            ", "
          )}</div>
          <button class="button button--add" data-product-id="${
            element.id
          }">zamów</button>
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
        <div class="basket__item-options"><button class="button button--remove" data-basket-id="${
          product.id
        }">usuń</button></div>
      </div>`
    );
  });

  renderBasketSum();
  renderSmallBasketQuantity();
  handleBasketState();
  addBasketListeners();
  clearBasketListener();
}

// Handle visibility of basket layout on empty/not-empty state
function handleBasketState() {
  const basketElement = document.querySelector(".basket");

  if (BASKET.length) {
    basketElement.classList.remove("basket--empty");
  } else {
    basketElement.classList.add("basket--empty");
  }
}

// Render summary price of all products in basket
function renderBasketSum() {
  const basketFooterPrice = document.querySelector(".basket__footer-price");
  let sum = 0;

  BASKET.forEach((product) => {
    sum = sum + product.price * product.quantity;
  });

  basketFooterPrice.textContent = `${sum.toFixed(2)} zł`;

  const basketMobilePrice = document.querySelector(".basket__mobile-price");
  basketMobilePrice.textContent = `${sum.toFixed(2)} zł`;
}

function renderSmallBasketQuantity() {
  const basketMobileQuantity = document.querySelector(
    ".basket__mobile-quantity"
  );
  let quantity = 0;

  BASKET.forEach((product) => {
    quantity += product.quantity;
  });

  basketMobileQuantity.textContent = `${quantity} szt.`;
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

  button.addEventListener("click", () =>
    productsList.classList.toggle("products__list--center")
  );
}

// Add click listeners to products
function addProductListeners() {
  const buttons = document.querySelectorAll(".product .button");
  buttons.forEach((button) => button.addEventListener("click", addToBasket));
}

// Render error message and hide basket on error
function renderErrorMessage(type) {
  const errorMessage = document.querySelector(".error");
  const basket = document.querySelector(".basket");
  if (type === "emptyError") {
    errorMessage.textContent = "Nie mamy produktu z wpisanymi składnikami";
  }

  if (type === "appError") {
    errorMessage.removeAttribute("hidden");
    basket.setAttribute("hidden", "true");
  }
}

// Add sorting dropdown listener
function addsortCurrentListener() {
  const dropdown = document.querySelector(".sort__array");

  dropdown.addEventListener("change", renderProducts);
}

function clearBasketListener() {
  const buttonClear = document.querySelector(".button--clear");
  buttonClear.addEventListener("click", clearBasket);
}
// filtrowanie

/*******************************
 * EVENT HANDLERS
 *******************************/

function clearBasket() {
  BASKET = [];
  saveBasketInLocalStorage();
  renderBasket();
}

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

  saveBasketInLocalStorage();

  renderBasket();
}
// local storage

function saveBasketInLocalStorage() {
  console.log(JSON.stringify(BASKET));
  localStorage.setItem("userBasket", JSON.stringify(BASKET));
}
function getBaskettFromLocalStorage() {
  console.log(localStorage.getItem("userBasket"));
  return JSON.parse(localStorage.getItem("userBasket"));
}

function isProductInList(list, productId) {
  return list.find((el) => el.id === productId);
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

  saveBasketInLocalStorage();
  renderBasket();
}
function sortCurrentList() {
  const sorterElement = document.querySelector(".sort__array");
  const sorterValue = sorterElement.options[sorterElement.selectedIndex].value;

  if (sorterValue === "z-a") {
    CURRENT_PRODUCTS_LIST.sort((x, y) => y.title.localeCompare(x.title));
  } else if (sorterValue === "cena rosnąco") {
    CURRENT_PRODUCTS_LIST.sort((x, y) => parseInt(x.price) - parseInt(y.price));
  } else if (sorterValue === "cena malejąco") {
    CURRENT_PRODUCTS_LIST.sort((x, y) => parseInt(y.price) - parseInt(x.price));
  } else {
    CURRENT_PRODUCTS_LIST.sort((x, y) => x.title.localeCompare(y.title));
  }
}

/*******************************
 * CODE EXECUTE
 *******************************/

let BASKET = getBaskettFromLocalStorage() || [];
// let BASKET = [];
let PRODUCTS_LIST = [];
let CURRENT_PRODUCTS_LIST = [];

appStart();
