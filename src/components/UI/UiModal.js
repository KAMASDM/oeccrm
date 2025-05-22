import React from "react";
import { Modal } from "react-bootstrap";

const UiModal = ({
  size,
  showStatus,
  setModalStatus,
  title,
  body,
  showHeader,
  showFooter,
  footerContent,
  modalClass,
}) => {
  const mainSize = size ? size : "lg";
  return (
    <Modal
      show={showStatus}
      size={mainSize}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={setModalStatus}
    >
      {showHeader ? (
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">{title}</Modal.Title>
        </Modal.Header>
      ) : (
        ""
      )}
      <Modal.Body className={modalClass ? modalClass : ""}>{body}</Modal.Body>
      {showFooter ? <Modal.Footer>{footerContent}</Modal.Footer> : ""}
    </Modal>
  );
};

export default UiModal;
