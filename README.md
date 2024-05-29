# Employee Dashboard

## Description

Employee Dashboard is a web application designed to display information about company employees' earnings over a specified period. The application allows users to select a specific time period and departments from which data will be displayed. Data on employees and deals is obtained via the Bitrix24 API.

## Key Features

- **Data Filtering**: Users can select a specific time period and departments to display data.
- **Data Display**: Information about top employees by earnings is displayed, including photos, names, and departments.
- **Responsive Design**: The interface is optimized for various devices.

## Technologies

- **Node.js and Express**: For the server-side of the application.
- **Axios**: To perform HTTP requests to external services.
- **HTML/CSS**: For the client-side of the application.
- **JavaScript**: For client-side interactivity.

## Configuration

Add the following webhooks (bitrixApi.js):

const EMPLOYEES_WEBHOOK_URL = '...'; // Insert here bitrix webhook.

const DEALS_WEBHOOK_URL = '...'; // Insert here bitrix webhook.
