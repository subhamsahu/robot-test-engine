from flask import Flask, request, Response, redirect, session, Blueprint
from app.core.response import success_response, error_response
from app.core.exceptions import BadRequestException
import uuid
import time
import json
import os
import sys

from app.core.log import log
from app.core.constants import API_PREFIX
from app.controllers.test_manager import TestManagerService

test_manager = Blueprint('test_manager', __name__, url_prefix=API_PREFIX + '/test-manager')
test_manager_controller_obj = TestManagerService()

@test_manager.route('/suite/create', methods=['POST'])
def create_suite():
    """
    Creates a new test suite based on the given payload.

    :param payload: The request payload containing the necessary information to create the test suite.
    :type payload: dict
    :return: A response object containing the status code and a message.
    :rtype: tuple
    """
    try:
        payload = request.get_json()
        log.log_console(payload)
        data= test_manager_controller_obj.create_suite(payload)
        return success_response(status=201, data=None), 201
    except BadRequestException as e:
        return error_response(400,str(e)), 400
    except Exception as e:
        return error_response(500,str(e)), 500

@test_manager.route('/suite/delete', methods=['DELETE'])
def delete_suite():
    """
    Delete a test suite.

    :param payload: The request payload containing the necessary information to delete the test suite.
    :type payload: dict
    :return: A response object containing the status code and a message.
    :rtype: tuple
    """
    try:
        id = request.args['id']
        data= test_manager_controller_obj.delete_suite(id)
        return success_response(status=202, data=None), 202
    except BadRequestException as e:
        return error_response(400,str(e)), 400
    except Exception as e:
        return error_response(500,str(e)), 500

@test_manager.route('/suite/list', methods=['GET'])
def list_suite():
    try:
        data= test_manager_controller_obj.list_suite()
        return success_response(status=202, data=data), 202
    except BadRequestException as e:
        return error_response(400,str(e)), 400
    except Exception as e:
        return error_response(500,str(e)), 500

@test_manager.route('/testcase/create', methods=['POST'])
def create_testcase():
    try:
        payload = request.get_json()
        log.log_console(payload)
        data= test_manager_controller_obj.create_testcase(payload)
        return success_response(status=201, data=None), 201
    except BadRequestException as e:
        return error_response(400,str(e)), 400
    except Exception as e:
        return error_response(500,str(e)), 500
    
@test_manager.route('/testcase/delete', methods=['DELETE'])
def delete_testcase():
    try:
        id = request.args['id']
        data= test_manager_controller_obj.delete_testcase(id)
        return success_response(status=200, data=None), 200
    except BadRequestException as e:
        return error_response(400,str(e)), 400
    except Exception as e:
        return error_response(500,str(e)), 500

@test_manager.route('/testcase/list', methods=['GET'])
def list_testcase():
    try:
        data= test_manager_controller_obj.list_testcase()
        return success_response(status=200, data=data), 200
    except BadRequestException as e:
        return error_response(400,str(e)), 400
    except Exception as e:
        return error_response(500,str(e)), 500
@test_manager.route('/testplan/create', methods=['POST'])
def create_testplan():
    try:
        payload = request.get_json()
        log.log_console(payload)
        data= test_manager_controller_obj.create_testplan(payload)
        return success_response(status=201, data=None), 201
    except BadRequestException as e:
        return error_response(400,str(e)), 400
    except Exception as e:
        return error_response(500,str(e)), 500
    
@test_manager.route('/testplan/delete', methods=['DELETE'])
def delete_testplan():
    try:
        id = request.args['id']
        data= test_manager_controller_obj.delete_testplan(id)
        return success_response(status=200, data=None), 200
    except BadRequestException as e:
        return error_response(400,str(e)), 400
    except Exception as e:
        return error_response(500,str(e)), 500

@test_manager.route('/testplan/list', methods=['GET'])
def list_testplan():
    try:
        data= test_manager_controller_obj.list_testplan()
        return success_response(status=200, data=data), 200
    except BadRequestException as e:
        return error_response(400,str(e)), 400
    except Exception as e:
        return error_response(500,str(e)), 500

@test_manager.route('/robot-api/list', methods=['POST','GET'])
def create_robot_api_list():
    try:
        if request.method == 'POST':
            data= test_manager_controller_obj.create_robot_api_list()
            return success_response(status=201, data=data), 202
        else:
            data = test_manager_controller_obj.fetch_robot_api_list()
            return success_response(status=200, data=data), 202
    except BadRequestException as e:
        return error_response(400,str(e)), 400
    except Exception as e:
        return error_response(500,str(e)), 500