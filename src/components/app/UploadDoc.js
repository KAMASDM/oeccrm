import React, { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { FileUploader } from "react-drag-drop-files";
import { ajaxCall } from "../../helpers/ajaxCall";
import { useDispatch, useSelector } from "react-redux";
import { uiAction } from "../../store/uiStore";
import UiModal from "../UI/UiModal";

const UploadDoc = (props) => {
  const [uploading, setUploading] = useState(false);
  const authData = useSelector((state) => state.authStore);
  const dispatch = useDispatch();
  const [throwErr, setThrowErr] = useState(null);

  useEffect(() => {
    if (throwErr) throw throwErr;
  }, [throwErr]);

  const uploadFile = async function (id, file) {
    const fdata = new FormData();
    if (file instanceof File) fdata.append(props.uploadKey, file);
    setUploading(true);
    let url = `update-application/${id}/`;
    if (props.uploadKey === "rcvd_offer_letter" || props.uploadKey === "Sop") {
      url = `get/courseinfo/${id}/`;
    }
    const response = await ajaxCall(
      url,
      {
        Authorization: `Bearer ${authData.accessToken}`,
      },
      "PATCH",
      fdata
    );
    if (response?.isNetwork) {
      setThrowErr({ ...response, page: "enqForm" });
      return;
    }
    if (response?.status === 401 || response?.status === 204) {
      setThrowErr({ ...response, page: "enqForm" });
      return;
    }
    if (response?.status === 400 || response?.status > 499) {
      dispatch(
        uiAction.setNotification({
          show: true,
          heading: "Application",
          msg: `Problem Occured while uploading ${props.title}, Please try again`,
        })
      );
      closeModal();
      return;
    }
    dispatch(
      uiAction.setNotification({
        show: true,
        heading: "Application",
        msg: `${props.title} Uploaded Successfully for ${props.name} `,
      })
    );
    if (props.uploadKey === "rcvd_offer_letter" || props.uploadKey === "Sop") {
    } else {
      props.setRefresherNeeded(true);
    }
    props.changeMode((data) => {
      return { ...data, document: response[props.uploadKey], show: false };
    });
    setUploading(false);
  };

  const closeModal = () => {
    props.changeMode((data) => {
      return { ...data, show: false };
    });
  };

  return (
    <>
      <UiModal
        setModalStatus={closeModal}
        showStatus={true}
        showHeader={true}
        title={`Upload ${props.title} for ${props.name}`}
        body={
          uploading ? (
            <div className="text-center uploadingBtn">
              <Button variant="primary" disabled>
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                Uploading...
              </Button>
            </div>
          ) : (
            <>
              <div className="flexCenter">
                <FileUploader
                  handleChange={(file) => {
                    uploadFile(props.id, file);
                  }}
                  types={["pdf"]}
                  hoverTitle="Upload Document"
                  minSize={0.00005}
                  maxSize={0.5}
                />
              </div>
              <div className="text-center mt-3">
                <Button variant="danjor-outline" onClick={closeModal}>
                  Cancel Upload
                </Button>
              </div>
            </>
          )
        }
      />
    </>
  );
};

export default UploadDoc;
