function fetchCourseAll(semester) {
    const url = 'http://localhost:8083/api/v1/semester/search-by-year?year=2024';

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        json = JSON.parse(data);
        // console.log(json);
        switch (semester) {
            case "semester1":
                clearTable();
                fetchCourse(json[0].id);
                break;
            case "semester2":
                clearTable();
                fetchCourse(json[1].id);
                break;
            case "semester3":
                clearTable();
                fetchCourse(json[2].id);
                break;
            default:
                break;
        }
    })
    .catch(error => {
        console.error('There was a problem with the request:', error);
    });
}



document.addEventListener("DOMContentLoaded", async () => {
    const semester = document.getElementById('semester');
    fetchCourseAll(semester.value);
    
    


    semester.addEventListener('change', (event) => {
        const selectedSemester = event.target.value;
        // console.log('Học kỳ đã chọn:', selectedSemester);
        fetchCourseAll(selectedSemester);
        // Bạn có thể thực hiện các hành động khác ở đây
    });
});


const fetchCourse = async (semesterID) =>  {
    const url = 'http://localhost:8083/api/v1/course/search-by-semester-id?semesterID='+semesterID;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(async (data) => {
        json = JSON.parse(data);

        console.log(json);

        const ids = await fetchCourseIDs(localStorage.getItem("studentID"));
        console.log(ids.subjectIDs);

        const tableBody = document.querySelector('#subjectTable tbody');
        let count = 0;
        json.forEach((data, index) => {
        
            if (ids.subjectIDs.includes(data.subject.id)) {
                let subject = data.subject;
                const row = document.createElement('tr');
                count+=1;
                row.innerHTML = `
                    <td>${count}</td>
                    <td>${subject.id}</td>
                    <td>${subject.name}</td>
                    <td>${subject.creditUnits}</td>
                    <td></td>
                    <td></td>
                `;

                row.addEventListener('click', (event) => {
                    // const clickedRow = event.target.closest('tr');
                    // Loại bỏ lớp 'table-active' từ tất cả các hàng trong bảng
                    const allRows = tableBody.querySelectorAll('tr');
                    allRows.forEach(row => {
                        row.classList.remove('table-active');
                    });

                    // Thêm lớp 'table-active' cho hàng được click
                    row.classList.add('table-active');




                });

                tableBody.appendChild(row);
            } 
        });
    })
    .catch(error => {
        console.error('There was a problem with the request:', error);
    });

    
}

function clearTable() {
    const tbody = document.querySelector('#subjectTable tbody');
    tbody.innerHTML = '';
}



const fetchCourseIDs = async (studentID) => {
    const url = 'http://localhost:8083/api/v1/student-2/search-by-student-id?studentID='+studentID;

    try {

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
        });
    
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.text();
        // console.log(data);
        return JSON.parse(data);
    
        
    } catch(error) {
        console.error('There was a problem with the request:', error);
    };

}
