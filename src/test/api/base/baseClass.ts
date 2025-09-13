import { APIRequestContext, expect, request as playwrightRequest } from '@playwright/test';

let request: APIRequestContext;

export class BaseClass {

    public async getRequest(url: string, headers?: any) {
        request = await playwrightRequest.newContext();
        const response = await request.get(url, {
            headers: headers
        });
        return response;
    }

    public async postRequest(url: string, headers: any, data?: any) {
        request = await playwrightRequest.newContext();
        return await request.post(url, {
            headers: headers,
            data: data
        });
    }

    public async putRequest(url: string, headers: any, data?: any) {
        request = await playwrightRequest.newContext();
        return await request.put(url, {
            headers: headers,
            data: data
        });
    }

    public async patchRequest(url: string, headers: any, data?: any) {
        request = await playwrightRequest.newContext();
        return await request.patch(url, {
            headers: headers,
            data: data
        });
    }

    public async deleteRequest(url: string, headers: any, data?: any) {
        request = await playwrightRequest.newContext();
        return await request.delete(url, {
            headers: headers,
            data: data
        });
    }

    public async disposeRequest() {
        request = await playwrightRequest.newContext();
        await request.dispose();
    }

}