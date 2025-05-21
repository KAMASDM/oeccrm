import React from "react";
import { Button, Form, InputGroup } from "react-bootstrap";

function EnquiryFilter(props) {
  const clss = "col-md-12";
  return (
    <div className="row nomp">
      <Form onSubmit={props.searchEnq} className={clss}>
        <Form.Label className="text-center itsBlock">Search Enquiry</Form.Label>
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Search Name / Email / Phone Number"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
            type="text"
            name="search"
            value={props.searchText}
            onChange={(e) => {
              props.setSearchText(e.target.value);
              if (!e.target.value?.length) {
                props.refreshNeeded(true);
              }
            }}
            className={`searchInput ${
              props.searchText?.length ? "nocontent" : ""
            }`}
          />
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
            type="submit"
            variant="outline-primary"
            id="button-addon2"
            className="searchBtnEnq"
            disabled={props.searchText?.length ? false : true}
          >
            Search
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
}

export default EnquiryFilter;
