*** Settings ***

Documentation   Resource File
Library         TestController.py


*** Variables ***
${Config}          ${CURDIR}//..//config//config.py
${LOGDIR}          None


*** Keywords ***
TEST_SUITE_SETUP
    [Documentation]    This is Suite Setup it will be responsible for checking all suite
    ...  related configs are done or not and various other tasks as well creating the
    ...  log directory to copy the log files.

    Log To Console   \n******** TEST_SUITE_SETUP ********\n
        
    ${resp_suite_things}=   Setup Suite   log_dir=${LOGDIR}  
    Should Be Equal As Strings    ${resp_suite_things}    PASS

TEST_SETUP
    [Documentation]    This routine is before each test case.

    log to console    \n******** TEST_SETUP ********\n
    Setup Test

TEST_TEARDOWN
    [Documentation]    This routine is end of each test case.

    log to console     \n******** TEST_TEARDOWN ********\n
    Teardown Test

TEST_SUITE_TEARDOWN
    [Documentation]    This is Suite Tear down, it will be responsible for clearing suite related

    log to console   \n******** TEST_SUITE_TEARDOWN ********\n


