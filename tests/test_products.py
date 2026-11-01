
# Unit tests for BST and AVL Tree

import sys
from pathlib import Path
import unittest

# Add the main project folder to Python's import path
PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT))

from product import Product
from bst import ProductBST
from avl import ProductAVL


class TestProductBST(unittest.TestCase):

    def setUp(self):
        self.tree = ProductBST()

        self.tree.insert(Product(30, "Laptop", 55000))
        self.tree.insert(Product(20, "Mouse", 500))
        self.tree.insert(Product(40, "Keyboard", 1500))

    def test_search_existing_product(self):
        product = self.tree.search(20)
        self.assertIsNotNone(product)
        self.assertEqual(product.name, "Mouse")

    def test_search_missing_product(self):
        self.assertIsNone(self.tree.search(99))

    def test_inorder_sorting(self):
        ids = [
            product.product_id
            for product in self.tree.inorder()
        ]
        self.assertEqual(ids, [20, 30, 40])

    def test_delete_product(self):
        result = self.tree.delete(20)
        self.assertTrue(result)
        self.assertIsNone(self.tree.search(20))

    def test_duplicate_id(self):
        with self.assertRaises(ValueError):
            self.tree.insert(Product(30, "Phone", 20000))


class TestProductAVL(unittest.TestCase):

    def setUp(self):
        self.tree = ProductAVL()

    def test_insert_and_search(self):
        self.tree.insert(Product(10, "Laptop", 55000))
        self.tree.insert(Product(20, "Mouse", 500))

        product = self.tree.search(20)
        self.assertIsNotNone(product)
        self.assertEqual(product.name, "Mouse")

    def test_duplicate_id(self):
        self.tree.insert(Product(10, "Laptop", 55000))

        with self.assertRaises(ValueError):
            self.tree.insert(Product(10, "Phone", 20000))

    def test_delete_product(self):
        self.tree.insert(Product(10, "Laptop", 55000))
        self.tree.insert(Product(20, "Mouse", 500))

        self.assertTrue(self.tree.delete(10))
        self.assertIsNone(self.tree.search(10))

    def test_avl_balance(self):
        # Insert sorted IDs to test automatic balancing
        for product_id in [10, 20, 30, 40, 50, 60]:
            self.tree.insert(
                Product(product_id, f"Product {product_id}", 1000)
            )

        def check_balance(node):
            if node is None:
                return 0

            left_height = check_balance(node.left)
            right_height = check_balance(node.right)

            self.assertLessEqual(
                abs(left_height - right_height), 1
            )

            return 1 + max(left_height, right_height)

        check_balance(self.tree.root)


if __name__ == "__main__":
    unittest.main()


