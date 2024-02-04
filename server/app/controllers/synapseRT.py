from app.schema.response_schema import ResponseSchema
from app.exceptions.app_exceptions import AutomationUtilToolException
from pathlib import Path
import requests
from app.core.constants import APP_PATH
import json
import os
from app.utils.synapsert import SynpaseRT
from app.db.repositories.jira import JIRARepository
from app.core.config import USER, PASSWORD
from app.db.repositories.app import AppRepository

from app.services.auth import AuthService


auth_service = AuthService()


class SRTService:
    def __init__(self) -> None:
        self.jira_settings_path = Path(
            APP_PATH, 'resources', 'jira', 'settings.json')
        self.url = 'https://alm.radisys.com/jira/rest'
        self.username = USER
        if 'encrypt_' in PASSWORD:
            self.passkey = auth_service.decrypt_passkey(PASSWORD)
        else:
            self.passkey = PASSWORD
        self._jira_repository = JIRARepository()
        self._app_repository = AppRepository()
        self.headers = {'content-type': 'application/json'}

    def get_testrun_id(self, test_plan, test_cycle_name, testcase_name):
        try:
            url = self.url + \
                f'/synapse/latest/public/testPlan/{test_plan}/cycle/{test_cycle_name}/testRuns'
            auth = (self.username, self.passkey)
            response = requests.get(url, headers=self.headers,
                                    auth=auth)
            try:
                output = response.json()
            except:
                output = response.text
            for each in output:
                if each['testCaseKey'] == testcase_name:
                    return each['id']
            return None
        except:
            return None

    def get_cycle_id(self, test_plan, test_cycle_name):
        try:
            url = self.url + \
                f'/synapse/latest/public/testPlan/{test_plan}/cycles'
            auth = (self.username, self.passkey)
            response = requests.get(url, headers=self.headers,
                                    auth=auth)
            try:
                output = response.json()
            except:
                output = response.text

            for each in output:
                if each['name'] == test_cycle_name:
                    return each['id']
        except:
            return None

    def update_tc_status_in_srt(self, srt_update):
        try:
            if str(srt_update.testcase_status).lower() not in ['pass', 'fail']:
                raise AutomationUtilToolException("Invalid Update Value")

            with open(self.jira_settings_path, 'r') as fin:
                jira_settings_data = json.load(fin)

            jira_settings_data = self._app_repository.get_app_settings_data()

            test_plan = jira_settings_data['testplan']
            test_cycle = jira_settings_data['test_cycle']

            test_cycle_id = self.get_cycle_id(test_plan, test_cycle)
            testcase_id = self.get_testrun_id(
                test_plan, test_cycle, srt_update.testcase_id)

            if not test_cycle_id or not testcase_id:
                raise AutomationUtilToolException(
                    "Testcase/Test Cycle Not Available")

            testcase_status = "Passed" if str(
                srt_update.testcase_status).lower() == "pass" else "Failed"

            url = self.url + \
                f'/synapse/latest/public/testPlan/{test_plan}/bulkStatusUpdate'

            test_id_list = list()
            test_id_list.append(int(testcase_id))

            payload = {
                "testCycleId": int(test_cycle_id),
                "status": testcase_status,
                "runIds": test_id_list
            }

            response = requests.post(url, headers=self.headers, data=json.dumps(payload),
                                     auth=(self.username, self.passkey))

            if response.status_code == 200:
                new_entry = {
                    "testplan": test_plan,
                    "test_cycle": test_cycle,
                    "testcase_id": srt_update.robot_test_id,
                    "srt_test_id": srt_update.testcase_id,
                    "jira_list": [],
                    "current_execution_status": testcase_status,
                    "current_binary_version": jira_settings_data['current_build'],
                    "execution_status": {}
                }
                self._jira_repository.add_jira(new_entry)
                return ResponseSchema("SRT Status Updated Successfully")
            else:
                raise AutomationUtilToolException(
                    "Some Issue while Updating the SRT status")
        except Exception as e:
            return ResponseSchema(AutomationUtilToolException(str(e)))

    def get_cycle(self, test_cycle):
        try:
            with open(self.jira_settings_path, 'r') as fin:
                jira_settings_data = json.load(fin)
            test_cycle = jira_settings_data['test_cycle']
            test_plan = jira_settings_data['testplan']
            test_cycle_id = self.get_cycle_id(test_plan, test_cycle)
            test_case_id = self.get_testrun_id(
                test_plan, test_cycle, "FGNRSTP-818")
            print(test_case_id)
            return ResponseSchema(test_cycle_id)
        except Exception as e:
            return ResponseSchema(AutomationUtilToolException(str(e)))