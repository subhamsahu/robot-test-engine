*** Settings ***

Suite Setup      TEST_SUITE_SETUP
Suite Teardown   TEST_SUITE_TEARDOWN
Test Setup       TEST_SETUP
Test Teardown    TEST_TEARDOWN
Resource         ${CURDIR}/../src/resources.robot


Test Tags    POC

*** Variables ***
${OK}=   ${200}

*** Test Cases ***

TC-01
    [Documentation]  Sample Testcase to create and delete a device manager on Domain Proxy
    [Tags]  TEST

    ${resp}=   Custom Keyword  arg1=arg1

