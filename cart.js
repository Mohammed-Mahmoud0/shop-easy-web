document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.querySelector(".cart_container");
  const menuBtn = document.querySelector(".menu_toggle");
  const navList = document.querySelector(".div_list");
  const searchBar = document.querySelector(".search_bar");

  menuBtn.addEventListener("click", () => {
    navList.classList.toggle("active");
    searchBar.classList.toggle("active");
  });

  function getCartItems() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }

  function saveCartItems(cartItems) {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }

  function createCartItemCard(product) {
    const card = document.createElement("div");
    card.classList.add("product_card");

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
          <button class="icon_btn cart active" title="Remove from cart">
            <i class="fa-solid fa-cart-shopping"></i>
          </button>
          <button class="icon_btn favorite decrease" title="Decrease quantity">
            <i class="fa-solid fa-minus"></i>
          </button>
          <h4 style="margin: 5px 5px;">${product.quantity || 1}</h4>
          <button class="icon_btn cart increase" title="Increase quantity">
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>
        <div>
          <h4>Sub Total: ${(product.quantity || 1) * product.price}</h4>
        </div>
      </div>
    `;

    const cartBtn = card.querySelector(".cart");
    cartBtn.addEventListener("click", () => {
      let cartItems = getCartItems().filter((item) => item.id !== product.id);
      saveCartItems(cartItems);
      displayCartItems();
    });

    const decreaseBtn = card.querySelector(".decrease");
    decreaseBtn.addEventListener("click", () => {
      let cartItems = getCartItems();
      const itemIndex = cartItems.findIndex((item) => item.id === product.id);
      if (itemIndex !== -1 && cartItems[itemIndex].quantity > 1) {
        cartItems[itemIndex].quantity -= 1;
        saveCartItems(cartItems);
        displayCartItems();
      }
    });

    const increaseBtn = card.querySelector(".increase");
    increaseBtn.addEventListener("click", () => {
      let cartItems = getCartItems();
      const itemIndex = cartItems.findIndex((item) => item.id === product.id);
      if (itemIndex !== -1) {
        cartItems[itemIndex].quantity =
          (cartItems[itemIndex].quantity || 1) + 1;
        saveCartItems(cartItems);
        displayCartItems();
      }
    });

    return card;
  }

  function filterCartItemsBySearch(query) {
    const allCartItems = getCartItems();
    if (!query) return allCartItems;

    return allCartItems.filter(
      (product) =>
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );
  }

  function displayCartItems(filteredCartItems = null) {
    cartContainer.innerHTML = "";
    const cartItems = filteredCartItems || getCartItems();
    if (cartItems.length === 0) {
      cartContainer.innerHTML = `
        <div class="empty_cart" style="text-align: center; padding: 20px; margin-top: 50px;margin-bottom: 50px;">
          <p>Your cart is empty 🛒 start adding products to your cart</p>
          <button onclick="location.href='index.html#products'" class="shop_now_button" style="margin-top: 60px; ">
            Browse Products
          </button>
        </div>
      `;
      return;
    }
    cartItems.forEach((product) => {
      cartContainer.appendChild(createCartItemCard(product));
    });
    createTotalPriceItem();
  }

  function calculateTotalPrice() {
    const cartItems = getCartItems();
    let totalPrice = 0;
    cartItems.forEach((item) => {
      totalPrice += item.price * item.quantity;
    });
    return totalPrice.toFixed(2);
  }

  const totalPrice = document.createElement("div");
  totalPrice.classList.add("product_card", "total_price");
  function createTotalPriceItem() {
    totalPrice.innerHTML = `<h4>Total Price: ${calculateTotalPrice()}</h4>`;
    cartContainer.parentElement.appendChild(totalPrice);
  }

  displayCartItems();

  const searchInput = document.querySelector(".search_input");
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value;
    const filteredCartItems = filterCartItemsBySearch(query);
    displayCartItems(filteredCartItems);
    if (filteredCartItems.length === 0) {
      cartContainer.innerHTML = `
        <div class="no_results" style="text-align: center; padding: 20px; margin-top: 50px;margin-bottom: 50px;">
          <p>No cart items match your search. 😞</p>
        </div>
      `;
    }
  });
});
