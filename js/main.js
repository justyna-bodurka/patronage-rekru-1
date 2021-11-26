let BASKET = [];
let PRODUCTS_LIST = [];

fetch(
  "https://raw.githubusercontent.com/alexsimkovich/patronage/main/api/data.json"
)
  .then((resp) => resp.json())
  .then((resp) => initialize(resp))
  .catch(() => renderErrorMessage());

function initialize(array) {
  PRODUCTS_LIST = array;

  renderProducts();
  addProductListeners();
  addLayoutChangeListeners();
}

function addProductListeners() {
  const buttons = document.querySelectorAll(".product .button");
  buttons.forEach((button) => button.addEventListener("click", addToBasket));
}

function renderProducts() {
  console.log(PRODUCTS_LIST);
  PRODUCTS_LIST.forEach((element) => {
    const list = document.querySelector(".products__list");

    list.insertAdjacentHTML(
      "beforeend",
      `
      <div class="product">
        <div  class="product__image" style="background-image: url('${
          element.image
        }');"></div>
        <div class="product__desc">
          <div class="product__title">${element.title}</div>
          <div class="product__price">${element.price.toFixed(2)} zł</div>
          <div class="product__ingredients">${element.ingredients.join(
            ", "
          )}</div>

          <button class="button button--green" data-product-id="${
            element.id
          }">zamów</button>
      </div>
    </div> `
    );
  });
}

function addToBasket(e) {
  console.log(e.target);
  const productId = parseInt(e.target.getAttribute("data-product-id"));
  const product = PRODUCTS_LIST.find((el) => el.id === productId);

  if (!product) return alert("coś poszło nie tak");

  const productInBasket = BASKET.find((el) => el.id === productId);

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
    <div class="basket__item-options"><button class="button button--red" data-basket-id="${
      product.id
    }">usuń</button></div>
  </div>`
    );
  });

  let sum = 0;
  BASKET.forEach((product) => {
    sum = sum + product.price * product.quantity;
  });

  basketFooterPrice = document.querySelector(".basket__footer-price");
  basketFooterPrice.innerHTML = `${sum.toFixed(2)} zł`;

  const basketEmpty = document.querySelector(".bakset__empty");
  const basketFooter = document.querySelector(".basket__footer");
  if (BASKET.length) {
    basketFooter.removeAttribute("hidden");
    basketEmpty.setAttribute("hidden", "true");
  } else {
    basketEmpty.removeAttribute("hidden");
    basketFooter.setAttribute("hidden", "true");
  }

  addBasketListeners();
}

function addBasketListeners() {
  const buttonsRemove = document.querySelectorAll(".button--red");
  buttonsRemove.forEach((button) =>
    button.addEventListener("click", removeFromBasket)
  );
}

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

function addLayoutChangeListeners() {
  const buttonNav = document.querySelector(".button--vintage");

  buttonNav.addEventListener("click", () => {
    const nav = document.querySelector(".products__list");
    nav.classList.toggle("products__list--center");
  });
}

function renderErrorMessage() {
  const errorMessage = document.querySelector(".products__list-error");
  errorMessage.removeAttribute("hidden");
  errorMessage.innerHTML =
    "Problem techniczny. <br>Jeśli chcesz zamówić pizzę zadzwoń do nas:<br> 500 700 700.";
  const basket = document.querySelector(".basket");
  basket.setAttribute("hidden", "true");
}
