var departments = [];
var subjects = [];
majors=[]
document.addEventListener("DOMContentLoaded", function() {
    // Gọi hàm fetchSubjects ở đây để đảm bảo rằng nó chỉ được gọi khi DOM đã tải hoàn toàn
    fetchSubjects();

    document.addEventListener("click", function(event) {
        if (event.target.classList.contains('detail-button')) {
            var row = event.target.closest('tr');
            var majorName = row.querySelector('td:nth-child(2)').textContent;
            var departmentName = row.querySelector('td:nth-child(3)').textContent;
            displayMajorModal(majorName, departmentName);
            
        }
    });
});

function displayMajorModal(majorName, departmentName) {
    var subjectNameInput = document.getElementById('subjectName');
    var departmentNameInput = document.getElementById('departmentName');
    subjectNameInput.value = majorName;
    departmentNameInput.value = departmentName;
    $('#subjectModal').modal('show');

    // Lấy ra các môn học của ngành từ subjects và hiển thị trong modal
    var selectedMajor = majors.find(major => major.name === majorName);
    if (selectedMajor) {
        var majorSubjects = subjects.filter(subject => selectedMajor.requiredCourses.includes(subject.id) || selectedMajor.electiveSubjects.includes(subject.id));
        displayCourseList(majorSubjects);
    } else {
        console.error('Không tìm thấy thông tin về ngành.');
    }
}


function fetchSubjects() {
    const url = 'http://localhost:8080/api/v1/subject/get-all';
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        },
        body: JSON.stringify({})
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch subjects');
        }
        return response.json();
    })
    .then(data => {
        subjects = data;
        fetchDepartmentAll();
        console.log("subjects ",subjects); // Sau khi lấy danh sách môn học, gọi hàm để lấy thông tin ngành và hiển thị danh sách môn học vào bảng
    })
    .catch(error => {
        console.error('Error fetching subjects:', error);
    });
}

function fetchDepartmentAll() {
    const url = 'http://localhost:8080/api/v1/department/get-all';
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        departments = data;
        populateDepartmentSelect();
    })
    .catch(error => {
        console.error('There was a problem with the request:', error);
    });
}

function populateDepartmentSelect() {
    const departmentSelect = document.getElementById("departmentInput");
    departments.forEach(department => {
        const option = document.createElement("option");
        option.value = department.id;
        option.text = department.name;
        departmentSelect.appendChild(option);
    });
}

document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("departmentInput").addEventListener("change", function() {
        var departmentID = this.value;
        fetchMajorsByDepartment(departmentID);
    });
});

function fetchMajorsByDepartment(departmentID) {
    const url = 'http://localhost:8080/api/v1/majors/search-by-department-id?departmentID=' + departmentID;
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        majors = data; 
        displayMajorList(data);
    })
    .catch(error => {
        console.error('There was a problem with the request:', error);
    });
}

function displayMajorList(majors) {
    var tbody = document.getElementById('majorList');
    tbody.innerHTML = '';

    majors.forEach(function(major, index) {
        var departmentName = departments.find(function(department) {
            return department.id === major.departmentID;
        });
        var row = document.createElement("tr");
        row.innerHTML = "<td>" + (index + 1) + "</td>" +
            "<td>" + major.name + "</td>" +
            "<td>" + (departmentName ? departmentName.name : "") + "</td>" +
            "<td>" + "<button class='btn btn-warning detail-button'>Chi tiết</button>" + "</td>";
        tbody.appendChild(row);
    });
}

function displayCourseList(subjects) {
    var requiredSubjectsTable = document.getElementById('requiredSubjectsTable');
    var optionalSubjectsTable = document.getElementById('optionalSubjectsTable');
    requiredSubjectsTable.innerHTML = '';
    optionalSubjectsTable.innerHTML = '';

    subjects.forEach(function(subject, index) {
        var row = document.createElement('tr');
        row.innerHTML = "<td>" + (index + 1) + "</td>" +
            "<td>" + subject.name + "</td>" +
            "<td>" + subject.creditUnits + "</td>" +
            "<td>" + subject.theorySessions + "</td>" +
            "<td>" + subject.practicalSessions + "</td>";

        // Kiểm tra xem môn có tiên quyết không
        if (subject.prerequisites && subject.prerequisites.length > 0) {
            // Tìm môn tiên quyết trong mảng subjects dựa trên ID
            var prerequisiteSubjectName = getPrerequisitesNames(subject.prerequisites);
            row.innerHTML += "<td>" + prerequisiteSubjectName + "</td>";
        } else {
            row.innerHTML += "<td>Không có</td>";
        }

        var isRequired = majors.some(major => major.requiredCourses.includes(subject.id));
        var isElective = majors.some(major => major.electiveSubjects.includes(subject.id));
        
        if (isRequired) {
            requiredSubjectsTable.appendChild(row);
        } else if (isElective) {
            optionalSubjectsTable.appendChild(row);
        }
    });
}



function getPrerequisitesNames(prerequisiteIds) {
    if (!Array.isArray(prerequisiteIds)) {
        prerequisiteIds = [prerequisiteIds];
    }
    let names = [];
    prerequisiteIds.forEach(function (prerequisiteId) {
        let prerequisite = subjects.find(function (subject) {
            return subject.id === prerequisiteId;
        });
        if (prerequisite) {
            names.push(prerequisite.name);
        } else {
            console.log("Không tìm thấy môn học với ID:", prerequisiteId);
            names.push("Không tìm thấy");
        }
    });
    return names.join(", ");
}