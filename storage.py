
# Storage module for saving and loading products

import json
from pathlib import Path
from product import Product

# Location where product data will be stored
DATA_FILE = Path(__file__).parent / "data" / "products.json"


# Load products from the JSON file
def load_products():
    if not DATA_FILE.exists():
        return []

    with DATA_FILE.open("r", encoding="utf-8") as file:
        data = json.load(file)

    return [Product.from_dict(item) for item in data]


# Save products to the JSON file
def save_products(products):
    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)

    with DATA_FILE.open("w", encoding="utf-8") as file:
        json.dump(
            [product.to_dict() for product in products],
            file,
            indent=4,
            ensure_ascii=False
        )

