import os
import csv
import io
import json
from app.core.exceptions import APPException
from app.core.log import log
from app.db.mongodb_connection import mongo_client
from app.core.constants import SERVER_PATH

db = mongo_client['TestFrameworkDb']
suite_coll = db['suites']
testcases_coll = db['testcases']
robot_api_coll = db['robot_api']

class TestManagerService:
    """
    This class provides the business logic for managing test suites and test cases.
    """

    def __init__(self):
        """
        Initialize the TestManagerService.
        """
        pass

    def create_suite(self, payload: dict) -> dict:
        """
        Create a new test suite.

        Args:
            payload (dict): The payload containing the necessary information for creating a test suite.

        Raises:
            Exception: If a test suite with the same name already exists.

        Returns:
            dict: The inserted document.
        """
        existing_document = suite_coll.find_one(
            {
                'name': payload.get('name', None),
            }
        )
        if existing_document:
            raise Exception("Suite Already Exist")
        data = suite_coll.insert_one(payload)
        return data

    def delete_suite(self, payload: dict) -> dict:
        """
        Delete a test suite.

        Args:
            payload (dict): The payload containing the name of the test suite to be deleted.

        Raises:
            Exception: If the test suite does not exist.

        Returns:
            dict: The deleted document.
        """
        query = {
            'name': payload.name
        }
        existing_document = suite_coll.find_one(
            query
        )
        if not existing_document:
            raise Exception("Suite Doesn't Exist")
        data = suite_coll.find_one_and_delete(query)
        return data

    def list_suite(self) -> list:
        """
        List all test suites.

        Returns:
            list: A list of all test suites.
        """
        data = list(suite_coll.find({}, {'_id': False}))
        return data

    def create_testcase(self, payload: dict) -> dict:
        """
        Create a new test case.

        Args:
            payload (dict): The payload containing the necessary information for creating a test case.

        Raises:
            Exception: If a test case with the same name already exists.

        Returns:
            dict: The inserted document.
        """
        existing_document = testcases_coll.find_one(
            {
                "name": payload.get("name", None),
            }
        )
        if existing_document:
            raise Exception("Testcase Already Exist")
        data = testcases_coll.insert_one(payload)
        return data

    def delete_testcase(self, testcasename: str) -> None:
        """
        Delete a test case.

        Args:
            testcasename (str): The name of the test case to be deleted.

        Raises:
            Exception: If the test case does not exist.

        Returns:
            None: Returns nothing.
        """
        existing_document = testcases_coll.find_one(
            {
                'name': testcasename,
            }
        )
        if not existing_document:
            raise Exception("Testcase Not Exist")
        data = testcases_coll.delete_one(
            {
                'name': testcasename,
            }
        )
        return data

    def list_testcase(self) -> list:
        """
        List all test cases.

        Returns:
            list: A list of all test cases.
        """
        data = list(testcases_coll.find({}, {'_id': False}))
        return data

    def create_robot_api_list(self) -> None:
        """
        Create the robot API list.
        """
        file_path = SERVER_PATH + '/static/robot_api_list.json'
        if not os.path.exists(file_path):
            raise Exception("robot api list file not exist")
        api_list = []
        with open(file_path, 'r') as fin:
            api_list = json.load(fin)
        for item in api_list:
            robot_api_coll.insert_one(item)

    def fetch_robot_api_list(self) -> list:
        """
        Fetch the robot API list.

        Returns:
            list: The robot API list.
        """
        file_path = SERVER_PATH + '/static/robot_api_list.json'
        if not os.path.exists(file_path):
            raise Exception("robot api list file not exist")
        api_list = []
        with open(file_path, 'r') as fin:
            api_list = json.load(fin)
        return api_list