import React from "react";
import { Form } from "react-bootstrap";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["pdf"];

const FileUpload = ({
  afile,
  isEdit,
  onChange,
  fieldName,
  label,
  title,
  groupId,
  groupClassName,
}) => {
  const fileName =
    isEdit && !(afile instanceof File)
      ? afile
        ? afile.split("/").reduce((acc, path) => {
            return path;
          }, "")
        : "No file uploaded yet"
      : afile
      ? `File name: ${afile.name}`
      : "No files uploaded yet";

  return (
    <>
      <Form.Group controlId={groupId} className={groupClassName}>
        {label ? (
          <Form.Label className="reesumeLabel">
            {label}
            {label === "Resume" ? (
              <>
                {" / "}
                <a href="https://getcv.me" target="_blank" rel="noreferrer">
                  Create Resume Now
                </a>
              </>
            ) : (
              ""
            )}
          </Form.Label>
        ) : (
          ""
        )}

        <div className="neumorphism-box uploadBox">
          <FileUploader
            handleChange={onChange}
            name={fieldName}
            types={fileTypes}
            hoverTitle={title}
            minSize={0.00005}
            maxSize={0.5}
          />
        </div>
        {isEdit && afile && !(afile instanceof File) ? (
          <a
            className="appDownload"
            target="_blank"
            rel="noreferrer"
            href={afile}
            download
          >
            {fileName}
          </a>
        ) : (
          <p>{fileName}</p>
        )}
      </Form.Group>
    </>
  );
};

export default FileUpload;
