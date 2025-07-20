let foodItems = [];

async function fetchFoodItems() {
  try {
    const response = await fetch("foodItems.json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    foodItems = await response.json();
    console.log(foodItems);
    populateMenu();
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

function populateMenu() {
  const categories = {
    bestSellers: [],
    trending: [],
    starter: [],
    beverages: [],
    "main-course": [],
  };

  foodItems.forEach((item) => {
    //is the item in the bestSellers category?
    if (item.best_seller === "yes") {
      categories["bestSellers"].push(item);
    }

    //is the item in the trending category?
    if (item.trending === "yes") {
      categories["trending"].push(item);
    }

    //put it in appropriate category
    let cat = item.category.toLowerCase().replace(" ", "-");

    // main course  -> main-course

    categories[cat].push(item);
  });
  for (const category in categories) {
    const categoryContainer = document.getElementById(category);
    // console.log(categoryContainer);

    const innerHTML = categories[category]
      .map((item) => createMenuItem(item))
      .join("");
    console.log(typeof innerHTML);

    categoryContainer.querySelector(".ourmenu-items").innerHTML = innerHTML;
  }
}

function createMenuItem(item) {
  const html = `<div class="ourmenu-card">
            <a href="productdetail.html"><img
              src="${item.imageurl}"
              alt="${item.title}"
            /></a>
            <div class="menu-card-content">
              <h4>${item.title}</h4>
              <p>${item.description}</p>
              <span
                >Price: <strike class="strike-price">$${item.actual_price}</strike> $${item.selling_price}</span
              </span>
            </div>
            <div onClick="addtoCart('${item.id}', '${item.selling_price}', '${item.title}', '${item.imageurl}')" class="add-to-cart-btn">
              <button class="cta-button">Add to Cart</button>
            </div>
    </div>`;

  return html;
}

fetchFoodItems();

function searchItems(query) {
  const searchContainer = document
    .getElementById("search-items")
    .querySelector(".ourmenu-items");
  searchContainer.innerHTML = ""; // Clear previous search results
  console.log(`Search item:- ${foodItems}`);

  if (query.length === 0) return;

  const filteredItems = foodItems.filter(
    (item) => item.title.toLowerCase().includes(query.toLowerCase())
    // || item.description.toLowerCase().includes(query.toLowerCase())
  );
  if (filteredItems.length === 0) {
    searchContainer.innerHTML = "<p>No items found</p>";
  } else {
    const searchHTML = filteredItems
      .map((item) => createMenuItem(item))
      .join("");
    searchContainer.innerHTML = searchHTML;
  }
}

let searchTimeout = null;
document.querySelector(".search-input").addEventListener("input", (event) => {
  const query = event.target.value;
  //searchItems(query);

  if (query) {
    if (searchTimeout) clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
      searchItems(query);
    }, 1000);
  }
});

function addtoCart(itemId, price, title, itemImageUrl) {
  console.log(
    `Item added to cart: ID=${itemId}, Price=$${price}, Title=${title}`
  );
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const itemIndex = cart.findIndex((item) => item.id === itemId);
  if (itemIndex > -1) {
    cart[itemIndex].quantity += 1;
  } else {
    cart.push({
      id: itemId,
      price: price,
      title: title,
      imageurl: itemImageUrl,
      quantity: 1,
    });
  }
  // Save the updated cart back to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Display success message
  showSuccessMessage(`${title} has been added to your cart!`);
}

// Function to display success message
function showSuccessMessage(message) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("success-message");
  messageDiv.textContent = message;
  document.body.appendChild(messageDiv);

  // Remove the message after 3 seconds
  setTimeout(() => {
    messageDiv.remove();
  }, 3000);
}
