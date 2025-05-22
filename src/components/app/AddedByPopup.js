import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { ajaxCallWithHeaderOnly } from "../../helpers/ajaxCall";

const AddedByPopup = ({ id, name }) => {
  const [phone, setPhone] = useState("");
  const [throwErr, setThrowErr] = useState(null);
  const authData = useSelector((state) => state.authStore);

  const getPhoneNumber = useCallback(
    async (id) => {
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
    },
    [authData.accessToken]
  );

  useEffect(() => {
    if (id) {
      getPhoneNumber(id);
    }
  }, [getPhoneNumber, id]);

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
      <span>{name}</span>
    </OverlayTrigger>
  );
};

export default AddedByPopup;
