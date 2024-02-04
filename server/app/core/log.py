import logging
from robot.api import logger
from pathlib import Path

log_path = Path(__file__).parent.parent.parent


class Log:
    def __init__(self):
        self.log_file = Path(log_path, 'server.log')
        self.logger = logging.getLogger(__name__)
        self.logger.setLevel(logging.DEBUG)

        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s')

        file_handler = logging.FileHandler(self.log_file)
        file_handler.setLevel(logging.DEBUG)
        file_handler.setFormatter(formatter)

        self.logger.addHandler(file_handler)

    def log_info(self, message, cli=False):
        self.logger.info(message)
        if cli:
            # This logs the message to Robot Framework's log as well
            logger.console(message)

    def log_warning(self, message, cli=False):
        self.logger.warning(message)
        if cli:
            # This logs the message to Robot Framework's log as well
            logger.console(message)

    def log_error(self, message, cli=False):
        self.logger.error(message)
        if cli:
            # This logs the message to Robot Framework's log as well
            logger.console(message)
    def log_console(self,message):
        logger.console(message)


log = Log()
