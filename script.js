document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector(".menu_toggle");
  const navList = document.querySelector(".div_list");
  const searchBar = document.querySelector(".search_bar");

  menuBtn.addEventListener("click", () => {
    navList.classList.toggle("active");
    searchBar.classList.toggle("active");
  });

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
              class="icon_btn favorite"
              title="Add to favorites"
              aria-label="Add to favorites"
            >
              <i class="fa-regular fa-heart" aria-hidden="true"></i>
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
