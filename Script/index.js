let foodItems = [];
let cardsHTML="";

async function fetchFoodItems() {
  try {
    const response = await fetch("./foodItems.json");

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const foodItems =await response.json();
    console.log("Food items fetched successfully:", foodItems);
    displayItems(foodItems);
  } catch (error) {
    console.error("Error fetching food items:", error);
  }
}

function displayItems(foodItems){

    const categories = {
        bestSellers: [],    
        trending: [],
        starter: [],    
        beverages: [],
        "main-course": []
    };
    foodItems.forEach((item)=>{
        if(item.best_seller === "yes"){
            categories["bestSellers"].push(item);
        }
        if(item.trending === "yes"){
            categories["trending"].push(item);
        }   
        let cat = item.category.toLowerCase().replace(" ", "-");
        categories[cat].push(item); 
    });
    console.log("Categories populated:", categories);
    let allCategoriesHTML = "";
    for (const category in categories) {
        console.log("Processing category:", category);
    const cardsHTML = categories[category]
        .map((item) => createMenuItem(item))
        .join("");
    allCategoriesHTML += renderSection(
        category.charAt(0).toUpperCase() + category.slice(1),
        cardsHTML
    );
        
    }
    // const categoryContainer = document.getElementById('menu');
    const categoryContainer = document.getElementById("menu1");
    categoryContainer.innerHTML = allCategoriesHTML;
}
function createMenuItem(item) {
    return `<div class="menu-card">
            <a href="productdetail.html"><img
              src="${item.imageurl}"
              alt="${item.title}"
            /></a>
            <div class="menu-card-content">
              <h4>${item.title}</h4>
              <p>${item.description}</p>
              <span
                >Price: <strike class="strike-price">$${item.actual_price}</strike> $${item.selling_price}
                <span style="color: rgb(243, 57, 57); font-size: 13px"
                  >10% off</span
                ></span
              >
            </div>
            <div class="add-to-cart-btn">
              <button class="cta-button">Add to Cart</button>
            </div>
          </div>`;
}

function renderSection(category, cardsHTML) {
    return `<div class="menu-category" id="${category.toLowerCase()}">
        <div class="category-header">
          <h3>${category}</h3>
          <button class="view-all-btn">view all</button>
        </div>
        <div class="menu-items">
        
            ${cardsHTML}
           
        </div>
      </div>
        `;
}
fetchFoodItems();
