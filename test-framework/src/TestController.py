from robot.api.deco import keyword
from robot.api import logger
from robot.libraries.BuiltIn import BuiltIn
from utils import update_nested_dict_value, delete_nested_dict_key, update_nested_value, deep_dict_delete
import requests
from requests.exceptions import ConnectionError
import sys
import os
import json
import random
import string
from pathlib import Path
from Log import Log
import time
from datetime import datetime
from Constants import status_fail, status_pass, app_path
from Setup import Setup
from SSHClient import file_scp

import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

log = None

try:
    sys.path.insert(0, os.path.dirname(
        os.path.abspath(__file__)) + "/../config")
    import config
except Exception as err:
    log.log_error(str(err))
    sys.path.pop(0)


class TestController:

    def __init__(self) -> None:
        self._headers = {
            "content-type": "application/json"
        }
        self._session_id = None
        self._test_cookies = None
        self._active_session_id = None
        self._robot_instance_id = int(config.ROBOT_INSTANCE_ID)


    @keyword('Setup Suite')
    def setup_suite(self, log_dir=None):
        """
        This method is used to initialize suite like setting up ems simulator

        :param data: None
        :return: PASS or FAIL
        """
        try:
            global log
            log = Log.get_logger(log_dir)
            log.log_info("******** Setup Suite ********")
            TestController.setup_obj = Setup(config)
            return status_pass
        except Exception as e:
            log.log_error(str(e))
            return status_fail

    @keyword('Setup Test')
    def setup_test(self):
        """
        This method is used to initialize test like bringing up nodes

        :param data: None
        :return: PASS or FAIL
        """
        try:
            log.log_info("******** Setup Test ********")
            test_case_name = BuiltIn().get_variable_value("${TEST NAME}")
            log.log_info(f"******** Testcase : {test_case_name} ********")
            TestController.setup_obj.clear_test_logs()
            if config.PCAP_CAPTURE:
                log.log_info("[ Starting TCP Dump]")
                TestController.setup_obj.start_tcp_dump()
            log.log_info("[ Starting Bringup Nodes]")
            TestController.setup_obj.bring_up_setup()
            return status_pass
        except Exception as e:
            log.log_error(str(e))
            return status_fail


    @keyword('Teardown Test')
    def teardown_test(self):
        """
        This method is used to initialize test like bringing down nodes, capture test logs

        :param data: None
        :return: PASS or FAIL
        """
        try:
            global _add_device_manager_counter, _add_device_counter
            log.log_info("******** Teardown Test ********")
            log.log_info("[ Starting Capturing Logs]")
            TestController.setup_obj.capture_test_logs()
            kill_at_teardown = config.KILL_NODES_AT_TEARDOWN
            if kill_at_teardown:
                log.log_info("[ Started Bringing Down Nodes]")
                TestController.setup_obj.bring_down_setup()
            if config.PCAP_CAPTURE:
                log.log_info("[ Stopping TCP Dump on Nodes]")
                TestController.setup_obj.stop_tcp_dump()
            return status_pass
        except Exception as e:
            log.log_error(str(e))
            return status_fail

    @keyword('Suite Teardown')
    def suite_teardown(self, **kwargs):
        pass
