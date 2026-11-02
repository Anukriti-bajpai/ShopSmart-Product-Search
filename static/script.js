
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

// Cart elements
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");


// ==========================================
// Shopping Cart Data
// ==========================================

// Load saved cart from localStorage
let cart = [];

try {
    cart = JSON.parse(localStorage.getItem("shopSmartCart")) || [];
} catch (error) {
    cart = [];
}


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

    if (name.includes("headphone") || name.includes("headset")) {
        return "/static/images/headphones.jpeg";
    }

    if (name.includes("mouse")) {
        return "/static/images/mouse.jpeg";
    }

    if (name.includes("watch")) {
        return "/static/images/watch.jpeg";
    }

    if (name.includes("laptop")) {
        return "/static/images/laptop.jpg";
    }

    // Default image
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

        // Add to Cart button
        const addToCartButton = document.createElement("button");
        addToCartButton.textContent = "Add to Cart";
        addToCartButton.className = "add-to-cart-button";

        addToCartButton.addEventListener("click", () => {
            addToCart(product);
        });

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
        card.appendChild(addToCartButton);
        card.appendChild(deleteButton);

        productsContainer.appendChild(card);

    });
}


// ==========================================
// Add product to Cart
// ==========================================

function addToCart(product) {

    const existingItem = cart.find(item =>
        String(item.product_id) === String(product.product_id)
    );

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            product_id: product.product_id,
            name: product.name,
            price: Number(product.price),
            category: product.category,
            quantity: 1
        });

    }

    saveCart();

    message.textContent = product.name + " added to cart!";
}


// ==========================================
// Save Cart in localStorage
// ==========================================

function saveCart() {

    localStorage.setItem("shopSmartCart", JSON.stringify(cart));

    updateCart();
}


// ==========================================
// Display Cart Items
// ==========================================

function updateCart() {

    cartItems.innerHTML = "";

    // Calculate total number of items
    const totalItems = cart.reduce((sum, item) =>
        sum + item.quantity, 0
    );

    cartCount.textContent = totalItems;

    // Empty cart message
    if (cart.length === 0) {

        cartItems.textContent = "Your cart is empty.";

        cartTotal.textContent = "0.00";

        return;
    }

    let totalPrice = 0;

    cart.forEach(item => {

        const itemTotal = item.price * item.quantity;

        totalPrice += itemTotal;

        // Cart item container
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        // Product name
        const name = document.createElement("h3");
        name.textContent = item.name;

        // Product price
        const price = document.createElement("p");
        price.textContent = "Price: ₹" + item.price.toFixed(2);

        // Quantity
        const quantity = document.createElement("p");
        quantity.textContent = "Quantity: " + item.quantity;

        // Quantity controls
        const quantityControls = document.createElement("div");
        quantityControls.className = "quantity-controls";

        // Decrease quantity button
        const decreaseButton = document.createElement("button");
        decreaseButton.textContent = "-";

        decreaseButton.addEventListener("click", () => {
            changeQuantity(item.product_id, -1);
        });

        // Increase quantity button
        const increaseButton = document.createElement("button");
        increaseButton.textContent = "+";

        increaseButton.addEventListener("click", () => {
            changeQuantity(item.product_id, 1);
        });

        quantityControls.appendChild(decreaseButton);
        quantityControls.appendChild(increaseButton);

        // Item subtotal
        const subtotal = document.createElement("p");
        subtotal.textContent = "Subtotal: ₹" + itemTotal.toFixed(2);

        // Remove button
        const removeButton = document.createElement("button");
        removeButton.textContent = "Remove";
        removeButton.className = "remove-cart-button";

        removeButton.addEventListener("click", () => {
            removeFromCart(item.product_id);
        });

        // Add everything to cart item
        cartItem.appendChild(name);
        cartItem.appendChild(price);
        cartItem.appendChild(quantity);
        cartItem.appendChild(quantityControls);
        cartItem.appendChild(subtotal);
        cartItem.appendChild(removeButton);

        cartItems.appendChild(cartItem);

    });

    // Update total price
    cartTotal.textContent = totalPrice.toFixed(2);
}


// ==========================================
// Change Product Quantity
// ==========================================

function changeQuantity(productId, change) {

    const item = cart.find(item =>
        String(item.product_id) === String(productId)
    );

    if (!item) {
        return;
    }

    item.quantity += change;

    // Remove item if quantity becomes zero
    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    saveCart();
}


// ==========================================
// Remove Product from Cart
// ==========================================

function removeFromCart(productId) {

    cart = cart.filter(item =>
        String(item.product_id) !== String(productId)
    );

    saveCart();
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

        // Also remove the deleted product from the cart
        removeFromCart(productId);

        message.textContent = "Product deleted successfully!";

        loadProducts();

    } catch (error) {

        message.textContent = error.message;

    }

}


// ==========================================
// Initialize Cart and Load Products
// ==========================================

updateCart();

loadProducts();

