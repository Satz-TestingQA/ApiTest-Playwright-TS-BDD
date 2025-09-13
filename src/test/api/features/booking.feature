Feature: API testing framework using playwright and cucumber

  Scenario: Performing CRUD operations with POST, GET, PUT, PATCH & DELETE requests using request chaining
    Given Creating a booking using POST api request
    Then Validating the data of created booking
    Then Fetching the booking booking id

    Given Retrieving the data of created booking using GET api request
    Then Validating the retrieved booking data

    Given Generating access token using POST api request
    Then Validate and fetch the generated token

    Given Updating the created booking using PUT api request
    Then Validate the updated booking data

    Given Updating partially the created booking using PATCH api request
    Then Validate the partially updated booking data

    Given Deleting a booking using DELETE api request
    Then Validate the status delete api call

  Scenario: Negative : Get details of deleted booking
    Given Retrieving the data of deleted booking using GET api request
    Then Validate the status of retrieved deleted booking
    
  Scenario: Negative : Create a new booking with invalid headers
    Given Creating a booking with invalid booking headers using POST api request
    Then Validate the status of post api call with invalid headers

  Scenario: Negative : Update the created booking without token
    Given Updating the created booking without token using PUT api request
    Then Validate the status of post put call without token
