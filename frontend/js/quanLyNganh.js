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
    const electiveSubjects = [];
    const requiredCourses = [];
    const majorName = document.getElementById('majorNameInput').value;
    document.querySelectorAll('#monHocTuChonTable tr').forEach(row => {
        const id = subjects.find(subject => subject.name === row.children[1].innerText).id;
        electiveSubjects.push(id);
    });
    document.querySelectorAll('#monHocBatBuocTable tr').forEach(row => {
        const id = subjects.find(subject => subject.name === row.children[1].innerText).id;
        requiredCourses.push(id);
    });
    if(majorName===''){
        showErrorToast("Chưa nhập tên ngành")
    }
    else if(requiredCourses.length===0){
        showErrorToast("Chưa chọn môn học bắt buộc")
    }
    else if(electiveSubjects.length===0){
        showErrorToast("Chưa chọn môn học tự chọn")
    }
    else {
        $('#confirmAddMajorModal').modal('show');
    }
        
    });

    // Sự kiện cho nút Xác nhận trong modal
    document.getElementById('confirmAddMajorButton').addEventListener('click', function() {
        $('#confirmAddMajorModal').modal('hide');
        // showInfoToast('Đang xử lý quá trình tạo thêm ngành')
        
        addMajor();
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

    const addedSubjectIds = getAddedSubjectIds();

    subjects.forEach((subject, index) => {
        if (!addedSubjectIds.includes(subject.id)) {
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
        }
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
        row.innerHTML = `<td>${targetTableBody.rows.length + 1}</td>
                         <td>${subject.name}</td>
                         <td>${subject.creditUnits}</td>
                         <td>${subject.theorySessions}</td>
                         <td>${subject.practicalSessions}</td>
                         <td>${subject.prerequisites ? getPrerequisitesNames(subject.prerequisites) : 'Không có'}</td>`;
        targetTableBody.appendChild(row);
    });

    selectedSubjects = [];
    document.getElementById('selectedSubjectsContainer').innerHTML = '';
    displayCourseList(subjects);
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
        showSuccessToast('Ngành mới đã được thêm thành công');
        document.getElementById('majorNameInput').value = '';
        document.getElementById('monHocBatBuocTable').innerHTML = '';
        document.getElementById('monHocTuChonTable').innerHTML = '';
        selectedSubjects = [];
        fetchSubjects();
    })
    .catch(error => {
        console.error('Error creating major:', error);
        showErrorToast('Đã xảy ra lỗi khi thêm ngành mới');
    });
}
function getAddedSubjectIds() {
    const mandatorySubjectRows = document.querySelectorAll('#monHocBatBuocTable tr');
    const optionalSubjectRows = document.querySelectorAll('#monHocTuChonTable tr');
    const addedSubjectIds = [];

    mandatorySubjectRows.forEach(row => {
        const id = subjects.find(subject => subject.name === row.children[1].innerText).id;
        addedSubjectIds.push(id);
    });

    optionalSubjectRows.forEach(row => {
        const id = subjects.find(subject => subject.name === row.children[1].innerText).id;
        addedSubjectIds.push(id);
    });

    return addedSubjectIds;
}
// Sự kiện tìm kiếm
document.getElementById('searchSubjectInput').addEventListener('input', function(event) {
    const keyword = event.target.value.toLowerCase();
    const filteredSubjects = subjects.filter(subject => subject.name.toLowerCase().includes(keyword));
    displayCourseList(filteredSubjects);
});

function toast({
    state = 'success',
    title = 'Thành công !',
    desc = 'Chúc bạn may mắn lần sau',
}) {
    var main = document.getElementById('toast');
    if (main) {
        var toastBody = document.createElement('div');
        icons = {
            success: 'fa-solid fa-circle-check',
            info: 'fa-solid fa-circle-info',
            error: 'fa-solid fa-circle-exclamation',
            warn: 'fa-solid fa-triangle-exclamation',
        }

        toastBody.classList.add(`toast--${state}`);
        toastBody.innerHTML =
                    `
                    <div class="toast show">
                        <div class="toast-icon">
                            <i class="${icons[state]}" ></i>
                        </div>
                        <div class="toast-body">
                            <h3 class="toast__title">${title}</h3>
                            <p class="toast__msg">${desc}</p>
                        </div>
                        <div class="toast__close">
                            <i class="fas fa-times"></i>
                        </div>
                    </div>
                    `

        main.appendChild(toastBody);

        toastBody.onclick = function (event) {
            if (event.target.closest('.toast__close')) {
                main.removeChild(toastBody);
            }
        }

        setTimeout(function () {
            if (main.contains(toastBody))
                main.removeChild(toastBody);
        }, 4000)
    }
}

function showSuccessToast(desc) {
    toast({
        state: 'success',
        title: 'Thành công !',
        desc: desc,
    })
}

function showErrorToast(desc) {
    toast({
        state: 'error',
        title: 'Lỗi !',
        desc: desc
    })
}

function showInfoToast(desc) {
    toast({
        state: 'info',
        title: 'Thông tin !',
        desc: desc
    })
}

function showWarnToast(desc) {
    toast({
        state: 'warn',
        title: 'Cảnh báo !',
        desc: desc
    })
}