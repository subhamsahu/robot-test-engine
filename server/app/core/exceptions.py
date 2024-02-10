class BaseException(Exception):
    """Base class for all exceptions in this application."""

    def __init__(self, msg, status):
        """
        Initialize a new BaseException instance.

        Args:
            msg (str): A human-readable error message.
            status (int): The HTTP status code for this exception.
        """
        self.msg = msg
        self.status = status

    def __str__(self):
        """Return a human-readable representation of this exception."""
        return self.msg + ' ' + self.status


class BadRequestException(BaseException):
    """Exception raised when the request is bad."""

    def __init__(self, msg, status=400):
        """
        Initialize a new BadRequestException instance.

        Args:
            msg (str): A human-readable error message.
            status (int, optional): The HTTP status code for this exception.
                Defaults to 400.
        """
        super().__init__(msg, status)


class APPException(BaseException):
    """Exception raised when an unexpected error occurs."""

    def __init__(self, msg, status=500):
        """
        Initialize a new APPException instance.

        Args:
            msg (str): A human-readable error message.
            status (int, optional): The HTTP status code for this exception.
                Defaults to 500.
        """
        super().__init__(msg, status)