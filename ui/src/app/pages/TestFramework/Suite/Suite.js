import React, { useEffect, useState, useRef } from 'react'
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import MonacoEditor from 'react-monaco-editor';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import { useDispatch } from 'react-redux';

import { showSnackBar } from '../../../redux/actions/snackBarActions';
import { ContentBox } from '../../../styles/AppStyles'
import SuiteForm from './components/SuiteForm';
import { get } from '../../../services/api';
import { BACKEND_URL } from '../../../core/constants';

const Suite = () => {
    const dispatch = useDispatch()
    const [toggleDrawer, setToggleDrawer] = useState(false)
    const anchor = "right"
    const [selectedSuiteName, setSelectedSuiteName] = useState('None');
    const [selectedSuite, setSelectedSuite] = useState(null);
    const [suiteList, setSuiteList] = useState([]);
    const [testcaseList, setTestcaseList] = useState([

    ]);
    const handletoggleDrawerChange = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setToggleDrawer(!toggleDrawer);
    };
    const handleSuiteNameChange = (event) => {
        setSelectedSuiteName(event.target.value);
        console.log(event.target)
    };
    const fetchSuite = async () => {
        const url = BACKEND_URL + '/test-manager/suite/list'
        let params = {}
        const data = await get(url, params)
        console.log(data)
        if (data && data?.success === true) {
            setSuiteList(data?.data)
        } else {
            dispatch(showSnackBar({ msg: `Create User Fail ${data.exception_reason}`, type: "error" }))
        }
    }
    useEffect(() => {
        fetchSuite()
    }, [])
    return (
        <ContentBox>
            <Grid container spacing={2} sx={{ marginBottom: 1 }}>
                <Grid item xs={2}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Suite</InputLabel>
                        <Select
                            labelId="suite"
                            id="suite"
                            value={selectedSuiteName}
                            label="Suite"
                            size='small'
                            onChange={handleSuiteNameChange}
                        >
                            <MenuItem value="None">
                                <em>None</em>
                            </MenuItem>
                            {
                                suiteList.map((suite) => {
                                    return <MenuItem value={suite.name}>{suite.name}</MenuItem>
                                })
                            }
                        </Select>
                    </FormControl>
                    <React.Fragment key={anchor}>
                        <Button onClick={handletoggleDrawerChange(anchor, true)} className='mt-1'>{selectedSuiteName == 'None' ? 'Create' : 'Edit'}</Button>
                        <Drawer
                            anchor={anchor}
                            open={toggleDrawer}
                            onClose={handletoggleDrawerChange(anchor, false)}
                        >
                            <SuiteForm suite={selectedSuiteName} edit={true} />
                        </Drawer>
                    </React.Fragment>
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={2}>
                    <FormControl fullWidth>
                        <Autocomplete
                            id="free-solo-demo"
                            freeSolo
                            size='small'
                            value={selectedSuiteName}
                            onChange={handleSuiteNameChange}
                            // onInputChange={handleSuiteNameChange}
                            options={suiteList.map((suite) => suite.name)}
                            renderInput={(params) => <TextField {...params} size='small' label="Test Suite" />}
                        />
                    </FormControl>
                </Grid>
            </Grid>

        </ContentBox>
    )
}

export default Suite