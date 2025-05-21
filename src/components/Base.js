import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "./UI/Layouts/Header";
import Sidebar from "./UI/Layouts/Sidebar";
import Notification from "./UI/Notification";
import { uiAction } from "../store/uiStore";

function Base() {
  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener("keydown", function (event) {
      if (event.altKey && event.key === "a") {
        navigate("/applications");
      }
      if (event.altKey && event.key === "z") {
        navigate("/application/create");
      }
      if (event.altKey && event.key === "c") {
        navigate("/enquiries");
      }
      if (event.altKey && event.key === "q") {
        navigate("/enquiry/create");
      }
      if (event.altKey && event.key === "p") {
        navigate("/user-profile");
      }
      if (event.altKey && event.key === "s") {
        navigate("/search");
      }
    });
  }, []);

  const uiData = useSelector((state) => state.uiStore);
  const authData = useSelector((state) => state.authStore);
  const dispatch = useDispatch();
  const isSmallDevice = window.innerWidth > 992;
  const [sideBarStatus, setSideBarStatus] = useState(isSmallDevice);
  // checking whether staff try to go to other pages

  const location = useLocation();
  const checkRestrictedStaffPath = function () {
    if (
      location.pathname === "/search" ||
      location.pathname === "/university" ||
      location.pathname === "/enquiries" ||
      location.pathname === "/enquiry/create" ||
      location.pathname === "/application/create"
    ) {
      return true;
    }
    return false;
  };
  
  useEffect(() => {
    if (authData.user_type === "staff" && checkRestrictedStaffPath()) {
      dispatch(
        uiAction.setNotification({
          show: true,
          heading: "Authentication Error",
          msg: `You do not have permission to view that page`,
        })
      );
      navigate("/");
    }
    if (!isSmallDevice) {
      setSideBarStatus(false);
    }
  }, [location.pathname, isSmallDevice]);

  useEffect(() => {}, []);
  return (
    <>
      <div
        className={`main-container ${
          sideBarStatus ? "sbar-open" : "sidebar-closed"
        }`}
        id="container"
      >
        <Sidebar sidebarStateChange={setSideBarStatus} />
        <div id="content" className="main-content">
          <div className="layout-px-spacing">
            <div className="middle-content p-0">
              <div className="container-fluid">
                <Header sidebarStateChange={setSideBarStatus} />
                <Outlet />{" "}
                <div className="neumorphism-box shortcutBox">
                  <div className="statbox box box-shadow">
                    <div className="widget-heading">
                      <h2 className="wHeadingMain">Shortcuts</h2>
                      <div className="widget-content widget-content-area">
                        <div className="row">
                          <div className="col-md-4">
                            <p>alt + c : All Enquiry</p>
                            <p>alt + q : Create Enquiry</p>
                          </div>
                          <div className="col-md-4">
                            <p>alt + a : All Applications</p>
                            <p>alt + z : Create Applications</p>
                          </div>
                          <div className="col-md-4">
                            <p>alt + p : User Profile</p>
                            <p>alt + s : Search Course</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Notification
        show={uiData.notification.show}
        heading={uiData.notification.heading}
        msg={uiData.notification.msg}
      />
    </>
  );
}

export default Base;
