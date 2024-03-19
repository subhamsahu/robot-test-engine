from flask import Flask, request, Response, redirect, session, Blueprint, jsonify
from app.core.response import success_response, error_response
from app.core.exceptions import BadRequestException
import uuid
import time
import json
import os
import sys
from app.core.log import log
from robot.api import logger
from app.core.constants import API_PREFIX, APP_PATH
from app.controllers.file_manager import FileManager
from app.core.utils import print_error_trace

dummy_manager = Blueprint('dummy', __name__, url_prefix=API_PREFIX + '/dummy')

# Dummy database to store products
products = [
    {"id": 1, "name": "Product 1", "price": 10.99},
    {"id": 2, "name": "Product 2", "price": 20.99},
    {"id": 3, "name": "Product 3", "price": 30.99}
]

# Create a new product
@dummy_manager.route('/products', methods=['POST'])
def create_product():
    data = request.json
    new_product = {
        "id": len(products) + 1,
        "name": data['name'],
        "price": data['price']
    }
    products.append(new_product)
    return jsonify(new_product), 201

# Read all products
@dummy_manager.route('/products', methods=['GET'])
def get_products():
    return jsonify(products)

# Read a single product by ID
@dummy_manager.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = next((product for product in products if product['id'] == product_id), None)
    if product:
        return jsonify(product)
    else:
        return jsonify({"message": "Product not found"}), 404

# Update a product by ID
@dummy_manager.route('/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    product = next((product for product in products if product['id'] == product_id), None)
    if product:
        data = request.json
        product.update(data)
        return jsonify(product)
    else:
        return jsonify({"message": "Product not found"}), 404

# Delete a product by ID
@dummy_manager.route('/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    global products
    products = [product for product in products if product['id'] != product_id]
    return jsonify({"message": "Product deleted"}), 200