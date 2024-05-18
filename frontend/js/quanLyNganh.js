var departments = [];
var subjects = [];
var selectedSubjects = [];

document.addEventListener("DOMContentLoaded", function() {
    fetchDepartmentAll();
    fetchSubjects();

    document.getElementById('addToMandatory').addEventListener('click', function() {
        addSubjectsToClass('mandatory');
    });

    document.getElementById('addToOptional').addEventListener('click', function() {
        addSubjectsToClass('optional');
    });

    // Sự kiện cho nút Thêm Ngành
    document.getElementById('addMajorButton').addEventListener('click', function() {
        $('#confirmAddMajorModal').modal('show');
    });

    // Sự kiện cho nút Xác nhận trong modal
    document.getElementById('confirmAddMajorButton').addEventListener('click', function() {
        addMajor();
        $('#confirmAddMajorModal').modal('hide');
    });
});

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
        displayCourseList(subjects);
    })
    .catch(error => {
        console.error('Error fetching subjects:', error);
    });
}

function displayCourseList(subjects) {
    var tbody = document.getElementById('monHocTable');
    tbody.innerHTML = '';

    subjects.forEach((subject, index) => {
        var row = document.createElement("tr");
        row.innerHTML = "<td>" + (index + 1) + "</td>" +
            "<td>" + subject.name + "</td>" +
            "<td>" + subject.creditUnits + "</td>" +
            "<td>" + subject.theorySessions + "</td>" +
            "<td>" + subject.practicalSessions + "</td>" +
            "<td>" + (subject.prerequisites && subject.prerequisites.length > 0 ? getPrerequisitesNames(subject.prerequisites) : "Không có") + "</td>"+
            "<td>" +
            "<button class='btn btn-warning add-button'>Thêm</button>" +
            "</td>";
        row.querySelector('.add-button').addEventListener('click', function() {
            addSubject(subject);
        });
        tbody.appendChild(row);
    });
}

function getPrerequisitesNames(prerequisiteIds) {
    let names = [];
    prerequisiteIds.forEach(prerequisiteId => {
        let prerequisite = subjects.find(subject => subject.id === prerequisiteId);
        if (prerequisite) {
            names.push(prerequisite.name);
        }
    });
    return names.join(", ");
}

function addSubject(subject) {
    if (!selectedSubjects.includes(subject.id)) {
        selectedSubjects.push(subject.id);

        const selectedSubjectsContainer = document.getElementById('selectedSubjectsContainer');
        const subjectButton = document.createElement('button');
        subjectButton.className = 'btn btn-secondary';
        subjectButton.innerHTML = subject.name + ' <span class="badge badge-light">x</span>';
        
        subjectButton.querySelector('span').addEventListener('click', function(event) {
            event.stopPropagation();
            removeSubject(subject.id, subjectButton);
        });

        selectedSubjectsContainer.appendChild(subjectButton);
    }
}

function removeSubject(subjectId, subjectButton) {
    selectedSubjects = selectedSubjects.filter(id => id !== subjectId);
    subjectButton.remove();
}

function addSubjectsToClass(classType) {
    const selectedSubjectsList = selectedSubjects.map(id => subjects.find(subject => subject.id === id));
    const targetTableBody = classType === 'mandatory' ? document.getElementById('monHocBatBuocTable') : document.getElementById('monHocTuChonTable');
    
    selectedSubjectsList.forEach((subject, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${index + 1}</td>
                         <td>${subject.name}</td>
                         <td>${subject.creditUnits}</td>
                         <td>${subject.theorySessions}</td>
                         <td>${subject.practicalSessions}</td>
                         <td>${subject.prerequisites ? getPrerequisitesNames(subject.prerequisites) : 'Không có'}</td>`;
        targetTableBody.appendChild(row);
    });

    selectedSubjects = [];
    document.getElementById('selectedSubjectsContainer').innerHTML = '';
    $('#addToClassModal').modal('hide');
}

function addMajor() {
    const majorName = document.getElementById('majorNameInput').value;
    const departmentID = document.getElementById('departmentInput').value;
    
    const electiveSubjects = [];
    document.querySelectorAll('#monHocTuChonTable tr').forEach(row => {
        const id = subjects.find(subject => subject.name === row.children[1].innerText).id;
        electiveSubjects.push(id);
    });

    const requiredCourses = [];
    document.querySelectorAll('#monHocBatBuocTable tr').forEach(row => {
        const id = subjects.find(subject => subject.name === row.children[1].innerText).id;
        requiredCourses.push(id);
    });

    const majorData = {
        name: majorName,
        departmentID: departmentID,
        electiveSubjects: electiveSubjects,
        requiredCourses: requiredCourses
    };

    fetch('http://localhost:8080/api/v1/majors/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        },
        body: JSON.stringify(majorData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to create major');
        }
        return response.json();
    })
    .then(data => {
        alert('Ngành đã được thêm thành công');
        location.reload(); // Reload lại trang sau khi thêm ngành
    })
    .catch(error => {
        console.error('Error creating major:', error);
        alert('Có lỗi xảy ra khi thêm ngành');
    });
}

// Sự kiện tìm kiếm
document.getElementById('searchSubjectInput').addEventListener('input', function(event) {
    const keyword = event.target.value.toLowerCase();
    const filteredSubjects = subjects.filter(subject => subject.name.toLowerCase().includes(keyword));
    displayCourseList(filteredSubjects);
});
