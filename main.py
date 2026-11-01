
# Online Shopping Product Search
# Main console application

from product import Product
from avl import ProductAVL
from storage import load_products, save_products


def display_products(products):
    if not products:
        print("No products found.")
        return

    print("\n" + "-" * 55)
    print(f"{'ID':<8}{'NAME':<25}{'PRICE':>12}")
    print("-" * 55)

    for product in products:
        print(
            f"{product.product_id:<8}"
            f"{product.name:<25}"
            f"₹{product.price:>10.2f}"
        )

    print("-" * 55)


def main():
    shop = ProductAVL()

    # Load saved products when the application starts
    try:
        for product in load_products():
            shop.insert(product)
    except (ValueError, KeyError, TypeError) as error:
        print("Could not load saved products:", error)

    while True:
        print("\n===== ONLINE SHOPPING PRODUCT SEARCH =====")
        print("1. Add product")
        print("2. Search by ID")
        print("3. Search by name")
        print("4. Update product price")
        print("5. Delete product")
        print("6. Display products by ID")
        print("7. Display products by price")
        print("8. Exit")

        choice = input("Enter your choice (1-8): ").strip()

        try:
            if choice == "1":
                product_id = int(input("Product ID: "))
                name = input("Product name: ").strip()
                price = float(input("Product price: ₹"))
                category = input("Category: ").strip() or "Other"

                if not name or price <= 0:
                    print("Enter a name and a positive price.")
                    continue

                product = Product(
                    product_id, name, price, category
                )

                shop.insert(product)
                save_products(shop.inorder())
                print("Product added successfully!")

            elif choice == "2":
                product_id = int(input("Enter product ID: "))
                product = shop.search(product_id)

                display_products([product] if product else [])

            elif choice == "3":
                name = input("Enter product name: ").strip().lower()

                matches = [
                    p for p in shop.inorder()
                    if name in p.name.lower()
                ] if name else []

                display_products(matches)

            elif choice == "4":
                product_id = int(input("Product ID: "))
                product = shop.search(product_id)

                if product is None:
                    print("Product not found.")
                    continue

                price = float(input("New price: ₹"))

                if price <= 0:
                    print("Price must be positive.")
                    continue

                product.price = price
                save_products(shop.inorder())
                print("Price updated successfully!")

            elif choice == "5":
                product_id = int(input("Product ID to delete: "))

                if shop.delete(product_id):
                    save_products(shop.inorder())
                    print("Product deleted successfully!")
                else:
                    print("Product not found.")

            elif choice == "6":
                display_products(shop.inorder())

            elif choice == "7":
                products = sorted(
                    shop.inorder(),
                    key=lambda p: p.price
                )
                display_products(products)

            elif choice == "8":
                print("Thank you for using the application!")
                break

            else:
                print("Invalid choice. Enter a number from 1 to 8.")

        except ValueError as error:
            print("Invalid input:", error)


if __name__ == "__main__":
    main()

