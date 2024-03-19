#*****************************************************************************************************#
# From this file we can generate the api document as html                                             #
# Using below command                                                                                 #
#                                                                                                     #
# python3 -m robot.libdoc -n AUTOMATION_API_GUIDE -v Version-Dev api_documentation.robot custom_api_guide.html     #
#                                                                                                     #
#*****************************************************************************************************#

*** Settings ***
Documentation    API reference document for Custom Robot Automation Framework. 
    ...    
    ...    

*** Keywords ***


Make POST Request

    [Arguments]  ${url}   ${file}=optional   ${delete}=optional  @{other_parameters}
    [Documentation]    This api is used to do something
    ...
    ...     Parameters :
    ...    | url                | url of POST request (required)    |
    ...    | file               | payload file  (optional)    |
    ...    | delete             | list of parameters to delete from payload (optional)    |
    ...    | other_parameters   | list of parameters to update in payload (optional)    |
    ...
    ...    Examples:
    ...    | Make POST Request  url=http://172.26.3.21:5080/api/v1/dummy/products   file=product.json
    ...
    No Operation

Make GET Request

    [Arguments]  ${url}  ${params}=optional  @{other_parameters}
    [Documentation]    This api is used to do something
    ...
    ...     Parameters :
    ...    | url                | url of POST request (required)    |
    ...    | params             | parameters with url  (optional)    |
    ...    | other_parameters   | list of other parameters (optional)    |
    ...
    ...    Examples:
    ...    | Make GET Request  url=http://172.26.3.21:50
    ...
    No Operation

Make PUT Request

    [Arguments]  ${url}   ${file}=optional   ${delete}=optional  @{other_parameters}
    [Documentation]    This api is used to do something
    ...
    ...     Parameters :
    ...    | url                | url of PUT request (required)    |
    ...    | file               | payload file  (optional)    |
    ...    | delete             | list of parameters to delete from payload (optional)    |
    ...    | other_parameters   | list of parameters to update in payload (optional)    |
    ...
    ...    Examples:
    ...    | Make PUT Request  url=http://172.26.3.21:5080/api/v1/dummy/products   file=product.json
    ...
    No Operation

Make DELETE Request

    [Arguments]  ${url}  ${params}=optional  @{other_parameters}
    [Documentation]    This api is used to do something
    ...
    ...     Parameters :
    ...    | url                | url of POST request (required)    |
    ...    | params             | parameters with url  (optional)    |
    ...    | other_parameters   | list of other parameters (optional)    |
    ...
    ...    Examples:
    ...    | Make GET Request  url=http://172.26.3.21:50
    ...
    No Operation