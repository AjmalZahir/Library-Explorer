# Project Proposal

## Business Case

### Problem Statement

There is no simple way for users to easily access and explore public library data in Bristol. Residents often struggle to find centralized, up-to-date information about library locations, operating hours, and available facilities, which are scattered across various platforms. This project aims to address this gap by developing a user-friendly web application, the Library Explorer, that consolidates this data into an accessible and intuitive platform, empowering users to engage with Bristol’s public libraries more effectively.

### Business Benefits

- Easy access to library data for users.
- Interactive map and table views for better navigation. Ideal for users seeking libraries in specific areas, and a table view for structured browsing of data like names and facilities.
- Encourages engagement with local public resources.
- Provides sorting and filtering options for a personalized experience, users can sort libraries by criteria like distance or name and filter them based on facilities, such as study rooms or children’s programs.
- Helps users find the nearest libraries using location-based services.

### Options Considered

- Use of third-party apps that show basic data, but these lack customization such as integrating interactive maps or specific datasets, limiting their effectiveness for this project.
- Building a more complex system with additional datasets from Bristol Open Data like community events, was explored. However, this would increase development complexity and divert focus from the core goal of library data accessibility.
- Implementing search, filter, and sorting functionalities for improved usability.

### Expected Risks

- Data inconsistencies in the API. The Bristol Open Data API may contain inconsistent or incomplete data, which could lead to inaccurate information being displayed, potentially undermining user trust in the application.
- API rate limits affecting performance. API rate limits may slow down data retrieval during high traffic, impacting the application’s performance and user experience, especially for real-time updates.
- Ensuring compatibility across different browsers.
- Managing user experience with real-time data updates. Real-time data updates from the API may introduce delays or inconsistencies, challenging the application’s ability to provide a seamless and reliable user experience.

## Project Scope

- Display library data, including library names, locations, and available facilities, ensuring users can easily access key details about each library.
- Show data in multiple formats, including an interactive map for a visual representation of library locations and a sortable table for structured and detailed information.
- Use JavaScript to fetch, process, and display real-time data from the Bristol Open Data API, ensuring the information remains up-to-date and accurate.
- Basic validation of the displayed data.
- Implement search, filter, and sorting functionalities allowing users to find libraries by keyword, filter by specific criteria, and sort results, enhancing usability.
- Provide a feature to locate the nearest library by accessing the user's current location and calculating the shortest distance to nearby libraries for convenience.

![Library Explorer Context Diagram Here](images/context.png)
