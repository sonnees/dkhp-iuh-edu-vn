var majors = [
    {
        "id": "15e205ad-9d92-4464-80f0-e858c827d408",
        "name": "Hệ Thống Thông Tin",
        "departmentID": "82aab472-6246-2352-9b5c-aabbcc2a6cf6",
        "electiveSubjects": [
            "2d401045-403b-4d29-8c6d-abac0e7a8938",
            "82aab472-d77f-4734-9b5c-aabbcc2a6cf6",
            "84bff92e-2e8f-4ed7-bd27-d030959297a7",
            "d616658d-bba5-460e-a0c5-9c51b328de71",
            "bae90ee8-ad04-47a3-8ae1-edd84dc830ff"
        ],
        "requiredCourses": [
            "5b982a77-d2a7-488e-adff-e1e8d113848d",
            "82aab472-d77f-4734-9b5c-aabbcc2a6cf6",
            "0515146f-37a6-4111-a0a6-7a012c67d8df",
            "27b58790-c91e-4ec2-865b-e316c1f6f982",
            "54689d6e-868f-477b-8fcf-a573fbe9a584",
            "d132f261-f788-495f-90c4-3a15126d1816",
            "601bcd47-019e-4867-918e-825b73a75e79",
            "fe5ed0ab-c915-450f-a616-2080f6c8c90a",
            "447d5a3e-56c0-420b-bb3c-210ea8d3632e",
            "058909d1-d08e-49a4-a3db-c34a59bbaab0"
        ],
        "_class": "edu.iuh.administratorservice.entity.Majors"
    },
    {
        "id": "42c2e860-c7ec-4ea5-be71-65a99f9ee5da",
        "name": "Công Nghệ Thông Tin",
        "departmentID": "82aab472-6246-2352-9b5c-aabbcc2a6cf6",
        "electiveSubjects": [
            "2d401045-403b-4d29-8c6d-abac0e7a8938",
            "82aab472-d77f-4734-9b5c-aabbcc2a6cf6",
            "84bff92e-2e8f-4ed7-bd27-d030959297a7",
            "d616658d-bba5-460e-a0c5-9c51b328de71",
            "bae90ee8-ad04-47a3-8ae1-edd84dc830ff"
        ],
        "requiredCourses": [
            "cfdb6928-39a8-4c32-b148-85ffddc9b8a2",
            "2c295b83-54cc-4ac0-9776-0863be75eb60",
            "19803538-fa00-46db-9b3e-4c1fe389309c",
            "e6436b12-134b-4145-ae69-c6cf4af628f0",
            "24629680-f852-4a16-b660-b6567b433639",
            "058909d1-d08e-49a4-a3db-c34a59bbaab0",
            "50af5876-0c3f-4e9c-a7db-549e58148e69",
            "5688926e-17c6-4cce-bc29-df1e29e60304",
            "35dec163-f78a-47b5-807a-d75f70763d68",
            "27b58790-c91e-4ec2-865b-e316c1f6f982",
            "54689d6e-868f-477b-8fcf-a573fbe9a584"
        ],
        "_class": "edu.iuh.administratorservice.entity.Majors"
    },
    {
        "id": "0a3bdac5-77d5-40f2-af9f-c31545b88740",
        "name": "Kỹ Thuật Phần Mềm",
        "departmentID": "82aab472-6246-2352-9b5c-aabbcc2a6cf6",
        "electiveSubjects": [
            "2d401045-403b-4d29-8c6d-abac0e7a8938",
            "82aab472-d77f-4734-9b5c-aabbcc2a6cf6",
            "84bff92e-2e8f-4ed7-bd27-d030959297a7",
            "d616658d-bba5-460e-a0c5-9c51b328de71",
            "bae90ee8-ad04-47a3-8ae1-edd84dc830ff"
        ],
        "requiredCourses": [
            "602e527e-1a33-4c12-aefd-79caf67f5a0d",
            "d132f261-f788-495f-90c4-3a15126d1816",
            "601bcd47-019e-4867-918e-825b73a75e79",
            "fe5ed0ab-c915-450f-a616-2080f6c8c90a",
            "447d5a3e-56c0-420b-bb3c-210ea8d3632e",
            "058909d1-d08e-49a4-a3db-c34a59bbaab0",
            "50af5876-0c3f-4e9c-a7db-549e58148e69",
            "5688926e-17c6-4cce-bc29-df1e29e60304",
            "35dec163-f78a-47b5-807a-d75f70763d68",
            "27b58790-c91e-4ec2-865b-e316c1f6f982",
            "54689d6e-868f-477b-8fcf-a573fbe9a584",
            "e6436b12-134b-4145-ae69-c6cf4af628f0",
            "24629680-f852-4a16-b660-b6567b433639"
        ],
        "_class": "edu.iuh.administratorservice.entity.Majors"
    }
];
function fetchDepartmentAll() {
    const url = 'http://localhost:8080/api/v1/department/get-all';
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        },
        body: JSON.stringify({})
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        majors = data.map(item => {
            return {
                id: item.id,
                name: item.name
            };
        });
    })
    .catch(error => {
        console.error('There was a problem with the request:', error);
        khoaData = [];
    });
}
document.addEventListener("DOMContentLoaded", fetchClasses);
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

var majorSelect = document.getElementById("majorInput");
majors.forEach(function(major) {
    var option = document.createElement("option");
    option.value = major.id;
    option.text = major.name;
    majorSelect.appendChild(option);
});

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
        var majorsName = majors.find(function(major) {
            return major.id === classItem.majorsID;
        }).name;
        var { type, mode } = getEducationType(classItem.typeOfEducation, classItem.modeOfEducation);
        var row = `
            <tr>
                <td>${index + 1}</td>
                <td>${classItem.name}</td>
                <td>${majorsName}</td>
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
    document.getElementById("majorInput").value = classItem.majorsID;
    document.getElementById("educationLevelInput").value = classItem.typeOfEducation;
    document.getElementById("trainingTypeInput").value = classItem.modeOfEducation;
    document.getElementById("updateButton").setAttribute("data-id", classId);
}

document.addEventListener("DOMContentLoaded", fetchClasses);

document.getElementById("classForm").addEventListener("submit", function(event) {
    event.preventDefault();
    var className = document.getElementById("classNameInput").value;
    var majorID = document.getElementById("majorInput").value;
    var educationLevel = document.getElementById("educationLevelInput").value;
    var trainingType = document.getElementById("trainingTypeInput").value;
    createClass(className, majorID);
    displayClasses();
    document.getElementById("classForm").reset();
});

document.getElementById("updateButton").addEventListener("click", function() {
    var className = document.getElementById("classNameInput").value;
    var majorID = document.getElementById("majorInput").value;
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
