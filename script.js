document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector(".menu_toggle");
  const navList = document.querySelector(".div_list");
  const searchBar = document.querySelector(".search_bar");

  menuBtn.addEventListener("click", () => {
    navList.classList.toggle("active");
    searchBar.classList.toggle("active");
  });
});

async function fetchData() {
  const response = await fetch("https://fakestoreapi.com/products/1");
  const data = await response.json();
  return data;
}

async function main() {
  data = await fetchData();
  console.log(data["category"]);
}

main();
