import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { ajaxCallWithHeaderOnly } from "../../helpers/ajaxCall";
import { useSelector } from "react-redux";
import CourseCard from "./CourseCard";
import LoadingData from "../UI/LoadingData";

function CourseLists(props) {
  const [searchCourse, setSearchCourse] = useState();
  const [courseData, setCourseData] = useState({
    totalCourse: null,
    img: null,
    courses: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [throwErr, setThrowErr] = useState(null);
  const authData = useSelector((state) => state.authStore);

  useEffect(() => {
    if (throwErr) throw throwErr;
  }, [throwErr]);

  const getData = async function () {
    setIsLoading(true);
    let courseUrl = `uni-retrieve/${props.uniId}/?level=${props.courseLevel}`;
    if (searchCourse?.length) courseUrl += `&course_name=${searchCourse}`;
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
    if (response?.status && response?.status === 401) {
      setThrowErr({ ...response, page: "enquiries" });
      return;
    }
    if (response?.status) {
      setThrowErr({ ...response, page: "enquiries" });
      return;
    }
    setCourseData({
      totalCourse: response?.university_count,
      img: response?.univ_logo,
      courses: response?.courses,
    });

    setIsLoading(false);
  };
  
  useEffect(() => {
    getData();
  }, [searchCourse]);

  return (
    <>
      <div className="row">
        <Form.Group className="mb-3 col-md-4" controlId="courseSearch">
          <Form.Control
            type="text"
            name="courseSearch"
            placeholder="Search Courses"
            value={searchCourse}
            onChange={(e) => setSearchCourse(e.target.value)}
          />
        </Form.Group>
        <div className="col-md-8 text-right">
          <button className="btn btn-primary" onClick={props.goToCourse}>
            Go to University List
          </button>
        </div>
      </div>
      <div className="row">
        {isLoading ? (
          <div className="col-md-12 text-center">
            <LoadingData />
          </div>
        ) : courseData.courses?.length ? (
          courseData.courses.map((course) => (
            <CourseCard
              courseData={course}
              uniId={props.uniId}
              levelId={props.courseLevel}
              selectionName={course.id}
              key={course.id}
            />
          ))
        ) : (
          <h2 className="text-center">No Courses Found</h2>
        )}
      </div>
    </>
  );
}

export default CourseLists;
