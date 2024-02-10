import React, { useEffect, useState, useRef } from 'react'
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Drawer from '@mui/material/Drawer';
import MonacoEditor from 'react-monaco-editor';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import { useDispatch, useSelector } from 'react-redux';
import {
    Button,
    FormControlLabel,
    Switch,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import PreviewIcon from '@mui/icons-material/Preview'

import { showSnackBar } from '../../../redux/actions/snackBarActions';
import { getTestcaseList } from '../../../redux/actions/testcaseAction'
import { ContentBox } from '../../../styles/AppStyles'
import SuiteForm from './components/SuiteForm';
import { get, post, remove } from '../../../services/api';
import { BACKEND_URL } from '../../../core/constants';
import { stateColorMap } from '../Tests/components/Constants';

const createPayload = {
    "name": "",
    "description": "",
    "testcasesList": [],
    "isActive": true
}

const Suite = () => {
    const dispatch = useDispatch()
    const result = useSelector((state) => state.testCaseListStateData)

    const [testcaseList, setTestcaseList] = useState(result);
    const [testcasename, settestcasename] = useState('None')
    const [selectedtestcase, setselectedtestcase] = useState(null)

    const [suiteList, setSuiteList] = useState([]);

    const [suitePayload, setsuitePayload] = useState(createPayload)

    const [loading, setloading] = useState(false)
    const [bulkselected, setbulkselected] = useState([])

    const fetchSuite = async () => {
        const url = BACKEND_URL + '/test-manager/suite/list'
        let params = {}
        const data = await get(url, params)
        
        if (data && data?.success === true) {
            setSuiteList(data?.data)
        } else {
            dispatch(showSnackBar({ msg: `Fetcing Suite Fail ${data.exception_reason}`, type: "error" }))
        }
    }
    useEffect(() => {
        fetchSuite()
        dispatch(getTestcaseList())
    }, [])

    const onChangeForm = (e) => {
        if (e.target.name === 'isActive') {
            setsuitePayload({ ...suitePayload, [e.target.name]: e.target.checked })
        }
        else {
            setsuitePayload({ ...suitePayload, [e.target.name]: e.target.value })
        }
    }
    const handleCreateSuite = async () => {
        const url = BACKEND_URL + '/test-manager/suite/create'
        let payload = suitePayload
        const data = await post(url, payload)
        
        if (data && data?.success === true) {
            dispatch(showSnackBar({ msg: "Create Suite Success", type: "success" }))
        } else {
            
            dispatch(showSnackBar({ msg: `Create Suite Fail ${data.exception_reason}`, type: "error" }))
        }
    }

    const handleSuiteNameChange = (event, newValue) => {
        let selectedObj = suiteList.find(obj => obj.name === newValue);
        if (selectedObj) {
            setsuitePayload(selectedObj)
        }
        else {
            setsuitePayload({ ...createPayload });
        }
    };

    const handleSuiteInputChange = (event, newInputValue) => {
        // This will be triggered when the user types
        // This will be triggered when the user types
        let selectedObj = suiteList.find(obj => obj.name === newInputValue);
        if (selectedObj) {
            setsuitePayload(selectedObj)
        }
        else {
            setsuitePayload({ ...createPayload, name: newInputValue });
        }
    }

    const handletestcasenameChange = (e, newValue) => {
        settestcasename(newValue);
    };

    const handleTestInputChange = (event, newInputValue) => {
        // This will be triggered when the user types
        settestcasename(newInputValue);
        let selectedObj = testcaseList.find(obj => obj.name === newInputValue);
        if (selectedObj) {
            setselectedtestcase(selectedObj)
        }
        else {
            setselectedtestcase(null)
        }
    }
    // Function to append an object to testcasesList
    const appendToTestcasesList = () => {
        if (selectedtestcase && !suitePayload.testcasesList.includes(selectedtestcase._id))  {
            setsuitePayload(prevState => ({
                ...prevState,
                testcasesList: [...prevState.testcasesList, selectedtestcase._id]
            }));
        }
    };

    const removeFromTestcasesList = (id) => {
        if (suitePayload.testcasesList.includes(id))  {
            setsuitePayload(prevState => ({
                ...prevState,
                testcasesList: suitePayload.testcasesList.filter(item => item != id)
            }));
        }
    };

    const handleDeleteSuite = async () => {
        let params = {
          'id': suitePayload._id,
        }
        const url = BACKEND_URL + '/test-manager/suite/delete'
        const data = await remove(url, params)
        
        if (data && data?.success === true) {
          dispatch(showSnackBar({ msg: "Delete Suite Success", type: "success" }))
        } else {
          dispatch(showSnackBar({ msg: `Delete Suite Fail ${data.exception_reason}`, type: "error" }))
        }
      }
    return (
        <ContentBox>
            <h6 className='text-blue'>Testsuite Management</h6><br />
            <Grid container spacing={2} className='mb-4'>
                <Grid item xs={2}>
                    <FormControl fullWidth>
                        <Autocomplete
                            id="free-solo-demo"
                            freeSolo
                            size='small'
                            value={suitePayload.name}
                            onChange={handleSuiteNameChange}
                            onInputChange={handleSuiteInputChange}
                            options={suiteList.map((suite) => suite.name)}
                            renderInput={(params) => <TextField {...params} size='small' label="Test Suite" />}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        label="Suite Description"
                        size="small"
                        name='description'
                        value={suitePayload.description}
                        fullWidth
                        onChange={(e) => setsuitePayload({...suitePayload, description:e.target.value})}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControlLabel
                        control={
                            <Switch
                                size="small"
                                label="Active"
                                name='isActive'
                                checked={suitePayload.isActive}
                                onChange={(e) => onChangeForm(e)}
                                value={suitePayload.isActive ? "off" : "on"}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        }
                        label="Active"
                    />
                </Grid>
                <Grid item xs={2}>
                    <FormControl fullWidth>
                        <Autocomplete
                            id="free-solo-demo"
                            freeSolo
                            size='small'
                            value={testcasename}
                            onChange={handletestcasenameChange}
                            onInputChange={handleTestInputChange}
                            options={testcaseList.map((testcase) => testcase.name)}
                            renderInput={(params) => <TextField {...params} size='small' label="Testcase" />}
                        />
                        {/* <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={testcasename}
                                label="TestcaseName"
                                onChange={(e) => handleChange(e)}
                            >
                                <MenuItem value="None">
                                    <em>None</em>
                                </MenuItem>
                                {
                                    testcaseList.map((testcase) => (
                                        <MenuItem key={testcase.name} value={testcase.name}>
                                            {testcase.name}
                                        </MenuItem>
                                    ))
                                }
                            </Select> */}
                    </FormControl>
                    <Button className='mt-1' onClick={appendToTestcasesList}>{'Add To Suite'}</Button>
                </Grid>
            </Grid>
            {
                suitePayload?.testcasesList.length > 0 &&
                <Grid container spacing={2} className='mb-4'>
                    <Grid item xs={12}>
                        {
                            suitePayload?.testcasesList.length > 0 &&
                            <div style={{ maxHeight: "450px", overflowX: "auto" }}>
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
                                            <th class="align-middle sort">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            suitePayload.testcasesList.map((id) => {
                                                let testcase = testcaseList.find(obj => obj._id === id)
                                                return <tr>
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
                                                        <Button onClick={()=>removeFromTestcasesList(id)}><DeleteIcon /></Button>
                                                    </td>
                                                </tr>
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        }
                    </Grid>
                </Grid>
            }
            <Grid container spacing={2}>
                {
                    suitePayload?._id && suitePayload?.name != "" ?
                        <Grid item xs={12}>
                            <LoadingButton
                                variant="contained"
                                size='small'
                                color="primary"
                                className='bg-blue me-2'
                                startIcon={<SaveIcon />}
                                onClick={() => handleCreateSuite()}
                            >
                                Update Suite
                            </LoadingButton>
                            <LoadingButton
                                variant="contained"
                                size='small'
                                // color="danger"
                                className='bg-pink'
                                startIcon={<DeleteIcon />}
                                onClick={() => handleDeleteSuite()}
                            >
                                Delete Suite
                            </LoadingButton>
                        </Grid> : <Grid item xs={12}>
                            <LoadingButton
                                variant="contained"
                                size='small'
                                color="primary"
                                className='bg-blue me-2'
                                startIcon={<SaveIcon />}
                                onClick={() => handleCreateSuite()}
                                disabled={suitePayload?.name === ""}
                            >
                                Save Suite
                            </LoadingButton>
                        </Grid>
                }
            </Grid>

        </ContentBox>
    )
}

export default Suite