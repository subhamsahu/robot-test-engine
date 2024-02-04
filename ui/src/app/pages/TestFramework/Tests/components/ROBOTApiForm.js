import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';

const ROBOTApiForm = ({ selectedAPI, handleCodeChange }) => {

    let api = selectedAPI
    const [enableSaveButton, setEnableSaveButton] = useState(false); 
    const [returnValue, setReturnValue] = useState('')
    const createRobotExpression = ()=>{
        console.log(api)
        let expression = ''
        api.args.map((arg)=> arg.value ? expression =  `${expression}  ${arg.name}=${arg.value}`: '')
        expression = returnValue !='' ? `\n$${returnValue}= ${api.keyword}  ${expression}` : `\n${api.keyword}  ${expression}`
        handleCodeChange(expression)
    }

    const toggleSaveButton = () => {
        let check = api.args.find((item) => item.key.required == true && (item.value) == undefined)
        setEnableSaveButton(!check)
      }
    return (
        <Grid container spacing={2} sx={{ marginBottom: 1 }}>
            <Grid item xs={12}>
                <h6>{selectedAPI.keyword}</h6>
            </Grid>
            <Grid item xs={12}>
                <FormControl fullWidth>
                    <TextField
                        id="outlined-basic"
                        label="Return Vale"
                        variant="outlined"
                        size='small'
                        value={returnValue}
                        onChange={(e)=>setReturnValue(e.target.value)}
                    />
                </FormControl>
            </Grid>
                {
                    api.args && api.args.length > 0 ? api.args.map((argsItem) => {
                        return (
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                {argsItem.required == false ?
                                    <label >{argsItem.name}</label > :
                                    <Stack direction="row" spacing={0.2}>
                                        <label >{argsItem.name} </label >
                                        <label > *</label >
                                    </Stack>
                                }
                                <TextField
                                    id={argsItem.name}
                                    onChange={e => {
                                        if (e.target.value != '' && e.target.value != undefined) {
                                            argsItem.value = e.target.value
                                        } else {
                                            argsItem.value = undefined
                                        }
                                    }} 
                                    placeholder={"enter value"}
                                    variant="outlined"
                                    size='small' />
                                </FormControl>
                            </Grid>)
                    }) : <></>
                }
            <Grid item xs={12}>
                <Button className='mt-1' onClick={()=>createRobotExpression()} >{'Add to Testcase'}</Button>
            </Grid>
        </Grid>
    )
}

export default ROBOTApiForm