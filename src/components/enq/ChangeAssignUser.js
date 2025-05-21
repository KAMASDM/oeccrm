import React, { useEffect, useState } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import SelectSearch from "react-select-search";
import { ajaxCall } from "../../helpers/ajaxCall";
import { useDispatch, useSelector } from "react-redux";
import { uiAction } from "../../store/uiStore";

function ChangeAssignUser(props) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [data, setData] = useState({
    name: props.name,
    val: props.assignId ? props.assignId : null,
  });
  const [throwErr, setThrowErr] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (throwErr) throw throwErr;
  }, [throwErr]);

  const authData = useSelector((state) => state.authStore);
  const changeData = async function (val, data) {
    setIsUpdating(true);
    const formData = new FormData();
    formData.append("assigned_users", val);
    const response = await ajaxCall(
      `get/courseinfo/${props.courseId}/`,
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
          msg: `For ${props.enqName} assigned User changed successfully`,
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
          msg: `For ${props.enqName} assigned User changed successfully`,
        })
      );
    }
  };
  const popoverAssignUsr = (
    <Popover id="popoverAssignusrEnq">
      <Popover.Body>
        <SelectSearch
          placeholder="select Option"
          options={props.allUser}
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
}

export default ChangeAssignUser;
