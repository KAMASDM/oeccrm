import React from "react";
import { Form } from "react-bootstrap";
import SelectSearch from "react-select-search";
import { Country, State, City } from "country-state-city";

const CountryStateCity = ({
  countryVal,
  stateVal,
  cityVal,
  countryChange,
  stateChange,
  cityChange,
}) => {
  const countries = Country.getAllCountries();

  const updatedCountries = countries.map((country) => ({
    name: country.name,
    value: country.isoCode,
    ...country,
  }));

  const updatedStates = (countryId) =>
    State.getStatesOfCountry(countryId).map((state) => ({
      name: state.name,
      value: state.isoCode,
      ...state,
    }));

  const updatedCities = (countryId, stateId) =>
    City.getCitiesOfState(countryId, stateId).map((city) => ({
      name: city.name,
      value: city.name,
      ...city,
    }));

  return (
    <>
      <Form.Group
        className="mb-3 col-md-6 selectbox"
        controlId="stuAddressCountry"
      >
        <Form.Label>Student Country</Form.Label>
        <SelectSearch
          options={updatedCountries}
          value={countryVal}
          onChange={countryChange}
          name="country"
          search={true}
          placeholder="Select Country"
        />
      </Form.Group>
      <Form.Group
        className="mb-3 col-md-6 selectbox"
        controlId="stuAddressState"
      >
        <Form.Label>Student State</Form.Label>
        <SelectSearch
          placeholder={
            countryVal ? "Select State" : "Choose country to get state list"
          }
          options={updatedStates(countryVal ? countryVal : null)}
          value={stateVal}
          onChange={stateChange}
          name="state"
          search={true}
        />
      </Form.Group>
      <Form.Group
        className="mb-3 col-md-6 selectbox"
        controlId="stuAddressCity"
      >
        <Form.Label>Student City</Form.Label>
        <SelectSearch
          placeholder={
            stateVal
              ? "Select city"
              : "Choose country and state to get city list"
          }
          options={updatedCities(
            countryVal ? countryVal : null,
            stateVal ? stateVal : null
          )}
          value={cityVal}
          onChange={cityChange}
          name="city"
          search={true}
        />
      </Form.Group>
    </>
  );
};

export default CountryStateCity;
