import { APIRequestContext, APIResponse, expect, request as playwrightRequest } from '@playwright/test';
import * as fs from 'fs';
import { testConstants } from '../constants/constants';
import { BaseClass } from '../base/baseClass';
import { ProdData, QaData } from '../testData/testData';
import { CustomWorld } from "../support/world";

let bookingId: string;
let request: APIRequestContext;
let response: any;
let config: any;
let data: any;
let token: string;
import dotenv from 'dotenv';
dotenv.config({
    path: `./env/.env.${process.env.ENV}`
})

export class BookingApiPage extends BaseClass {
    private world: CustomWorld;

    constructor(world: CustomWorld) {
        super();
        this.world = world;
    }
    public async envSetup() {
        try {
            this.world.attach("Environment setup is Started");
            if (process.env.RUN_ENV === testConstants.QaEnvironment) {
                config = JSON.parse(fs.readFileSync(testConstants.QaConfigFilePath, testConstants.Encoding));
                data = QaData;
                this.world.attach("Environment setup is completed and it is running with :" + testConstants.QaEnvironment);
            }
            else if (process.env.RUN_ENV === testConstants.ProdEnvironment) {
                config = JSON.parse(fs.readFileSync(testConstants.ProdConfigFilePath, testConstants.Encoding));
                data = ProdData;
                this.world.attach("Environment setup is completed and it is running with :" + testConstants.ProdEnvironment);
            }
            else {
                this.world.attach("Environment setup is Not done. Please provide a right Envrionment to run the cases");
            }
            request = await playwrightRequest.newContext();
        }
        catch (error) {
            this.world.attach('Error in Environment setup in beforeAll:' + error);
        }

    }

    public async cleanUp() {
        try {
            this.world.attach('Cleanup in AfterAll is started');
            this.disposeRequest();
            this.world.attach('Cleanup in AfterAll is completed');
        }
        catch (error) {
            this.world.log("Hooks error"+error);
        }
    }

    public async postApiCallToCreateBooking() {
        this.world.attach('Creating a booking using POST request is started');
        this.world.attach(`API URL: ` + config.apiUrl);

        response = await this.postRequest(config.apiUrl, config.headers, config.requestBody)
        this.world.attach('Creating a booking is completed');
    }

    public async verifyStatusAndStatusCode(response: APIResponse, statusCode: number) {
        this.world.attach('Validation on status code and status text is started');
        expect(response.status()).toBe(statusCode);
        expect(response.ok()).toBeTruthy();
        this.world.attach('Validation on status code and status text is started. Status code is ' + statusCode);
    }

    public async validateCreatedBooking() {
        await this.verifyStatusAndStatusCode(response, 200)
    }

    public async fetchBookingId() {
        bookingId = (await response.json()).bookingid;
        this.world.attach('The created booking id is :' + bookingId);
    }

    public async retrieveDataOfCreatedBooking() {
        this.world.attach('Retrieving the data of created booking using GET call is started');
        this.world.attach(`API URL: ` + config.apiUrl + ` and booking id: ` + bookingId);
        response = await this.getRequest((config.apiUrl + bookingId))

        await this.verifyStatusAndStatusCode(response, 200)
        response = await response.json();
        this.world.attach(`Retrieving the data of created booking is completed`);
    }
    public async validateDataOfCreatedBooking() {
        this.world.attach('Retrieving the data of created booking using GET call is started');

        expect(response).toHaveProperty(data.FirstName, data.FullName);
        expect(response).toHaveProperty(data.LastName, data.Surname);
        this.world.attach('Name of the booking is: ' + data.FullName + ' ' + data.Surname);

        expect(response).toHaveProperty(data.AdditionalNeeds, data.AddNeeds);
        this.world.attach('Address of the booking is: ' + data.AddNeeds);

        expect(response.bookingdates).toHaveProperty(data.CheckInDate, data.DateCheckIn);
        expect(response.bookingdates).toHaveProperty(data.CheckIOutDate, data.DateCheckout);
        this.world.attach('CheckIn and Checkout dates of the booking is: ' + data.DateCheckIn + ' and ' + data.DateCheckout);

        this.world.attach(`Validation of retrieving the data of created booking is completed`)
    }

    public async generateToken() {
        // Generating the access token
        this.world.attach(`Generating access token is started`);
        this.world.attach(`API URL: ` + config.tokenUrl);

        response = await this.postRequest(config.tokenUrl, config.headers, config.tokenbody);
        this.world.attach(`Generating access token is completed: ` + response.toString());
    }

    public async fetchingToken() {
        // Fetching the access toen
        await this.verifyStatusAndStatusCode(response, 200)
        token = (await response.json()).token;

        this.world.attach('Generated Token is: ' + token)
        this.world.attach(`Validating token generation is completed and the token is ${bookingId}`)
    }

    public async updateDataOfCreatedBooking() {
        // Put api call to update the created booking
        this.world.attach(`Updating the booking using PUT request is started`);
        this.world.attach(`API URL: ` + config.apiUrl + ` and booking id: ` + bookingId);

        response = await this.putRequest((config.apiUrl + bookingId), this.buildHeaders(), config.putRequestBody);
        this.world.attach(`Updating the booking using PUT request is Completed: ` + response.toString());

        // Validateing status and status code of the put api call
        await this.verifyStatusAndStatusCode(response, 200)
    }

    public async validateUpdatedDataOfBooking() {
        // Validating the properties of the updated booking
        this.world.attach(`Validating the updated booking using PUT request is started`);
        response = await response.json();
        expect(response).toHaveProperty(data.FirstName, data.UpdateFullName);
        expect(response).toHaveProperty(data.LastName, data.UpdateSurname);

        this.world.attach('Name of the updated booking is: ' + data.UpdateFullName + ' ' + data.UpdateSurname);
        expect(response).toHaveProperty(data.AdditionalNeeds, data.UpdateAddNeeds);
        this.world.attach('Updated additional need is: ' + data.UpdateAddNeeds);
        this.world.attach(`Validating the updated booking using PUT request is Completed: ` + response);
    }

    public async partiallyUpdateBooking() {
        // Patch api call to partially update the created booking
        this.world.attach(`Partially updating the booking using PATCH request is started`);
        this.world.attach(`API URL: ` + config.apiUrl + ` and booking id: ` + bookingId);

        response = await this.patchRequest((config.apiUrl + bookingId), this.buildHeaders(), config.patchRequestBody);
        this.world.attach(`Partially updating the booking using PATCH request is Completed: ` + response.toString());
    }

    public async validatePartiallyUpdateBooking() {
        // Validating the properties of the partially updated booking
        this.world.attach(`Validating the partially updated booking is started`);
        await this.verifyStatusAndStatusCode(response, 200)
        response = await response.json();

        expect(response).toHaveProperty(data.FirstName, data.PatchFullName);
        expect(response).toHaveProperty(data.LastName, data.PatchSurname);
        this.world.attach('Name of the partially updated booking is: ' + data.PatchFullName + ' ' + data.PatchSurname);

        expect(response).toHaveProperty(data.AdditionalNeeds, data.PatchAddNeeds);
        this.world.attach('Partially updated additional need is: ' + data.PatchAddNeeds);
        this.world.attach(`Validating the partially updated booking is completed`);
    }

    public async deleteCreatedBooking() {
        // Delete api call to create a booking
        this.world.attach(`Deleting the booking using DELETE request is started`);
        this.world.attach(`API URL: ` + config.apiUrl + ` and booking id: ` + bookingId);

        response = await this.deleteRequest((config.apiUrl + bookingId), this.buildHeaders())
        this.world.attach(`Deleting the booking using DELETE request is Completed: ` + response.toString());
    }

    public async validateDeletedBooking() {
        this.world.attach(`Validating deleted the booking is started`);
        await this.verifyStatusAndStatusCode(response, 201)
        this.world.attach(`Validating deleted the booking is Completed`);
    }

    public async getDeletedBookingDetails() {
        // Get api call to retrive the data of deleted booking
        this.world.attach(`Retrieving deleted the booking using GET request is started`);
        this.world.attach(`API URL: ` + config.apiUrl + ` and booking id: ` + bookingId);

        response = await this.getRequest((config.apiUrl + bookingId));
        this.world.attach(`Retrieving deleted the booking using GET request is Completed`);
    }

    public async validateDeletedBookingDetails() {
        this.world.attach(`Validating the retrieving deleted the booking is started`);
        await this.negativeScenarioStatusValidation(response, 404, data.NotFound)
        this.world.attach(`Validating the retrieving deleted the booking is Completed`);
    }

    public async createBookingWithInvalidHeaders() {
        this.world.attach(`create a booking with invalid headers using POST request is started`);
        this.world.attach(`API URL: ` + config.apiUrl);

        response = await this.postRequest(config.apiUrl, config.invalidHeaders, config.invalidRequestBody);
        this.world.attach(`create a booking with invalid headers using POST request is completed`);
    }

    public async validateBookingWithInvalidHeaders() {
        this.world.attach(`Validating creating a booking with invalid headers is started`);
        await this.negativeScenarioStatusValidation(response, 500, data.ServerError)
        this.world.attach(`Validating creating a booking with invalid headersis completed`);
    }

    public async updateCreatedBookingWithoutAccessToken() {
        // Put api call to update the created booking
        this.world.attach(`Update a booking without access token using POST request is started`);
        this.world.attach(`API URL: ` + config.apiUrl + ` and booking id: ` + bookingId);

        response = await this.putRequest((config.apiUrl + bookingId), config.headers, config.requestBody);
        this.world.attach(`Update a booking without access token using POST request is completed`);
    }

    public async validateCreatedBookingWithoutAccessToken() {
        this.world.attach(`Validating updating a booking with invalid headers is started`);
        await this.negativeScenarioStatusValidation(response, 403, data.Forbidden)
        this.world.attach(`Validating updating a booking with invalid headersis completed`);
    }

    public async negativeScenarioStatusValidation(response: APIResponse, statusCode: number, statusText: string) {
        this.world.attach('Validation on status code and status text is started');
        expect(response.status()).toBe(statusCode);
        expect(response.statusText()).toBe(statusText);
        this.world.attach('Validation on status code and status text is started. Status code is ' + statusCode + ' and status is ' + statusText);

    }

    public buildHeaders() {
        return {
            'Content-Type': 'application/json',
            "Cookie": `token=${token}`
        };
    }

    public async postRequestBody(jsonBody: any, firstName: string, lastName: string, extraBenefits: string) {
        return await this.stringFormat(JSON.stringify(jsonBody), firstName, lastName, extraBenefits);
    }

    public async stringFormat(str: string, ...args: any[]) {
        str.replace(/{(\d+)}/g, (match: any, index: any | number) => args[index].toString() || "");
    }
}
