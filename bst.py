
# Binary Search Tree implementation for products

class BSTNode:
    def __init__(self, product):
        self.product = product
        self.left = None
        self.right = None


class ProductBST:
    def __init__(self):
        self.root = None

    # Insert a product
    def insert(self, product):
        self.root = self._insert(self.root, product)

    def _insert(self, node, product):
        if node is None:
            return BSTNode(product)

        if product.product_id < node.product.product_id:
            node.left = self._insert(node.left, product)

        elif product.product_id > node.product.product_id:
            node.right = self._insert(node.right, product)

        else:
            raise ValueError("Product ID already exists.")

        return node

    # Search for a product by ID
    def search(self, product_id):
        node = self.root
        product_id = int(product_id)

        while node:
            current_id = node.product.product_id

            if product_id == current_id:
                return node.product

            elif product_id < current_id:
                node = node.left

            else:
                node = node.right

        return None

    # Return products in ascending ID order
    def inorder(self):
        products = []

        def traverse(node):
            if node:
                traverse(node.left)
                products.append(node.product)
                traverse(node.right)

        traverse(self.root)
        return products

    # Delete a product by ID
    def delete(self, product_id):
        product_id = int(product_id)

        if self.search(product_id) is None:
            return False

        self.root = self._delete(self.root, product_id)
        return True

    def _delete(self, node, product_id):
        if node is None:
            return None

        if product_id < node.product.product_id:
            node.left = self._delete(node.left, product_id)

        elif product_id > node.product.product_id:
            node.right = self._delete(node.right, product_id)

        else:
            # Node has no left child
            if node.left is None:
                return node.right

            # Node has no right child
            if node.right is None:
                return node.left

            # Find the smallest product in the right subtree
            successor = node.right

            while successor.left:
                successor = successor.left

            node.product = successor.product

            node.right = self._delete(
                node.right,
                successor.product.product_id
            )

        return node

