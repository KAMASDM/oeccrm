import React from "react";
import { Button, Modal } from "react-bootstrap";

function UiModal(props) {
  const size = props?.size ? props.size : "lg";
  return (
    <Modal
      show={props.showStatus}
      size={size}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={props.setModalStatus}
    >
      {props.showHeader ? (
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {props.title}
          </Modal.Title>
        </Modal.Header>
      ) : (
        ""
      )}
      <Modal.Body className={props?.modalClass ? props?.modalClass : ""}>
        {props.body}
      </Modal.Body>
      {props.showFooter ? (
        <Modal.Footer>{props.footerContent}</Modal.Footer>
      ) : (
        ""
      )}
    </Modal>
  );
}

export default UiModal;
