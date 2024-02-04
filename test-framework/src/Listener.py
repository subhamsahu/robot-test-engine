from robot.libraries.BuiltIn import BuiltIn


class TestListener:

    ROBOT_LIBRARY_SCOPE = "GLOBAL"
    ROBOT_LISTENER_API_VERSION = 3

    def __init__(self):
        pass

    def start_suite(self, suite, result):
        pass

    def start_test(self, test, result):
        pass

    def end_test(self, data, result):
        pass

    def end_suite(self, suite, result):
        pass


