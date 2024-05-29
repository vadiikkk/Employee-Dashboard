const axios = require('axios');

const EMPLOYEES_WEBHOOK_URL = '...'; // Insert here bitrix webhook.
const DEALS_WEBHOOK_URL = '...'; // Insert here bitrix webhook.

const fetchAllEmployees = async (departmentIds) => {
    let employees = [];
    let start = 0;
    const params = { start: start };

    // If departmentIds are not set, show data for departments 204, 346 and 156.
    if (departmentIds.length > 0) {
        params['filter'] = { 'UF_DEPARTMENT': departmentIds };
    } else {
        params['filter'] = { 'UF_DEPARTMENT': [204, 346, 156] };
    }

    // Collecting paginated data.
    while (true) {
        const response = await axios.get(EMPLOYEES_WEBHOOK_URL, { params });

        if (response.data.result) {
            employees = employees.concat(response.data.result);
        }

        if (response.data.next) {
            start = response.data.next;
            params.start = start;
        } else {
            break;
        }
    }

    return employees;
};

const fetchAllDeals = async (startDate, endDate) => {
    let deals = [];
    let start = 0;

    // Collecting paginated data.
    while (true) {
        const response = await axios.get(DEALS_WEBHOOK_URL, {
            params: {
                start: start,
                filter: {
                    '>=CLOSEDATE': startDate.toISOString(),
                    '<=CLOSEDATE': endDate.toISOString(),
                    'STAGE_ID': 'C52:WON'
                },
                select: ['ID', 'ASSIGNED_BY_ID', 'OPPORTUNITY']
            }
        });

        if (response.data.result) {
            deals = deals.concat(response.data.result);
        }

        if (response.data.next) {
            start = response.data.next;
        } else {
            break;
        }
    }

    return deals;
};

module.exports = {
    fetchAllEmployees,
    fetchAllDeals
};
