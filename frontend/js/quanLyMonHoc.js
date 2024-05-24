var subjects = [];
var selectedSubjects = [];
document.addEventListener('DOMContentLoaded', function() {
    fetchSubjects();
    document.getElementById('showFormButton').addEventListener('click', function() {
        // Hiển thị modal với danh sách môn học
        displayCourseList(subjects);
        $('#monHocModal').modal('show');
    });
    document.getElementById('searchCourseInput').addEventListener('input', function(event) {
        const keyword = event.target.value.toLowerCase();
        const filteredSubjects = subjects.filter(subject => subject.name.toLowerCase().includes(keyword));
        displayCourseList(filteredSubjects);
    });

    document.getElementById("submitBtn").addEventListener("click", function(event) {
        event.preventDefault();
    
        var courseName = document.getElementById('courseNameInput').value;
        var creditUnits = parseInt(document.getElementById('creditInput').value);
        var theorySessions = parseInt(document.getElementById('theoryHoursInput').value);
        var practiceSessions = parseInt(document.getElementById('practiceHoursInput').value);
        if(courseName===""){
            showErrorToast("Bạn chưa nhập tên môn học")
        }
        else if(creditUnits===""){
            showErrorToast("Bạn chưa nhập tổng số tín chỉ")
        }
        else if(theorySessions===""){
            showErrorToast("Bạn chưa nhập số tín chỉ lý thuyết")
        }
        else if(practiceSessions===""){
            showErrorToast("Bạn chưa nhập số tín chỉ thực hành")
        }
        else if (theorySessions + practiceSessions !== creditUnits) {
            showErrorToast("Tổng số tín chỉ phải bằng với số tín chỉ lý thuyết + số tín chỉ thực hành")
            return;
        }
        var newSubject = {
            name: courseName,
            creditUnits: creditUnits,
            theorySessions: theorySessions,
            practicalSessions: practiceSessions,
            prerequisites: selectedSubjects
        };
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
            showSuccessToast('Tạo môn học thành công!')
            // alert('Tạo môn học thành công!');
            fetchSubjects();
            spaceInput();
        })
        .catch(error => {
            showErrorToast('Đã có lỗi khi tạo môn học mới')
            console.error('Error creating subject:', error);
        });
    });
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
            "<td>" + (subject.prerequisites && subject.prerequisites.length > 0 ? getPrerequisitesNames(subject.prerequisites) : "Không có") + "</td>";
        tbody.appendChild(row);
    });

    var tbodyTienQuyet = document.getElementById('monHocTable');
    tbodyTienQuyet.innerHTML = '';
    stt = 0;
    subjects.forEach(function(subject) {
        if (!selectedSubjects.includes(subject.id)) {
            stt++;
            var row = document.createElement("tr");
            row.innerHTML = "<td>" + stt + "</td>" +
                "<td>" + subject.name + "</td>" +
                "<td>" + subject.creditUnits + "</td>" +
                "<td>" + subject.theorySessions + "</td>" +
                "<td>" + subject.practicalSessions + "</td>" +
                "<td>" + (subject.prerequisites && subject.prerequisites.length > 0 ? getPrerequisitesNames(subject.prerequisites) : "Không có") + "</td>" +
                "<td>" +
                    "<button class='btn btn-warning add-button'>Thêm</button>" +
                "</td>";
            row.querySelector('.add-button').addEventListener('click', function() {
                addSubject(subject);
                $('#monHocModal').modal('hide');
            });
            tbodyTienQuyet.appendChild(row);
        }
    });

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
        const index = selectedSubjects.indexOf(subjectId);
        if (index > -1) {
            selectedSubjects.splice(index, 1);
            subjectButton.remove();
            displayCourseList(subjects);
        }
    }
}

function getPrerequisitesNames(prerequisiteIds) {
    if (!Array.isArray(prerequisiteIds)) {
        prerequisiteIds = [prerequisiteIds];
    }
    let names = [];
    prerequisiteIds.forEach(function(prerequisiteId) {
        let prerequisite = subjects.find(function(subject) {
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
    
    // Làm trống selectedSubjectsContainer
    document.getElementById('selectedSubjectsContainer').innerHTML = '';
    selectedSubjects = []; // Reset mảng selectedSubjects
}




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
            `;

        main.appendChild(toastBody);

        toastBody.onclick = function(event) {
            if (event.target.closest('.toast__close')) {
                main.removeChild(toastBody);
            }
        }

        setTimeout(function() {
            if (main.contains(toastBody))
                main.removeChild(toastBody);
        }, 4000);
    }
}

function showSuccessToast(desc) {
    toast({
        state: 'success',
        title: 'Thành công !',
        desc: desc,
    });
}

function showErrorToast(desc) {
    toast({
        state: 'error',
        title: 'Lỗi !',
        desc: desc,
    });
}

function showInfoToast(desc) {
    toast({
        state: 'info',
        title: 'Thông tin !',
        desc: desc,
    });
}

function showWarnToast(desc) {
    toast({
        state: 'warn',
        title: 'Cảnh báo !',
        desc: desc,
    });
}
