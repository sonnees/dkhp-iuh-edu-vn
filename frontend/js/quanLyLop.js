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
            return department.id === classItem.majorsID;
        });
        var departmentName = department ? department.name : classItem.majorsID; // Kiểm tra xem phần tử được tìm thấy hay không
        var { type, mode } = getEducationType(classItem.typeOfEducation, classItem.modeOfEducation);
        var row = `
            <tr>
                <td>${index + 1}</td>
                <td>${classItem.name}</td>
                <td>${departmentName}</td>
                <td>${type}</td>
                <td>${mode}</td>
                
            </tr>
        `;
        classList.insertAdjacentHTML("beforeend", row);
    });
}

function fillClassForm(classId) {
    var classItem = classes.find(function(item) {
        return item.id === classId;
    });
    document.getElementById("classNameInput").value = classItem.name;
    document.getElementById("departmentInput").value = classItem.majorsID;
    document.getElementById("educationLevelInput").value = classItem.typeOfEducation;
    document.getElementById("trainingTypeInput").value = classItem.modeOfEducation;
}

document.addEventListener("DOMContentLoaded", function () {
    fetchClasses()
    document.getElementById("classForm").addEventListener("submit", function(event) {
        event.preventDefault();
        var className = document.getElementById("classNameInput").value;
        var majorID = document.getElementById("majorInput").value;
        // var educationLevel = document.getElementById("educationLevelInput").value;
        // var trainingType = document.getElementById("trainingTypeInput").value;
        console.log(">>>>",majorID);
        if(className===""){
            showErrorToast("Bạn chưa nhập tên lớp")
        }
        else if (majorID===""){
            showErrorToast("Bạn chưa chọn ngành")
        }
        else {
            createClass(className, majorID);
            displayClasses();
            document.getElementById("classForm").reset();
        }
        
    });
    document.getElementById("departmentInput").addEventListener("change", async function() {
        var departmentID = this.value;
        await fetchMajorsByDepartment(departmentID); // Sử dụng await để đảm bảo fetch hoàn tất trước khi tiếp tục
    });
});



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
        showSuccessToast("Tạo lớp học mới thành công")
        // classes.push(data);
        displayClasses();
    })
    .catch(error => {
        showErrorToast("Đã có lỗi khi tạo lớp học mới")
        console.error('Error creating class:', error);
    });
}


async function fetchMajorsByDepartment(departmentID) {
    const url = 'http://localhost:8080/api/v1/majors/search-by-department-id?departmentID=' + departmentID;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        populateMajorSelect(data);
    } catch (error) {
        console.error('There was a problem with the request:', error);
    }
}

function populateMajorSelect(majors) {
    const majorSelect = document.getElementById("majorInput");
    majorSelect.innerHTML = ""; // Xóa tất cả các tùy chọn hiện có
    majors.forEach(major => {
        const option = document.createElement("option");
        option.value = major.id;
        option.text = major.name;
        majorSelect.appendChild(option);
    });
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
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