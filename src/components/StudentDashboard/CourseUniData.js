import React, { useEffect, useRef, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ajaxCallWithHeaderOnly,
  ajaxCallWithoutBody,
} from "../../helpers/ajaxCall";
import LoadingData from "../UI/LoadingData";
import DocumentRow from "../app/DocumentRow";
import ExportPDF from "../app/ExportPDF";
import UiModal from "../UI/UiModal";
import { uiAction } from "../../store/uiStore";
import ChangeAssignUser from "../enq/ChangeAssignUser";
import ChangeStatus from "../app/ChangeStatus";

function CourseUniData(props) {
  const [enqData, setEnqData] = useState([]);
  const [assignUsrData, setAssignUsrData] = useState([]);
  const [allStatus, setAllStatus] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [promptStatus, setPromptStatus] = useState(false);
  const authData = useSelector((state) => state.authStore);
  const navigate = useNavigate();
  const [throwErr, setThrowErr] = useState(null);
  const dispatch = useDispatch();
  const deleteAppDetails = useRef({});
  const getAssignUsrData = async function () {
    const response = await ajaxCallWithHeaderOnly("userlist/", {
      Authorization: `Bearer ${authData.accessToken}`,
    });
    if (response?.isNetwork) {
      setThrowErr({ ...response, page: "enquiries" });
      return;
    }
    if (response?.status === 401) {
      setThrowErr({ ...response, page: "enquiries" });
      return;
    }
    if (!response?.length) {
      setThrowErr({ ...response, page: "enquiries" });
      return;
    }
    setAssignUsrData((data) => {
      return response.map((option) => {
        return { value: option.id, name: option.username };
      });
    });
  };
  useEffect(() => {
    if (enqData.length && !assignUsrData.length) {
      getAssignUsrData();
    }
  }, [enqData]);

  useEffect(() => {
    if (enqData.length && !allStatus.length) {
      getAllStatusData();
    }
  }, [enqData]);

  const getUniData = async (url) => {
    setIsLoadingData(true);
    const response = await ajaxCallWithHeaderOnly(
      url,
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
    if (response?.results?.length > 0) {
      setEnqData(response?.results);
      setTotalRows(response.count);
    } else {
      setEnqData([]);
    }
    setIsLoadingData(false);
    props.setRefresherNeeded(false);
  };

  useEffect(() => {
    if (props.refreshNeeded)
      getUniData(`get/courseinfo/?application=${props.appId}`);
  }, [props.appId, props.refreshNeeded]);
 

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setPageNo(page);
    setEnqData([]);
    props.setRefresherNeeded(true);
  };

  // for delete
  const promptDelete = (student_name, deleteId) => {
    setPromptStatus(true);
    deleteAppDetails.current = { name: student_name, id: deleteId };
  };

  const getAllStatusData = async function () {
    const response = await ajaxCallWithHeaderOnly("appstatus/", {
      Authorization: `Bearer ${authData.accessToken}`,
    });
    if (response?.isNetwork) {
      setThrowErr({ ...response, page: "enquiries" });
      return;
    }
    if (response?.status === 401) {
      setThrowErr({ ...response, page: "enquiries" });
      return;
    }
    if (!response?.length) {
      setThrowErr({ ...response, page: "enquiries" });
      return;
    }
    setAllStatus((data) => {
      return response.map((option) => {
        return { value: option.id, name: option.App_status };
      });
    });
  };
  const columnsAll = [
    {
      cell: (row) => (
        <>
          <ExportPDF data={row} />
          {authData.user_type === "superuser" ? (
            <button
              className="enquiryAction"
              title="Delete Application"
              onClick={() => {
                promptDelete(props.stuName, row.id);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-trash p-1 br-8 mb-1"
              >
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          ) : (
            ""
          )}
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "University Interested",
      selector: (row) => row.university_interested?.univ_name,
      sortable: true,
    },
    {
      name: "Level Applying for",
      selector: (row) => row.level_applying_for?.levels,
    },
    {
      name: "Intake_interested",
      selector: (row) =>
        row.intake_interested?.intake_month +
        " " +
        row.intake_interested?.intake_year,
      grow: 1,
    },

    {
      name: "Course Interested",
      selector: (row) => row.course_interested?.course_name,
    },
    {
      name: "Sop",
      cell: (row) => (
        <DocumentRow
          id={row.id}
          docType="SOP"
          name={row.student_name}
          document={row.Sop}
          uploadKey="Sop"
        />
      ),
    },
    {
      name: "Offer Letter",
      cell: (row) => (
        <DocumentRow
          id={row.id}
          docType="Offer Letter"
          name={row.student_name}
          document={row.rcvd_offer_letter}
          uploadKey="rcvd_offer_letter"
        />
      ),
    },
    {
      name: "Assigned Users",
      selector: (row) => (
        <ChangeAssignUser
          enqName={row.name}
          allUser={assignUsrData}
          name={
            row.assigned_users?.username ? row.assigned_users?.username : "-"
          }
          assignId={row.assigned_users?.id}
          courseId={row.id}
        />
      ),
    },
    {
      name: "Status",
      selector: (row) => (
        <ChangeStatus
          enqName={row.name}
          allStatus={allStatus}
          name={row.status?.App_status ? row.status?.App_status : "-"}
          statusId={row.status?.id}
          courseId={row.id}
        />
      ),
    },
  ];
  const columns =
    authData.user_type === "superuser"
      ? columnsAll
      : columnsAll.filter((col) => col.name !== "Assigned Users");
  const deleteApp = async function (deleteId) {
    try {
      setIsLoadingData(true);
      const response = await ajaxCallWithoutBody(
        `get/courseinfo/${deleteId}/`,
        {
          Authorization: `Bearer ${authData.accessToken}`,
        },
        "DELETE"
      );
      if (response !== true) {
        setThrowErr({ ...response, page: "applications" });
        return;
      }
      dispatch(
        uiAction.setNotification({
          show: true,
          heading: "Application Deleted Successfully",
          msg: `<strong>${deleteAppDetails.current.name}</strong> Application Deleted successfully`,
        })
      );
      deleteAppDetails.current = {};
      setEnqData([]);
      props.setRefresherNeeded(true);
    } catch (e) {
      setThrowErr({ e, page: "enquiries" });
      return;
    }
  };
  return (
    <>
      <DataTable
        autoResetPage={true}
        onChangePage={(page) => {
          setPageNo(page);
          setEnqData([]);
          props.setRefresherNeeded(true);
        }}
        columns={columns}
        data={enqData}
        onChangeRowsPerPage={handlePerRowsChange}
        selectableRows
        pagination
        paginationServer
        progressPending={isLoadingData}
        progressComponent={<LoadingData className="loading-spinner-flex" />}
        paginationTotalRows={totalRows}
        key={totalRows}
      />{" "}
      {promptStatus ? (
        <UiModal
          setModalStatus={() => {
            setPromptStatus(false);
          }}
          showStatus={promptStatus}
          showHeader={false}
          body={
            <div className="delete-modal text-center">
              <div className="delete-modal__icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="80"
                  height="80"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="#f15e5e"
                    d="M8.27 3L3 8.27v7.46L8.27 21h7.46C17.5 19.24 21 15.73 21 15.73V8.27L15.73 3M9.1 5h5.8L19 9.1v5.8L14.9 19H9.1L5 14.9V9.1m6 5.9h2v2h-2v-2m0-8h2v6h-2V7"
                  />
                </svg>
              </div>
              <div className="delete-modal__text">
                <h3>Are you sure?</h3>
                <p>
                  Do you really want to delete
                  <strong> {deleteAppDetails.current.name} ?</strong>
                </p>
              </div>
              <div className="delete-modal__action">
                <button
                  class="btn btn-light-dark mb-2 me-4"
                  onClick={() => {
                    setPromptStatus(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  class="btn btn-danger mb-2 me-4"
                  onClick={() => {
                    deleteApp(deleteAppDetails.current.id);
                    setPromptStatus(false);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          }
          showFooter={false}
          footerContent=""
        />
      ) : (
        ""
      )}
    </>
  );
}

export default CourseUniData;
