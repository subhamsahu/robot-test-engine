import React from 'react'

const HTMLViewer = ({file_path,restURL}) => { 
    let iframeSrc = restURL + `/fileexplorer/get_html_file?file_path=${file_path}`
    console.log(iframeSrc)
    return (
        <div className='card'>
            <div className='card-body'>
                <a href={iframeSrc} target='_blank'>Open HTML File in New Tab</a>
                <iframe src={iframeSrc} name="html_viewer" style={{ "height":"550px","width": "100%" }} sandbox="allow-scripts allow-popups allow-same-origin">
                </iframe>
            </div>
        </div>
    )
}

export default HTMLViewer