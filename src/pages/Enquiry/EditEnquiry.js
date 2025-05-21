import React from "react";
import { useParams } from "react-router-dom";
import EnquiryForm from "./EnquiryForm";

function EditEnquiry() {
  const param = useParams();
  return (
    <EnquiryForm enqId={param.enquiryId} title="Edit Enquiry" edit={true} />
  );
}

export default EditEnquiry;
