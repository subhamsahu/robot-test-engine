import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import useStyles from "./styles";

const CSVViewer = (props) => {
  const file_data_from_store = props.file_data_from_store
  let editable = props.editable
  var classes = useStyles();
  const dataSource = file_data_from_store.file_contents
  const rows = dataSource.split('\n');
  let cols = rows[0];
  cols = cols.split(',');
  const rowsObj = rows.map((row) => {
    const vals = row.split(',');
    return vals.reduce((res, val, idx) => {
      const prop = cols[idx];
      res[prop] = val;
      return res;
    }, {});
  });
  return (
    <div>
      <div>
        <div style={{ "height": "550px", "width": "100%" }}>
          <h3 className={classes.textBlue}>File Preview: {file_data_from_store.file_path}</h3>
          {/* <button className='btn btn-sm bg-gray' onClick={handleFileDataChange}><i className="fas fa-save"></i></button> */}
          <TableContainer sx={{ height: "550px" }}>
            <Table
              size="small"
              aria-label="a dense table"
            >
              <TableBody>
                {rowsObj.map((item) => {                                // changed here
                  return (
                    <TableRow>
                      {Object.entries(item).map((field) => {        // changed here
                        return <TableCell>{field[1]}</TableCell>
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  )
}

CSVViewer.defaultProps = {
  editable: false
};

export default CSVViewer