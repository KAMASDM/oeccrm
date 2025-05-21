import React from "react";
import "react-select-search/style.css";
import ApplicationForm from "./ApplicationForm";
import { useParams } from "react-router-dom";
function CreateApplication() {
  const enqId = useParams().appID;
  return (
    <ApplicationForm
      type="create"
      title="Create Application"
      edit={false}
      enqID={enqId}
      enqSelectionDisable={enqId ? true : false}
    />
  );
}

export default CreateApplication;
