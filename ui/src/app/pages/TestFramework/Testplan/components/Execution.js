import React, { useState } from 'react'
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { FormControlLabel, Grid, Switch, TextField } from '@mui/material';

const steps = ['Select Testplan', 'Select Testcases', 'Execute'];

const executePayload = {
    name: "",
    description: "",
    executionList: [

    ],
    campaignName: "",
    rerunFailed: false,

}


const Execution = () => {

    const testplanListResult = useSelector((state) => state.testplanListStateData)
    const testsuiteListResult = useSelector((state) => state.testSuiteListStateData)
    const testcaseListResult = useSelector((state) => state.testCaseListStateData)

    const [testplanPayload, settestplanPayload] = useState({ ...executePayload, testcaseList: [] })

    const [selectedtestplan, setselectedtestplan] = useState('None')

    const [activeStep, setActiveStep] = React.useState(0);
    const [skipped, setSkipped] = React.useState(new Set());

    const isStepOptional = (step) => {
        return step === 1;
    };

    const isStepSkipped = (step) => {
        return skipped.has(step);
    };

    const handleNext = () => {
        let newSkipped = skipped;
        if (isStepSkipped(activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(activeStep);
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped(newSkipped);
        if (activeStep == 0) {
            let currentTestplan = testplanListResult.find((obj) => obj.name === selectedtestplan)
            currentTestplan.executionList = []
            for (let suite of currentTestplan.testSuitesList) {
                let currentSuite = testsuiteListResult.find((obj) => obj._id === suite)
                let executionTestcase = []
                // console.warn(currentSuite)
                for (let testcase of currentSuite.testcasesList) {
                    let currentTestCase = testcaseListResult.find((obj) => obj._id === testcase)
                    currentTestCase.suite = currentSuite.name
                    currentTestplan.executionList = [...currentTestplan.executionList, currentTestCase]
                }
                // currentTestplan.executionList.append(currentSuite)
            }
            settestplanPayload({ ...currentTestplan });
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleSkip = () => {
        if (!isStepOptional(activeStep)) {
            // You probably want to guard against something like this,
            // it should never occur unless someone's actively trying to break something.
            throw new Error("You can't skip a step that isn't optional.");
        }

        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSkipped((prevSkipped) => {
            const newSkipped = new Set(prevSkipped.values());
            newSkipped.add(activeStep);
            return newSkipped;
        });
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const onChangeForm = (e) => {
        if (e.target.name === 'Rerun Failed Testcases') {
            settestplanPayload({ ...testplanPayload, [e.target.name]: e.target.checked })
        }
        else {
            settestplanPayload({ ...testplanPayload, [e.target.name]: e.target.value })
        }
    }

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Grid item xs={2}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Testplan</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                size="small"
                                value={selectedtestplan}
                                label="Testplan"
                                onChange={(e) => setselectedtestplan(e.target.value)}
                            >
                                <MenuItem value={"None"}>None</MenuItem>
                                {
                                    testplanListResult.map((testplan) => {
                                        return (
                                            <MenuItem value={testplan.name}>{testplan.name}</MenuItem>
                                        )
                                    })
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                )
            case 1:
                return <Grid item xs={12}>
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
                                    <th class="align-middle sort">Suite</th>
                                    <th class="align-middle sort">Testcase</th>
                                    <th class="align-middle sort">Description</th>
                                    <th class="align-middle sort">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    testplanPayload?.executionList.map((testcase) => {
                                        return <tr>
                                            <td class="align-middle no-sort">
                                                <div class="custom-control custom-checkbox">
                                                    <input className="form-check-input" type="checkbox" value="" name='master_checkbox' id="flexCheckDefault"
                                                    // onChange={(e) => handleMasterCheckBoxChange(e)} 
                                                    />
                                                </div>
                                            </td>
                                            <td class="align-middle sort">{testcase.suite}</td>
                                            <td class="align-middle sort">{testcase.name}</td>
                                            <td class="align-middle sort">{testcase.description}</td>
                                            <td class="align-middle sort">{testcase?.status}</td>
                                            {/* <td class="align-middle sort"><Button onClick={() => removeFromTestcasesList(suiteId)}><DeleteIcon /></Button></td> */}
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </Grid>;
            case 2:
                return <React.Fragment><Grid item xs={2}>
                    <FormControl fullWidth>
                        <TextField
                            id="outlined-basic"
                            label="Test Campaign Name"
                            variant="outlined"
                            size='small'
                            value={testplanPayload.campaignName}
                            onChange={(e) => settestplanPayload({ ...testplanPayload, campaignName: e.target.value })}
                        />
                    </FormControl>
                </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <FormControlLabel
                                control={
                                    <Switch
                                        size="small"
                                        label="Rerun Failed Testcases"
                                        name='Rerun Failed Testcases'
                                        checked={testplanPayload.rerunFailed}
                                        onChange={(e) => onChangeForm(e)}
                                        value={testplanPayload.rerunFailed ? "off" : "on"}
                                        inputProps={{ 'aria-label': 'controlled' }}
                                    />
                                }
                                label="Rerun Failed Testcases"
                            />
                        </FormControl>
                    </Grid>
                </React.Fragment>;
            default:
                return 'Unknown step';
        }
    };
    return (
        <div>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    if (isStepOptional(index)) {
                        labelProps.optional = (
                            <Typography variant="caption">Optional</Typography>
                        );
                    }
                    if (isStepSkipped(index)) {
                        stepProps.completed = false;
                    }
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            {activeStep === steps.length ? (
                <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        All steps completed - you&apos;re finished
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleReset}>Reset</Button>
                    </Box>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Button
                            color="inherit"
                            disabled={activeStep === 0}
                            onClick={handleBack}
                            sx={{ mr: 1 }}
                        >
                            Back
                        </Button>
                        <Box sx={{ flex: '1 1 auto' }} />
                        {isStepOptional(activeStep) && (
                            <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                                Skip
                            </Button>
                        )}

                        <Button onClick={handleNext}>
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </Box>
                </React.Fragment>
            )}
            <Grid container spacing={2} className='mt-4'>
                {

                    getStepContent(activeStep)

                }
            </Grid>
        </div>
    )
}

export default Execution