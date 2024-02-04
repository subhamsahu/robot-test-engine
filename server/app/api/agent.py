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
from app.controllers.agent import AgentService

agent = Blueprint('admin', __name__, url_prefix=API_PREFIX + '/agent')
agent_controller_obj = AgentService()

@agent.route('/execute-test-plan', methods=['GET'])
def get_file_data():
    try:
        return success_response()
    except BadRequestException as e:
        return error_response(400,str(e))
    except Exception as e:
        return error_response(500,str(e))