import React, { useEffect, useState } from "react";
import EnqDetails from "../../components/enq/EnqDetails";
import { Link, useParams } from "react-router-dom";
import LoadingData from "../../components/UI/LoadingData";
import { ajaxCallWithHeaderOnly } from "../../helpers/ajaxCall";
import { useSelector } from "react-redux";
import CourseUniData from "../../components/StudentDashboard/CourseUniData";
import AddCourseUni from "../../components/app/AddCourseUni";

function StudentDashboard() {
  const [appDocInfo, setAppDocInfo] = useState({ isLoading: true, data: {} });
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const authData = useSelector((state) => state.authStore);
  const enqId = useParams().enqId;
  const [throwErr, setThrowErr] = useState(null);
  const [refreshNeeded, setRefresherNeeded] = useState(true);

  useEffect(() => {
    if (throwErr) throw throwErr;
  }, [throwErr]);

  const getEnqdata = async () => {
    const response = await ajaxCallWithHeaderOnly(
      `enquiries/${enqId}/`,
      {
        Authorization: `Bearer ${authData.accessToken}`,
      },
      "POST",
      null
    );
    if (response?.isNetwork) {
      setThrowErr({ ...response, page: "enqForm" });
      return;
    }
    if (
      response?.status === 401 ||
      response?.status === 204 ||
      response?.status === 404
    ) {
      setThrowErr({ ...response, page: "enqForm" });
      return;
    }
    if (response?.status) {
      setThrowErr({ ...response, page: "enquiries" });
      return;
    }
    setData(response);
    setIsLoading(false);
  };

  useEffect(() => {
    if (enqId) {
      setIsLoading(true);
      getEnqdata();
    }
  }, [enqId]);

  if (isLoading) {
    return <LoadingData className="text-center" />;
  }
  
  return (
    <>
      <div className="neumorphism-box">
        <EnqDetails data={data} />
      </div>
      <div className="col-md-12 text-center">
        {data.application_id ? (
          <>
            <AddCourseUni
              appName={data.student_name}
              appId={data.application_id}
              country={
                data.country_interested?.id ? data.country_interested?.id : 1
              }
              setRefresherNeeded={setRefresherNeeded}
            />
            <div className="neumorphism-box">
              <div className="col-md-12">
                {data.application_id ? (
                  <CourseUniData
                    stuName={data.student_name}
                    setRefresherNeeded={setRefresherNeeded}
                    refreshNeeded={refreshNeeded}
                    enqId={data.id}
                    appId={data.application_id}
                    setAppDocInfo={setAppDocInfo}
                  />
                ) : (
                  ""
                )}
              </div>
            </div>
          </>
        ) : (
          <Link
            className="btn btn-primary"
            to={`/application/create/${data.id}`}
          >
            Add Application
          </Link>
        )}
      </div>
    </>
  );
}

export default StudentDashboard;
