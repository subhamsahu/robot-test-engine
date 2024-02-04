SW_RELEASE = 'v1.0'

# Framework Configs
HOST_IP='X.X.X.X'
PASSKEY = "root123"
ROBOT_INSTANCE_ID = 1
TEST_PLAN = 'testplan.csv'

SETUP = ['NODE1','NODE2']         # This list indicates the nodes that will start at setup bringup an enables auto log copy
KILL_NODES_AT_TEARDOWN = True   # This will kill the nodes at end of each testcase, marking it as False will igonore

PCAP_CAPTURE =  False

SETUP_DETAILS = {
    'NODE1': {
        'ip': HOST_IP,
        'user': 'root',
        'password': PASSKEY,
        'build_path': '',
        'sudo': True,
        'log_path': '',
        'bring_up':True
    },
    'NODE2': {
        'ip': HOST_IP,
        'user': 'root',
        'password': PASSKEY,
        'build_path': '',
        'sudo': True,
        'log_path': '',
        'bring_up':True
    }
}
