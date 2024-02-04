import os
from app.core.exceptions import APPException
from app.core.log import log
import csv
import io
from app.db.mongodb_connection import mongo_client

db = mongo_client['TestFrameworkDb']
suite_coll = db['suites']

class AgentService:
    """
    This class provides methods to interact with the Test Automation Agent
    """

    def __init__(self):
        """
        Initialize the AgentService class
        """
        pass

    @staticmethod
    def convert_csv_to_json(csv_str):
        """
        Convert a CSV string to a JSON list

        Args:
            csv_str (str): The CSV string to convert

        Returns:
            list: The JSON list representation of the CSV string
        """
        out = csv.DictReader(io.StringIO(csv_str))
        out_list = list(out)
        i = 0
        for item in out_list:
            item.update({'id': i})
            i += 1
        return out_list

    @staticmethod
    def get_file_data(file_path, file_data_only):
        """
        Get the contents of a file

        Args:
            file_path (str): The path of the file
            file_data_only (bool): A flag indicating whether to return only the file contents or the entire file data

        Returns:
            dict, None: The file data if successful, or None if an error occurs
        """
        try:
            if not os.path.exists(file_path):
                return APPException("No such File/Directory Found")

            if os.path.isdir(file_path):
                raise APPException("Given Path is Directory")

            filename, file_extension = os.path.splitext(file_path)
            if file_extension == ".xlsx":
                raise APPException("Excel Sheet Support Not Added yet")

            file_contents = None
            with open(file_path, "r") as fin:
                file_contents = fin.read().rstrip()

            if file_extension == ".csv":
                if file_data_only:
                    file_extension = ".txt"
                else:
                    file_contents = AgentService.convert_csv_to_json(file_contents)
            log.log_info(file_path)
            data = {
                "file_path": file_path,
                "file_extention": file_extension,
                "file_contents": file_contents,
            }
            return data
        except Exception as e:
            log.log_error(str(e))
            return None

    @staticmethod
    def set_file_data(file_path, file_data):
        """
        Set the contents of a file

        Args:
            file_path (str): The path of the file
            file_data (dict): The file data containing the contents and other information

        Returns:
            bool: True if successful, or False if an error occurs
        """
        try:
            log.log_info(f"Setting File {file_path}")
            if not os.path.exists(file_path):
                return APPException("No such File/Directory Found")

            if os.path.isdir(file_path):
                raise APPException("Given Path is Directory")

            log.log_info(file_data.file_content)
            file_content = str(file_data.file_content).replace(
                "<new_line>", "\n")
            log.log_info(file_content)
            with open(file_path, "w") as fout:
                fout.write(file_content)
            return True
        except Exception as e:
            log.log_error(str(e))
            return False

    def execute_testplan(self, testplan):
        """
        Execute a test plan

        Args:
            testplan (dict): The test plan data

        Returns:
            bool: True if successful, or False if an error occurs
        """
        try:
            AUTOMATION_AGENT_PATH = ""
            test_suiter_command = f"cd {AUTOMATION_AGENT_PATH} ;cd scripts/SASuite4/; python3.8 TestSuiteExecutor.py ../../testplan/SA_Testplan_1.csv  Logs/  run"
            log.log_info(test_suiter_command)
            kill_exisiting_tmux_cmd = 'tmux kill-session -t test_session'
            os.system(kill_exisiting_tmux_cmd)
            cmd = f'tmux new-session -d -s test_session \; send-keys "{test_suiter_command}" Enter'
            log.log_info(cmd)
            os.system(cmd)
            return True
        except Exception as e:
            log.log_error(str(e))
            return False