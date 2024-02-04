from config import config
from pathlib import Path
import csv
import os
import datetime
import time
import sys

def execute_test_plan(rerun_count):
    test_plan = config.TEST_PLAN
    file_path = Path(Path(__file__).parent, 'testplan',test_plan)
    test_path = Path(Path(__file__).parent, 'tests')
    root_log_path = Path(Path(__file__).parent.parent, 'logs')
    print("Testplan Path: ", file_path)
    print("Tests Path: ",test_path)
    print("Log Path: ",root_log_path)
    data_dict={}
    with open(file_path, 'r') as csvfile:
        csvreader = csv.DictReader(csvfile)
        for row in csvreader:
            suite = row['Suite']
            if suite =='':
                continue
            test_case_id = row['Testcase Id']
            execute = row['Execute']
            # If the name is already in the dictionary, append to the list of values
            if str(execute).lower() == 'y':
                if suite in data_dict:
                    data_dict[suite].append({'testcase_id': test_case_id, 'execute': execute})
                else:
                    data_dict[suite] = [{'testcase_id': test_case_id, 'execute': execute}]
    print(data_dict)
    for suite in data_dict.keys():
        ts = time.time()
        timestamp = datetime.datetime.fromtimestamp(ts).strftime('%Y_%m_%d_%H_%M_%S')
        suite_log = Path(root_log_path , f'{suite}_{timestamp}')
        os.makedirs(suite_log)
        robot_str = f'robot --outputdir {suite_log} -v  LogDir:{suite_log} '
        for testcase_items in data_dict[suite]:
            if str(testcase_items['execute']).lower() == 'y':
                robot_str = robot_str + f"-t {testcase_items['testcase_id']} "
        robot_str = robot_str  + str(Path(test_path,f'{suite}.robot'))
        os.system(robot_str)

if len(sys.argv) == 2:
    rerun_count = int(sys.argv[1])
    execute_test_plan(rerun_count)
else:
    print("Usage: \n{}".format("python3.10 test_plan_executor.py  rerun_count"))
    print("Example: \npython3.10 test_plan_executor.py  2")