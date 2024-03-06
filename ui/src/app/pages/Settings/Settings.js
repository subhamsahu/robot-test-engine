import React from 'react'
import { ContentBox } from '../../styles/AppStyles'
import { Grid } from '@mui/material'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Box, Icon, Paper } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const Settings = () => {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <ContentBox>
            <h6 className='text-blue'>App Settings</h6><br />
            <Grid container spacing={2}>
                <Grid item xs={2}>
                    {/* <Paper style={{ maxHeight: '800px', overflow: 'auto' }}> */}
                    <Tabs value={value} onChange={handleChange} orientation="vertical">
                        <Tab label="JIRA" />
                        <Tab label="Synapse RT" />
                        <Tab label="Account" />
                        <Tab label="Theme" />
                    </Tabs>
                    {/* </Paper> */}

                </Grid>
                <Grid item xs={10}>
                    <Grid container spacing={2} sx={{ marginBottom: 1 }}>
                        <Grid item xs={3}>
                            <FormControl fullWidth>
                                <TextField
                                    id="outlined-basic"
                                    label="Return Vale"
                                    variant="outlined"
                                    size='small'
                                    value={""}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </ContentBox>
    )
}

export default Settings