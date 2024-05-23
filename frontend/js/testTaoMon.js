document.getElementById("prerequisiteCheckbox").addEventListener("change", function() {
    var majorSelect = document.getElementById("majorSelect");
    if (this.checked) {
        majorSelect.style.display = "block";
    } else {
        majorSelect.style.display = "none";
    }
});

var subjects = [];

document.addEventListener('DOMContentLoaded', function() {
    fetchSubjects();
});

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
        populatePrerequisiteSelect();
    })
    .catch(error => {
        console.error('Error fetching subjects:', error);
    });
}

function displayCourseList(subjects) {
    var tbody = document.getElementById('courseList');
    tbody.innerHTML = '';

    let stt = 0;
    subjects.forEach(function(subject) {
        stt++;
        var row = document.createElement("tr");
        row.innerHTML = "<td>" + stt + "</td>" +
            "<td>" + subject.name + "</td>" +
            "<td>" + subject.creditUnits + "</td>" +
            "<td>" + subject.theorySessions + "</td>" +
            "<td>" + subject.practicalSessions + "</td>" +
            "<td>" + (subject.prerequisites && subject.prerequisites.length > 0 ? getPrerequisitesNames(subject.prerequisites) : "Không có") + "</td>"
            ;
        tbody.appendChild(row);
    });
}

function populatePrerequisiteSelect() {
    var select = document.getElementById('majorSelect');
    select.innerHTML = '';

    subjects.forEach(function(subject) {
        var option = document.createElement('option');
        option.text = subject.name;
        option.value = subject._id;
        select.appendChild(option);
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
        }
    });
    return names.join(", ");
}

function populateModalCourseList() {
    var tbody = document.getElementById('modalCourseList');
    tbody.innerHTML = '';

    let stt = 0;
    subjects.forEach(function(subject) {
        stt++;
        var row = document.createElement("tr");
        row.innerHTML = "<td>" + stt + "</td>" +
            "<td>" + subject.name + "</td>" +
            "<td><button class='btn btn-primary selectPrerequisiteBtn' data-id='" + subject._id + "' data-name='" + subject.name + "'>Chọn</button></td>";
        tbody.appendChild(row);
    });

    document.querySelectorAll('.selectPrerequisiteBtn').forEach(button => {
        button.addEventListener('click', function(event) {
            var subjectId = event.target.getAttribute('data-id');
            var subjectName = event.target.getAttribute('data-name');

            document.getElementById('majorSelect').value = subjectId;
            document.getElementById('majorSelect').style.display = 'block';
            $('#monHocModal').modal('hide');
        });
    });
}

document.getElementById("submitBtn").addEventListener("click", function(event) {
    event.preventDefault();

    var courseName = document.getElementById('courseNameInput').value;
    var creditUnits = parseInt(document.getElementById('creditInput').value);
    var theorySessions = parseInt(document.getElementById('theoryHoursInput').value);
    var practiceSessions = parseInt(document.getElementById('practiceHoursInput').value);
    var checkbox = document.getElementById('prerequisiteCheckbox');
    var prerequisiteId = '';

    if (theorySessions + practiceSessions !== creditUnits) {
        alert('Số tiết lý thuyết và số tiết thực hành phải bằng số tín chỉ.');
        return;
    }

    if (checkbox.checked) {
        prerequisiteId = document.getElementById('majorSelect').value;
    }

    var newSubject = {
        name: courseName,
        creditUnits: creditUnits,
        theorySessions: theorySessions,
        practicalSessions: practiceSessions
    };

    if (prerequisiteId) {
        newSubject.prerequisites = [prerequisiteId];
    }

    fetch('http://localhost:8080/api/v1/subject/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        },
        body: JSON.stringify(newSubject)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to create subject');
        }
        return response.json();
    })
    .then(data => {
        alert('Tạo môn học thành công!');
        fetchSubjects();
        spaceInput();
    })
    .catch(error => {
        console.error('Error creating subject:', error);
    });
});

document.getElementById("updateBtn").addEventListener("click", function(event) {
    event.preventDefault();

    var courseID = document.getElementById('courseID').value;
    var courseName = document.getElementById('courseNameInput').value;
    var creditUnits = parseInt(document.getElementById('creditInput').value);
    var theorySessions = parseInt(document.getElementById('theoryHoursInput').value);
    var practiceSessions = parseInt(document.getElementById('practiceHoursInput').value);
    var checkbox = document.getElementById('prerequisiteCheckbox');
    var prerequisiteId = '';

    if (theorySessions + practiceSessions !== creditUnits) {
        alert('Số tiết lý thuyết và số tiết thực hành phải bằng số tín chỉ.');
        return;
    }

    if (checkbox.checked) {
        prerequisiteId = document.getElementById('majorSelect').value;
    }

    var updatedSubject = subjects.find(function(subject) {
        return subject._id === courseID;
    });

    updatedSubject.name = courseName;
    updatedSubject.creditUnits = creditUnits;
    updatedSubject.theorySessions = theorySessions;
    updatedSubject.practicalSessions = practiceSessions;

    if (prerequisiteId) {
        updatedSubject.prerequisites = [prerequisiteId];
    } else {
        delete updatedSubject.prerequisites;
    }

    alert('Cập nhật môn học thành công!');
    displayCourseList(subjects);
    spaceInput();
});

function generateUUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

function spaceInput() {
    document.getElementById('courseID').value = '';
    document.getElementById('courseNameInput').value = '';
    document.getElementById('creditInput').value = '';
    document.getElementById('theoryHoursInput').value = '';
    document.getElementById('practiceHoursInput').value = '';
    document.getElementById('prerequisiteCheckbox').checked = false;
    document.getElementById('majorSelect').style.display = "none";
}

document.getElementById('searchCourseInput').addEventListener('input', function(event) {
    const keyword = event.target.value.toLowerCase();
    const filteredSubjects = subjects.filter(subject => subject.name.toLowerCase().includes(keyword));
    displayCourseList(filteredSubjects);
});

document.getElementById('showFormButton').addEventListener('click', function(event) {
    populateModalCourseList();
    $('#monHocModal').modal('show');
});
