import React, { useEffect, useState } from "react";
import { ajaxCallWithHeaderOnly } from "../../helpers/ajaxCall";
import { useSelector } from "react-redux";
import LoadingData from "../UI/LoadingData";
function UserCount() {
  const [data, setData] = useState({
    totalEnq: null,
    totalApp: null,
  });
  const [loadingData, setLoadingData] = useState(true);

  const [throwErr, setThrowErr] = useState(null);

  useEffect(() => {
    if (throwErr) throw throwErr;
  }, [throwErr]);

  const authData = useSelector((state) => state.authStore);
  const userCountData = async () => {
    try {
      const response = await ajaxCallWithHeaderOnly(
        `total/counts/`,
        {
          Authorization: `Bearer ${authData.accessToken}`,
        },
        "GET",
        null
      );
      if (response?.isNetwork) {
        setThrowErr({ ...response, page: "enquiries" });
        return;
      }
      if (response?.status === 401) {
        setThrowErr({ ...response, page: "enquiries" });
        return;
      }
      if (response?.status) {
        setThrowErr({ ...response, page: "enquiries" });
        return;
      }
      setLoadingData(false);
      setData({
        totalApp: response.total_applications,
        totalEnq: response.total_enquiries,
      });
    } catch (e) {
      setThrowErr({ e, page: "enquiries" });
      return;
    }
  };

  useEffect(() => {
    userCountData();
  }, []);

  if (loadingData) {
    return <LoadingData className="text-center" />;
  }
  
  return (
    <>
      <div className="col-md-6">
        <div className="neumorphism-box p50">
          <h4>Total Enquiries Processed</h4>
          <h5 className="headingHome">{data.totalEnq}</h5>
        </div>
      </div>
      <div className="col-md-6">
        <div className="neumorphism-box p50">
          <h4>Total Applications Processed</h4>
          <h5 className="headingHome">{data.totalApp}</h5>
        </div>
      </div>
    </>
  );
}

export default UserCount;
