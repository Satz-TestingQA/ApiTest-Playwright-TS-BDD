export interface ProdDataType {
    FullName: string;
    Surname: string;
    FirstName: string;
    LastName: string;
    AdditionalNeeds: string;
    AddNeeds: string;
    CheckInDate: string;
    CheckIOutDate: string;
    DateCheckIn: string;
    DateCheckout: string;
    UpdateFullName: string;
    UpdateSurname: string;
    UpdateAddNeeds: string;
    Admin: string;
    Password: string;
    PatchFullName: string;
    PatchSurname: string;
    PatchAddNeeds: string;
    NotFound: string;
    ServerError: string;
    Forbidden: string;
};
export const ProdData: ProdDataType = {
    FullName: "Prod Full Name",
    Surname: "Prod Surname",
    FirstName: "firstname",
    LastName: 'lastname',
    AdditionalNeeds: 'additionalneeds',
    AddNeeds: "Prod Needs",
    CheckInDate: 'checkin',
    CheckIOutDate: 'checkout',
    DateCheckIn: "2025-12-01",
    DateCheckout: "2025-12-05",
    UpdateFullName: 'Prod Put First Name',
    UpdateSurname: 'Prod Put Surname',
    UpdateAddNeeds: "Prod Update Needs",
    Admin: process.env.QA_PASSWORD as string,
    Password: process.env.QA_PASSWORD as string,
    PatchFullName: 'Prod Patch First Name',
    PatchSurname: 'Prod Patch Surname',
    PatchAddNeeds: "Prod Patch Needs",
    NotFound: 'Not Found',
    ServerError: 'Internal Server Error',
    Forbidden: 'Forbidden',
};
export interface QaDataType {
    FullName: string;
    Surname: string;
    FirstName: string;
    LastName: string;
    AdditionalNeeds: string;
    AddNeeds: string;
    CheckInDate: string;
    CheckIOutDate: string;
    DateCheckIn: string;
    DateCheckout: string;
    UpdateFullName: string;
    UpdateSurname: string;
    UpdateAddNeeds: string;
    Admin: string;
    Password: string;
    PatchFullName: string;
    PatchSurname: string;
    PatchAddNeeds: string;
    NotFound: string;
    ServerError: string;
    Forbidden: string;
}
export const QaData: QaDataType = {
    FullName: "Qa Full Name",
    Surname: "Qa Surname",
    FirstName: "firstname",
    LastName: 'lastname',
    AdditionalNeeds: 'additionalneeds',
    AddNeeds: "Qa Needs",
    CheckInDate: 'checkin',
    CheckIOutDate: 'checkout',
    DateCheckIn: "2025-11-01",
    DateCheckout: "2025-11-05",
    UpdateFullName: 'Qa Put First Name',
    UpdateSurname: 'Qa Put Surname',
    UpdateAddNeeds: "Qa Update Needs",
    Admin: process.env.QA_PASSWORD as string,
    Password: process.env.QA_PASSWORD as string,
    PatchFullName: 'Qa Patch First Name',
    PatchSurname: 'Qa Patch Surname',
    PatchAddNeeds: "Qa Patch Needs",
    NotFound: 'Not Found',
    ServerError: 'Internal Server Error',
    Forbidden: 'Forbidden',
}
