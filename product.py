
# Product class for Online Shopping Product Search

class Product:
    def __init__(self, product_id, name, price, category="Other"):
        self.product_id = int(product_id)
        self.name = name.strip()
        self.price = float(price)
        self.category = category.strip() or "Other"

    # Convert product details into a dictionary
    def to_dict(self):
        return {
            "product_id": self.product_id,
            "name": self.name,
            "price": self.price,
            "category": self.category
        }

    # Create a Product object from saved dictionary data
    @classmethod
    def from_dict(cls, data):
        return cls(
            data["product_id"],
            data["name"],
            data["price"],
            data.get("category", "Other")
        )

    # Display product details as readable text
    def __str__(self):
        return (
            f"ID: {self.product_id} | "
            f"Name: {self.name} | "
            f"Price: ₹{self.price:.2f} | "
            f"Category: {self.category}"
        )
