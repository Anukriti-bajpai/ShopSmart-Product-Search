🌐 **Live Website:** [Visit ShopSmart](https://shopsmart-product-search.onrender.com)
# ShopSmart - Online Shopping Product Search

A Python-based online shopping product management and search system using Binary Search Tree (BST) and AVL Tree data structures.

## Project Overview

ShopSmart is a product search application that allows users to add, search, update, delete, and display products. It uses an AVL Tree to maintain products efficiently based on their unique product IDs.

The project also includes a Flask-based web interface and a separate BST implementation for comparison and testing.

## Features

- Add new products with ID, name, price, and category.
- Search products by unique product ID.
- Search products by product name.
- Update product prices.
- Delete products.
- Display products sorted by ID or price.
- Store product information in a JSON file.
- Maintain balanced tree structure using AVL rotations.
- Access product management features through a Flask web interface.
- Unit tests for BST and AVL Tree operations.

## Technologies Used

- Python
- Flask
- HTML
- CSS
- JavaScript
- JSON
- Binary Search Tree (BST)
- AVL Tree
- Unittest

## Project Structure

```text
OnlineShoppingProductSearch/
│
├── main.py
├── product.py
├── bst.py
├── avl.py
├── storage.py
├── app.py
│
├── templates/
│   └── index.html
│
├── static/
│   ├── style.css
│   └── script.js
│
├── tests/
│   └── test_products.py
│
├── data/
│   └── products.json
│
├── README.md
└── .gitignore
```

## How to Run

### 1. Install Flask

```bash
pip install flask
```

### 2. Run the Console Application

```bash
python main.py
```

### 3. Run the Web Application

```bash
python app.py
```

Open the following address in your browser:

```text
http://127.0.0.1:5000
```

## Data Structure Implementation

### Binary Search Tree (BST)

A BST stores products according to their product IDs. Each node contains a product and references to its left and right child nodes.

### AVL Tree

An AVL Tree is a self-balancing Binary Search Tree. It maintains balance using four rotations:

- LL Rotation
- RR Rotation
- LR Rotation
- RL Rotation

The AVL Tree is used as the primary data structure in the application.

## Time Complexity

| Operation | BST Average | AVL Tree |
|---|---:|---:|
| Insertion | O(log n) | O(log n) |
| Searching | O(log n) | O(log n) |
| Deletion | O(log n) | O(log n) |

**Note:** An ordinary BST can take O(n) time in the worst case. AVL Tree operations remain O(log n) because the tree stays balanced.

## Testing

Run the unit tests from the project root:

```bash
python -m unittest discover -s tests -v
```

## Future Improvements

- Add price-range filtering.
- Add sorting and filtering options to the web interface.
- Improve the user interface.
- Add user authentication.
- Deploy the application online.

## Author

Developed as a Python Data Structures and Algorithms project.
