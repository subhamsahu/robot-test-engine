import requests
from pathlib import Path
from robot.api import logger
import json

from Constants import app_path
from Log import Log
from Utils import update_nested_dict_value, delete_nested_dict_key, update_nested_value, deep_dict_delete

log = None

class APIController:
    def __init__(self) -> None:
        """
        Initialize the APIController class
        """
        global log
        self._headers = {
            "content-type": "application/json"
        }
        try:
            log = Log.get_logger(__name__)
        except Exception as e:
            logger.console(str(e))

    def _generate_payload_data(self, file: str, delete: list = [], **kwargs):
        if not file:
            raise Exception
        input_file_content = None
        input_file = Path(app_path, 'tests','payload',
                          file).as_posix()
        log.log_info(input_file)
        with open(input_file, 'r') as fin:
            input_file_content = json.loads(fin.read())
        # log.log_info(input_file_content)
        data = input_file_content
        log.log_info(f"Data in File: \n{json.dumps(data,indent=2)}")
        for k, v in kwargs.items():
            data = update_nested_value(data, k, v)

        for k in delete:
            data = deep_dict_delete(data, k)

        log.log_info(f"Data after modification: \n{json.dumps(data,indent=2)}")
        return data


    def post(self, url: str, payload: dict, kwargs: dict = {}) -> dict:
        """
        Make a POST request to the specified URL with the given payload and keyword arguments.

        Args:
            url (str): The URL to which the request should be made.
            payload (dict): The data to be sent with the request.
            kwargs (dict): A dictionary of additional arguments to be passed to the request.

        Returns:
            dict: The response from the server.
        """
        log.log_info(url)
        response = requests.post(url,
                                data=json.dumps(payload),
                                headers=self._headers,
                                )
        return response

    def get(self, url: str, params: dict = {}, kwargs: dict = {}) -> dict:
        """
        Make a GET request to the specified URL with the given parameters and keyword arguments.

        Args:
            url (str): The URL to which the request should be made.
            params (dict): A dictionary of parameters to be passed to the request.
            kwargs (dict): A dictionary of additional arguments to be passed to the request.

        Returns:
            dict: The response from the server.
        """
        response = requests.get(url, params=params, **kwargs)
        return response

    def delete(self, url: str, params: dict = {}, kwargs: dict = {}) -> dict:
        """
        Make a DELETE request to the specified URL with the given parameters and keyword arguments.

        Args:
            url (str): The URL to which the request should be made.
            params (dict): A dictionary of parameters to be passed to the request.
            kwargs (dict): A dictionary of additional arguments to be passed to the request.

        Returns:
            dict: The response from the server.
        """
        response = requests.delete(url, params=params, **kwargs)
        return response

    def put(self, url: str, payload: dict, kwargs: dict = {}) -> dict:
        """
        Make a PUT request to the specified URL with the given payload and keyword arguments.

        Args:
            url (str): The URL to which the request should be made.
            payload (dict): The data to be sent with the request.
            kwargs (dict): A dictionary of additional arguments to be passed to the request.

        Returns:
            dict: The response from the server.
        """
        response = requests.put(url, json=payload, **kwargs)
        return response
