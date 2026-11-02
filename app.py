
from flask import Flask, jsonify, request, render_template

from product import Product
from avl import ProductAVL
from storage import load_products, save_products


app = Flask(__name__)

# Create AVL Tree
shop = ProductAVL()


# ==========================================
# Load Products from JSON Storage
# ==========================================

try:
    for product in load_products():
        shop.insert(product)

except (ValueError, KeyError, TypeError) as error:
    print("Error loading products:", error)


# ==========================================
# Home Page
# ==========================================

@app.route("/")
def home():
    return render_template("index.html")


# ==========================================
# Get All Products / Add Product
# ==========================================

@app.route("/api/products", methods=["GET", "POST"])
def products_api():

    if request.method == "GET":
        products = [p.to_dict() for p in shop.inorder()]
        return jsonify(products)

    data = request.get_json(silent=True) or {}

    try:
        product_id = int(data["product_id"])
        name = str(data["name"]).strip()
        price = float(data["price"])
        category = str(data.get("category", "Other")).strip() or "Other"

        if not name:
            return jsonify({
                "error": "Product name is required."
            }), 400

        if price <= 0:
            return jsonify({
                "error": "Price must be positive."
            }), 400

        product = Product(product_id, name, price, category)

        shop.insert(product)
        save_products(shop.inorder())

        return jsonify(product.to_dict()), 201

    except KeyError as error:
        return jsonify({
            "error": f"Missing field: {error.args[0]}"
        }), 400

    except (ValueError, TypeError) as error:
        return jsonify({
            "error": str(error)
        }), 400


# ==========================================
# Update Product
# ==========================================

@app.route("/api/products/<int:product_id>", methods=["PUT"])
def update_product(product_id):

    product = shop.search(product_id)

    if product is None:
        return jsonify({
            "error": "Product not found."
        }), 404

    data = request.get_json(silent=True) or {}

    try:
        price = float(data["price"])

        if price <= 0:
            return jsonify({
                "error": "Price must be positive."
            }), 400

        product.price = price

        save_products(shop.inorder())

        return jsonify(product.to_dict())

    except KeyError:
        return jsonify({
            "error": "Price is required."
        }), 400

    except (ValueError, TypeError):
        return jsonify({
            "error": "Enter a valid price."
        }), 400


# ==========================================
# Delete Product
# ==========================================

@app.route("/api/products/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):

    if shop.delete(product_id):

        save_products(shop.inorder())

        return jsonify({
            "message": "Product deleted successfully."
        })

    return jsonify({
        "error": "Product not found."
    }), 404


# ==========================================
# Run Flask Application
# ==========================================

if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)

