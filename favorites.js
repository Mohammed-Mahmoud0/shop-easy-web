document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector(".menu_toggle");
  const navList = document.querySelector(".div_list");
  const searchBar = document.querySelector(".search_bar");


  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      navList.classList.toggle("active");
      searchBar.classList.toggle("active");
    });
  }


  function getFavorites() {
    const favorites = localStorage.getItem("favorites");
    return favorites ? JSON.parse(favorites) : [];
  }

 
  function saveFavorites(favorites) {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }

  
  function removeFromFavorites(productId) {
    let favorites = getFavorites();
    favorites = favorites.filter(fav => fav.id !== productId);
    saveFavorites(favorites);
    displayFavorites(); 
  }

  function displayFavorites() {
    const favoritesContainer = document.getElementById("favoritesContainer");
    const noFavorites = document.getElementById("noFavorites");
    const favorites = getFavorites();

    favoritesContainer.innerHTML = "";
    

    if (favorites.length === 0) {
      noFavorites.style.display = "block";
      favoritesContainer.appendChild(noFavorites);
      return;
    }

    noFavorites.style.display = "none";

    favorites.forEach((product) => {
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
            <button
              class="icon_btn favorite favorited"
              title="Remove from favorites"
              aria-label="Remove from favorites"
              data-product-id="${product.id}"
            >
              <i class="fa-solid fa-heart" aria-hidden="true"></i>
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
        removeFromFavorites(product.id);
      });

      favoritesContainer.appendChild(productCard);
    });
  }

  displayFavorites();
});