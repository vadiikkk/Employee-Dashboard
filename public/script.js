document.addEventListener('DOMContentLoaded', function () {
    // Lightweight plugin for picking date ranges.
    flatpickr("#dateRange", {
        mode: "range",
        dateFormat: "Y-m-d",
        locale: "ru"
    });

    const loadDataButton = document.getElementById('loadData');
    const loadingIndicator = document.getElementById('loadingIndicator');

    loadDataButton.addEventListener('click', function () {

        // Date parsing.
        const dateRange = document.getElementById('dateRange').value;
        const dates = dateRange.split(" to ");
        const startDate = dates[0];
        const endDate = dates[1] || startDate;

        // Department parsing.
        const departmentInput = document.getElementById('departmentInput').value;
        const departments = departmentInput ? departmentInput.split(',').map(item => item.trim()) : [];

        // Forming url for backend fetch.
        const url = new URL(window.location.origin + '/api/employees');
        url.searchParams.append('startDate', startDate);
        url.searchParams.append('endDate', endDate);
        departments.forEach(dept => url.searchParams.append('departments', dept));

        loadingIndicator.style.display = 'block';

        fetch(url)
            .then(response => response.json())
            .then(data => {
                loadingIndicator.style.display = 'none';

                const dashboard = document.getElementById('employee-dashboard');

                while (dashboard.firstChild) {
                    dashboard.removeChild(dashboard.firstChild);
                }

                // Not chosen date message.
                if (!dateRange) {
                    const notice = document.createElement('div');
                    notice.className = 'alert';
                    notice.textContent = 'Не выбран диапазон дат. Показаны данные за последний месяц.';
                    dashboard.appendChild(notice);
                }

                // Not chosen department message.
                if (!departmentInput) {
                    const notice = document.createElement('div');
                    notice.className = 'alert';
                    notice.textContent = 'Не выбраны департаменты. Показаны данные среди департаментов 204, 346, 156.';
                    dashboard.appendChild(notice);
                }

                if (data.employees.length === 0) {
                    dashboard.innerHTML = '<p>Данные не найдены. Попробуйте изменить период или департаменты</p>';
                } else {
                    // Forming each dash.
                    data.employees.forEach((employee, index) => {
                        const employeeDiv = document.createElement('div');
                        employeeDiv.className = 'employee';

                        // Top 3 -> Gold, silver, bronze
                        if (index === 0) employeeDiv.classList.add('gold');
                        else if (index === 1) employeeDiv.classList.add('silver');
                        else if (index === 2) employeeDiv.classList.add('bronze');

                        // Photo and name.
                        const photoAndNameDiv = document.createElement('div');
                        photoAndNameDiv.className = 'photo-name';

                        const photoImg = document.createElement('img');
                        photoImg.src = employee.personalPhoto;
                        photoImg.alt = 'Employee photo';
                        photoImg.className = 'employee-photo';

                        const nameSpan = document.createElement('span');
                        nameSpan.textContent = employee.name;
                        nameSpan.className = 'employee-name';

                        photoAndNameDiv.appendChild(photoImg);
                        photoAndNameDiv.appendChild(nameSpan);

                        // Departments.
                        const departmentsSpan = document.createElement('span');
                        departmentsSpan.textContent = `Департаменты: ${employee.departments.join(', ')}`;
                        departmentsSpan.className = 'employee-departments';

                        // Earnings.
                        const earningsSpan = document.createElement('span');
                        earningsSpan.textContent = `Заработок: ${employee.earnings.toFixed(2)}₽`;
                        earningsSpan.className = 'employee-earnings';

                        // Put to dashboard
                        employeeDiv.appendChild(photoAndNameDiv);
                        employeeDiv.appendChild(departmentsSpan);
                        employeeDiv.appendChild(earningsSpan);

                        dashboard.appendChild(employeeDiv);
                    });
                }
            })
            .catch(error => console.error('Error fetching employee data:', error));
    });
});
