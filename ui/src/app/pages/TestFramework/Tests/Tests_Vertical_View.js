import React, { useEffect, useState, useRef } from 'react'
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import MonacoEditor from 'react-monaco-editor';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import { Tabs } from 'antd';
import PreviewIcon from '@mui/icons-material/Preview';
import { Box, Icon, Paper } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';


import { ContentBox } from '../../../styles/AppStyles'
import ROBOTApiForm from './components/ROBOTApiForm'
import { get, post, remove } from '../../../services/api';
import { BACKEND_URL } from '../../../core/constants';
import { useDispatch } from 'react-redux';
import { showSnackBar } from '../../../redux/actions/snackBarActions';
import { ConditionLoopControls, TestcaseStates, initCode, stateColorMap } from './components/Constants';
import { setTestcaseList } from '../../../redux/actions/testcaseAction';

// Destructure the Tab component from Tabs
const { TabPane } = Tabs;

const createPayload = {
  'name': 'sample',
  'description': 'sample description',
  'state': 'scripting',
  'body': initCode,
  'keywords': []
}


const Tests = () => {
  const dispatch = useDispatch()
  const editorRef = useRef(null);
  const [editorCursorPosition, setEditorCursorPostion] = useState(0)

  const [testcaseList, settestcaselist] = useState([

  ]);

  const [testcasepayload, settestcasepayload] = useState(createPayload)

  const [selectedTestcase, setSelectedTestcase] = useState(null)

  const [robotAPIList, setrobotAPIList] = useState([]);
  const [selectedRobotAPI, setselectedRobotAPI] = useState('None')

  const [customAPIList, setcustomAPIList] = useState([]);
  const [selectedCustomAPI, setselectedCustomAPI] = useState('None')

  const [selectedAPI, setselectedAPI] = useState(null)
  const [selectedLoopConditionControl, setSelectedLoopConditionControl] = useState({
    "keyword": "FOR",
    "body": "\nFOR    ${INDEX}    IN RANGE    2    5\n\t<statement>\nEND"
  })

  useEffect(() => {
    fetchRobotAPIList()
    fetchTestcaseList()
  }, [])


  const fetchRobotAPIList = async () => {
    const url = BACKEND_URL + '/test-manager/robot-api/list'
    let params = {}
    const data = await get(url, params)

    if (data && data?.success === true) {
      setrobotAPIList(data?.data)
    } else {
      dispatch(showSnackBar({ msg: `Fetch Robot API List Fail ${data.exception_reason}`, type: "error" }))
    }
  }

  const fetchTestcaseList = async () => {
    const url = BACKEND_URL + '/test-manager/testcase/list'
    let params = {}
    const data = await get(url, params)

    if (data && data?.success === true) {
      settestcaselist(data?.data)
      dispatch(setTestcaseList(data.data))
    } else {
      dispatch(showSnackBar({ msg: `Fetch Testcases Fail ${data.exception_reason}`, type: "error" }))
    }
  }

  useEffect(() => {

  }, []);

  const editorDidMount = (editor, monaco) => {
    const cursorPosition = editor.getPosition();
    editorRef.current = { editor, monaco };
    editor.onDidChangeCursorSelection((event) => {
      const cursorPosition = event.selection;
      setEditorCursorPostion(cursorPosition.startLineNumber)
    });
  };

  const handleCodeChange = (newCode) => {
    // setCode(newCode);
    settestcasepayload(prevState => ({
      ...prevState,
      body: newCode
    }));
  };

  const handleAppendToCode = (newCode) => {
    if (editorRef.current) {
      // Get the Monaco Editor instance
      const editor = editorRef.current.editor;

      // Set the text content of the editor
      const newText = newCode;
      const lineNumber = editorCursorPosition; // Replace with the desired line number

      // Get the current content
      const currentContent = editor.getValue().split('\n');

      // Insert the new text at the specified line number
      currentContent.splice(lineNumber - 1, 0, newText);

      // Set the modified content back to the editor
      // editor.setValue(currentContent.join('\n'));
      settestcasepayload(prevState => ({
        ...prevState,
        body: currentContent.join('\n')
      }));
    }
    else {
      // setCode(code + newCode)
      settestcasepayload(prevState => ({
        ...prevState,
        body: prevState.body + newCode
      }));
    }
  }

  const handleAPISelection = (e, apiType) => {
    if (apiType === 'robot') {
      setselectedRobotAPI(e.target.value)
      setselectedCustomAPI('None')
      const selectedObj = robotAPIList.find(obj => obj.keyword === e.target.value);
      setselectedAPI(selectedObj);
    } else if (apiType == 'custom') {
      setselectedRobotAPI('None')
      setselectedCustomAPI(e.target.value)
      const selectedObj = customAPIList.find(obj => obj.keyword === e.target.value);
      setselectedAPI(selectedObj);
    }
  }

  const handleLoopConditionControlSelection = (e) => {
    let selectedObj = ConditionLoopControls.find(obj => obj.keyword === e.target.value);
    setSelectedLoopConditionControl(selectedObj)
  }

  const handleCreateTestcase = async () => {
    const url = BACKEND_URL + '/test-manager/testcase/create'
    let payload = testcasepayload
    const data = await post(url, payload)

    if (data && data?.success === true) {
      dispatch(showSnackBar({ msg: "Create Testcase Success", type: "success" }))
      fetchTestcaseList()
      resetThings()
    } else {

      dispatch(showSnackBar({ msg: `Create Testcase Fail ${data.exception_reason}`, type: "error" }))
    }
  }

  const handleDeleteTestcase = async () => {
    let params = {
      'id': testcasepayload._id,
    }
    const url = BACKEND_URL + '/test-manager/testcase/delete'
    const data = await remove(url, params)

    if (data && data?.success === true) {
      dispatch(showSnackBar({ msg: "Delete Testcase Success", type: "success" }))
      fetchTestcaseList()
      resetThings()
    } else {
      dispatch(showSnackBar({ msg: `Delete Testcase Fail ${data.exception_reason}`, type: "error" }))
    }
  }

  const handleSaveTestcase = async () => {
    let test_data = {
      'name': testcasepayload.name,
      'body': testcasepayload.body,
      'keywords': []
    }
    // const url = BACKEND_URL + '/test-manager/testcase/create'
    // let payload = test_data
    // const data = await post(url, payload)
    // 
    // if (data && data?.success === true) {
    //   dispatch(showSnackBar({ msg: "Create Testcase Success", type: "success" }))
    // } else {
    //   
    //   dispatch(showSnackBar({ msg: `Create Testcase Fail ${data.exception_reason}`, type: "error" }))
    // }
  }

  const handleChange = (event, newValue) => {
    settestcasepayload(prevState => ({
      ...prevState,
      name: newValue
    }));
  };

  const handleInputChange = (event, newInputValue) => {
    // This will be triggered when the user types
    settestcasepayload(prevState => ({
      ...prevState,
      name: newInputValue
    }));
    let selectedObj = testcaseList.find(obj => obj.name === newInputValue);
    if (selectedObj) {
      // setCode(selectedObj.body)
      setSelectedTestcase(selectedObj)
      settestcasepayload(selectedObj);
    }
    else {
      // setCode(initCode)
      setSelectedTestcase(null)
      settestcasepayload(prevState => ({
        ...prevState,
        body: initCode
      }));
    }
  };

  const resetThings = () => {
    settestcasepayload(createPayload)
    setselectedRobotAPI('None')
    setselectedAPI(null)
    setselectedCustomAPI('None')
  }

  const [tabvalue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };


  return (
    <ContentBox>
      <h6 className='text-blue'>Testcase Management</h6>
      <Tabs defaultActiveKey="1" onChange={handleTabChange}>
        {/* TabPane for the first tab */}
        <TabPane tab="Testcase Handler" key="1">
          <Box>
            <Grid container spacing={2} className='mb-4'>
              <Grid item xs={2}>
                <Paper style={{ maxHeight: '800px', overflow: 'auto' }}>
                  <List>
                    <ListItem>
                      <FormControl fullWidth>
                        <Autocomplete
                          id="free-solo-demo"
                          freeSolo
                          size='small'
                          value={testcasepayload.name}
                          onChange={handleChange}
                          onInputChange={handleInputChange}
                          options={testcaseList.map((testcase) => testcase.name)}
                          renderInput={(params) => <TextField {...params} size='small' label="Testcase" />}
                        />
                      </FormControl>
                    </ListItem>
                    <ListItem>
                      <FormControl fullWidth>
                        <TextField
                          id="outlined-basic"
                          label="Testcase Description"
                          variant="outlined"
                          size='small'
                          multiline
                          rows={4}
                          value={testcasepayload.description}
                          onChange={(e) => settestcasepayload({ ...testcasepayload, description: e.target.value })}
                        />
                      </FormControl>
                    </ListItem>
                    <ListItem>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Testcase State</InputLabel>
                        <Select
                          labelId="loop_conditions"
                          id="testcasestate"
                          value={testcasepayload.state}
                          label="TestcaseState"
                          size='small'
                          onChange={(e) => settestcasepayload({ ...testcasepayload, state: e.target.value })}
                        >
                          {
                            TestcaseStates.map((element) => {
                              return <MenuItem value={element}>{element}</MenuItem>
                            })
                          }
                        </Select>
                      </FormControl>
                    </ListItem>
                    <ListItem>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">ROBOT APIs</InputLabel>
                        <Select
                          labelId="add_to_testcase"
                          id="add_to_testcase"
                          value={selectedRobotAPI}
                          label="Add To Testcase"
                          size='small'
                          onChange={(e) => handleAPISelection(e, 'robot')}
                        >
                          <MenuItem value="None">
                            <em>None</em>
                          </MenuItem>
                          {
                            robotAPIList.map((robotAPI) => {
                              return <MenuItem value={robotAPI.keyword}>{robotAPI.keyword}</MenuItem>
                            })
                          }
                        </Select>
                      </FormControl>
                    </ListItem>
                    <ListItem>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Custom APIs</InputLabel>
                        <Select
                          labelId="add_to_testcase"
                          id="add_to_testcase"
                          value={selectedCustomAPI}
                          label="Add To Testcase"
                          size='small'
                          onChange={(e) => handleAPISelection(e, 'custom')}
                        >
                          <MenuItem value="None">
                            <em>None</em>
                          </MenuItem>
                          {
                            customAPIList.map((customAPI) => {
                              return <MenuItem value={customAPI.keyword}>{customAPI.keyword}</MenuItem>
                            })
                          }
                        </Select>
                      </FormControl>
                    </ListItem>
                    <ListItem >
                      <Stack>
                        <FormControl>
                          <InputLabel id="demo-simple-select-label">Loop/Conditions</InputLabel>
                          <Select
                            labelId="loop_conditions"
                            id="loopConditions"
                            value={selectedLoopConditionControl.keyword}
                            label="Add To Testcase"
                            size='small'
                            onChange={(e) => handleLoopConditionControlSelection(e)}
                          >
                            {
                              ConditionLoopControls.map((element) => {
                                return <MenuItem value={element.keyword}>{element.keyword}</MenuItem>
                              })
                            }
                          </Select>
                        </FormControl>
                        <Button className='mt-1' onClick={() => handleAppendToCode(selectedLoopConditionControl.body)}>{'Add To Testcase'}</Button>
                      </Stack>
                    </ListItem>
                    <ListItem>
                      <Button className='mt-1' onClick={() => handleAppendToCode(selectedLoopConditionControl.body)}>{'Keyword Management'}</Button>
                    </ListItem>
                    <ListItem>
                      <Button className='mt-1' onClick={() => handleAppendToCode(selectedLoopConditionControl.body)}>{'Variable Management'}</Button>
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
              <Grid item xs={7}>
                <div className='border p-2'>
                  <Stack direction="row" spacing={2} justifyContent="space-between">
                    <h6 className='fw-bold'>Testcase Editor</h6>
                    <div>
                      <span class={`badge badge-${stateColorMap[testcasepayload.state]} rounded-pill d-inline me-2`}>{String(testcasepayload.state).toLocaleUpperCase()}</span>
                      {
                        selectedTestcase ? <>
                          <button
                            className='btn btn-sm bg-blue me-2'
                            onClick={() => handleSaveTestcase()}
                          ><i class="fas fa-save"></i>
                          </button>
                          <button
                            className='btn btn-sm bg-pink'
                            onClick={() => handleDeleteTestcase()}
                          ><i className="fas fa-trash"></i>
                          </button></>
                          : <button
                            className='btn btn-sm bg-blue me-2'
                            disabled={testcasepayload.name === ''}
                            onClick={() => handleCreateTestcase()}
                          ><i className="fas fa-save"></i></button>

                      }

                    </div>
                  </Stack>
                  <hr /><br />
                  <MonacoEditor
                    width="100%"
                    height="600px"
                    language="python"  // Set the language of the code (e.g., javascript, python)
                    theme="vs"       // Set the editor theme (e.g., vs, vs-dark)
                    value={testcasepayload.body}
                    onChange={handleCodeChange}
                    editorDidMount={editorDidMount}
                  />
                </div>
              </Grid>
              <Grid item xs={3}>
                <Paper style={{ maxHeight: '800px', overflow: 'auto', padding:'15px' }}>
                  {selectedAPI ? <ROBOTApiForm selectedAPI={selectedAPI} handleCodeChange={handleAppendToCode} /> : <></>}
                </Paper>
              </Grid>
            </Grid>

          </Box>
        </TabPane>
        {/* TabPane for the second tab */}
        <TabPane tab="Testcase List" key="2">
          {
            testcaseList.length > 0 &&
            <table class="table align-middle mb-0 bg-white border">
              <thead class="bg-light">
                <tr>
                  <th class="align-middle no-sort">
                    <div class="custom-control custom-checkbox">
                      <input className="form-check-input" type="checkbox" value="" name='master_checkbox' id="flexCheckDefault"
                      // onChange={(e) => handleMasterCheckBoxChange(e)} 
                      />
                    </div>
                  </th>
                  <th class="align-middle sort">Id</th>
                  <th class="align-middle sort">Name</th>
                  <th class="align-middle sort">Description</th>
                  <th class="align-middle sort">Testcase Status</th>
                  <th class="align-middle sort">View</th>
                </tr>
              </thead>
              <tbody>
                {
                  testcaseList.map((testcase) =>
                    <tr>
                      <td>
                        <div class="d-flex align-items-center">
                          <div class="custom-control custom-checkbox">
                            <input className="form-check-input" type="checkbox" value="" name='master_checkbox' id="flexCheckDefault"
                            // onChange={(e) => handleMasterCheckBoxChange(e)} 
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <p class="fw-normal mb-1">{testcase._id}</p>
                      </td>
                      <td>
                        <p>{testcase.name}</p>
                      </td>
                      <td>{testcase.description}</td>
                      <td>
                        <span class={`badge badge-${stateColorMap[testcase.state]} rounded-pill d-inline me-2`}>{String(testcase.state).toLocaleUpperCase()}</span>
                      </td>
                      <td>
                        <Button><PreviewIcon /></Button>
                      </td>
                    </tr>)
                }
              </tbody>
            </table>
          }
        </TabPane>
      </Tabs>


    </ContentBox>
  )
}

export default Tests