from app.main import create_flask_app
from app.core.utils import display_dotted_string
from app.core.settings import HOST, PORT, DEBUG
from app.core.log import log

if __name__ == '__main__':
    display_dotted_string("Robo Server")
    log.log_info(f"Robo Server Started at {HOST}:{PORT}")
    app = create_flask_app()
    def list_endpoints():
        for rule in app.url_map.iter_rules():
            if 'GET' in rule.methods or 'POST' in rule.methods:
                log.log_info({
                    'endpoint': rule.endpoint,
                    'methods': ','.join(rule.methods),
                    'url': str(rule)
                })
    # list_endpoints()
    app.run(
        host=HOST,
        port=int(PORT),
        debug=DEBUG
    )
