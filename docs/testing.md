# Testing

## Test Plan
<!-- Tests are contributed by the person responsible for the corresponding Use Case and Code files -->

### Manual Tests (UAT)

These are the manual tests we plan to carry out:

| Test Case ID | Test Type | Description                                                  | Scenario                                                                                              | Status |
| ------------ | --------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- | ------ |
| TF1.1        | UAT       | Requests permission to access user location                  | User clicks "Find on Map"<br>Confirmation box appears, requesting permission                          | pass   |
| TF1.3        | UAT       | Map centred on user location                                 | User clicks "Find on Map"<br>User grants permission<br>Map appears centred on user location           | pass   |
| TF1.4        | UAT       | Markers added to the map for each tool station               | User clicks "Find on Map"<br>User grants permission<br>Map shows markers for each library in the area | pass   |
| TNF1.1       | UAT       | Defaults to Bristol City Centre                              | User clicks "Find on Map"<br>User denies permission<br>Map centred on Bristol City Centre             | pass   |
| TNF1.5a      | UAT       | The app should respond to the user within 5 seconds          | User clicks "Find on Map"<br>Map appears within 5 seconds                                             | pass   |
| TNF1.5b      | UAT       | The app should respond to the user within 5 seconds          | User clicks "Find by Type"<br>Table appears within 5 seconds                                          | pass   |
| TNF1.6       | UAT       | The app should work on Chrome and Safari browsers            | Perform all tests on Chrome/Safari                                                                    | pass   |
| TNF1.7       | UAT       | The markers should not be so large that they obscure the map | Verify marker size on map                                                                             | pass   |
| TF1.8        | UAT       | "Find Nearest" button functionality                          | User clicks "Find Nearest"<br>Table sorts by distance from user<br>Closest library appears first      | pass   |

### Automated Tests (Unit Tests)

The following unit tests have been implemented for the API module:

<!-- Contributor:  M Z M Ajmal -->

1. **fetchLibraries - successful fetch**

   - Verifies the correct API URL is used
   - Verifies the function returns an array of features
   - Status: pass

<!-- Contributor:  M Z M Ajmal -->

2. **fetchLibraries - failed fetch**
   - Verifies error handling when the fetch fails
   - Status: pass

## Requirements Traceability Matrix

The RTM links requirements to code via testing.

| Requirement ID | Use-Case/Test | Description          | Software Module | Test Case ID | Status |
| -------------- | ------------- | -------------------- | --------------- | ------------ | ------ |
| FR1            | UC1           | Table browsing       | libraryList.js  | -            | -      |
| FR2            | UC2           | Map display          | libraryMap.js   | TF1.4        | pass   |
| FR3            | UC1/UC2       | API data retrieval   | api.js          | Unit Tests   | pass   |
| FR4            | UAT           | Geolocation handling | libraryMap.js   | TF1.1, TF1.3 | pass   |
| FR5            | UAT           | Marker interactions  | libraryMap.js   | TF1.4        | pass   |
| FR6            | UC1           | Distance sorting     | libraryList.js  | TF1.8        | pass   |
| NFR1           | UC1           | 3s table load        | libraryList.js  | TNF1.5b      | pass   |
| NFR1           | UC2           | 3s map load          | libraryMap.js   | TNF1.5a      | pass   |
| NFR2           | UC1/UC2       | Mobile responsive    | ALL             | TNF1.6       | pass   |
| NFR3           | UC2           | Geolocation fallback | libraryMap.js   | TNF1.1       | pass   |
| NFR3           | UC2           | Marker size          | libraryMap.js   | TNF1.7       | pass   |

## Test Results Summary

- **Functional Requirements**: All functional requirements (FR1.1, FR1.3, FR1.4) are passing
- **Non-Functional Requirements**: All non-functional requirements
- **Unit Tests**: Both unit tests for the API module are passing
