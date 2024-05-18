var departments = [];

document.addEventListener("DOMContentLoaded", function() {
    fetchDepartmentAll();
});

function fetchDepartmentAll() {
    const url = 'http://localhost:8080/api/v1/department/get-all';
    fetch(url, {
        method: 'POST', // Sử dụng phương thức GET
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
        departments = data; // Lưu dữ liệu vào mảng departments
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
var classes = [];

function fetchClasses() {
    const url = 'http://localhost:8080/api/v1/classes/get-all';
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
        classes = data;
        displayClasses();
    })
    .catch(error => {
        console.error('Error fetching subjects:', error);
    });
}

function getEducationType(type, mode) {
    if (type === "UNIVERSITY") {
        type = "Đại học";
    } else if (type === "COLLEGE") {
        type = "Cao đẳng";
    }
    if (mode === "REGULAR") {
        mode = "Chính quy";
    } else if (mode === "NON_REGULAR") {
        mode = "Không chính quy";
    }
    return { type, mode };
}

function displayClasses() {
    var classList = document.getElementById("classList");
    classList.innerHTML = "";
    classes.forEach(function(classItem, index) {
        var department = departments.find(function(department) {
            return department.id === classItem.departmentID;
        });
        var departmentName = department ? department.name : "N/A"; // Kiểm tra xem phần tử được tìm thấy hay không
        var { type, mode } = getEducationType(classItem.typeOfEducation, classItem.modeOfEducation);
        var row = `
            <tr>
                <td>${index + 1}</td>
                <td>${classItem.name}</td>
                <td>${departmentName}</td>
                <td>${type}</td>
                <td>${mode}</td>
                <td>
                    <button class="btn btn-info btn-edit" data-id="${classItem.id}">Sửa</button>
                    <button class="btn btn-danger btn-delete" data-id="${classItem.id}">Xóa</button>
                </td>
            </tr>
        `;
        classList.insertAdjacentHTML("beforeend", row);
    });

    var deleteButtons = document.querySelectorAll(".btn-delete");
    deleteButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            var classId = button.getAttribute("data-id");
            deleteClass(classId);
        });
    });

    var editButtons = document.querySelectorAll(".btn-edit");
    editButtons.forEach(function(button) {
        button.addEventListener("click", function() {
            var classId = button.getAttribute("data-id");
            fillClassForm(classId);
        });
    });
}

function deleteClass(classId) {
    classes = classes.filter(function(classItem) {
        return classItem.id !== classId;
    });
    displayClasses();
}

function fillClassForm(classId) {
    var classItem = classes.find(function(item) {
        return item.id === classId;
    });
    document.getElementById("classNameInput").value = classItem.name;
    document.getElementById("departmentInput").value = classItem.majorsID;
    document.getElementById("educationLevelInput").value = classItem.typeOfEducation;
    document.getElementById("trainingTypeInput").value = classItem.modeOfEducation;
    document.getElementById("updateButton").setAttribute("data-id", classId);
}

document.addEventListener("DOMContentLoaded", fetchClasses);

document.getElementById("classForm").addEventListener("submit", function(event) {
    event.preventDefault();
    var className = document.getElementById("classNameInput").value;
    var majorID = document.getElementById("departmentInput").value;
    var educationLevel = document.getElementById("educationLevelInput").value;
    var trainingType = document.getElementById("trainingTypeInput").value;
    createClass(className, majorID);
    displayClasses();
    document.getElementById("classForm").reset();
});

document.getElementById("updateButton").addEventListener("click", function() {
    var className = document.getElementById("classNameInput").value;
    var majorID = document.getElementById("departmentInput").value;
    var educationLevel = document.getElementById("educationLevelInput").value;
    var trainingType = document.getElementById("trainingTypeInput").value;
    var classIdToUpdate = document.getElementById("updateButton").getAttribute("data-id");
    var classToUpdateIndex = classes.findIndex(function(classItem) {
        return classItem.id === classIdToUpdate;
    });
    classes[classToUpdateIndex].name = className;
    classes[classToUpdateIndex].majorsID = majorID;
    classes[classToUpdateIndex].typeOfEducation = educationLevel;
    classes[classToUpdateIndex].modeOfEducation = trainingType;
    displayClasses();
    document.getElementById("classForm").reset();
});

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function createClass(className, majorID) {
    var newClass = {
        name: className,
        majorsID: majorID
    };

    fetch('http://localhost:8080/api/v1/classes/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        },
        body: JSON.stringify(newClass)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to create class');
        }
        return response.json();
    })
    .then(data => {
        classes.push(data);
        displayClasses();
    })
    .catch(error => {
        console.error('Error creating class:', error);
    });
}
