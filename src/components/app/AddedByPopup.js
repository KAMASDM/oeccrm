import React, { useEffect, useState } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { ajaxCallWithHeaderOnly } from "../../helpers/ajaxCall";
import { useSelector } from "react-redux";

function AddedByPopup(props) {
  const [phone, setPhone] = useState("");
  const [throwErr, setThrowErr] = useState(null);
  const authData = useSelector((state) => state.authStore);
  const getPhoneNumber = async function (id) {
    const response = await ajaxCallWithHeaderOnly(`user/ph/${id}/`, {
      Authorization: `Bearer ${authData.accessToken}`,
    });
    if (response?.isNetwork) {
      setThrowErr({ ...response, page: "enquiries" });
      return;
    }
    if (response?.status === 401) {
      setThrowErr({ ...response, page: "enquiries" });
      return;
    }
    setPhone(response?.PhoneNumber);
  };

  useEffect(() => {
    if (props.id) {
      getPhoneNumber(props.id);
    }
  }, [props.id]);
  
  useEffect(() => {
    if (throwErr) throw throwErr;
  }, [throwErr]);
  const popoverPhoneNumber = (
    <Popover id="popoverName">
      <Popover.Body>Phone Number : {phone} </Popover.Body>
    </Popover>
  );
  return (
    <OverlayTrigger
      placement="bottom"
      trigger="click"
      overlay={popoverPhoneNumber}
      rootClose
    >
      <span>{props.name}</span>
    </OverlayTrigger>
  );
}

export default AddedByPopup;
