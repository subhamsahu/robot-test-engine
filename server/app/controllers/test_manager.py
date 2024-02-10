import os
import csv
import io
import json
from bson.objectid import ObjectId

from app.core.exceptions import APPException
from app.core.log import log
from app.db.mongodb_connection import mongo_client
from app.core.constants import SERVER_PATH
from app.utils.utility import Utility

db = mongo_client['TestFrameworkDb']
suite_coll = db['suites']
testcases_coll = db['testcases']
testplan_coll = db['testplans']
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

    def delete_suite(self, id: str) -> dict:
        """Deletes a test suite.

        Args:
            id (str): The id of the test suite to be deleted.

        Raises:
            Exception: If the test suite does not exist.

        Returns:
            dict: The deleted document.
        """
        query = {"_id": ObjectId(id)}
        existing_document = suite_coll.find_one(query)
        if not existing_document:
            raise Exception("Suite Doesn't Exist")
        data = Utility.convert_mongo_document_to_dict(
            suite_coll.find_one_and_delete(query)
        )
        return data

    def list_suite(self) -> list:
        """
        List all test suites.

        Returns:
            list: A list of all test suites.
        """
        data = list(suite_coll.find({}))
        list_of_suites = Utility.convert_mongo_document_list_to_dict(data)
        return list_of_suites

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

    def delete_testcase(self, id: str) -> None:
        """
        Delete a test case.

        Args:
            testcasename (str): The name of the test case to be deleted.

        Raises:
            Exception: If the test case does not exist.

        Returns:
            None: Returns nothing.
        """
        query = {"_id": ObjectId(id)}
        existing_document = testcases_coll.find_one(query)
        if not existing_document:
            raise Exception("Testcase Not Exist")
        data = testcases_coll.delete_one(query)
        return data

    def list_testcase(self) -> list:
        """
        List all test cases.

        Returns:
            list: A list of all test cases.
        """
        # data = list(testcases_coll.find({}))
        data = testcases_coll.find({})
        list_of_testcases= Utility.convert_mongo_document_list_to_dict(data)
        return list_of_testcases
    def create_testplan(self, payload: dict) -> dict:
        """
        Create a new test plan.

        Args:
            payload (dict): The payload containing the necessary information for creating a test plan.

        Raises:
            Exception: If a test plan with the same name already exists.

        Returns:
            dict: The inserted document.
        """
        existing_document = testplan_coll.find_one(
            {
                "name": payload.get("name", None),
            }
        )
        if existing_document:
            raise Exception("Testcase Already Exist")
        data = testplan_coll.insert_one(payload)
        return data

    def delete_testplan(self, id: str) -> None:
        """
        Deletes a test plan.

        Args:
            id (str): The id of the test plan to be deleted.

        Raises:
            Exception: If the test plan does not exist.

        Returns:
            None: Returns nothing.
        """
        query = {"_id": ObjectId(id)}
        existing_document = testplan_coll.find_one(query)
        if not existing_document:
            raise Exception("Testcase Not Exist")
        data = testplan_coll.delete_one(query)
        return data

    def list_testplan(self) -> list:
        """
        List all test plans.

        Returns:
            list: A list of all test plans.
        """
        data = testplan_coll.find({})
        list_of_testplans= Utility.convert_mongo_document_list_to_dict(data)
        return list_of_testplans

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