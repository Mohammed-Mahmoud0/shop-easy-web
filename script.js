document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector(".menu_toggle");
  const navList = document.querySelector(".div_list");
  const searchBar = document.querySelector(".search_bar");

  menuBtn.addEventListener("click", () => {
    navList.classList.toggle("active");
    searchBar.classList.toggle("active");
  });

  function getFavorites() {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  }

  function saveFavorites(favorites) {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }

  async function fetchProducts() {
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      return await response.json();
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }

  function displayProducts(products, showAll = false) {
    const productContainer = document.querySelector(".product_container");
    productContainer.innerHTML = "";

    const favorites = getFavorites();

    const visibleProducts = showAll ? products : products.slice(0, 8);

    visibleProducts.forEach((product) => {
      const isFavorite = favorites.some((fav) => fav.id === product.id);

      const productCard = document.createElement("div");
      productCard.classList.add("product_card");

      productCard.innerHTML = `
      <div class="product_image">
        <img src="${product.image}" alt="${product.title}" />
      </div>
      <div class="product_image_text">
        <h4 class="product_category">${product.category}</h4>
        <div class="product_meta">
          <span class="product_title">${product.title}</span>
          <span class="product_price">$${product.price}</span>
        </div>
        <div class="product_icons">
          <button class="icon_btn favorite ${isFavorite ? "active" : ""}" 
                  title="${
                    isFavorite ? "Remove from favorites" : "Add to favorites"
                  }">
            <i class="${isFavorite ? "fa-solid" : "fa-regular"} fa-heart"></i>
          </button>
          <button class="icon_btn cart" title="Add to cart">
            <i class="fa-solid fa-cart-shopping"></i>
          </button>
        </div>
      </div>
    `;

      const favBtn = productCard.querySelector(".favorite");
      favBtn.addEventListener("click", () => {
        let updatedFavorites = getFavorites();
        if (isFavorite) {
          updatedFavorites = updatedFavorites.filter(
            (fav) => fav.id !== product.id
          );
        } else {
          updatedFavorites.push(product);
        }
        saveFavorites(updatedFavorites);
        displayProducts(products, showAll);
      });

      productContainer.appendChild(productCard);
    });
  }

  async function main() {
    const products = await fetchProducts();
    let showAll = false;

    const toggleBtn = document.querySelector("#toggleProductsBtn");

    displayProducts(products, showAll);

    toggleBtn.addEventListener("click", () => {
      showAll = !showAll;
      displayProducts(products, showAll);
      toggleBtn.textContent = showAll ? "Show Less" : "View All Products";
      toggleBtn.style.padding = showAll ? "10px 50px" : "10px 20px";
    });
  }

  main();

  main();
});
