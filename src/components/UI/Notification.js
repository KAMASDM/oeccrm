import React from "react";
import Toast from "react-bootstrap/Toast";
import { useDispatch } from "react-redux";
import { uiAction } from "../../store/uiStore";

const Notification = ({ show, heading, msg }) => {
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
          show={show}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">{heading}</strong>
          </Toast.Header>
          <Toast.Body dangerouslySetInnerHTML={{ __html: msg }}></Toast.Body>
        </Toast>
      </div>
    </div>
  );
};

export default Notification;
