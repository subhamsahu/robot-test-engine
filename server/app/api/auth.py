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

auth = Blueprint('auth', __name__, url_prefix=API_PREFIX + '/auth')

@auth.route('/login')
def login():
    return "login"