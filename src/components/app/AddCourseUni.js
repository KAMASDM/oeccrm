import React, { useState } from "react";
import { Button } from "react-bootstrap";
import UiModal from "../UI/UiModal";
import CourseUniForm from "./CourseUniForm";

const AddCourseUni = ({ appName, appId, country, setRefresherNeeded }) => {
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
              appName={appName}
              clssName="col-md-6"
              appId={appId}
              hideModal={changeUniFormStatus}
              country={country}
              setRefresherNeeded={setRefresherNeeded}
            />
          }
        />
      ) : (
        ""
      )}
    </>
  );
};

export default AddCourseUni;
