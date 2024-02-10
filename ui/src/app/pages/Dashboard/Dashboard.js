import React, { useEffect, useState } from 'react'
import { ContentBox } from '../../styles/AppStyles'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  registerables
} from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Button, Grid } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import { useDispatch } from 'react-redux';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ...registerables,
)

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  minHeight: '600px'
}));


const Dashboard = () => {
  const dispatch = useDispatch()
  const anchor = "right"
  const [toggleDrawer, setToggleDrawer] = useState(false)
  const nooftests = {
    labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
    datasets: [{
      label: 'Total Tests',
      data: ['14', '8', '20', '30', '15', '50'],
      backgroundColor: [
        'rgba(18,102,241,1)',
        'rgba(18,102,241,1)',
        'rgba(18,102,241,1)',
        'rgba(18,102,241,1)',
        'rgba(18,102,241,1)',
        'rgba(18,102,241,1)',
      ],
      borderColor: [
        'rgb(18,102,241)',
        'rgb(18,102,241)',
        'rgb(18,102,241)',
        'rgb(18,102,241)',
        'rgb(18,102,241)',
        'rgb(18,102,241)',
      ],
      borderWidth: 4
    }]
  }
  const handletoggleDrawerChange = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setToggleDrawer(!toggleDrawer);
  }

  useEffect(() => {

  }, [])

  return (
    <ContentBox>
      <h6 className='text-blue'>Analytics</h6><br />
      <Grid container spacing={2} sx={{ marginBottom: 1 }}>
        <Grid item xs={12}>
          <div class="col-lg-6 pl-lg-2 mb-3">
            <div class="card h-lg-100">
              <div class="card-header">
                <div class="row flex-between-center">
                  <div class="col-auto">
                    <h6 class="mb-0">Test Campaigns</h6>
                  </div>
                </div>
              </div>
              <div class="card-body h-100 pr-0">
                <div class="echart-line-total-sales h-100" data-echart-responsive="true">
                  <Line data={nooftests} width={500} height={250} />
                </div>
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={2}>
          <React.Fragment key={anchor}>
            <Button onClick={handletoggleDrawerChange(anchor, true)} className='mt-1'>Last Execution Result</Button>
            <Drawer
              anchor={anchor}
              open={toggleDrawer}
              onClose={handletoggleDrawerChange(anchor, false)}
            >

            </Drawer>
          </React.Fragment>
        </Grid>
      </Grid>
    </ContentBox >
  )
}

export default Dashboard