from dotenv import load_dotenv
import os

load_dotenv()

HOST = os.getenv("HOSTNAME")
PORT = os.getenv("PORT")
DEBUG = True if os.getenv("DEBUG") == 'True' else False
UI_URL = os.getenv("UI_URL")
MONGODB_URI = os.getenv("MONGODB_URI")
