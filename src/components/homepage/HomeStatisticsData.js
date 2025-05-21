import React, { useEffect, useState } from "react";
import { ajaxCallWithHeaderOnly } from "../../helpers/ajaxCall";
import { useSelector } from "react-redux";
import LoadingData from "../UI/LoadingData";

function HomeStatisticsData() {
  const [data, setData] = useState({
    bestAgent: null,
    bestAgentCount: null,
    bestUni: null,
    bestUniCount: null,
    bestCourse: null,
    bestCourseCount: null,
  });

  const [throwErr, setThrowErr] = useState(null);

  useEffect(() => {
    if (throwErr) throw throwErr;
  }, [throwErr]);

  const authData = useSelector((state) => state.authStore);
  const bestEmpData = async () => {
    try {
      const response = await ajaxCallWithHeaderOnly(
        `bestagent/`,
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
      if (response) {
        if (
          typeof response === "object" &&
          !Array.isArray(response) &&
          response !== null
        ) {
          const bestApp = { name: "", apps: 0 };
          for (const [yr, data] of Object.entries(response)) {
            if (+yr === new Date().getFullYear()) {
              for (const [name, apps] of Object.entries(data)) {
                if (apps > bestApp.apps) {
                  bestApp.name = name;
                  bestApp.apps = apps;
                }
              }
            }
          }
          setData((data) => {
            return {
              ...data,
              bestAgent: bestApp.name,
              bestAgentCount: bestApp.apps,
            };
          });
        }
      }
    } catch (e) {
      setThrowErr({ e, page: "enquiries" });
      return;
    }
  };
  const bestUniData = async () => {
    try {
      const response = await ajaxCallWithHeaderOnly(
        `best-performing-university/`,
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
      if (response.data) {
        if (
          typeof response.data === "object" &&
          !Array.isArray(response.data) &&
          response.data !== null
        ) {
          const bestUnii = { name: "", apps: 0 };
          for (const [yr, data] of Object.entries(response.data)) {
            if (+yr === new Date().getFullYear()) {
              bestUnii.name = Object.keys(data)[0];
              bestUnii.apps = data[bestUnii.name];
            }
          }
          setData((data) => {
            return {
              ...data,
              bestUni: bestUnii.name,
              bestUniCount: bestUnii.apps,
            };
          });
        }
      }
    } catch (e) {
      setThrowErr({ e, page: "enquiries" });
      return;
    }
  };
  const bestCourseData = async () => {
    try {
      const response = await ajaxCallWithHeaderOnly(
        `best-performing-university/`,
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
      if (response.data) {
        if (
          typeof response.data === "object" &&
          !Array.isArray(response.data) &&
          response.data !== null
        ) {
          const bestCourse = { name: "", apps: 0 };
          for (const [yr, data] of Object.entries(response.data)) {
            if (+yr === new Date().getFullYear()) {

              bestCourse.name = Object.keys(data)[0];
              bestCourse.apps = data[bestCourse.name];
            }
          }
          setData((data) => {
            return {
              ...data,
              bestUni: bestCourse.name,
              bestUniCount: bestCourse.apps,
            };
          });
        }
      }
    } catch (e) {
      setThrowErr({ e, page: "enquiries" });
      return;
    }
  };
  useEffect(() => {
    bestEmpData();
    bestUniData();
    bestCourseData();
  }, []);
  return (
    <>
      {data.bestAgent ? (
        <div className="row">
          <div className="col-md-4 homepageCard">
            <div className="neumorphism-box p50 text-center">
              <h4>Best Agent</h4>
              <h5 className="headingHome">
                {data.bestAgent} [{data.bestAgentCount}]
              </h5>
            </div>
          </div>
          <div className="col-md-4 homepageCard">
            <div className="neumorphism-box p50 text-center">
              <h4>Best Performing University</h4>
              <h5 className="headingHome">
                {data.bestUni} [{data.bestUniCount}]
              </h5>
            </div>
          </div>
          <div className="col-md-4 homepageCard">
            <div className="neumorphism-box p50 text-center">
              <h4>Best Performing Course</h4>
            </div>
          </div>
        </div>
      ) : (
        <div className="col-md-12 text-center">
          <LoadingData />
        </div>
      )}
    </>
  );
}

export default HomeStatisticsData;
