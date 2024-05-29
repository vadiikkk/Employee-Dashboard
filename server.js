const express = require('express');
const { fetchAllEmployees, fetchAllDeals } = require('./bitrixApi');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/api/employees', async (req, res) => {
    try {
        let startDate = req.query.startDate ? new Date(req.query.startDate) : new Date();
        const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();

        // If StartDate is not set, show data for the last month.
        if (!req.query.startDate) {
            startDate.setMonth(startDate.getMonth() - 1);
        }

        const departmentIds = req.query.departments ? req.query.departments : [];

        const [employees, deals] = await Promise.all([
            fetchAllEmployees(departmentIds),
            fetchAllDeals(startDate, endDate)
        ]);

        // Counting earnings for each employee.
        const earningsByEmployee = {};
        deals.forEach(deal => {
            const amount = parseFloat(deal.OPPORTUNITY);
            if (earningsByEmployee[deal.ASSIGNED_BY_ID]) {
                earningsByEmployee[deal.ASSIGNED_BY_ID] += amount;
            } else {
                earningsByEmployee[deal.ASSIGNED_BY_ID] = amount;
            }
        });

        // Pick only employees who's earnings are greater than zero and create dto for front.
        const result = employees
            .filter(employee => earningsByEmployee[employee.ID] > 0)
            .map(employee => ({
                id: employee.ID,
                name: employee.NAME.trim() + ' ' + employee.LAST_NAME.trim(),
                earnings: earningsByEmployee[employee.ID],
                personalPhoto: employee.PERSONAL_PHOTO,
                departments: employee.UF_DEPARTMENT
            }))
            .sort((a, b) => b.earnings - a.earnings);

        res.json({ employees: result });
    } catch (error) {
        console.error('Error retrieving data from Bitrix24:', error.message);
        res.status(500).send('Error retrieving data from Bitrix24');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
