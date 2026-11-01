// ShopSmart - Frontend JavaScript

const productsContainer = document.getElementById("productsContainer");
const productForm = document.getElementById("productForm");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const showAllButton = document.getElementById("showAllButton");
const message = document.getElementById("message");


// Display products on the webpage
function displayProducts(products) {
    productsContainer.innerHTML = "";

    if (products.length === 0) {
        productsContainer.innerHTML = "<p>No products found.</p>";
        return;
    }

    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        const title = document.createElement("h3");
        title.textContent = product.name;

        const id = document.createElement("p");
        id.textContent = "Product ID: " + product.product_id;

        const price = document.createElement("p");
        price.className = "product-price";
        price.textContent = "₹" + Number(product.price).toFixed(2);

        const category = document.createElement("p");
        category.textContent = "Category: " + product.category;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete Product";
        deleteButton.className = "delete-button";

        deleteButton.addEventListener("click", () => {
            deleteProduct(product.product_id);
        });

        card.appendChild(title);
        card.appendChild(id);
        card.appendChild(price);
        card.appendChild(category);
        card.appendChild(deleteButton);

        productsContainer.appendChild(card);
    });
}


// Load all products from Flask
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


// Add a new product
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


// Search products by name
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


// Show all products
showAllButton.addEventListener("click", () => {
    searchInput.value = "";
    message.textContent = "";
    loadProducts();
});


// Delete a product
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


// Load products when the webpage opens
loadProducts();


