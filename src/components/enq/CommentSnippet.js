import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form } from "react-bootstrap";
import { ajaxCall } from "../../helpers/ajaxCall";
import { uiAction } from "../../store/uiStore";
import { FileUploader } from "react-drag-drop-files";

function CommentSnippet({ parentComment, enqId, parentId, refresh }) {
  const [showInput, setShowInput] = useState({ show: false, id: null });
  const [replyInput, setReplyInput] = useState();
  const [replyFile, setReplyFile] = useState();
  const [submitting, setSubmitting] = useState(false);
  const authData = useSelector((state) => state.authStore);
  const [throwErr, setThrowErr] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (throwErr) throw throwErr;
  }, [throwErr]);

  const sendReplyData = async function (input) {
    setSubmitting(true);
    try {
      const fdata = new FormData();
      fdata.append("object_id", enqId);
      fdata.append("parent", parentId);
      fdata.append("content", input);
      if (replyFile instanceof File) fdata.append("uploaded_file", replyFile);
      const response = await ajaxCall(
        `app/postcomment/`,
        {
          Authorization: `Bearer ${authData.accessToken}`,
        },
        "POST",
        fdata
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
            heading: "Application",
            msg: `Replied successfully`,
          })
        );
        refresh();
        setSubmitting(false);
      }
    } catch (e) {
      setThrowErr({ e, page: "enquiries" });
      return;
    }
  };
  const addReply = function () {
    try {
      if (replyInput?.length) {
        sendReplyData(replyInput);
        setReplyInput();
        console.log("ajax here", replyInput);
      }
      setShowInput({ show: false, id: parentComment.id });
    } catch (e) {
      setThrowErr({ e, page: "enquiries" });
      return;
    }
  };
  const cancelReply = () => {
    setShowInput({ show: false, id: parentComment.id });
  };
  return (
    <>
      <li key={parentComment.id} className="parentElement">
        <p>
          {parentComment.content}{" "}
          {parentComment.uploaded_file ? (
            <>
              <br />
              <a
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary mt-3"
                href={parentComment.uploaded_file}
                download={true}
              >
                Download Document
              </a>
            </>
          ) : (
            ""
          )}
        </p>
        <p></p>
        <span className="author">
          By{" "}
          {parentComment.user?.username === authData.userName
            ? `me`
            : parentComment.user?.username}
        </span>
      </li>
      {showInput.show ? (
        <Form onSubmit={addReply} className="row">
          <Form.Group className="mb-3 col-md-6" controlId="stuName">
            <Form.Control
              type="text"
              name="stuName"
              value={replyInput}
              onChange={(e) => setReplyInput(e.target.value)}
              placeholder="Write Comment Reply"
              autoFocus
            />
          </Form.Group>
          <div className="col-md-6">
            <FileUploader
              handleChange={(file) => {
                setReplyFile(file);
              }}
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
              {submitting ? "Adding Reply" : "Add Reply"}
            </Button>
            <Button
              type="button"
              variant="outline-danger"
              onClick={cancelReply}
            >
              Cancel
            </Button>
          </div>
        </Form>
      ) : (
        <span
          className="pointer commentReply"
          key={`span-${parentComment.id}`}
          onClick={() => setShowInput({ show: true, id: parentComment.id })}
        >
          Reply
        </span>
      )}
      {parentComment.childs.length ? (
        <ul className="childComponent">
          {parentComment.childs.map((childComment) => {
            return (
              <li key={childComment.id} className="childElement">
                <p>
                  {childComment.content}
                  {childComment.uploaded_file ? (
                    <>
                      <br />
                      <a
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary mt-3"
                        href={childComment.uploaded_file}
                        download={true}
                      >
                        Download Document
                      </a>
                    </>
                  ) : (
                    ""
                  )}
                </p>
                <span className="author">
                  By{" "}
                  {childComment.user?.username === authData.userName
                    ? `me`
                    : childComment.user?.username}
                </span>
              </li>
            );
          })}{" "}
        </ul>
      ) : (
        ""
      )}
    </>
  );
}

export default CommentSnippet;
