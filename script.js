document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector(".menu_toggle");
  const navList = document.querySelector(".div_list");
  const searchBar = document.querySelector(".search_bar");

  menuBtn.addEventListener("click", () => {
    navList.classList.toggle("active");
    searchBar.classList.toggle("active");
  });

  function getFavorites() {
    const favorites = localStorage.getItem("favorites");
    return favorites ? JSON.parse(favorites) : [];
  }

  function saveFavorites(favorites) {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }

  function addToFavorites(product) {
    let favorites = getFavorites();
    const existingIndex = favorites.findIndex(fav => fav.id === product.id);
    
    if (existingIndex === -1) {
      favorites.push(product);
      saveFavorites(favorites);
      return true; 
    }
    return false;
  }

  function removeFromFavorites(productId) {
    let favorites = getFavorites();
    favorites = favorites.filter(fav => fav.id !== productId);
    saveFavorites(favorites);
  }

  function isInFavorites(productId) {
    const favorites = getFavorites();
    return favorites.some(fav => fav.id === productId);
  }

  function toggleFavorite(product, button) {
    const isFavorited = isInFavorites(product.id);
    
    if (isFavorited) {
      removeFromFavorites(product.id);
      button.classList.remove("favorited");
      button.querySelector("i").className = "fa-regular fa-heart";
      button.title = "Add to favorites";
      button.setAttribute("aria-label", "Add to favorites");
    } else {
      addToFavorites(product);
      button.classList.add("favorited");
      button.querySelector("i").className = "fa-solid fa-heart";
      button.title = "Remove from favorites";
      button.setAttribute("aria-label", "Remove from favorites");
    }
  }

  async function fetchProducts() {
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      const products = await response.json();
      return products;
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }

  function displayProducts(products) {
    const productContainer = document.querySelector(".product_container");
    productContainer.innerHTML = "";

    products.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.classList.add("product_card");

      const isFavorited = isInFavorites(product.id);
      const heartIcon = isFavorited ? "fa-solid fa-heart" : "fa-regular fa-heart";
      const favoritedClass = isFavorited ? "favorited" : "";
      const favoriteTitle = isFavorited ? "Remove from favorites" : "Add to favorites";

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
            <button
              class="icon_btn favorite ${favoritedClass}"
              title="${favoriteTitle}"
              aria-label="${favoriteTitle}"
            >
              <i class="${heartIcon}" aria-hidden="true"></i>
            </button>
            <button
              class="icon_btn cart"
              title="Add to cart"
              aria-label="Add to cart"
            >
              <i class="fa-solid fa-cart-shopping" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      `;

      const favoriteBtn = productCard.querySelector(".favorite");
      favoriteBtn.addEventListener("click", () => {
        toggleFavorite(product, favoriteBtn);
      });

      productContainer.appendChild(productCard);
    });
  }

  const viewAllButton = document.querySelector(".view_all_button");
  let showingAllProducts = false;

  viewAllButton.addEventListener("click", async () => {
    const products = await fetchProducts();
    if (showingAllProducts) {
      displayProducts(products.slice(0, 8));
      viewAllButton.textContent = "View All Products";
    } else {
      displayProducts(products);
      viewAllButton.textContent = "Collapse Products";
    }
    showingAllProducts = !showingAllProducts;
  });

  async function main() {
    const products = await fetchProducts();
    displayProducts(products.slice(0, 8));
  }

  main();
});
