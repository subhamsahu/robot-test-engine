from flask import Flask
from flask_cors import CORS
from app.api.auth import auth
from app.api.agent import agent
from app.api.file_manager import file_manager
from app.api.test_manager import test_manager

def create_flask_app():
    app = Flask(__name__)
    CORS(app, resources={r"*": {"origins": "*"}})
    app.register_blueprint(auth)
    app.register_blueprint(agent)
    app.register_blueprint(file_manager)
    app.register_blueprint(test_manager)
    return app
