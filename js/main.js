fetch("https://raw.githubusercontent.com/alexsimkovich/patronage/main/api/data.json")
  .then((resp) => resp.json())
  .then((resp) => initialize(resp))
  .catch((error) => {
    console.log("nie udało się pobrać");
  });

function initialize(array) {
  console.log(array);
  array.forEach((element) => {
    const list = document.querySelector(".products-list");
    list.insertAdjacentHTML("beforeend",`
      <div class="product">
        <div  class="product__image" style="background-image: url('${element.image}');"></div>
        <div class="product__desc">
          <div class="product__title">${element.title}</div>
          <div class="product__price">${element.price}</div>
          <div class="product__ingredients">${element.ingredients.join(", ")}</div>

          <button class="button">zamów</button>
      </div>
    </div> `);
  });
}
