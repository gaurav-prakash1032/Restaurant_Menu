function updateTotalPrice() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalPriceElement = document.getElementById("total-price");
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  totalPriceElement.textContent = total.toFixed(2);
}

function addItemToCart(itemId, title, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const itemIndex = cart.findIndex((item) => item.id === itemId);

  if (itemIndex > -1) {
    cart[itemIndex].quantity += 1;
  } else {
    cart.push({ id: itemId, title: title, price: price, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateTotalPrice();
  renderCart();
}

function incrementQuantity(itemId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const itemIndex = cart.findIndex(
    (item) => Number(item.id) === Number(itemId)
  );

  if (itemIndex > -1) {
    cart[itemIndex].quantity += 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    updateTotalPrice();
    renderCart();
  }
}

function decrementQuantity(itemId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const itemIndex = cart.findIndex((item) => {
    return Number(item.id) === Number(itemId);
  });

  if (itemIndex > -1) {
    if (cart[itemIndex].quantity > 1) {
      cart[itemIndex].quantity -= 1;
    } else {
      cart.splice(itemIndex, 1);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateTotalPrice();
    renderCart();
  }
}

function removeFromCart(itemId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((item) => item.id !== itemId);
  localStorage.setItem("cart", JSON.stringify(cart));

  updateTotalPrice(); // Update total after modifying the cart
  renderCart(); // Re-render to update the UI properly
}
function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartContainer = document.getElementById("cart-container");
  const emptyMessage = document.getElementById("empty-message");
  const cartTotal = document.getElementById("cart-total");
  let totalprice;
  // Clear existing content in the cart container
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    emptyMessage.style.display = "block";
    cartTotal.style.display = "none";
  } else {
    emptyMessage.style.display = "none";
    cartTotal.style.display = "block";

    cartContainer.innerHTML = cart
      .map(
        (item) => `
   
        <div class="cart-item">
            <div class="cart-item-details-left">
                <img src="${item.imageurl}" alt="${item.title}" />
                <div class="cart-item-details">
                    <h4>${item.title}</h4>
                    <p>Price: $${item.price}</p>
                    <p>Total: $${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    </div>
                    <div class="controls-container">
                        <div class="quantity-controls">
                            Quantity:
                            <button onclick="decrementQuantity(${
                              item.id
                            })">-</button>
                            <span>${item.quantity}</span>
                        <button onclick="incrementQuantity(${
                          item.id
                        })">+</button>
                    </div>
                    <button class="remove-button" onclick="removeFromCart(${
                      item.id
                    })">Remove</button>
                </div>
            </div>
            `
      )
      .join("");
  }
}
function openModal() {
  document.getElementById("seatModal").style.display = "block";
}

// Function to close the modal
function closeModal() {
  document.getElementById("seatModal").style.display = "none";
}

const cart = JSON.parse(localStorage.getItem("cart")) || []; //global variable
totalprice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
console.log(totalprice);
// Function to place the order
function placeOrder() {
  const seatNumber = document.getElementById("seatNumber").value;
  console.log(cart);
  if (seatNumber) {
    alert(`Order placed for seat number: ${seatNumber}`);
    const order = { cart: cart, totalprice: totalprice };
    localStorage.setItem("Order", JSON.stringify(order));
    closeModal(); // Close the modal after placing the order
  } else {
    alert("Please enter a seat number.");
  }
}

// Close the modal when clicking outside of it
window.onclick = function (event) {
  const modal = document.getElementById("seatModal");
  if (event.target === modal) {
    closeModal();
  }
};

document.addEventListener("DOMContentLoaded", function () {
  updateTotalPrice();
  renderCart();
});
