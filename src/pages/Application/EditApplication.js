import React from "react";
import { useParams } from "react-router-dom";
import ApplicationForm from "./ApplicationForm";

function EditApplication() {
  const param = useParams();
  return (
    <ApplicationForm
      appId={param.appId}
      type="create"
      title="Edit Application"
      edit={true}
    />
  );
}

export default EditApplication;
