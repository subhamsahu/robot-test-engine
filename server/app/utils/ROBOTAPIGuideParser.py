from bs4 import BeautifulSoup
import re
import json
import sys
import time
import os
from os.path import expanduser

from bs4 import BeautifulSoup

class ROBOTAPIGuideParser:
    def __init__(self):
        self.final_json = []

    def parse_html(self, file_name, additionalFields=[]):
        """
        :return:
        """
        try:
            with open(file_name, "r", encoding='utf-8') as html_file:
                content = html_file.read()
                soup = BeautifulSoup(content, 'lxml')
                title = soup.find('title').text
                divTags = soup.find_all('div', class_="keyword-container match")
                if len(divTags) != 0:
                    # Handling ROBO APIs
                    for x in divTags:
                        api_arg_dict = {"keyword": x.h2.text.strip()}
                        arg = []
                        spanTags = x.find_all('span', {"class": "arg-name arg-required"})
                        for y in spanTags:
                            subStringOne = re.sub(r'<span class=\"\S+-\S+ \S+-\S+\" title=\"\S+ \S+\">', '', str(y))
                            subStringOne = re.sub(r'</span>', '', subStringOne)
                            stripSubStringOne = subStringOne.strip()
                            # arg.append(stripSubStringOne)
                            baseArg = {
                                'name': stripSubStringOne,
                                'defaultValue': None,
                                'kind': 'POSITIONAL_OR_NAMED',
                                'required': True,
                            }
                            
                            for additionalField in additionalFields:
                                for fieldName in additionalField:
                                    baseArg[fieldName] = additionalField[fieldName]

                            # arg.append({
                            #     'name': stripSubStringOne,
                            #     'defaultValue': None,
                            #     'kind': 'POSITIONAL_OR_NAMED',
                            #     'required': True,
                            # },)
                            
                            arg.append(baseArg)
                            
                        spanTagsForArgName = x.find_all('span', {"class": "arg-name arg-optional"})

                        if len(spanTagsForArgName) == 0:
                            api_arg_dict["args"] = arg
                            # print(api_arg_dict)
                            self.final_json.append(api_arg_dict)
                        else:
                            for y in spanTagsForArgName:
                                subStringTwo = re.sub(r'<span class=\"\S+-\S+ \S+-\S+\" title=\"\S+ \S+\">', '', str(y))
                                subStringTwo = re.sub(r'</span>', '', subStringTwo)
                                str1 = subStringTwo.strip()
                            spanTagsForEqual = x.find_all('span', {"class": "arg-default-eq"})
                            for y in spanTagsForEqual:
                                subStringThree = re.sub(r'<span class=\"\S+-\S+\">', '', str(y))
                                subStringThree = re.sub(r'</span>', '', subStringThree)
                                str2 = subStringThree.strip()
                            spanTagsForEqualValue = x.find_all('span', {"class": "arg-default-value"})
                            for y in spanTagsForEqualValue:
                                subStringFour = re.sub(
                                    r'<span class=\"\S+-\S+\" title=\"\S+ \S+ \S+ \S+ \S+ \S+ \S+ \S+ \S+ \S+\">', '',
                                    str(y))
                                subStringFour = re.sub(r'</span>', '', subStringFour)
                            # arg.append(str1+str2+subStringFour.strip())
                            spanTagsForArgOptional = x.find_all('span', {"class": "arg-name arg-optional"})
                            if len(spanTagsForArgOptional) != 0:
                                for y in spanTagsForArgOptional:
                                    subStringFive = re.sub(r'<span class=\"\S+-\S+ \S+-\S+\" title=\"\S+ \S+\">', '',
                                                           str(y))
                                    subStringFive = re.sub(r'</span>', '', subStringFive)
                                    subStringFive = re.sub(
                                        r'<span class="arg-kind" title="Variable number of arguments">', '',
                                        subStringFive)

                                    subStringFive = re.sub(
                                        r'<span class="arg-kind" title="Variable number of named arguments">', '',
                                        subStringFive)

                                    subStringFive = subStringFive.replace(" ", "")
                                    subStringFive = subStringFive.replace("\n", "")
                                    # arg.append(subStringFive)
                                    baseArg = {
                                        'name': subStringFive,
                                        'defaultValue': None,
                                        'kind': 'POSITIONAL_OR_NAMED',
                                        'required': False,
                                    }
                                    
                                    for additionalField in additionalFields:
                                        for fieldName in additionalField:
                                            baseArg[fieldName] = additionalField[fieldName]
                                    
                                    # arg.append({
                                        # 'name': subStringFive,
                                        # 'defaultValue': None,
                                        # 'kind': 'POSITIONAL_OR_NAMED',
                                        # 'required': False,
                                    # },
                                    # )
                                    arg.append(baseArg)
                            api_arg_dict["args"] = arg
                            # print(api_arg_dict)

                            self.final_json.append(api_arg_dict)
                else:
                    # Handling costom APIs
                    headTags = soup.find('head')
                    allScriptTags = headTags.find_all('script')[-1].text
                    scriptTagsForLibdoc = re.sub(r'libdoc = ', '', allScriptTags)
                    jsonScriptTagsForlibdoc = json.loads(scriptTagsForLibdoc)
                    length = len(jsonScriptTagsForlibdoc['keywords'])
                    title = jsonScriptTagsForlibdoc['name']
                    for x in range(length):
                        api_arg_dict = {"keyword": jsonScriptTagsForlibdoc["keywords"][x]['name']}
                        arg = []
                        a = len(jsonScriptTagsForlibdoc["keywords"][x]['args'])
                        for y in range(a):
                            # z = #jsonScriptTagsForlibdoc["keywords"][x]['args'#][y]['name']
                            z = jsonScriptTagsForlibdoc["keywords"][x]['args'][y]
                            arg.append(z)

                        api_arg_dict["args"] = arg
                        # print(api_arg_dict)
                        self.final_json.append(api_arg_dict)
            #print("PARSINF DONE....", self.final_json)
        except Exception as err:
            print("ERROR", f"Exception in parse_html {err}")
        return self.final_json

obj = ROBOTAPIGuideParser()
file_name = "/opt/odpuser/automation_test_framework/server/app/static/robotframework-userguide-6.1.1/libraries/BuiltIn.html"
api_json = obj.parse_html(file_name, additionalFields= [{"argsWithoutName" : True}])
with open('api_list.json', 'w') as fout:
    json.dump(api_json,fout, indent=2)