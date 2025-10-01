document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector(".menu_toggle");
  const navList = document.querySelector(".div_list");

  menuBtn.addEventListener("click", () => {
    navList.classList.toggle("active");
  });

  function getCartItems() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }

  function calculateTotalPrice() {
    const cartItems = getCartItems();
    let totalPrice = 0;
    cartItems.forEach((item) => {
      totalPrice += item.price * (item.quantity || 1);
    });
    return totalPrice.toFixed(2);
  }

  function displayOrderSummary() {
    const summaryItems = document.querySelector(".summary_items");
    const summaryTotal = document.querySelector(".summary_total");
    const cartItems = getCartItems();

    if (cartItems.length === 0) {
      summaryItems.innerHTML = "<p>No items in cart</p>";
      summaryTotal.innerHTML = "<h4>Total: $0.00</h4>";
      return;
    }

    summaryItems.innerHTML = "";
    cartItems.forEach((item) => {
      const itemElement = document.createElement("div");
      itemElement.classList.add("summary_item");
      itemElement.innerHTML = `
        <div class="item_info">
          <span class="item_name">${item.title}</span>
          <span class="item_details">Qty: ${item.quantity || 1} × $${item.price}</span>
        </div>
        <span class="item_total">$${((item.quantity || 1) * item.price).toFixed(2)}</span>
      `;
      summaryItems.appendChild(itemElement);
    });

    summaryTotal.innerHTML = `<h4>Total: $${calculateTotalPrice()}</h4>`;
  }

  function handleFormSubmission() {
    const form = document.getElementById("checkoutForm");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const address = document.getElementById("address").value;

      if (!name || !email || !address) {
        alert("Please fill in all fields!");
        return;
      }

      // Clear the cart
      localStorage.removeItem("cart");
      
      alert(`Thank you ${name}! Your order has been placed successfully. We will send confirmation to ${email}.`);
      
      // Redirect to home page
      window.location.href = "index.html";
    });
  }

  // Initialize the page
  displayOrderSummary();
  handleFormSubmission();

  // If cart is empty, redirect to cart page
  if (getCartItems().length === 0) {
    alert("Your cart is empty!");
    window.location.href = "cart.html";
  }
});