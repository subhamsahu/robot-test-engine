from app.exceptions.app_exceptions import AutomationUtilToolException

import requests
import json
import re
from requests.auth import HTTPBasicAuth
import os
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from app.core.constants import APP_PATH
from app.core.config import USER, PASSWORD
import copy

from app.db.repositories.app import AppRepository
from app.services.auth import AuthService


auth_service = AuthService()


class JIRAService:

    def __init__(self):
        self.username = USER
        if 'encrypt_' in PASSWORD:
            self.passkey = auth_service.decrypt_passkey(PASSWORD)
        else:
            self.passkey = PASSWORD
        self.url = "https://alm.radisys.com/jira/rest/api/latest/issue/"
        self.create_payload = {}
        self._jira_repository = JIRARepository()
        self._app_repostitory = AppRepository()
        self.jira_settings_path = Path(
            APP_PATH, 'resources', 'jira', 'settings.json')

    def get_jira_by_id(self, jira_ticket):
        auth = HTTPBasicAuth(self.username, self.passkey)
        get_details_url = self.url + jira_ticket

        headers = {
            "Accept": "application/json"
        }
        response = requests.request(
            "GET",
            get_details_url,
            headers=headers,
            auth=auth
        )
        if 'AUTHENTICATED_FAILED' in response.text:
            raise Exception("Authentication failed")

        return json.loads(response.text)

    def create_jira_ticket(self, payload: dict):
        create_jira_url = self.url
        # versions : 5G-NR-Q4-20
        create_payload = {
            "fields": {
                "project": {
                    "key": f"{payload.get('project',None)}"
                },
                "summary": f"{payload.get('summary',None)}",
                "description": f"{payload.get('description',None)}",
                "issuetype": {'name': f"{payload.get('issuetype',None)}"},
                "priority": {'name': f"{payload.get('priority',None)}"},
                "versions": [{"name": f"{payload.get('affected_versions[0]',None)}"}],
                "assignee": {"name": f"{self.username}"},
                "reporter": {"name": f"{self.username}"},
                "customfield_10911": {"value": f"{payload.get('severity',None)}"},
                "customfield_11407": {"value": f"{payload.get('issue_classification',None)}"},
                "customfield_11408": {"value": f"{payload.get('issue_source',None)}"},
                "customfield_11409": {"value": f"{payload.get('phase_found',None)}"}
            }
        }

        auth = HTTPBasicAuth(self.username, self.passkey)

        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
        response = requests.request(
            "POST",
            create_jira_url,
            data=json.dumps(create_payload),
            headers=headers,
            auth=auth
        )
        if 'AUTHENTICATED_FAILED' in response.text:
            raise Exception("Authentication Failed, Please Check Username/Password")
        
        jira = json.loads(response.text)
        jira_id = jira["key"]
        return jira_id

    def create_update_payload(self, jira_data: dict) -> dict:
        update_payload = {
            "update": {

            }
        }
        if jira_data.priority != "None":
            priority_dict = {
                "priority": {'name': f'{jira_data.priority}'},
            }
            update_payload["fields"] = priority_dict

        if jira_data.summary != "None":
            summary = [{"set": f"{jira_data.summary}"}]
            update_payload["update"]["summary"] = summary

        if jira_data.description != "None":
            description = [{"set": f"{jira_data.description}"}]
            update_payload["update"]["description"] = description

        if jira_data.severity != "None":
            severity = [{"set": f"{jira_data.severity}"}]
            update_payload["update"]["customfield_10911"] = severity

        if jira_data.issue_classification != "None":
            issue_classification = [
                {"set": f"{jira_data.issue_classification}"}]
            update_payload["update"]["customfield_11407"] = issue_classification

        if jira_data.issue_source != "None":
            issue_source = [{"set": f"{jira_data.issue_source}"}]
            update_payload["update"]["customfield_11408"] = issue_source

        if jira_data.phase_found != "None":
            phase_found = [{"set": f"{jira_data.phase_found}"}]
            update_payload["update"]["customfield_11409"] = phase_found

        if jira_data.comment != "":
            comment = [
                {
                    "add": {
                        "body": f"{jira_data.comment}"
                    }
                }
            ]
            update_payload["update"]["comment"] = comment

        return update_payload

    def update_jira_ticket(self, jira_ticket, jira_data: dict):
        
        update_payload = self.create_update_payload(jira_data)
        # update_payload = {
        #     "fields": {
        #         "priority": {'name': f'{jira_data.priority}'},
        #     },
        #     "update": {
        #         "summary": [{"set": f"{jira_data.summary}"}],
        #         "description": [
        #             {
        #                 "set": f"{jira_data.description}"
        #             }
        #         ],
        #         "assignee": [{"set": {"name": f"{jira_data.assignee}"}}],
        #         "versions": [{"set": [{"name": f"{jira_data.affected_versions}"}]}],
        #         "components": [{"set": [{"name": f"{jira_data.components}"}]}],
        #         "customfield_10911": [{"set": {"value": f"{jira_data.severity}"}}],
        #         "customfield_11407": [{"set": {"value": f"{jira_data.issue_classification}"}}],
        #         "customfield_11408": [{"set": {"value": f"{jira_data.issue_source}"}}],
        #         "customfield_11409": [{"set": {"value": f"{jira_data.phase_found}"}}],
        #         "comment": [
        #             {
        #                 "add": {
        #                     "body": f"{jira_data.comment}"
        #                 }
        #             }
        #         ]
        #     }
        # }

        # return ResponseSchema(update_payload)

        update_jira_url = self.url + jira_ticket

        auth = HTTPBasicAuth(self.username, self.passkey)

        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
        response = requests.request(
            "PUT",
            update_jira_url,
            data=json.dumps(update_payload),
            headers=headers,
            auth=auth
        )
        if 'AUTHENTICATED_FAILED' in response.text:
            raise Exception("Authentication Failed, Please Check Username/Password")

        if str(response.status_code) == "204":
            return {"success": True}
        return {"response": json.loads(response.text)}


    def update_jira_comment(self, jira_ticket, jira_comment):
        update_payload = {
            "update": {
                "comment": [
                    {
                        "add": {
                            "body": f"{jira_comment.comment}"
                        }
                    }
                ]
            }
        }

        update_jira_url = self.url + jira_ticket

        auth = HTTPBasicAuth(self.username, self.passkey)

        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
        response = requests.request(
            "PUT",
            update_jira_url,
            data=json.dumps(update_payload),
            headers=headers,
            auth=auth
        )
        if 'AUTHENTICATED_FAILED' in response.text:
            raise Exception("Authentication Failed, Please Check Username/Password")
        
        if str(response.status_code) == "204":
            return ResponseSchema("Jira Ticket Updated Successfully")
        return json.loads(response.text)


    def close_jira_ticket(self, jira_ticket,api_mode=True) -> ResponseSchema:
        update_jira_url = self.url + jira_ticket + \
            '/transitions?expand=transitions.fields'

        current_status = self.get_jira_status_by_id(jira_ticket)

        if current_status.data != "Resolved":
            raise Exception(f"Only Jira With Resolved state can be closed")

        transition_id = 51

        transition_payload = {"transition": {"id": transition_id}}

        print(transition_payload)

        auth = HTTPBasicAuth(self.username, self.passkey)

        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
        response = requests.request(
            "POST",
            update_jira_url,
            data=json.dumps(transition_payload),
            headers=headers,
            auth=auth
        )
        if 'AUTHENTICATED_FAILED' in response.text:
            raise Exception("Authentication Failed, Please Check Username/Password")
        
        if response.status_code == 204:
            return response.status_code
        return json.loads(response.text)


    def get_jira_transitions_by_id(self, jira_ticket,api_mode=True):
        auth = HTTPBasicAuth(self.username, self.passkey)
        get_details_url = self.url + jira_ticket + '/transitions'

        headers = {
            "Accept": "application/json"
        }
        response = requests.request(
            "GET",
            get_details_url,
            headers=headers,
            auth=auth
        )
        if 'AUTHENTICATED_FAILED' in response.text:
            raise Exception("Authentication Failed, Please Check Username/Password")
        return json.loads(response.text)

    def get_jira_status_by_id(self, jira_ticket,api_mode=True):
        auth = HTTPBasicAuth(self.username, self.passkey)
        get_details_url = self.url + jira_ticket + '?fields=status'

        headers = {
            "Accept": "application/json"
        }
        response = requests.request(
            "GET",
            get_details_url,
            headers=headers,
            auth=auth
        )
        if 'AUTHENTICATED_FAILED' in response.text:
            raise Exception("Authentication Failed, Please Check Username/Password")

        data = json.loads(response.text)
        return data['fields']['status']['name']

    def set_jira_transition_id(self, jira_ticket: str, transition_id: int,api_mode=True):
        update_jira_url = self.url + jira_ticket + \
            '/transitions?expand=transitions.fields'

        transition_payload = {"transition": {"id": transition_id}}

        print(transition_payload)

        auth = HTTPBasicAuth(self.username, self.passkey)

        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
        response = requests.request(
            "POST",
            update_jira_url,
            data=json.dumps(transition_payload),
            headers=headers,
            auth=auth
        )
        if 'AUTHENTICATED_FAILED' in response.text:
            return Exception("Authentication Failed, Please Check Username/Password")

        print(response.status_code)
        return json.loads(response.text)

    def set_jira_settings(self, jira_settings):
        jira_settings_data = {
            "testplan": f"{jira_settings.testplan}",
            "test_cycle": f"{jira_settings.test_cycle}",
            "custom_comment": f"{jira_settings.custom_comment}",
            "prev_build": f"{jira_settings.prev_build}",
            "current_build": f"{jira_settings.current_build}",
            "deep_validation": False
        }
        with open(self.jira_settings_path, 'w') as fout:
            json.dump(jira_settings_data, fout, indent=2)
        self._app_repostitory.set_app_settings(jira_settings_data)


    def set_default_jira_settings(self):
        jira_settings_data = {
            "testplan": "DummyTestplan",
            "test_cycle": "DummyTestcycle",
            "custom_comment": "DummyComment",
            "prev_build": "RC1",
            "current_build": "RC2",
            "deep_validation": False
        }
        settings_obj = self._app_repostitory.get_app_settings_data()
        if (settings_obj):
            print("Record already available")
            return
        print("Inserting Settings Record")
        self._app_repostitory.set_app_settings(jira_settings_data)

    def get_jira_settings(self):
        self._app_repostitory.get_app_settings()


    def get_all_jira_from_db(self):
        all_jira = self._jira_repository.get_all_jira()
        all_jira

    def update_jira_to_testcase(self, jira_id, srt_id):
        auth = HTTPBasicAuth(self.username, self.passkey)
        get_details_url = self.url + jira_id

        headers = {
            "Accept": "application/json"
        }
        response = requests.request(
            "GET",
            get_details_url,
            headers=headers,
            auth=auth
        )
        if str(response.status_code) == "404":
            raise Exception("Issue don't Exist")
        jira_settings = self._app_repostitory.get_app_settings_data()
        return self._jira_repository.assign_jira_issue_to_test_id(
            srt_id, jira_settings["testplan"], jira_settings["test_cycle"], jira_id, jira_settings['current_build'])

    def jira_list_in_db(self):
        items = self._jira_repository.get_all_jira()
        jira_list = []
        for item in items:
            jira_list.extend(item.jira_list)

        return jira_list

    def search_string_in_jira(self, search_token, api_mode=True):
        from app.utils.search_algorithms import search_token_in_jira
        jira_list = self.jira_list_in_db(api_mode=False)
        filtered_jira_list = []
        for jira in jira_list:
            jira_detail = self.get_jira_by_id(jira, api_mode=False)
            search_percentage = search_token_in_jira(
                search_token, jira_detail)
            print(search_percentage)
            if search_percentage > 50:
                filtered_jira_list.append(jira)
        return filtered_jira_list
