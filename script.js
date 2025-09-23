document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector(".menu_toggle");
  const navList = document.querySelector(".div_list");
  const searchBar = document.querySelector(".search_bar");

  menuBtn.addEventListener("click", () => {
    navList.classList.toggle("active");
    searchBar.classList.toggle("active");
  });
});
