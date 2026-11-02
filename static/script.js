
// ==========================================
// ShopSmart - Frontend JavaScript
// ==========================================

// Get HTML elements
const productsContainer = document.getElementById("productsContainer");
const productForm = document.getElementById("productForm");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const showAllButton = document.getElementById("showAllButton");
const message = document.getElementById("message");


// ==========================================
// Get product image based on product name
// ==========================================


function getProductImage(productName) {

    const name = productName.toLowerCase();

    if (name.includes("track")) {
        return "/static/images/tracksuit.jpeg";
    }

    if (name.includes("jean")) {
        return "/static/images/jeans.jpeg";
    }

    if (name.includes("bottle")) {
        return "/static/images/bottle.jpeg";
    }

    if (name.includes("shoe")) {
        return "/static/images/shoes.jpeg";
    }

    if (name.includes("headphone")) {
        return "/static/images/headphones.jpeg";
    }

    if (name.includes("mouse")) {
        return "/static/images/mouse.jpeg";
    }

    if (name.includes("laptop")) {
        return "/static/images/laptop.jpg";
    }

    return "/static/images/laptop.jpg";
}



// ==========================================
// Display products on the webpage
// ==========================================

function displayProducts(products) {

    productsContainer.innerHTML = "";

    if (products.length === 0) {
        productsContainer.innerHTML = "<p>No products found.</p>";
        return;
    }

    products.forEach(product => {

        const card = document.createElement("div");
        card.className = "product-card";

        // Product image
        const image = document.createElement("img");
        image.src = getProductImage(product.name);
        image.alt = product.name;
        image.className = "product-image";

        // Hide image if file is missing
        image.onerror = function() {
            this.style.display = "none";
        };

        // Product name
        const title = document.createElement("h3");
        title.textContent = product.name;

        // Product ID
        const id = document.createElement("p");
        id.textContent = "Product ID: " + product.product_id;

        // Product price
        const price = document.createElement("p");
        price.className = "product-price";
        price.textContent = "₹" + Number(product.price).toFixed(2);

        // Product category
        const category = document.createElement("p");
        category.textContent = "Category: " + product.category;

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete Product";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", () => {
            deleteProduct(product.product_id);
        });

        // Add elements to product card
        card.appendChild(image);
        card.appendChild(title);
        card.appendChild(id);
        card.appendChild(price);
        card.appendChild(category);
        card.appendChild(deleteButton);

        productsContainer.appendChild(card);

    });
}


// ==========================================
// Load all products from Flask
// ==========================================

async function loadProducts() {

    try {

        const response = await fetch("/api/products");

        if (!response.ok) {
            throw new Error("Could not load products.");
        }

        const products = await response.json();

        displayProducts(products);

    } catch (error) {

        message.textContent = error.message;

    }
}


// ==========================================
// Add a new product
// ==========================================

productForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const product = {

        product_id: document.getElementById("productId").value,
        name: document.getElementById("productName").value,
        price: document.getElementById("productPrice").value,
        category: document.getElementById("productCategory").value || "Other"

    };

    try {

        const response = await fetch("/api/products", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(product)

        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Could not add product.");
        }

        message.textContent = "Product added successfully!";

        productForm.reset();

        loadProducts();

    } catch (error) {

        message.textContent = error.message;

    }

});


// ==========================================
// Search products by name
// ==========================================

async function searchProducts() {

    const searchTerm = searchInput.value.trim().toLowerCase();

    try {

        const response = await fetch("/api/products");

        const products = await response.json();

        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm)
        );

        displayProducts(filteredProducts);

    } catch (error) {

        message.textContent = "Search failed: " + error.message;

    }

}


// Search button
searchButton.addEventListener("click", searchProducts);


// ==========================================
// Show all products
// ==========================================

showAllButton.addEventListener("click", () => {

    searchInput.value = "";

    message.textContent = "";

    loadProducts();

});


// ==========================================
// Delete a product
// ==========================================

async function deleteProduct(productId) {

    const confirmed = confirm("Are you sure you want to delete this product?");

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch(`/api/products/${productId}`, {

            method: "DELETE"

        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Could not delete product.");
        }

        message.textContent = "Product deleted successfully!";

        loadProducts();

    } catch (error) {

        message.textContent = error.message;

    }

}


// ==========================================
// Load products when webpage opens
// ==========================================

loadProducts();
