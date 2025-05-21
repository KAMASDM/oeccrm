import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { appAction } from "../../store/appColumns";

function ColumnFilter(props) {
  const [columnStatus, setColumnStatus] = useState(false);
  const columnData = useSelector((store) => store[props.filterStore]);
  const dispatch = useDispatch();
  
  return (
    <>
      <div className="col-lg-12 flex-main">
        <div>
          {props.showFilterBtn ? (
            <button
              class="btn btn-outline-dark mb-2 me-4"
              onClick={props.filterOnClick}
            >
              Clear Filter
            </button>
          ) : (
            ""
          )}
        </div>
        <div>
          {columnStatus ? (
            <Button
              variant="outline-primary"
              onClick={() => setColumnStatus((status) => !status)}
            >
              Hide Column &nbsp;
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
                class="feather feather-eye-off"
              >
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            </Button>
          ) : (
            <Button
              variant="outline-primary"
              onClick={() => setColumnStatus((status) => !status)}
              style={{ marginBottom: "20px" }}
            >
              Show Column &nbsp;
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <rect
                  x="0"
                  y="0"
                  width="24"
                  height="24"
                  fill="none"
                  stroke="none"
                />
                <path
                  fill="currentColor"
                  d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5s5 2.24 5 5s-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3s3-1.34 3-3s-1.34-3-3-3z"
                />
              </svg>
            </Button>
          )}
        </div>
      </div>
      {columnStatus ? (
        <div className="col-lg-12 flex-col-btns">
          {props.allColumns.map((column) => {
            return (
              <Button
                variant={columnData[column.id] ? "outline-dark" : "dark"}
                onClick={() =>
                  dispatch(appAction.setappColumnStatus({ key: column.id }))
                }
              >
                {column.name}
              </Button>
            );
          })}
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default ColumnFilter;
