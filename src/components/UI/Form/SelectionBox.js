import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import SelectSearch from "react-select-search";
import { ajaxCallWithHeaderOnly } from "../../../helpers/ajaxCall";

const SelectionBox = ({
  name,
  url,
  groupId,
  onChange,
  label,
  isSearch,
  objKey,
  value,
  col,
  groupClass,
  disabled,
}) => {
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [throwErr, setThrowErr] = useState(null);
  const authData = useSelector((state) => state.authStore);

  useEffect(() => {
    if (throwErr) throw throwErr;
  }, [throwErr]);

  useEffect(() => {
    if (
      groupId !== "courseFilterApp" &&
      name !== "courseInterested" &&
      name !== "married"
    ) {
      const data = async () => {
        setIsLoading(true);
        const response = await ajaxCallWithHeaderOnly(url, {
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
        setOptions((options) => {
          const date = new Date();
          const currentYr = date.getFullYear();
          let ajaxOptions;
          if (url === "intakes/" || url === "intakes/?course_related=true") {
            ajaxOptions = [...response]
              .map((option) => {
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
                    date.getMonth() + 1 <=
                      months[currentMonth[1].toLowerCase()] &&
                    currentYr === option.intake_year
                  ) {
                    return {
                      value: option.id,
                      name: option.intake_month + " " + option.intake_year,
                    };
                  } else if (
                    date.getMonth() + 1 <=
                      months[currentMonth[1].toLowerCase()] &&
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
              })
              .filter((data) => data);
          } else {
            ajaxOptions = [...response].map((option) => {
              return { value: option.id, name: option[objKey] };
            });
          }
          return ajaxOptions;
        });
        setIsLoading(false);
      };
      try {
        data();
      } catch (e) {
        setThrowErr({ e, page: "enquiries" });
        return;
      }
    }
    if (name === "married") {
      setIsLoading(false);
      setOptions(col);
    }
  }, [authData.accessToken, col, groupId, name, objKey, url]);

  useEffect(() => {
    if (
      (name === "courseInterested" || groupId === "courseFilterApp") &&
      url.length
    ) {
      setIsLoading(true);
      const data = async () => {
        const response = await ajaxCallWithHeaderOnly(url, {
          Authorization: `Bearer ${authData.accessToken}`,
        });
        if (response?.isNetwork) {
          setThrowErr({ ...response, page: "select" });
          return;
        }
        if (response?.status === 401) {
          setThrowErr({ ...response, page: "select" });
          return;
        }
        setOptions((options) => {
          const ajaxOptions = [...response].map((option) => {
            return { value: option.id, name: option[objKey] };
          });

          return ajaxOptions;
        });
        setIsLoading(false);
      };
      try {
        data();
      } catch (e) {
        setThrowErr({ e, page: "enquiries" });
        return;
      }
    }
  }, [authData.accessToken, groupId, name, objKey, url]);

  let placeholder = isLoading
    ? "Loading"
    : options?.length
    ? "Select from options"
    : "No Data Found";
  if (groupId === "courseIntersted") {
    if (url) {
      placeholder = isLoading
        ? "Loading"
        : options?.length
        ? "Select from options"
        : "No Data Found";
    } else
      placeholder =
        "Select University, Intake & Course Level to load the courses";
  }
  if (groupId === "courseFilterApp") {
    if (url) {
      placeholder = isLoading
        ? "Loading"
        : options?.length
        ? "Select from options"
        : "No Data Found";
    } else placeholder = "Select University to load the courses";
  }

  return (
    <Form.Group className={groupClass} controlId={groupId}>
      {label?.length && (
        <Form.Label className="text-center itsBlock">{label}</Form.Label>
      )}
      <SelectSearch
        disabled={disabled}
        options={options}
        value={value}
        onChange={onChange}
        name={name}
        search={isSearch}
        placeholder={placeholder}
      />
    </Form.Group>
  );
};

export default SelectionBox;
