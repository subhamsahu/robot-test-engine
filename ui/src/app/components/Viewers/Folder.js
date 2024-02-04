import { useState, useEffect, useContext } from "react";
import useStyles from "./styles";
import FolderIcon from '@mui/icons-material/Folder';
import { getFileDetails } from "../../services/analytics/ViewerServices";

function Folder({ explorer, setfileStateCallback, restURL }) {
    const [expand, setExpand] = useState(false);
    var classes = useStyles();
    const [show, setShow] = useState(false);
    const [points, setPoints] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const handleClick = () => setShow(false);
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);
    console.log(restURL)
    const sendObjectForDetail = async (obj) => {
        if (restURL == undefined) {
            return
        }
        let data = await getFileDetails(restURL, obj.name)
        console.log(data)
        setfileStateCallback(data)
    }
    return (
        <div>
            <span onClick={() => setExpand(!expand)}>
                {
                    (explorer.isFolder) ?

                        <span className={`${classes.textBlue}`} style={{ cursor: "pointer" }}> <FolderIcon /> {explorer.prefix.length > 35 ? explorer.prefix.substring(0, 35) : explorer.prefix} </span> :
                        <span onClick={() => sendObjectForDetail(explorer)} style={{ "cursor": "pointer" }}>{explorer.prefix}</span>
                }
            </span>
            <br />
            <div style={{ display: expand ? "block" : "none", paddingLeft: 15 }}>
                {explorer.items.map((explore) => (
                    <>
                        <Folder key={explore.name} explorer={explore} setfileStateCallback={setfileStateCallback} restURL={restURL} />
                    </>
                ))}
            </div>
        </div>
    );
}

export default Folder;