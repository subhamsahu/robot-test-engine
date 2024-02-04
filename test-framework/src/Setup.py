from SSHClient import SSHClient, file_scp
import os
import sys
from robot.api import logger
from robot.libraries.BuiltIn import BuiltIn
from Log import Log
import time
from Constants import status_pass, status_fail, python3_version, python2_version

log = None
config = None


class Setup:
    ssh_objects = {
    }

    def __init__(self, conf) -> None:
        global log
        global config
        config = conf
        try:
            log = Log.get_logger(__name__)
        except Exception as e:
            logger.console(str(e))
        self.create_ssh_connection()

    def create_ssh_connection(self):
        try:
            for node in config.SETUP:
                log.log_info(node)
                if Setup.ssh_objects.get(config.SETUP_DETAILS[node]['ip'], None):
                    log.log_info(
                        f"SSH object for IP {config.SETUP_DETAILS[node]['ip']} already exist")
                    continue
                ssh_obj = SSHClient(
                    config.SETUP_DETAILS[node]['ip'], config.SETUP_DETAILS[node]['user'], config.SETUP_DETAILS[node]['password'])
                ssh_obj.get_ssh_client()
                Setup.ssh_objects[config.SETUP_DETAILS[node]['ip']] = ssh_obj
        except Exception as e:
            log.log_error(f"Failed to bring up node {str(e)}")

    def bring_up_node(self, node):
        try:
            return status_pass
        except Exception as e:
            log.log_error(f"Failed to bring up node {str(e)}")
            return status_fail

    def bring_up_setup(self):
        for node in config.SETUP:
            self.bring_up_node(node)

    def bring_down_node(self, node):
        try:
            return status_pass
        except Exception as e:
            log.log_error(f"Failed to bring up node {str(e)}")
            return status_fail

    def bring_down_setup(self):
        for node in config.SETUP:
            self.bring_down_node(node)

    def clear_test_logs(self):
        try:
            return status_pass
        except Exception as e:
            log.log_error(f"Failed to bring up node {str(e)}")
            return status_fail

    def capture_test_logs(self):
        try:
            return status_pass
        except Exception as e:
            log.log_error(f"Failed to bring up node {str(e)}")
            return status_fail

    def check_node_status(self, node):
        try:
            return status_pass
        except Exception as e:
            log.log_error(f"Failed to bring up node {str(e)}")
            return status_fail

    def check_setup_status(self):
        for node in config.SETUP:
            self.check_node_status(node)

    def start_tcp_capture_on_node(self,node):
        try:
            return status_pass
        except Exception as e:
            log.log_error(f"Failed to start tcpdump capture on {node} : {str(e)}")
            return status_fail
        
    def start_tcp_dump(self):
        for node in config.SETUP:
            self.start_tcp_capture_on_node(node)

    def stop_tcp_capture_on_node(self,node):
        try:
            return status_pass
        except Exception as e:
            log.log_error(f"Failed to start tcpdump capture on {node} : {str(e)}")
            return status_fail
        
    def stop_tcp_dump(self):
        for node in config.SETUP:
            self.stop_tcp_capture_on_node(node)
