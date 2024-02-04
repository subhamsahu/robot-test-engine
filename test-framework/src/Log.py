import logging
from robot.api import logger


class Log:
    instance = None

    def __init__(self, log_path='Logs'):
        self.log_path = log_path
        self.log_file = log_path + '/testsuite.log'
        self.logger = logging.getLogger(__name__)
        self.logger.setLevel(logging.DEBUG)

        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s')

        file_handler = logging.FileHandler(self.log_file)
        file_handler.setLevel(logging.DEBUG)
        file_handler.setFormatter(formatter)

        self.logger.addHandler(file_handler)

    def log_info(self, message, cli=True):
        self.logger.info(message)
        # This logs the message to Robot Framework's log as well
        if cli:
            logger.console(f"INFO: {message}" )

    def log_warning(self, message, cli=True):
        self.logger.warning(message)
        # This logs the message to Robot Framework's log as well
        if cli:
            logger.console(f"WARNING: {message}" )

    def log_error(self, message, cli=True):
        self.logger.error(message)
        # This logs the message to Robot Framework's log as well
        if cli:
            logger.console(f"ERROR: {message}" )

    @classmethod
    def get_logger(cls, logspath=None):
        if not cls.instance:
            cls.instance = cls(logspath)
        # logger.console(cls.instance)
        return cls.instance
