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

import { ContentBox } from '../../../styles/AppStyles'
import ROBOTApiForm from './components/ROBOTApiForm'
import { get, post, remove } from '../../../services/api';
import { BACKEND_URL } from '../../../core/constants';
import { useDispatch } from 'react-redux';
import { showSnackBar } from '../../../redux/actions/snackBarActions';
import { ConditionLoopControls } from './components/Constants';

const Tests = () => {
  const dispatch = useDispatch()
  const editorRef = useRef(null);
  const [editorCursorPosition, setEditorCursorPostion] = useState(0)
  const [testcaseList, setTestcaseList] = useState([

  ]);
  const [testcasename, setTestcasename] = useState('')
  const [selectedTestcase, setSelectedTestcase] = useState(null)
  const [robotAPIList, setrobotAPIList] = useState([]);
  const [selectedRobotAPI, setselectedRobotAPI] = useState('None')
  const [selectedAPI, setselectedAPI] = useState(null)
  const [customAPIList, setcustomAPIList] = useState([]);
  const [selectedCustomAPI, setselectedCustomAPI] = useState('None')
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
    console.log(data)
    if (data && data?.success === true) {
      setrobotAPIList(data?.data)
    } else {
      dispatch(showSnackBar({ msg: `Create User Fail ${data.exception_reason}`, type: "error" }))
    }
  }

  const fetchTestcaseList = async () => {
    const url = BACKEND_URL + '/test-manager/testcase/list'
    let params = {}
    const data = await get(url, params)
    console.log(data)
    if (data && data?.success === true) {
      setTestcaseList(data?.data)
    } else {
      dispatch(showSnackBar({ msg: `Create User Fail ${data.exception_reason}`, type: "error" }))
    }
  }

  useEffect(() => {

  }, []);

  const editorDidMount = (editor, monaco) => {
    console.log('editorDidMount', editor);
    const cursorPosition = editor.getPosition();
    console.log('Initial cursor position:', cursorPosition);
    editorRef.current = { editor, monaco };
    editor.onDidChangeCursorSelection((event) => {
      const cursorPosition = event.selection;
      setEditorCursorPostion(cursorPosition.startLineNumber)
    });
  };
  const initCode = '[Documentation]  Test Documentation\n[Tags]  Tag1  Tag2\n\n'
  const [code, setCode] = useState(initCode);

  const handleCodeChange = (newCode) => {
    setCode(newCode);
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
      editor.setValue(currentContent.join('\n'));
    }
    else {
      setCode(code + newCode)
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
    console.log(e.target.value)
    let selectedObj = ConditionLoopControls.find(obj => obj.keyword === e.target.value);
    console.log(selectedObj)
    setSelectedLoopConditionControl(selectedObj)
  }

  const handleCreateTestcase = async () => {
    let test_data = {
      'name': testcasename,
      'body': code,
      'keywords': []
    }
    const url = BACKEND_URL + '/test-manager/testcase/create'
    let payload = test_data
    const data = await post(url, payload)
    console.log(data)
    if (data && data?.success === true) {
      dispatch(showSnackBar({ msg: "Create Testcase Success", type: "success" }))
      fetchTestcaseList()
      resetThings()
    } else {
      console.log(data)
      dispatch(showSnackBar({ msg: `Create Testcase Fail ${data.exception_reason}`, type: "error" }))
    }
  }

  const handleDeleteTestcase = async () => {
    let params = {
      'testcasename': testcasename,
    }
    const url = BACKEND_URL + '/test-manager/testcase/delete'
    const data = await remove(url, params)
    console.log(data)
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
      'name': testcasename,
      'body': code,
      'keywords': []
    }
    // const url = BACKEND_URL + '/test-manager/testcase/create'
    // let payload = test_data
    // const data = await post(url, payload)
    // console.log(data)
    // if (data && data?.success === true) {
    //   dispatch(showSnackBar({ msg: "Create Testcase Success", type: "success" }))
    // } else {
    //   console.log(data)
    //   dispatch(showSnackBar({ msg: `Create Testcase Fail ${data.exception_reason}`, type: "error" }))
    // }
  }

  const handleChange = (event, newValue) => {
    setTestcasename(newValue);
  };

  const handleInputChange = (event, newInputValue) => {
    // This will be triggered when the user types
    setTestcasename(newInputValue);
    console.log(newInputValue)
    let selectedObj = testcaseList.find(obj => obj.name === newInputValue);
    if (selectedObj) {
      setCode(selectedObj.body)
      setSelectedTestcase(selectedObj)
    }
    else {
      setCode(initCode)
      setSelectedTestcase(null)
    }
  };

  const resetThings = ()=>{
    setTestcasename('')
    setselectedRobotAPI('None')
    setselectedAPI(null)
    setselectedCustomAPI('None')
  }


  return (
    <ContentBox>
      <h6 className='text-blue'>Testcase Management</h6><br/>
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <FormControl fullWidth>
            <Autocomplete
              id="free-solo-demo"
              freeSolo
              size='small'
              value={testcasename}
              onChange={handleChange}
              onInputChange={handleInputChange}
              options={testcaseList.map((testcase) => testcase.name)}
              renderInput={(params) => <TextField {...params} size='small' label="Testcase" />}
            />
          </FormControl>
        </Grid>
        <Grid item xs={2}>
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
          {/* <Button className='mt-1' disabled={selectedRobotAPI == 'None'}>{'Add To Testcase'}</Button> */}
        </Grid>
        <Grid item xs={2}>
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
          {/* <Button className='mt-1' disabled={selectedCustomAPI == 'None'}>{'Add To Testcase'}</Button> */}
        </Grid>
        <Grid item xs={2}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Custom Keywords</InputLabel>
            <Select
              labelId="add_to_testcase"
              id="add_to_testcase"
              value={"None"}
              label="Add To Testcase"
              size='small'
            >
              <MenuItem value="None">
                <em>None</em>
              </MenuItem>
            </Select>
          </FormControl>
          {/* <Button className='mt-1'>{'Add To Testcase'}</Button> */}
        </Grid>
        <Grid item xs={2}>
          <FormControl fullWidth>
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
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <div className='border p-2'>
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <h6 className='fw-bold'>Testcase Editor</h6>
              <div>
                {
                  selectedTestcase ? <>
                    <button
                      className='btn btn-sm bg-blue me-2'
                      onClick={() => handleSaveTestcase()}
                    ><i class="fas fa-save"></i>
                    </button>
                    <button
                      className='btn btn-sm bg-pink'
                      onClick={()=>handleDeleteTestcase()}
                    ><i className="fas fa-trash"></i>
                    </button></>
                    : <button
                      className='btn btn-sm bg-blue me-2'
                      // disabled={testcasename != ''}
                      onClick={() => handleCreateTestcase()}
                    ><i className="fas fa-plus"></i></button>

                }

              </div>
            </Stack>
            <hr /><br />
            <MonacoEditor
              width="100%"
              height="500"
              language="python"  // Set the language of the code (e.g., javascript, python)
              theme="vs"       // Set the editor theme (e.g., vs, vs-dark)
              value={code}
              onChange={handleCodeChange}
              editorDidMount={editorDidMount}
            />
          </div>
        </Grid>
        <Grid item xs={4}>
          {selectedAPI ? <ROBOTApiForm selectedAPI={selectedAPI} handleCodeChange={handleAppendToCode} /> : <></>}
        </Grid>
      </Grid>

    </ContentBox>
  )
}

export default Tests