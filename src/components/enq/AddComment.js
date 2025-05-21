import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { ajaxCall } from "../../helpers/ajaxCall";
import { useDispatch, useSelector } from "react-redux";
import { uiAction } from "../../store/uiStore";
import { FileUploader } from "react-drag-drop-files";

function AddComment(props) {
  const [textBoxStatus, setTextBoxStatus] = useState({
    show: false,
    text: null,
    upload: null,
  });
  const [throwErr, setThrowErr] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const authData = useSelector((state) => state.authStore);
  const dispatch = useDispatch();
  const cancelComment = () => {
    setTextBoxStatus((textBoxStatus) => {
      return { ...textBoxStatus, show: false };
    });
  };

  useEffect(() => {
    if (throwErr) throw throwErr;
  }, [throwErr]);

  const sendCommentData = async function (input, file) {
    setSubmitting(true);
    const formData = new FormData();
    formData.append("object_id", props.enqId);
    formData.append("content", input);
    if (file instanceof File) formData.append("uploaded_file", file);

    const response = await ajaxCall(
      `app/postcomment/`,
      {
        Authorization: `Bearer ${authData.accessToken}`,
      },
      "POST",
      formData
    );
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
          heading: "Application",
          msg: `Comment Added`,
        })
      );
      setTextBoxStatus({ show: false, text: null, upload: null });
      props.refresh();
    }
    setSubmitting(false);
  };
  const addComment = function (e) {
    e.preventDefault();
    if (textBoxStatus.text?.length || textBoxStatus.upload instanceof File) {
      sendCommentData(textBoxStatus.text, textBoxStatus.upload);
    } else {
      dispatch(
        uiAction.setNotification({
          show: true,
          heading: "Application",
          msg: `Comment Discarded`,
        })
      );
      setTextBoxStatus({ show: false, text: null, upload: null });
    }
  };

  return (
    <div className="text-center">
      {textBoxStatus.show ? (
        <Form onSubmit={addComment} className="row">
          <Form.Group
            className="text-center col-md-12 mb-3"
            controlId="addComment"
          >
            <Form.Control
              as="textarea"
              name="addComment"
              value={textBoxStatus.text}
              onChange={(e) =>
                setTextBoxStatus((oldData) => {
                  return { ...oldData, show: true, text: e.target.value };
                })
              }
              autoFocus
              placeholder="Add Comment"
            />
          </Form.Group>
          <div className="col-md-6">
            <FileUploader
              handleChange={(file) => {
                setTextBoxStatus((oldData) => {
                  return { ...oldData, show: true, upload: file };
                });
              }}
              name={props.fieldName}
              hoverTitle={props.title}
              minSize={0.0005}
              maxSize={0.5}
              types={["JPG", "PNG", "GIF", "JPEG", "docs", "pdf"]}
            />
          </div>
          <div className="col-md-6">
            <Button
              varient="primary"
              type="submit"
              className="mr-3"
              disabled={submitting}
            >
              {submitting ? "Adding Comment" : "Add Comment"}
            </Button>
            <Button
              type="button"
              variant="outline-danger"
              onClick={cancelComment}
            >
              Cancel
            </Button>
          </div>
        </Form>
      ) : (
        <span
          onClick={() => {
            setTextBoxStatus({ show: true, text: null, upload: null });
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
