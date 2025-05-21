import React, { useState } from "react";
import { Button } from "react-bootstrap";
import UiModal from "../UI/UiModal";
import CourseUniForm from "./CourseUniForm";

function AddCourseUni(props) {
  const [uniFormStatus, setUniFormStatus] = useState(false);

  const changeUniFormStatus = () => {
    setUniFormStatus((status) => !status);
  };
  return (
    <>
      <div className="col-md-12 text-center mb-3">
        <Button onClick={changeUniFormStatus}>Apply To University</Button>
      </div>
      {uniFormStatus ? (
        <UiModal
          setModalStatus={changeUniFormStatus}
          showStatus={true}
          showHeader={true}
          title="Apply To University"
          body={
            <CourseUniForm
              appName={props.appName}
              clssName="col-md-6"
              appId={props.appId}
              hideModal={changeUniFormStatus}
              country={props.country}
              setRefresherNeeded={props.setRefresherNeeded}
            />
          }
        />
      ) : (
        ""
      )}
    </>
  );
}

export default AddCourseUni;
