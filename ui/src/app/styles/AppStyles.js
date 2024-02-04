import { styled } from '@mui/material';
// import { makeStyles } from "@material-ui/styles";

export const ContentBox = styled('div')(({ theme }) => ({
    padding: '30px',
    [theme.breakpoints.down('sm')]: { margin: '16px' },
}));




// export default makeStyles(theme => ({

//     folderBody:{ backgroundColor: "white", border: '2px solid #852D90!important', padding: "5px", height: "600px", overflowY: "scroll" },
// }));
