import os
from app.core.exceptions import BadRequestException
from app.core.log import log
from app.db.mongodb_connection import mongo_client

class FileManager:
    def __init__(self):
        pass

    def get_file_data(self, file_path):
        if not os.path.exists(file_path):
            raise BadRequestException(msg = 'Requested File Not found')
        data = None
        with open(file_path,'r') as fin:
            data = fin.read()
        return data