class BaseException(Exception):
    def __init__(self, msg, status):
        self.msg = msg
        self.status = status

    def __str__(self):
        return self.msg + ' ' + self.status


class BadRequestException(BaseException):
    def __init__(self, msg, status=400):
        super().__init__(msg, status)

class APPException(BaseException):
    def __init__(self, msg, status=500):
        super().__init__(msg, status)

