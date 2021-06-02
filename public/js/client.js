const parent = document.querySelector(".parent");
const { editForm } = document;
const addToCart = document.querySelector("#addToCartBtn");

//delete product
parent?.addEventListener("click", async (event) => {
  // console.log(event.target.id);
  if (event.target.id === "deleteBtn") {
    const prodDivId = event.target.parentElement.id;
    console.log(prodDivId);
    const response = await fetch(`/homepage/${prodDivId}`, {
      method: "DELETE",
    });
    if (response.status === 200) {
      event.target.parentElement.remove();
    }
  }
});

//edit product
editForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  // console.log(event.target.id);
  // if (e.target.id === "editProdBtn") {
  const data = Object.fromEntries(new FormData(editForm).entries());
  const prodDivId = e.target.id;
  console.log(data);
  const response = await fetch(`/homepage/edit/${prodDivId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (response.status === 200) {
    window.location.replace("/homepage/myProducts");
  }
});

//add product to the users cart
parent?.addEventListener("click", async (e) => {
  if (e.target.id === "addToCartBtn") {
    const prodDivId = e.target.parentElement.parentElement.parentElement.id;
    const response = await fetch(`/homepage/addToCart/${prodDivId}`, {
      method: "GET",
    });
  }
});
