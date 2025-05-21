import React from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import SelectionBox from "../../components/UI/Form/SelectionBox";

function OptionFilter(props) {
  const clss = props.isAdmin ? "col-md-4" : "col-md-6";
  return (
    <>
      <SelectionBox
        groupClass={`mb-3 selectbox ${clss}`}
        onChange={props.filterSelectionChanged.bind(null, "enquiry_status")}
        value={props.appFilter.enquiry_status}
        isSearch={true}
        groupId="status"
        label="Status"
        name="status"
        url="appstatus/"
        objKey="App_status"
      />
      <div className={clss}>
        <Form onSubmit={props.searchEnq}>
          <Form.Label>Search Application</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Search Name"
              aria-describedby="basic-addon2"
              type="text"
              name="search"
              value={props.searchText}
              onChange={(e) => {
                props.setSearchText(e.target.value);
                if (!e.target.value) {
                  props.refreshTable(true);
                }
              }}
              className={`searchInput ${
                props.searchText?.length ? "nocontent" : ""
              }`}
            />{" "}
            {props.searchText?.length ? (
              <InputGroup.Text
                onClick={props.clearSearch}
                className="clear-search__btn"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="m12 13.4l-4.9 4.9q-.275.275-.7.275q-.425 0-.7-.275q-.275-.275-.275-.7q0-.425.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7q0-.425.275-.7q.275-.275.7-.275q.425 0 .7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275q.425 0 .7.275q.275.275.275.7q0 .425-.275.7L13.4 12l4.9 4.9q.275.275.275.7q0 .425-.275.7q-.275.275-.7.275q-.425 0-.7-.275Z"
                  />
                </svg>
              </InputGroup.Text>
            ) : (
              ""
            )}
            <Button
              variant="outline-primary"
              id="button-addon2"
              className="searchBtnEnq"
              disabled={props.searchText?.length ? false : true}
              onClick={props.searchEnq}
            >
              Search
            </Button>
          </InputGroup>
        </Form>
      </div>
    </>
  );
}

export default OptionFilter;
