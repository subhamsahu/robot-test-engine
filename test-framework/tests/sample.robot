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

    ${resp}=   Make POST Request  url=http://172.26.3.21:5080/api/v1/dummy/products   file=product.json
    Should Be Equal    ${resp.status_code}    ${STATUS_CREATED}

    ${resp}=   Make GET Request  url=http://172.26.3.21:5080/api/v1/dummy/products
    Should Be Equal    ${resp.status_code}    ${STATUS_OK}
    Log To Console     ${resp.text}

    ${resp}=   Make PUT Request  url=http://172.26.3.21:5080/api/v1/dummy/products/1   file=product.json
    Should Be Equal    ${resp.status_code}    ${STATUS_OK}

    ${resp}=   Make DELETE Request  url=http://172.26.3.21:5080/api/v1/dummy/products/1
    Should Be Equal    ${resp.status_code}    ${STATUS_OK}