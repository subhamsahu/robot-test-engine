*** Settings ***

Suite Setup      TEST_SUITE_SETUP
Suite Teardown   TEST_SUITE_TEARDOWN
Test Setup       TEST_SETUP
Test Teardown    TEST_TEARDOWN
Resource         ${CURDIR}/../src/resources.robot
Resource         ${CURDIR}/objects/objects.robot
Resource         ${CURDIR}/keywords/keywords.robot
Resource         ${CURDIR}/variables/variables.robot


Test Tags    POC

*** Test Cases ***

TC-01
    [Documentation]  Sample Testcase to create and delete a device manager on Domain Proxy
    [Tags]  TEST

    ${resp}=   Custom Keyword  arg1=arg1

