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

  function getCartItems() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }

  function saveCartItems(cartItems) {
    localStorage.setItem("cart", JSON.stringify(cartItems));
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
    const cartItems = getCartItems();

    const visibleProducts = showAll ? products : products.slice(0, 8);

    visibleProducts.forEach((product) => {
      const isFavorite = favorites.some((fav) => fav.id === product.id);
      const isInCart = cartItems.some((item) => item.id === product.id);

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
          <button class="icon_btn cart ${isInCart ? "active" : ""}" 
                  title="${isInCart ? "In Cart" : "Add to cart"}">
            <i class="${"fa-solid fa-cart-shopping"}" style="color: ${
        isInCart ? "green" : "gray"
      };"></i>
          </button>
        </div>
      </div>
    `;

      const favBtn = productCard.querySelector(".favorite");
      favBtn.addEventListener("click", () => {
        if (isFavorite) {
          const updatedFavorites = favorites.filter(
            (fav) => fav.id !== product.id
          );
          saveFavorites(updatedFavorites);
        } else {
          favorites.push(product);
          saveFavorites(favorites);
        }
        displayProducts(products, showAll);
      });

      const cartBtn = productCard.querySelector(".cart");
      cartBtn.addEventListener("click", () => {
        if (isInCart) {
          const updatedCart = cartItems.filter(
            (item) => item.id !== product.id
          );
          saveCartItems(updatedCart);
        } else {
          cartItems.push(product);
          saveCartItems(cartItems);
        }
        displayProducts(products, showAll);
      });

      productContainer.appendChild(productCard);
    });
  }

  function getCategories(products) {
    const categories = new Set(products.map((product) => product.category));
    return Array.from(categories);
  }

  function getCategoryOptions(products) {
    const categories = getCategories(products);
    return categories
      .map((category) => `<option value="${category}">${category}</option>`)
      .join("");
  }

  fetchProducts().then((products) => {
    const categoryOptions = getCategoryOptions(products);
    categoryFilter.innerHTML =
      `<option value="all">All</option>` + categoryOptions;
  });

  function filterProductsByCategory() {
    const categoryFilter = document.getElementById("categoryFilter");
    categoryFilter.addEventListener("change", async () => {
      const products = await fetchProducts();
      const selectedCategory = categoryFilter.value;
      if (selectedCategory === "all") {
        displayProducts(products);
      } else {
        const filteredProducts = products.filter(
          (product) => product.category === selectedCategory
        );
        displayProducts(filteredProducts);
      }
    });
  }

  function filterProductsBySearch(products, query) {
    return products.filter(
      (product) =>
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );
  }

  async function main() {
    const products = await fetchProducts();
    let showAll = false;

    const toggleBtn = document.querySelector("#toggleProductsBtn");
    const searchInput = document.querySelector(".search_input");

    displayProducts(products, showAll);
    filterProductsByCategory();

    toggleBtn.addEventListener("click", () => {
      showAll = !showAll;
      toggleBtn.textContent = showAll ? "Show Less" : "View All Products";
      displayProducts(products, showAll);
    });

    searchInput.addEventListener("input", (event) => {
      const query = event.target.value;
      const filteredProducts = filterProductsBySearch(products, query);
      displayProducts(filteredProducts, true);
    });
  }

  main();
});
