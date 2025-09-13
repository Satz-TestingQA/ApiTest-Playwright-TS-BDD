import { Given, Then, Before, After, BeforeAll } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';


// import { AfterAll, BeforeAll, Given, Then, When } from "@cucumber/cucumber";
import { BookingApiPage } from '../pages/bookingApiPage'

let bookingApiPage: BookingApiPage;

Before(async function (this: CustomWorld) {
    bookingApiPage = new BookingApiPage(this);
});

After(async function () {
    // Teardown or clean up actions
});

Scenario: "Performing CRUD operations with POST, GET, PUT, PATCH & DELETE requests using request chaining"

Given('Creating a booking using POST api request', async function () {
        bookingApiPage.envSetup();
        await bookingApiPage.postApiCallToCreateBooking();
});

Then('Validating the data of created booking', async function () {
    await bookingApiPage.validateCreatedBooking();
});

Then('Fetching the booking booking id', async function () {
    await bookingApiPage.fetchBookingId();
});

Given('Retrieving the data of created booking using GET api request', async function () {
    await bookingApiPage.retrieveDataOfCreatedBooking();
});

Then('Validating the retrieved booking data', async function () {
    await bookingApiPage.validateDataOfCreatedBooking();
});

Given('Generating access token using POST api request', async function () {
    await bookingApiPage.generateToken();
});

Then('Validate and fetch the generated token', async function () {
    await bookingApiPage.fetchingToken()
});

Given('Updating the created booking using PUT api request', async function () {
    await bookingApiPage.updateDataOfCreatedBooking();
});

Then('Validate the updated booking data', async function () {
    await bookingApiPage.validateUpdatedDataOfBooking();
});

Given('Updating partially the created booking using PATCH api request', async function () {
    await bookingApiPage.partiallyUpdateBooking();
});

Then('Validate the partially updated booking data', async function () {
    await bookingApiPage.validatePartiallyUpdateBooking();
});

Given('Deleting a booking using DELETE api request', async function () {
    await bookingApiPage.deleteCreatedBooking();
});

Then('Validate the status delete api call', async function () {
    await bookingApiPage.validateDeletedBooking();
});

Scenario: Negative: "Get details of deleted booking"

Given('Retrieving the data of deleted booking using GET api request', async function () {
    await bookingApiPage.getDeletedBookingDetails();
});

Then('Validate the status of retrieved deleted booking', async function () {
    await bookingApiPage.validateDeletedBookingDetails()
});

Scenario: Negative: "Create a new booking with invalid headers"

Given('Creating a booking with invalid booking headers using POST api request', async function () {
    await bookingApiPage.createBookingWithInvalidHeaders();
});

Then('Validate the status of post api call with invalid headers', async function () {
    await bookingApiPage.validateBookingWithInvalidHeaders();
});

Scenario: Negative: "Update the created booking without token"

Given('Updating the created booking without token using PUT api request', async function () {
    await bookingApiPage.updateCreatedBookingWithoutAccessToken();
});

Then('Validate the status of post put call without token', async function () {
    await bookingApiPage.validateCreatedBookingWithoutAccessToken();
});

