#*****************************************************************************************************#
# From this file we can generate the api document as html                                             #
# Using below command                                                                                 #
#                                                                                                     #
# python3 -m robot.libdoc -n AUTOMATION_API_GUIDE -v Version-Dev api_documentation.robot robot_framework_api_guide.html     #
#                                                                                                     #
#*****************************************************************************************************#

*** Settings ***
Documentation    API reference document for Custom Robot Automation Framework. 
    ...    
    ...    

*** Keywords ***


API NAME

    [Arguments]  ${arg1}   ${arg2}   ${arg3}
    [Documentation]    This api is used to do something
    ...
    ...     Parameters :
    ...    | arg1               | some description (required)    |
    ...    | arg2               | some description (optional)    |
    ...    | arg3               | some description (optional)    |
    ...
    ...    Examples:
    ...    | API NAME   arg1=val1  arg2=val2 (optional)  arg3=val3 (optional)
    ...
    No Operation
