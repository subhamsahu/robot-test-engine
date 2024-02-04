from flask import Flask, request, Response, redirect, session, Blueprint
from app.core.response import success_response, error_response
from app.core.exceptions import BadRequestException
import uuid
import time
import json
import os
import sys
from app.core.log import log
from robot.api import logger
from app.core.constants import API_PREFIX, APP_PATH
from app.controllers.file_manager import FileManager
from app.core.utils import print_error_trace

file_manager = Blueprint('file_manager', __name__, url_prefix=API_PREFIX + '/file-manager')
file_manager_controller_obj = FileManager()

@file_manager.route('/get-file-data', methods=['GET'])
def get_file_data():
    try:
        relative_file_path = request.args.get("file_path", None)
        absolute_file_path = APP_PATH + relative_file_path
        log.log_info(f"Requested File Path: {absolute_file_path}")
        data = file_manager_controller_obj.get_file_data(absolute_file_path)
        return success_response(data=data)
    except BadRequestException as e:
        log.log_error(f"{e.msg}")
        return error_response(400,str(e.msg)), 400
    except Exception as e:
        log.log_error(f"{e}")
        print_error_trace(e)
        return error_response(500,str(e)), 500
    
@file_manager.route('/set-file-data', methods=['POST'])
def set_file_data():
    try:
        return success_response()
    except BadRequestException as e:
        return error_response(400,str(e))
    except Exception as e:
        return error_response(500,str(e))