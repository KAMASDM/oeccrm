import React, { useState } from "react";
import "./SideImgForm.css";

// Document icon
const DocumentIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Download arrow icon
const DownloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function SideImgForm(props) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Extract filename from path
  const getFileName = () => {
    if (!props.afile) return 'Document';
    
    const parts = props.afile.split('/');
    return parts[parts.length - 1] || 'Document';
  };
  
  const fileName = getFileName();
  // Get file extension
  const fileExtension = fileName.split('.').pop().toLowerCase();
  
  return (
    <div className="lavender-document-card">
      <div className="lavender-document-card__preview">
        <DocumentIcon />
        <div className="lavender-document-card__extension">
          {fileExtension}
        </div>
      </div>
      
      <div className="lavender-document-card__content">
        <h3 className="lavender-document-card__title">
          {props.documentTitle || fileName}
        </h3>
        
        {props.documentType && (
          <div className="lavender-document-card__type">
            {props.documentType}
          </div>
        )}
        
        <a
          className="lavender-document-card__download-btn"
          href={props.afile}
          target="_blank"
          rel="noreferrer"
          download
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <span>Download Document</span>
          <DownloadIcon />
        </a>
      </div>
    </div>
  );
}

export default SideImgForm;