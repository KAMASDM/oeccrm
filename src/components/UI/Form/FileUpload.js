import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { FileUploader } from "react-drag-drop-files";
import "./FileUpload.css";

// Icons
const DocumentIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#9575cd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke="#9575cd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 13H8" stroke="#9575cd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 17H8" stroke="#9575cd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 9H9H8" stroke="#9575cd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const fileTypes = ["pdf"];

function FileUpload(props) {
  const [dragActive, setDragActive] = useState(false);
  
  // Handle file name display with improved readability
  const fileName = 
    props.isEdit && !(props.afile instanceof File)
      ? props.afile
        ? props.afile.split("/").reduce((acc, path) => {
            return path;
          }, "")
        : "No file uploaded yet"
      : props.afile
      ? `${props.afile.name}`
      : "No files uploaded yet";
      
  const fileIsUploaded = 
    (props.isEdit && props.afile && !(props.afile instanceof File)) || 
    (props.afile instanceof File);

  // Events to enhance drag-drop UI feedback
  const handleDragStateChange = (active) => {
    setDragActive(active);
  };

  return (
    <Form.Group 
      controlId={props.groupId} 
      className={`lavender-file-upload ${props.groupClassName || ""}`}
    >
      {props?.label ? (
        <Form.Label className="lavender-file-upload__label">
          {props.label}
          {props.label === "Resume" ? (
            <span className="lavender-file-upload__resume-link">
              {" / "}
              <a href="https://getcv.me" target="_blank" rel="noreferrer">
                Create Resume Now
              </a>
            </span>
          ) : null}
        </Form.Label>
      ) : null}

      <div 
        className={`lavender-file-upload__container ${dragActive ? 'active' : ''} ${fileIsUploaded ? 'has-file' : ''}`}
        onDragEnter={() => handleDragStateChange(true)}
        onDragLeave={() => handleDragStateChange(false)}
        onDragEnd={() => handleDragStateChange(false)}
        onDrop={() => handleDragStateChange(false)}
      >
        <div className="lavender-file-upload__dropzone">
          <FileUploader
            handleChange={props.onChange}
            name={props.fieldName}
            types={fileTypes}
            hoverTitle={props.title || "Drop file here"}
            minSize={0.00005}
            maxSize={0.5}
            onDraggingStateChange={handleDragStateChange}
          />
          
          <div className="lavender-file-upload__content">
            <DocumentIcon />
            <p className="lavender-file-upload__text">
              <span className="lavender-file-upload__title">
                {props.title || "Drop your PDF file here"}
              </span>
              <span className="lavender-file-upload__subtitle">
                or <span className="lavender-file-upload__browse">browse files</span>
              </span>
            </p>
            <p className="lavender-file-upload__size-limit">Maximum file size: 500KB</p>
          </div>
        </div>
      </div>
      
      {fileIsUploaded && (
        <div className="lavender-file-upload__file-info">
          {props.isEdit && props.afile && !(props.afile instanceof File) ? (
            <a
              className="lavender-file-upload__download-link"
              target="_blank"
              rel="noreferrer"
              href={props.afile}
              download
            >
              <span className="lavender-file-upload__filename">{fileName}</span>
              <DownloadIcon />
            </a>
          ) : (
            <div className="lavender-file-upload__filename-container">
              <span className="lavender-file-upload__filename">{fileName}</span>
            </div>
          )}
        </div>
      )}
    </Form.Group>
  );
}

export default FileUpload;