import React, { useState } from "react";
import { ToastContainer } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Toast from "react-bootstrap/Toast";
import { useDispatch } from "react-redux";
import { uiAction } from "../../store/uiStore";

function Notification(props) {
  const dispatch = useDispatch();
  return (
    <div aria-live="polite" aria-atomic="true">
      <div className="notification-card">
        <Toast
          onClose={() =>
            dispatch(
              uiAction.setNotification({
                show: false,
                heading: null,
                msg: null,
              })
            )
          }
          show={props.show}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">{props.heading}</strong>
          </Toast.Header>
          <Toast.Body
            dangerouslySetInnerHTML={{ __html: props.msg }}
          ></Toast.Body>
        </Toast>
      </div>
    </div>
  );
}

export default Notification;
