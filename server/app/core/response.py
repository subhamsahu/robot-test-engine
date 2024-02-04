def success_response(status=200, data=None):
    return {
        "status": status,
        "success": True,
        "exception_reason": None,
        "data": data
    }


def error_response(status=500, err=None):
    return {
        "status": status,
        "success": False,
        "exception_reason": err,
        "data": None
    }
