import React, { useState } from 'react'
import { ContentBox } from '../../../styles/AppStyles'
import { Grid, MenuItem, Select } from '@mui/material'

const Testplan = () => {
  const [testplanList, settestplanList] = useState([])
  const [selectedTestplan, setSelectedTestplan] = useState({
    'name':'None',
    'testList':[]
  })
  const handleMasterCheckBoxChange = async () => {

  }
  const handleCheckBoxChange = () => {

  }
  const handleEdit = () => {

  }
  const handleOpenDialog = () => {

  }
  const handleTestplanChange = ()=>{

  }
  return (
    <ContentBox>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <button className='btn btn-sm bg-blue'>Create a Testplan</button>
        </Grid>
        <Grid item xs={2}>
          <Select
            labelId="suite"
            id="suite"
            value={selectedTestplan.name}
            label="Suite"
            size='small'
            onChange={handleTestplanChange}
          >
            <MenuItem value="None">
              <em>None</em>
            </MenuItem>
            {
              testplanList.map((suite) => {
                return <MenuItem value={suite.name}>{suite.name}</MenuItem>
              })
            }
          </Select>
        </Grid>
        <Grid item xs={2}>
          <button className='btn btn-sm bg-blue'>Execute Testplan</button>
        </Grid>
        <Grid item xs={12}>
          <table class="table table-sm mb-0 table-striped table-dashboard fs--1 data-table border-bottom border-200" data-options='{"searching":false,"responsive":false,"info":false,"lengthChange":false,"sWrapper":"falcon-data-table-wrapper","dom":"<&#39;row mx-1&#39;<&#39;col-sm-12 col-md-6&#39;l><&#39;col-sm-12 col-md-6&#39;f>><&#39;table-responsive&#39;tr><&#39;row no-gutters px-1 py-3 align-items-center justify-content-center&#39;<&#39;col-auto&#39;p>>","language":{"paginate":{"next":"<span class=\"fas fa-chevron-right\"></span>","previous":"<span class=\"fas fa-chevron-left\"></span>"}}}'>
            <thead class="bg-200 text-900">
              <tr>
                <th class="align-middle no-sort">
                  <div class="custom-control custom-checkbox">
                    <input className="form-check-input" type="checkbox" value="" name='master_checkbox' id="flexCheckDefault" onChange={(e) => handleMasterCheckBoxChange(e)} />
                  </div>
                </th>
                <th class="align-middle sort">Suite</th>
                <th class="align-middle sort">Name</th>
                <th class="align-middle sort">Description</th>
                <th class="align-middle sort">Joined</th>
                <th class="no-sort">Actions</th>
              </tr>
            </thead>
            <tbody id="testplan">
              {
                selectedTestplan?.testList.map((item, index) => (
                  <tr class="btn-reveal-trigger">
                    <td class="py-2 align-middle">
                      <div class="custom-control custom-checkbox">
                        <input className="form-check-input" type="checkbox" value="" name='child_checkbox' id="flexCheckDefault" onChange={(e) => handleCheckBoxChange(e, item)} />
                      </div>
                    </td>
                    <td class="py-2 align-middle white-space-nowrap customer-name-column"><a href="../pages/customer-details.html">
                      <div class="media d-flex align-items-center">
                        <div class="avatar avatar-xl mr-2">
                          <div class="avatar-name rounded-circle"><span><img src={item.avatar}></img></span></div>
                        </div>
                        <div class="media-body">
                          <h5 class="mb-0 fs--1">{item.firstName}</h5>
                        </div>
                      </div>
                    </a></td>
                    <td class="py-2 align-middle"><a href={`mailto:${item.email}`}>{item.email}</a></td>
                    <td class="py-2 align-middle white-space-nowrap"> <a href="tel:2012001851">(91) {item.phoneNumber} </a></td>
                    <td class="py-2 align-middle">30/03/2018</td>
                    <td class="py-2 align-middle">{item.role}</td>
                    <td class="py-2 align-middle">
                      {item.active ? <span class="badge badge-success rounded-pill d-inline">Active</span> :
                        <span class="badge badge-danger rounded-pill d-inline">Not Active</span>
                      }</td>
                    <td class="py-2 align-middle">
                      {
                        item.verified ? <span class="badge badge-success rounded-pill d-inline">Verified</span> :
                          <span class="badge badge-danger rounded-pill d-inline">Not Verified</span>
                      }
                    </td>
                    <td class="py-2 align-middle white-space-nowrap">
                      <div class="dropdown">
                        <button
                          class="btn btn-link btn-sm btn-reveal dropdown-toggle"
                          type="button"
                          id={`dropdownbtn_${index}`}
                          data-mdb-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <span class="fas fa-ellipsis-h fs--1"></span>
                        </button>
                        <ul class="dropdown-menu" aria-labelledby={`dropdownbtn_${index}`}>
                          <li><a class="dropdown-item" href="#" onClick={() => handleEdit(item)}>Edit</a></li>
                          <li><a class="dropdown-item" href="#" onClick={() => handleOpenDialog(item)}>Delete</a></li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))
              }

            </tbody>
          </table>
        </Grid>
      </Grid>
    </ContentBox>
  )
}

export default Testplan