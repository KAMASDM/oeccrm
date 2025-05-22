import React, { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { FileUploader } from "react-drag-drop-files";
import UiModal from "../UI/UiModal";
import { uiAction } from "../../store/uiStore";
import { ajaxCall } from "../../helpers/ajaxCall";

const UploadDoc = ({
  uploadKey,
  setRefresherNeeded,
  title,
  name,
  id,
  changeMode,
}) => {
  const dispatch = useDispatch();
  const [throwErr, setThrowErr] = useState(null);
  const [uploading, setUploading] = useState(false);
  const authData = useSelector((state) => state.authStore);

  useEffect(() => {
    if (throwErr) throw throwErr;
  }, [throwErr]);

  const uploadFile = async (id, file) => {
    const fdata = new FormData();
    if (file instanceof File) fdata.append(uploadKey, file);
    setUploading(true);
    let url = `update-application/${id}/`;
    if (uploadKey === "rcvd_offer_letter" || uploadKey === "Sop") {
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
          msg: `Problem Occured while uploading ${title}, Please try again`,
        })
      );
      closeModal();
      return;
    }
    dispatch(
      uiAction.setNotification({
        show: true,
        heading: "Application",
        msg: `${title} Uploaded Successfully for ${name} `,
      })
    );
    if (uploadKey === "rcvd_offer_letter" || uploadKey === "Sop") {
    } else {
      setRefresherNeeded(true);
    }
    changeMode((data) => {
      return { ...data, document: response[uploadKey], show: false };
    });
    setUploading(false);
  };

  const closeModal = () => {
    changeMode((data) => {
      return { ...data, show: false };
    });
  };

  return (
    <>
      <UiModal
        setModalStatus={closeModal}
        showStatus={true}
        showHeader={true}
        title={`Upload ${title} for ${name}`}
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
                    uploadFile(id, file);
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
