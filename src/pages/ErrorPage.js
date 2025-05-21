import React from "react";
import { useDispatch } from "react-redux";
import { useRouteError, Link } from "react-router-dom";
import { uiAction } from "../store/uiStore";
import { authAction } from "../store/authStore";
import { deleteFromLocalStorage } from "../helpers/helperFunctions";

function ErrorPage() {
  const error = useRouteError();
  const dispatch = useDispatch();

  if (error?.isNetwork) {
    return (
      <div class="d-flex align-items-center justify-content-center vh-100">
        <div class="text-center">
          <h1 class="display-1 fw-bold">You are Offline !</h1>
          <p class="fs-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="80"
              height="80"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-cloud-off"
            >
              <path d="M22.61 16.95A5 5 0 0 0 18 10h-1.26a8 8 0 0 0-7.05-6M5 5a8 8 0 0 0 4 15h9a5 5 0 0 0 1.7-.3"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          </p>
          <p class="lead">Please check your internet connection</p>
          <Link className="btn btn-primary" to="/">
            Try Again
          </Link>
        </div>
      </div>
    );
  }
  if (error?.status === 204) {
    return (
      <div class="d-flex align-items-center justify-content-center vh-100">
        <div class="text-center">
          <h1 class="display-1 fw-bold">
            {error?.page === "enqForm" ? "Enquiry" : "Application"} not found.
          </h1>
          <p class="lead">
            {error?.page === "enqForm" ? "Enquiry" : "Application"} you looking
            is not found on database, if you think it's by mistake please
            contact developer...
          </p>
          <Link className="btn btn-primary" to="/">
            Go To Dashboard
          </Link>
        </div>
      </div>
    );
  }
  if (error?.status === 401) {
    dispatch(
      uiAction.setNotification({
        show: true,
        heading: "",
        msg: `Session Expired Please login again`,
      })
    );
    dispatch(
      authAction.setAuthStatus({
        userName: "",
        loggedIn: false,
        accessToken: null,
        refreshToken: null,
        userId: null,
        user_type: null,
        timeOfLogin: null,
        logInOperation: -1,
      })
    );
    deleteFromLocalStorage("loginInfo");
  }
  if (error?.status > 404 && error?.status < 600) {
    return (
      <div class="d-flex align-items-center justify-content-center vh-100">
        <div class="text-center">
          <h1 class="display-1 fw-bold">{error?.status} Error Happened</h1>
          <p class="fs-3">
          </p>
          <p class="lead">
            Looks like server is offline, If this problem persists for long
            time, Please contact developer
          </p>
          <Link className="btn btn-primary" to="/">
            Try Again
          </Link>
        </div>
      </div>
    );
  }
  if (error?.status === 404) {
    return (
      <div class="d-flex align-items-center justify-content-center vh-100">
        <div class="text-center">
          <h1 class="display-1 fw-bold">404</h1>
          <p class="fs-3">
            <span class="text-danger">Opps!</span> Page not found.
          </p>
          <p class="lead">The page you’re looking for doesn’t exist.</p>
          <Link className="btn btn-primary" to="/">
            Try Again
          </Link>
        </div>
      </div>
    );
  }
  if (error?.general) {
    return (
      <div class="d-flex align-items-center justify-content-center vh-100">
        <div class="text-center">
          <h1 class="display-1 fw-bold">{error?.status} Error Happened</h1>
          <p class="fs-3">
          </p>
          <p class="lead">
            If this problem occur again, Please contact Developer
          </p>
          <Link className="btn btn-primary" to="/">
            Try Again
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div class="d-flex align-items-center justify-content-center vh-100">
      <div class="text-center">
        <h1 class="display-1 fw-bold">{error?.status} Error Happened</h1>
        <p class="fs-3">
        </p>
        <p class="lead">
          If this problem occur again, Please contact Developer
        </p>
        <Link className="btn btn-primary" to="/">
          Try Again
        </Link>
      </div>
    </div>
  );
}

export default ErrorPage;
