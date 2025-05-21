import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SelectSearch from "react-select-search";

function CourseCard({ courseData, uniId, levelId, selectionName }) {
  const [options, setOptions] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    if (courseData.intake?.length) {
      const date = new Date();
      const currentYr = date.getFullYear();
      const options = courseData.intake.map((option) => {
        const months = {
          jan: 1,
          feb: 2,
          mar: 3,
          apr: 4,
          may: 5,
          jun: 6,
          jul: 7,
          aug: 8,
          sep: 9,
          oct: 10,
          nov: 11,
          dec: 12,
        };
        const currentMonth = option.intake_month.split("-");
        if (currentYr === option.intake_year) {
          if (
            date.getMonth() + 1 <= months[currentMonth[1].toLowerCase()] &&
            currentYr === option.intake_year
          ) {
            return {
              value: option.id,
              name: option.intake_month + " " + option.intake_year,
            };
          } else if (
            date.getMonth() + 1 <= months[currentMonth[1].toLowerCase()] &&
            currentYr !== option.intake_year
          ) {
            return {
              value: option.id,
              name: option.intake_month + " " + option.intake_year,
            };
          }
        } else if (currentYr < option.intake_year) {
          return {
            value: option.id,
            name: option.intake_month + " " + option.intake_year,
          };
        }
      });
      const data = (
        <div className="courseCardSelect">
          <SelectSearch
            placeholder="Select Intake"
            options={options}
            value=""
            onChange={goToEnqPage}
            name={selectionName}
          />
        </div>
      );
      setOptions(data);
    } else {
      const options = <p className="dengor">No intake found for this course</p>;
      setOptions(options);
    }
  }, [courseData.intake]);

  const goToEnqPage = function (intake) {
    navigate("/enquiry/create", {
      state: {
        uniId,
        courseId: courseData.id,
        levelId,
        intake,
      },
    });
  };
  return (
    <div className="col-md-4 text-center mb-3">
      <div className="card courseCard">
        {courseData.img ? (
          <img
            src={courseData.img}
            className="card-img-top"
            alt={courseData.course_name}
          />
        ) : (
          ""
        )}
        <div className="card-body">
          <h5 className="card-title mb-3">{courseData.course_name}</h5>
          {options}
        </div>
      </div>
    </div>
  );
}

export default CourseCard;
