import React, { useEffect, useState } from 'react'
// import 'codemirror/keymap/sublime';
// import 'codemirror/theme/dracula.css';
import CodeMirror from '@uiw/react-codemirror';
// import { saveFileDetails } from '../../services/Common';
// import { useDispatch, useSelector } from 'react-redux'
// import { startSpinner, stopSpinner } from '../../redux/actions/spinnerActions';
// import { showSnackBar } from '../../redux/actions/snackBarActions';

const CodeViewer = (props) => {
    const file_data_from_store = {}
    // const file_data_from_store = useSelector(state => state.loadFileData)
    // const [code, setCode] = useState("")
    // const dispatch = useDispatch()

    // const saveFileChanges = async () => {
    //     dispatch(startSpinner())
    //     var data_to_send = code.replace(/\n/g, '<new_line>');
    //     console.warn(data_to_send)
    //     const data = await saveFileDetails(file_data_from_store.file_path, data_to_send)
    //     if (data.success && data) {
    //         dispatch(showSnackBar({ msg: "File Updated Succefully", type: "alert-success" }))
    //     }
    //     else{
    //         dispatch(showSnackBar({ msg: `${data.exception_reason}`, type: "alert-danger" }))
    //     }
    //     dispatch(stopSpinner())
    // }
    return (
        <div>
            <div className='flex-row border p-2 mt-2 mb-2'>
                <div className='d-flex flex-row justify-content-between'><h6 className='text-blue'>File Preview:   <span className='text-gray'>{props.file_path}</span></h6>
                    <button
                        className='btn btn-sm bg-blue'
                    // onClick={saveFileChanges}
                    ><i className="fas fa-save"></i></button>
                </div>
            </div>
            <CodeMirror
                value={props.file_content}
                options={{
                    theme: 'dracula',
                    keyMap: 'sublime',
                    mode: 'python',
                }}
                onChange={(editor, data, value) => {
                    // setCode(editor);
                }}
                className="h-200"
                tabIndex={true}
                // theme={"dark"}
                maxHeight={"500px"}
            />
        </div>
    )
}

export default CodeViewer