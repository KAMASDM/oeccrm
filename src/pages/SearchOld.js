import React, { useEffect, useReducer, useState } from "react";
import { Form, OverlayTrigger, Popover, ProgressBar } from "react-bootstrap";
import SelectionBox from "../components/UI/Form/SelectionBox";
import { ajaxCallWithHeaderOnly } from "../helpers/ajaxCall";
import { useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import LoadingData from "../components/UI/LoadingData";
import { useNavigate } from "react-router-dom";

const initialState = {
  name: null,
  examGiven: null,
  marks: null,
  engWaiver: null,
  levelId: null,
  levelName: null,
  intakeId: null,
  intakeName: null,
  ielts: null,
  toefl: null,
  pte: null,
  cSearch: null,
  university: { id: null, name: null },
  loadPercent: 0,
  loadText: "Fill all Details to load Courses",
  isAll: 0,
  filter: null,
  refresh: 0,
};

const reducer = (state, action) => {
  if (action.type === "resetRefresh") {
    return {
      ...state,
      refresh: 0,
    };
  }

  if (action.type === "checkThings") {
    let loadText = "Fill all Details to load Courses";
    let load = 0;
    let isAll = 1;
    if (state.ielts || state.toefl || state.pte) {
      load += 25;
    }
    if (state.intakeId) {
      load += 25;
    }
    if (state.levelId) {
      load += 25;
    }
    if (state.cSearch) {
      load += 25;
    }
    isAll = isAll && (state.ielts || state.toefl || state.pte);
    isAll = isAll && state.intakeId;
    isAll = isAll && state.levelId && state.cSearch;
    isAll = isAll ? 1 : 0;
    if (load) {
      const remainSteps = 4 - load / 25;

      loadText = `${remainSteps} steps remains to get list of courses`;
    }
    let filter = `?course_levels=${state.levelId}&intake=${state.intakeId}&course_name=${state.cSearch}`;
    filter += state.ielts ? `&ielts_score=${state.ielts}` : "";
    filter += state.toefl ? `&ielts_score=${state.toefl}` : "";
    filter += state.pte ? `&ielts_score=${state.pte}` : "";
    return {
      ...state,
      loadPercent: load,
      isAll,
      loadText,
      filter,
    };
  }
  let value = action.value;
  if (!action.value) {
    value = null;
  }

  return {
    ...state,
    [action.type]: value,
    refresh: 1,
  };
};
function Search() {
  const [throwErr, setThrowErr] = useState(null);
  const [uniData, setUniData] = useState([]);
  const [isUniLoadingData, setIsUniLoadingData] = useState(false);

  // for pagination
  const [pageNo, setPageNo] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const handlePerRowsChange = (newPerPage, page) => {
    setPerPage(newPerPage);
    setPageNo(page);
    setUniData([]);
  };
  // pagination over
  const [uniState, dispatchUniState] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  useEffect(() => {
    if (throwErr) throw throwErr;
  }, [throwErr]);

  const authData = useSelector((state) => state.authStore);

  const goToEnqPage = function (uniId, courseId) {
    navigate("/enquiry/create", {
      state: {
        uniId,
        courseId,
        levelId: uniState.levelId,
        name: uniState.name,
        intake: uniState.intakeId,
      },
    });
  };

  const uniColumns = [
    {
      name: "University Name",
      selector: (row) => row.uniName,
      sortable: true,
    },
    {
      name: "Course Name",
      selector: (row) => row.courseName,
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => (
        <span
          className="btn-primary btn"
          onClick={() => {
            goToEnqPage(row.uniId, row.courseId);
          }}
        >
          Apply To This Course
        </span>
      ),
      sortable: true,
    },
  ];
  const getData = async function () {
    setIsUniLoadingData(true);
    let courseUrl = `courseslistsuni/${uniState.filter}&p=${pageNo}&records=${perPage}`;
    const response = await ajaxCallWithHeaderOnly(
      `${courseUrl}`,
      {
        Authorization: `Bearer ${authData.accessToken}`,
      },
      "POST",
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
      const data = response.results.map((data) => {
        return {
          ...data,
          courseId: data?.id,
          courseName: data?.course_name,
          uniId: data?.university?.id,
          uniName: data?.university?.univ_name,
        };
      });
      setTotalRows(response.count);
      setUniData(data);
    } else {
      setTotalRows(0);
      setUniData([]);
    }
    setIsUniLoadingData(false);
    dispatchUniState({
      type: "resetRefresh",
    });
  };
  useEffect(() => {
    try {
      if (uniState.isAll) getData();
    } catch (e) {
      setThrowErr({ e, page: "enquiries" });
      return;
    }
  }, [
    uniState.isAll,
    uniState.refresh,
    uniState.levelId,
    uniState.intakeId,
    uniState.ielts,
    uniState.toefl,
    uniState.pte,
    uniState.cSearch,
    perPage,
    pageNo,
  ]);
  const selectValueChanged = function (typeId, typeName, val, name) {
    if (name) {
      dispatchUniState({
        type: typeId,
        value: val,
      });
      dispatchUniState({
        type: typeName,
        value: name.name,
      });
      dispatchUniState({
        type: "checkThings",
      });
    }
  };

  const popoverName = (
    <Popover id="popoverName">
      <Popover.Body>
        <Form.Group className="mb-3 col-md-12" controlId="stuName">
          <Form.Control
            type="text"
            name="stuName"
            value={uniState.name}
            onChange={(e) =>
              dispatchUniState({
                type: "name",
                value: e.target.value,
              })
            }
          />
        </Form.Group>
      </Popover.Body>
    </Popover>
  );

  const popoverLevel = (
    <Popover id="popoverLevel">
      <Popover.Body>
        <SelectionBox
          groupClass="mb-3 col-md-12 selectbox"
          groupId="levelApplying"
          value={uniState.levelId}
          onChange={selectValueChanged.bind(null, "levelId", "levelName")}
          name="levelApplying"
          url="courselevels/"
          isSearch={false}
          objKey="levels"
        />
      </Popover.Body>
    </Popover>
  );

  const popoverIntake = (
    <Popover id="popoverLevel">
      <Popover.Body>
        <SelectionBox
          groupClass="mb-3 col-md-12 selectbox"
          groupId="intakeInterested"
          value={uniState.intakeId}
          onChange={selectValueChanged.bind(null, "intakeId", "intakeName")}
          name="intakeInterested"
          url="intakes/"
          isSearch={true}
          objKey="it's different"
        />
      </Popover.Body>
    </Popover>
  );

  const popoverIelts = (
    <Popover id="popoverIELTS">
      <Popover.Body>
        <Form.Group className="mb-3 col-md-12" controlId="ielts">
          <Form.Control
            type="text"
            name="ielts"
            value={uniState.ielts}
            onChange={(e) => {
              dispatchUniState({
                type: "ielts",
                value: e.target.value,
              });
              dispatchUniState({
                type: "checkThings",
              });
            }}
          />
        </Form.Group>
      </Popover.Body>
    </Popover>
  );

  const popoverTofel = (
    <Popover id="popoverTofel">
      <Popover.Body>
        <Form.Group className="mb-3 col-md-12" controlId="toefl">
          <Form.Control
            type="text"
            name="toefl"
            value={uniState.toefl}
            onChange={(e) => {
              dispatchUniState({
                type: "toefl",
                value: e.target.value,
              });
              dispatchUniState({
                type: "checkThings",
              });
            }}
          />
        </Form.Group>
      </Popover.Body>
    </Popover>
  );

  const popoverPte = (
    <Popover id="Popoverpte">
      <Popover.Body>
        <Form.Group className="mb-3 col-md-12" controlId="pte">
          <Form.Control
            type="text"
            name="pte"
            value={uniState.pte}
            onChange={(e) => {
              dispatchUniState({
                type: "pte",
                value: e.target.value,
              });
              dispatchUniState({
                type: "checkThings",
              });
            }}
          />
        </Form.Group>
      </Popover.Body>
    </Popover>
  );

  const popoverSearch = (
    <Popover id="popoverName">
      <Popover.Body>
        <Form.Group className="mb-3 col-md-12" controlId="cSearch">
          <Form.Control
            type="text"
            name="cSearch"
            value={uniState.cSearch}
            onChange={(e) => {
              dispatchUniState({
                type: "cSearch",
                value: e.target.value,
              });
              dispatchUniState({
                type: "checkThings",
              });
            }}
          />
        </Form.Group>
      </Popover.Body>
    </Popover>
  );

  return (
    <div class="row layout-spacing">
      <div class="neumorphism-box nmb">
        <div class="col-lg-12 flex-main">
          <div className="uniForm text-center">
            My Name Is{" "}
            <OverlayTrigger
              placement="bottom"
              trigger="click"
              overlay={popoverName}
              rootClose
            >
              <span className="uniSName">
                {uniState.name?.length ? uniState.name : "(Full Name)"}
              </span>
            </OverlayTrigger>
            . I want to pursue{" "}
            <OverlayTrigger
              placement="bottom"
              trigger="click"
              overlay={popoverLevel}
              rootClose
            >
              <span className="uniSName">
                {uniState.levelName?.length ? uniState.levelName : "(UG / PG)"}
              </span>
            </OverlayTrigger>{" "}
            for intake{" "}
            <OverlayTrigger
              placement="bottom"
              trigger="click"
              overlay={popoverIntake}
              rootClose
            >
              <span className="uniSName">
                {uniState.intakeName?.length
                  ? uniState.intakeName
                  : "(Jan-Feb 2023)"}
                .
              </span>
            </OverlayTrigger>{" "}
            <br /> I am happy to say that I have secured{" "}
            <OverlayTrigger
              placement="bottom"
              trigger="click"
              overlay={popoverIelts}
              rootClose
            >
              <span className="uniSName">
                {uniState.ielts?.length ? uniState.ielts : "(IELTS SCORE)"}
              </span>
            </OverlayTrigger>{" "}
            Bands in IELTS &{" "}
            <OverlayTrigger
              placement="bottom"
              trigger="click"
              overlay={popoverTofel}
              rootClose
            >
              <span className="uniSName">
                {uniState.toefl?.length ? uniState.toefl : "(PTE SCORE)"}
              </span>
            </OverlayTrigger>{" "}
            in PTE &{" "}
            <OverlayTrigger
              placement="bottom"
              trigger="click"
              overlay={popoverPte}
              rootClose
            >
              <span className="uniSName">
                {uniState.pte?.length ? uniState.pte : "(TOFEL SCORE)"}
              </span>
            </OverlayTrigger>{" "}
            in TOFEL. Please find me course of{" "}
            <OverlayTrigger
              placement="bottom"
              trigger="click"
              overlay={popoverSearch}
              rootClose
            >
              <span className="uniSName">
                {uniState.cSearch?.length
                  ? uniState.cSearch
                  : "(Specialization)"}
              </span>
            </OverlayTrigger>{" "}
          </div>
        </div>
      </div>
      <div class="neumorphism-box nmb">
        <div class="col-lg-12">
          {uniState.isAll ? (
            <>
              <DataTable
                onChangePage={(page) => {
                  setPageNo(page);
                  setUniData([]);
                }}
                columns={uniColumns}
                data={uniData}
                onChangeRowsPerPage={handlePerRowsChange}
                pagination
                paginationServer
                progressPending={isUniLoadingData}
                progressComponent={
                  <LoadingData className="loading-spinner-flex" />
                }
                paginationTotalRows={totalRows}
              />
            </>
          ) : (
            <div className="uniForm text-center">
              {uniState.loadText}
              <ProgressBar
                animated
                now={uniState.loadPercent + 1}
                variant="uniColor"
                label={`${uniState.loadPercent}%`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
