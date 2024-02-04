from pyfiglet import Figlet
from app.core.log import log
import os
import sys
import traceback


class Colour(object):
    """
    Used to print the colours in the Console Prints.
    Contains no Methods
    """
    header = '\033[95m'
    blue = '\033[94m'
    green = '\033[92m'
    yellow = '\033[93m'
    red = '\033[91m'
    end_c = '\033[0m'
    bold = '\033[1m'
    underline = '\033[4m'


def display_dotted_string(string):
    """
    Used to display the string in a dotted format
    :param string: String
    :return: None
    """

    font = Figlet(font='slant')
    print(Colour.blue + font.renderText(string) + Colour.end_c)

def print_error_trace(e):
    exc_type, exc_obj, exc_tb = sys.exc_info()
    fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
    traceback_details = traceback.extract_tb(exc_tb)
    log.log_error(f"{exc_type}, {fname}, {exc_tb.tb_lineno}")
    for trace in traceback_details:
        log.log_console(f"File: {trace[0]}, Line: {trace[1]}, Function: {trace[2]}, Exception: {exc_type.__name__}: {exc_obj}")
