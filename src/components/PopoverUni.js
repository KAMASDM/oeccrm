import React from "react";
import { Form, Popover } from "react-bootstrap";

function PopoverUni() {
  return (
    <Popover id="popover-basic">
      <Popover.Body>
        <Form.Group className="mb-3 col-md-12" controlId="stuName">
          <Form.Control
            type="text"
            name="stuName"
            value=""
          />
        </Form.Group>
      </Popover.Body>
    </Popover>
  );
}

export default PopoverUni;
