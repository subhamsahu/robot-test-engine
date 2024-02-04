import React, { useState } from 'react'

import {
    Button,
    FormControlLabel,
    Grid,
    Switch,
    TextField,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { ContentBox } from '../../../../styles/AppStyles';
import { useDispatch } from 'react-redux';
import { post } from '../../../../services/api'
import { showSnackBar } from '../../../../redux/actions/snackBarActions';
import { LoadingButton } from '@mui/lab';

import { BACKEND_URL } from '../../../../core/constants';

const createPayload = {
    "name": "",
    "description": "",
    "testcases_list":[],
    "isActive": true
}

const SuiteForm = () => {
    const dispatch = useDispatch()
    const [suitePayload, setsuitePayload] = useState(createPayload)
    const [loading, setloading] = useState(false)
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
        console.log(data)
        if (data && data?.success === true) {
            dispatch(showSnackBar({ msg: "Create Suite Success", type: "success" }))
        } else {
            console.log(data)
            dispatch(showSnackBar({ msg: `Create Suite Fail ${data.exception_reason}`, type: "error" }))
        }
    }
    return (
        <ContentBox>
            <Grid container spacing={2} sx={{ backgroundColor: 'white', }}>
                <Grid item xs={12}>
                    <TextField
                        label="Suite Name"
                        size="small"
                        name='name'
                        fullWidth
                        onChange={(e) => onChangeForm(e)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Suite Description"
                        size="small"
                        name='description'
                        fullWidth
                        multiline
                        rows={4}
                        onChange={(e) => onChangeForm(e)}
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
                <Grid item xs={12}>
                    <LoadingButton
                        variant="contained"
                        size='small'
                        color="primary"
                        className='bg-blue'
                        startIcon={<SaveIcon />}
                        onClick={()=>handleCreateSuite()}
                    >
                        Add Suite
                    </LoadingButton>
                </Grid>
            </Grid>
        </ContentBox>
    )
}

export default SuiteForm