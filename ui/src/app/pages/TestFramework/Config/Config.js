import { useEffect, useState } from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useDispatch } from 'react-redux';

import { showSnackBar } from '../../../redux/actions/snackBarActions';
import { ContentBox } from '../../../styles/AppStyles'
import CodeViewer from '../../../components/Viewers/CodeViewer'
import { configFilesList } from './Files';
import { get } from '../../../services/api';
import { BACKEND_URL } from '../../../core/constants';


const Config = () => {
  const dispatch = useDispatch()
  const [tabvalue, setTabValue] = useState(0);
  const [selectedConfig, setSelectedConfig] = useState(configFilesList[0]);
  const [selectedFileContent, setSelectedFileContent] = useState("")
  useEffect(()=>{
    handleConfigContentChange(configFilesList[0])
  },[])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setSelectedConfig(configFilesList[newValue])
    handleConfigContentChange(configFilesList[newValue])
  };
  const handleConfigContentChange = async(configFile) =>{
    const url =  BACKEND_URL + '/file-manager/get-file-data'
    console.log(url)
    const params = {
      'file_path':configFile.relativePath
    }
    const data = await get(url, params)
    if(data.success){
      setSelectedFileContent(data.data)
    }else{
      setSelectedFileContent('')
      console.log(data)
      dispatch(showSnackBar({ msg: `${data.exception_reason}`, type: "error" }))
    }
  }
  return (
    <>
      <Box sx={{ maxWidth: { xs: 320, sm: 480 } }}>
        <Tabs
          value={tabvalue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
          aria-label="scrollable force tabs example"
        >
          {
            configFilesList.map((config) => {
              return <Tab label={config.name} />
            })
          }
        </Tabs>
      </Box>
      <ContentBox>
        <CodeViewer file_path={selectedConfig.relativePath} file_content={selectedFileContent}/>
      </ContentBox>
    </>
  )
}

export default Config