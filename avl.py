
# AVL Tree implementation for product searching

class AVLNode:
    def __init__(self, product):
        self.product = product
        self.left = None
        self.right = None
        self.height = 1


class ProductAVL:
    def __init__(self):
        self.root = None

    # Calculate node height
    def height(self, node):
        return node.height if node else 0

    # Calculate balance factor
    def balance(self, node):
        if node is None:
            return 0

        return self.height(node.left) - self.height(node.right)

    # Right rotation
    def rotate_right(self, y):
        x = y.left
        subtree = x.right

        x.right = y
        y.left = subtree

        y.height = 1 + max(
            self.height(y.left),
            self.height(y.right)
        )
        x.height = 1 + max(
            self.height(x.left),
            self.height(x.right)
        )

        return x

    # Left rotation
    def rotate_left(self, x):
        y = x.right
        subtree = y.left

        y.left = x
        x.right = subtree

        x.height = 1 + max(
            self.height(x.left),
            self.height(x.right)
        )
        y.height = 1 + max(
            self.height(y.left),
            self.height(y.right)
        )

        return y

    # Insert a product
    def insert(self, product):
        if self.search(product.product_id) is not None:
            raise ValueError("Product ID already exists.")

        self.root = self._insert(self.root, product)

    def _insert(self, node, product):
        if node is None:
            return AVLNode(product)

        if product.product_id < node.product.product_id:
            node.left = self._insert(node.left, product)
        else:
            node.right = self._insert(node.right, product)

        node.height = 1 + max(
            self.height(node.left),
            self.height(node.right)
        )

        balance = self.balance(node)

        # LL case
        if balance > 1 and product.product_id < node.left.product.product_id:
            return self.rotate_right(node)

        # RR case
        if balance < -1 and product.product_id > node.right.product.product_id:
            return self.rotate_left(node)

        # LR case
        if balance > 1 and product.product_id > node.left.product.product_id:
            node.left = self.rotate_left(node.left)
            return self.rotate_right(node)

        # RL case
        if balance < -1 and product.product_id < node.right.product.product_id:
            node.right = self.rotate_right(node.right)
            return self.rotate_left(node)

        return node

    # Search for a product using its ID
    def search(self, product_id):
        node = self.root
        product_id = int(product_id)

        while node:
            current_id = node.product.product_id

            if product_id == current_id:
                return node.product

            if product_id < current_id:
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

    # Delete a product using its ID
    def delete(self, product_id):
        product_id = int(product_id)

        if self.search(product_id) is None:
            return False

        self.root = self._delete(self.root, product_id)
        return True

    def _delete(self, node, product_id):
        if node is None:
            return None

        current_id = node.product.product_id

        if product_id < current_id:
            node.left = self._delete(node.left, product_id)

        elif product_id > current_id:
            node.right = self._delete(node.right, product_id)

        else:
            # Node has zero or one child
            if node.left is None:
                return node.right

            if node.right is None:
                return node.left

            # Find the smallest node in the right subtree
            successor = node.right

            while successor.left:
                successor = successor.left

            node.product = successor.product
            node.right = self._delete(
                node.right,
                successor.product.product_id
            )

        # Update height after deletion
        node.height = 1 + max(
            self.height(node.left),
            self.height(node.right)
        )

        balance = self.balance(node)

        # LL case
        if balance > 1 and self.balance(node.left) >= 0:
            return self.rotate_right(node)

        # LR case
        if balance > 1 and self.balance(node.left) < 0:
            node.left = self.rotate_left(node.left)
            return self.rotate_right(node)

        # RR case
        if balance < -1 and self.balance(node.right) <= 0:
            return self.rotate_left(node)

        # RL case
        if balance < -1 and self.balance(node.right) > 0:
            node.right = self.rotate_right(node.right)
            return self.rotate_left(node)

        return node


