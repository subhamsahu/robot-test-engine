import os
import sys
import time
import paramiko
import pexpect
from robot.api import logger
from Log import Log

log = None


class SSHClient(object):

    def __init__(self, ip, user, password):
        global log
        self.sshobj = None
        self.channel = None
        self.transport = None
        self.HOST = ip
        self.username = user
        self.password = password
        try:
            log = Log.get_logger(__name__)
        except Exception as e:
            logger.console(str(e))

    def get_ssh_client(self):
        self.sshobj = paramiko.SSHClient()
        self.sshobj.set_missing_host_key_policy(paramiko.AutoAddPolicy())

        try:
            log.log_info(f"Getting sshobject to Node (IP={self.HOST})")
            self.sshobj.connect(hostname=self.HOST,
                                username=self.username, password=self.password, timeout=5)
            self.transport = self.sshobj.get_transport()
            self.channel = None

        except Exception as e:
            log.log_error(str(e))
            log.log_error("sshobject -> FAIL")
            return False

        log.log_info("sshobject -> SUCCESS")
        return True

    def exec_remote_cmd(self, cmd):
        stdin, stdout, stderr = self.sshobj.exec_command(cmd)
        strline = ""
        for line in iter(stdout.readline, ""):
            strline += line
        return strline

    def exec_remote_cmd_with_no_output(self, cmd):
        self.sshobj.exec_command(cmd)


def file_scp(host_ip, user, pas, host_path, local_path, dir=False, upload=False):
    """
    :param host_ip:
    :param user:
    :param pas:
    :param host_path:
    :param local_path:
    :param dir:
    :return:
    """
    ret_val = "PASS"
    try:
        if upload == True:
            command = "{} {}@{}:{}".format(local_path,
                                           user, host_ip, host_path)
        else:
            command = "{}@{}:{} ".format(user, host_ip,
                                         host_path) + "{}".format(local_path)
        if dir == True:
            command = "scp -r " + command
        else:
            command = "scp " + command

        logger.console("scp command = {}".format(command))
        scp_obj = pexpect.spawn('bash -c "%s"' % str("{}".format(command)))

        scp_obj.setwinsize(5000, 5000)
        scp_obj.maxread = 8000
        scp_obj.setecho(False)
        # scp_obj.sendline('\n')
    except Exception as err:
        return err
    else:
        ret_val = "FAIL"
        scp_obj.timeout = 180
        first = scp_obj.expect(['yes', 'password:', 'Unable to connect',
                               'No route to host', '#', pexpect.EOF, pexpect.TIMEOUT])
        if first == 0:
            scp_obj.sendline('yes')
            second = scp_obj.expect(
                ['Password:', 'password', pexpect.EOF, pexpect.TIMEOUT])
            if second == 0 or second == 1:
                scp_obj.sendline(pas)
                index = scp_obj.expect(
                    ['Password:', 'password:', 'No file', pexpect.EOF, pexpect.TIMEOUT])
                if index == 0 or index == 1:
                    ret_val = "FAIL : DUT machine password is wrong"
                elif index == 2:
                    ret_val = "FIL : No such file or directory"
                elif index == 3:
                    # "SCP : SUCCESS"
                    ret_val = "PASS"
            if second == 2:
                # ret_val = "SCP : SUCCESS"
                ret_val = "PASS"
        if first == 1:
            scp_obj.sendline(pas)
            second = scp_obj.expect(
                ['Password:', 'password:', 'No file', pexpect.EOF, pexpect.TIMEOUT])
            if second == 0 or second == 1:
                ret_val = "FAIL : DUT machine pasword is wrong"
            elif second == 2:
                ret_val = "FAIL : No such file or directory"
            elif second == 3:
                # "SCP :100% SUCCESS"
                ret_val = "PASS"
            elif second == 4:
                ret_val = "FAIL : object EOF"
        if first == 2 or first == 3:
            ret_val = "DUT is not reachable problem with ip/user"

        if first == 5:
            ret_val = "PASS"
    return ret_val
