import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { OverlayTrigger, Popover } from "react-bootstrap";
import SelectSearch from "react-select-search";
import { uiAction } from "../../store/uiStore";
import { ajaxCall } from "../../helpers/ajaxCall";

const ChangeAssignUser = ({ name, assignId, courseId, enqName, allUser }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState({
    name: name,
    val: assignId ? assignId : null,
  });
  const [throwErr, setThrowErr] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const authData = useSelector((state) => state.authStore);

  useEffect(() => {
    if (throwErr) throw throwErr;
  }, [throwErr]);

  const changeData = async function (val, data) {
    setIsUpdating(true);
    const formData = new FormData();
    formData.append("assigned_users", val);
    const response = await ajaxCall(
      `get/courseinfo/${courseId}/`,
      {
        Authorization: `Bearer ${authData.accessToken}`,
      },
      "PATCH",
      formData
    );
    if (response?.isNetwork) {
      setThrowErr({ ...response, page: "enqForm" });
      dispatch(
        uiAction.setNotification({
          show: true,
          heading: "Enquiry",
          msg: `Some Problem occur while updating the Assign User`,
        })
      );
      return;
    }
    if (
      response?.status === 401 ||
      response?.status === 204 ||
      response?.status === 400
    ) {
      setThrowErr({ ...response, page: "enqForm" });
      dispatch(
        uiAction.setNotification({
          show: true,
          heading: "Enquiry",
          msg: `For ${enqName} assigned User changed successfully`,
        })
      );
      return;
    }
    if (response?.status === 400) {
    }
    if (response.assigned_users === val) {
      setData({ name: data.name, val });
      console.log();
      setIsUpdating(false);
      dispatch(
        uiAction.setNotification({
          show: true,
          heading: "Enquiry",
          msg: `For ${enqName} assigned User changed successfully`,
        })
      );
    }
  };

  const popoverAssignUsr = (
    <Popover id="popoverAssignusrEnq">
      <Popover.Body>
        <SelectSearch
          placeholder="select Option"
          options={allUser}
          value={data.val}
          onChange={changeData}
          name="assignedUsr"
          search={true}
        />
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      {isUpdating ? (
        "Updating"
      ) : (
        <OverlayTrigger
          placement="bottom"
          trigger="click"
          overlay={popoverAssignUsr}
          rootClose
        >
          <span className="pointer">{data.name}</span>
        </OverlayTrigger>
      )}
    </>
  );
};

export default ChangeAssignUser;
