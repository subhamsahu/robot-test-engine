# Robot Test Engine
This repository contains skeleton code for robot based automation framework

## Code Prerequisites
* Python 3.10.12 with Ubuntu 22.04
* Node js v18.18.0 (for react ui)

## Folder Structure
   robot-test-engine
      ├───logs  (All Logs will be captured here)
      ├───server  (This dir contains server code when ui to be used for automation testcase scripting or execution)
      │   └───app
      │       ├───api
      │       ├───controllers      
      │       ├───core
      │       └───db
      ├───test-framework (This dir contains code for test framework and can be used independently)
      │   ├───config (This dir will contain config to be used by test framework)
      │   ├───data (This dir will contain data to be used by tests in test framework)
      │   │   └───test-inputs
      │   ├───src (This dir will contain source code of test framework)
      │   ├───testplan (This dir will contain testplan in csv format to select/deselect testcases)
      │   ├───tests (This dir contains testcases in .robot files)
      │   └───utilities (Any other utilities related to framework will come here)
      └───ui (This dir contains ui code in React)

## Steps for Test Framework Installation and Startup
1. Run install.sh to install all the dependency
2. Update test-framework from test-framework/config/config.py file
3. Update server folder config by updating server/.env file 
4. Run deploy.sh to deploy the ui, server and test-framework

## Running the Testcases
1. Navigate Inside test-framework dir , select the testcase from testplan/tesplan.csv
2. Execute python3.10 test_plan_executor.py to execute the testcases
Note: test plan executor will take care of log caturing and directory creation etc
