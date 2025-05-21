import React, { useState } from "react";
import UploadDoc from "./UploadDoc";

function DocumentRow(props) {
  const [docData, setDocData] = useState({
    show: false,
    id: props.id,
    title: props.docType,
    name: props.name,
    document: props.document,
    key: props.uploadKey,
  });
  return (
    <>
      {docData.document ? (
        <a
          href={docData.document}
          target="_blank"
          rel="noreferrer"
          download
          className="btn btn-primary"
          alt={`Download ${docData.name}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-arrow-down-circle"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="8 12 12 16 16 12"></polyline>
            <line x1="12" y1="8" x2="12" y2="16"></line>
          </svg>
        </a>
      ) : (
        <div
          className="btn btn-danger"
          onClick={() => {
            setDocData({ ...docData, show: true });
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-arrow-up-circle"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="16 12 12 8 8 12"></polyline>
            <line x1="12" y1="16" x2="12" y2="8"></line>
          </svg>
        </div>
      )}
      {docData.show ? (
        <UploadDoc
          changeMode={setDocData}
          name={docData.name}
          title={docData.title}
          uploadKey={props.uploadKey}
          id={docData.id}
          setRefresherNeeded={props.setRefresherNeeded}
        />
      ) : (
        ""
      )}
    </>
  );
}

export default DocumentRow;
