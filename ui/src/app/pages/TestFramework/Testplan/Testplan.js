import React, { useEffect, useState } from 'react'
import { Autocomplete, Button, FormControl, FormControlLabel, Grid, MenuItem, Select, Stack, Switch, TextField } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import DeleteIcon from '@mui/icons-material/Delete';
import { LoadingButton } from '@mui/lab';
import SaveIcon from '@mui/icons-material/Save';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Tabs } from 'antd';

import { ContentBox } from '../../../styles/AppStyles'
import { stateColorMap } from '../Tests/components/Constants'
import { BACKEND_URL } from '../../../core/constants';
import { get, post } from '../../../services/api';
import { showSnackBar } from '../../../redux/actions/snackBarActions';
import Execution from './components/Execution';
import { setTestplanList } from '../../../redux/actions/testplanAction';

// Destructure the Tab component from Tabs
const { TabPane } = Tabs;

const createPayload = {
  name: "",
  description: "",
  testSuitesList: [

  ],
  isActive: true
}

const Testplan = () => {
  const dispatch = useDispatch()
  const testsuiteListResult = useSelector((state) => state.testSuiteListStateData)
  const testcaseListResult = useSelector((state) => state.testCaseListStateData)

  const [testplanPayload, settestplanPayload] = useState(createPayload)
  const [testplanList, settestplanList] = useState([])
  const [selectedTestplan, setselectedTestplan] = useState(null)

  const [suiteList, setSuiteList] = useState(testsuiteListResult);
  const [suitename, setsuitename] = useState('None')
  const [selectedSuite, setselectedSuite] = useState(null)

  const [testcaseList, setTestcaseList] = useState(testcaseListResult);

  useEffect(() => {
    fetchTestPlan()
  }, [])


  const fetchTestPlan = async () => {
    const url = BACKEND_URL + '/test-manager/testplan/list'
    let params = {}
    const data = await get(url, params)
    if (data && data?.success === true) {
      settestplanList(data?.data)
      dispatch(setTestplanList(data.data))
    } else {
      dispatch(showSnackBar({ msg: `Fetch Testplans Fail ${data.exception_reason}`, type: "error" }))
    }
  }

  const handleTestplaneNameChange = (event, newValue) => {
    let selectedObj = testplanList.find(obj => obj.name === newValue);
    if (selectedObj) {
      settestplanPayload(selectedObj)
    }
    else {
      settestplanPayload({ ...createPayload });
    }
  };

  const handleTestplanInputChange = (event, newInputValue) => {
    // This will be triggered when the user types
    // This will be triggered when the user types
    let selectedObj = testplanList.find(obj => obj.name === newInputValue);
    if (selectedObj) {
      settestplanPayload(selectedObj)
    }
    else {
      settestplanPayload({ ...createPayload, name: newInputValue });
    }
  }

  const removeFromTestcasesList = () => {

  }

  const onChangeForm = (e) => {
    if (e.target.name === 'isActive') {
      settestplanPayload({ ...testplanPayload, [e.target.name]: e.target.checked })
    }
    else {
      settestplanPayload({ ...testplanPayload, [e.target.name]: e.target.value })
    }
  }

  const handlesuitenameChange = (e, newValue) => {
    setsuitename(newValue);
  };

  const handleSuiteInputChange = (event, newInputValue) => {
    // This will be triggered when the user types
    setsuitename(newInputValue);
    let selectedObj = suiteList.find(obj => obj.name === newInputValue);
    if (selectedObj) {
      setselectedSuite(selectedObj)
    }
    else {
      setselectedSuite(null)
    }
  }

  const appendToSuiteList = () => {
    if (selectedSuite && !testplanPayload.testSuitesList.includes(selectedSuite._id)) {
      settestplanPayload(prevState => ({
        ...prevState,
        testSuitesList: [...prevState.testSuitesList, selectedSuite._id]
      }));
    }
  };

  const handleCreateTestplan = async () => {
    const url = BACKEND_URL + '/test-manager/testplan/create'
    let payload = testplanPayload
    const data = await post(url, payload)

    if (data && data?.success === true) {
      dispatch(showSnackBar({ msg: "Create Testplan Success", type: "success" }))
    } else {

      dispatch(showSnackBar({ msg: `Create Testplan Fail ${data.exception_reason}`, type: "error" }))
    }
  }
  const handleDeleteTestplan = () => {
    console.warn(testplanPayload)
  }
  const handleUpdateTestplan = () => {
    console.warn(testplanPayload)
  }

  const [tabvalue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <ContentBox>
      <h6 className='text-blue'>Testplan Management</h6><br />
      <Grid container spacing={2} className='mb-4'>
        <Grid item xs={2}>
          <FormControl fullWidth>
            <Autocomplete
              id="free-solo-demo"
              freeSolo
              size='small'
              value={testplanPayload.name}
              onChange={handleTestplanInputChange}
              onInputChange={handleTestplanInputChange}
              options={testplanList.map((testplan) => testplan.name)}
              renderInput={(params) => <TextField {...params} size='small' label="Test Plan" />}
            />
          </FormControl>
        </Grid>
        <Grid item xs={2}>
          <TextField
            label="Testplan Description"
            size="small"
            name='description'
            value={testplanPayload.description}
            fullWidth
            onChange={(e) => settestplanPayload({ ...testplanPayload, description: e.target.value })}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                size="small"
                label="Active"
                name='isActive'
                checked={testplanPayload.isActive}
                onChange={(e) => onChangeForm(e)}
                value={testplanPayload.isActive ? "off" : "on"}
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
              value={suitename}
              onChange={handlesuitenameChange}
              onInputChange={handleSuiteInputChange}
              options={suiteList.map((suite) => suite.name)}
              renderInput={(params) => <TextField {...params} size='small' label="Test Suite" />}
            />
          </FormControl>
          <Button className='mt-1' onClick={appendToSuiteList}>{'Add To Suite'}</Button>
        </Grid>
        <Grid item xs={12}>
          {
            testplanPayload?.testSuitesList.length > 0 &&
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
                    <th class="align-middle sort">Name</th>
                    <th class="align-middle sort">Description</th>
                    <th class="align-middle sort">Testcase Count</th>
                    <th class="align-middle sort">Testcases</th>
                    <th class="align-middle sort">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    testplanPayload?.testSuitesList.map((suiteId) => {
                      let suite = suiteList.find(obj => obj._id === suiteId)
                      return <tr>
                        <td class="align-middle no-sort">
                          <div class="custom-control custom-checkbox">
                            <input className="form-check-input" type="checkbox" value="" name='master_checkbox' id="flexCheckDefault"
                            // onChange={(e) => handleMasterCheckBoxChange(e)} 
                            />
                          </div>
                        </td>
                        <td class="align-middle sort">{suite.name}</td>
                        <td class="align-middle sort">{suite.description}</td>
                        <td class="align-middle sort">{suite.testcasesList.length}</td>
                        <td class="align-middle sort">{suite.testcasesList.length}</td>
                        <td class="align-middle sort"><Button onClick={() => removeFromTestcasesList(suiteId)}><DeleteIcon /></Button></td>
                      </tr>
                      // return suite?.testcasesList.map((id) => {
                      //   let testcase = testcaseList.find(obj => obj._id === id)
                      //   return <tr>
                      //     <td>
                      //       <div class="d-flex align-items-center">
                      //         <div class="custom-control custom-checkbox">
                      //           <input className="form-check-input" type="checkbox" value="" name='master_checkbox' id="flexCheckDefault"
                      //           // onChange={(e) => handleMasterCheckBoxChange(e)} 
                      //           />
                      //         </div>
                      //       </div>
                      //     </td>
                      //     <td>
                      //       <p class="fw-normal mb-1">{suite?.name}</p>
                      //     </td>
                      //     <td>
                      //       <p>{testcase.name}</p>
                      //     </td>
                      //     <td>{testcase.description}</td>
                      //     <td>
                      //       <span class={`badge badge-${stateColorMap[testcase.state]} rounded-pill d-inline me-2`}>{String(testcase.state).toLocaleUpperCase()}</span>
                      //     </td>
                      //     <td>
                      //       <Button onClick={() => removeFromTestcasesList(id)}><DeleteIcon /></Button>
                      //     </td>
                      //   </tr>
                      // })

                    })
                  }
                </tbody>
              </table>
            </div>
          }
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {
          testplanPayload?._id && testplanPayload?.name != "" ?
            <Grid item xs={12}>
              <Stack direction={"row"} className='mb-2'>
                <LoadingButton
                  variant="contained"
                  size='small'
                  color="primary"
                  className='bg-blue me-2'
                  startIcon={<SaveIcon />}
                // onClick={() => handleCreateSuite()}
                >
                  Update Testplan
                </LoadingButton>
                <LoadingButton
                  variant="contained"
                  size='small'
                  // color="danger"
                  className='bg-pink me-2'
                  startIcon={<DeleteIcon />}
                // onClick={() => handleDeleteSuite()}
                >
                  Delete Testplan
                </LoadingButton></Stack>

              <LoadingButton
                variant="contained"
                size='small'
                // color="danger"
                className='bg-green'
                startIcon={<PlayArrowIcon />}
              // onClick={() => handleDeleteSuite()}
              >
                Execute Testplan
              </LoadingButton>
            </Grid> : <Grid item xs={12}>
              <LoadingButton
                variant="contained"
                size='small'
                color="primary"
                className='bg-blue me-2'
                startIcon={<SaveIcon />}
                onClick={() => handleCreateTestplan()}
                disabled={testplanPayload?.name === ""}
              >
                Save Testplan
              </LoadingButton>
            </Grid>
        }
      </Grid>

    </ContentBox>
  )
}

export default Testplan