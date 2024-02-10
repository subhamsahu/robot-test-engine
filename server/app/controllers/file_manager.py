import os
from app.core.exceptions import BadRequestException
from app.core.log import log
from app.db.mongodb_connection import mongo_client

class FileManager:
    """
    This class is responsible for managing the files in the system.
    """

    def __init__(self):
        """
        Initialize the FileManager class.
        """
        pass

    def get_file_data(self, file_path: str) -> str:
        """
        Get the data from a file.

        Args:
            file_path (str): The path of the file.

        Raises:
            BadRequestException: If the file does not exist.

        Returns:
            str: The data from the file.
        """
        if not os.path.exists(file_path):
            raise BadRequestException(msg="Requested File Not found")
        data = None
        with open(file_path, 'r') as fin:
            data = fin.read()
        return data

    def get_dir_structure(self, path: str) -> dict:
        """
        Get the directory structure.

        Args:
            path (str): The path of the directory.

        Returns:
            dict: The directory structure.
        """
        tree = {}

        def pathto_dict(path):
            for root, dirs, files in os.walk(path):
                tree = {
                    "prefix": root.split('/')[-1],
                    "name": root,
                    "isFolder": True,
                    "items": []
                }
                tree["items"].extend(
                    [pathto_dict(os.path.join(root, d)) for d in sorted(dirs)])
                tree["items"].extend([
                    {"prefix": f, "name": os.path.join(root, f), "isFolder": False, "items": []}
                    for f in sorted(files)
                ])
                return tree

        tree = pathto_dict(path)
        return tree