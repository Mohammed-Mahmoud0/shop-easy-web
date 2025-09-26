document.addEventListener("DOMContentLoaded", () => {
  const favoritesContainer = document.querySelector(".favorites_container");
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

  function getCartItems() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }

  function saveCartItems(cartItems) {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }

  function createFavoriteCard(product) {
    const card = document.createElement("div");
    card.classList.add("product_card");

    const cartItems = getCartItems();
    const isInCart = cartItems.some((item) => item.id === product.id);

    card.innerHTML = `
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
          <button class="icon_btn favorite active" title="Remove from favorites">
            <i class="fa-solid fa-heart"></i>
          </button>
          <button class="icon_btn cart ${isInCart ? "active" : ""}" title="${
      isInCart ? "In Cart" : "Add to cart"
    }">
            <i class="fa-solid fa-cart-shopping" style="color: ${isInCart ? "green" : "gray"};"></i>
          </button>
        </div>
      </div>
    `;

    const favBtn = card.querySelector(".favorite");
    favBtn.addEventListener("click", () => {
      let favorites = getFavorites().filter((fav) => fav.id !== product.id);
      saveFavorites(favorites);
      displayFavorites();
    });

    const cartBtn = card.querySelector(".cart");
    cartBtn.addEventListener("click", () => {
      if (isInCart) {
        const updatedCart = cartItems.filter((item) => item.id !== product.id);
        saveCartItems(updatedCart);
      } else {
        cartItems.push(product);
        saveCartItems(cartItems);
      }
      displayFavorites();
    });

    return card;
  }

  function filterFavoritesBySearch(query) {
    const allFavorites = getFavorites();
    if (!query) return allFavorites;

    return allFavorites.filter(
      (product) =>
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );
  }

  function displayFavorites(filteredFavorites = null) {
    favoritesContainer.innerHTML = "";
    const favorites = filteredFavorites || getFavorites();
    if (favorites.length === 0) {
      favoritesContainer.innerHTML = `
        <div class="empty_favorites" style="text-align: center; padding: 20px; margin-top: 50px;margin-bottom: 50px;">
          <p>No favorites yet 💔 start browsing products to add some</p>
          <button onclick="location.href='index.html#products'" class="shop_now_button" style="margin-top: 60px; ">
            Browse Products
          </button>
        </div>
      `;
      return;
    }
    favorites.forEach((product) => {
      favoritesContainer.appendChild(createFavoriteCard(product));
    });
  }

  displayFavorites();

  const searchInput = document.querySelector(".search_input");
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value;
    const filteredFavorites = filterFavoritesBySearch(query);
    displayFavorites(filteredFavorites);
    if (filteredFavorites.length === 0) {
      favoritesContainer.innerHTML = `
        <div class="no_results" style="text-align: center; padding: 20px; margin-top: 50px;margin-bottom: 50px;">
          <p>No favorites match your search. 😞</p>
        </div>
      `;
    }
  });
});
