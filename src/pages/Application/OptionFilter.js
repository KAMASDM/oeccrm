import React from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import SelectionBox from "../../components/UI/Form/SelectionBox";

const OptionFilter = ({
  isAdmin,
  filterSelectionChanged,
  appFilter,
  searchEnq,
  searchText,
  setSearchText,
  refreshTable,
  clearSearch,
}) => {
  const clss = isAdmin ? "col-md-4" : "col-md-6";
  return (
    <>
      <SelectionBox
        groupClass={`mb-3 selectbox ${clss}`}
        onChange={filterSelectionChanged.bind(null, "enquiry_status")}
        value={appFilter.enquiry_status}
        isSearch={true}
        groupId="status"
        label="Status"
        name="status"
        url="appstatus/"
        objKey="App_status"
      />
      <div className={clss}>
        <Form onSubmit={searchEnq}>
          <Form.Label>Search Application</Form.Label>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Search Name"
              aria-describedby="basic-addon2"
              type="text"
              name="search"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                if (!e.target.value) {
                  refreshTable(true);
                }
              }}
              className={`searchInput ${searchText?.length ? "nocontent" : ""}`}
            />{" "}
            {searchText?.length ? (
              <InputGroup.Text
                onClick={clearSearch}
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
              disabled={searchText?.length ? false : true}
              onClick={searchEnq}
            >
              Search
            </Button>
          </InputGroup>
        </Form>
      </div>
    </>
  );
};

export default OptionFilter;
