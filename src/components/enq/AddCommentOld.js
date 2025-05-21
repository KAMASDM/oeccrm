import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { ajaxCall } from "../../helpers/ajaxCall";
import { useDispatch, useSelector } from "react-redux";
import { uiAction } from "../../store/uiStore";

function AddComment(props) {
  const [textBoxStatus, setTextBoxStatus] = useState({
    show: false,
    text: null,
  });
  const [throwErr, setThrowErr] = useState(null);
  const authData = useSelector((state) => state.authStore);
  const dispatch = useDispatch();
  useEffect(() => {
    if (throwErr) throw throwErr;
  }, [throwErr]);
  const sendCommentData = async function (input) {
    const data = {
      object_id: props.enqId,
      content: input,
    };

    const response = await ajaxCall(
      `enq/postcomment/`,
      {
        Authorization: `Bearer ${authData.accessToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      "POST",
      JSON.stringify(data)
    );
    console.log(response);
    if (response?.isNetwork) {
      setThrowErr({ ...response, page: "enqForm" });
      return;
    }
    if (
      response?.status &&
      (response?.status !== 200 || response?.status !== 201)
    ) {
      setThrowErr({ ...response, page: "enqForm" });
      return;
    } else {
      dispatch(
        uiAction.setNotification({
          show: true,
          heading: "Enquiry",
          msg: `Comment Added`,
        })
      );
      props.refresh();
    }
  };
  const addComment = function () {
    if (textBoxStatus.text?.length) {
      sendCommentData(textBoxStatus.text);
      setTextBoxStatus({ show: false, text: null });
    }
    setTextBoxStatus({ show: false, text: null });
  };
  return (
    <div className="text-center">
      {textBoxStatus.show ? (
        <Form.Group className="text-center" controlId="addComment">
          <Form.Control
            as="textarea"
            name="addComment"
            value={textBoxStatus.text}
            onChange={(e) =>
              setTextBoxStatus({ show: true, text: e.target.value })
            }
            autoFocus
            placeholder="Add Comment"
            onBlur={addComment}
          />
        </Form.Group>
      ) : (
        <span
          onClick={() => {
            setTextBoxStatus({ show: true, text: null });
          }}
          className="btn btn-primary text-center"
        >
          Add Comment
        </span>
      )}
    </div>
  );
}

export default AddComment;
