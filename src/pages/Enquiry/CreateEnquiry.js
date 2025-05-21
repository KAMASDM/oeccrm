import React from "react";
import EnquiryForm from "./EnquiryForm";

function CreateEnquiry(props) {
  return (
    <>
      <EnquiryForm
        type="create"
        title="Create Enquiry"
        edit={false}
        isFlow={props ? true : false}
        level={props?.levelId}
        intake={props?.intake}
        courseId={props?.courseId}
        uniId={props?.uniId}
      />
    </>
  );
}

export default CreateEnquiry;
