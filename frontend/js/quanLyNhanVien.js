var departments = [];
var staffs = [];

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

function fetchAllStafff() {
    const url = 'http://localhost:8080/api/v1/staff/get-all';
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
        staffs = data;
        populateStaffTable();     
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

function populateStaffTable() {
    const staffTable = document.getElementById("staffTable");
    staffTable.innerHTML = ''; // Xóa nội dung cũ trong bảng

    staffs.forEach((staff, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${staff.fullName}</td>
            <td>${getDepartmentNameById(staff.departmentID)}</td>
        `;
        staffTable.appendChild(row);
    });
}

function populateStaffFilteredTable(filteredStaffs) {
    const staffTable = document.getElementById("staffTable");
    staffTable.innerHTML = '';
    filteredStaffs.forEach((staff, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${staff.fullName}</td>
            <td>${getDepartmentNameById(staff.departmentID)}</td>
        `;
        staffTable.appendChild(row);
    });
}

function getDepartmentNameById(departmentId) {
    const department = departments.find(dep => dep.id === departmentId);
    return department ? department.name : '';
}

document.addEventListener("DOMContentLoaded", function() {
    fetchDepartmentAll();
    fetchAllStafff(); // Gọi hàm để lấy dữ liệu nhân viên

    const form = document.querySelector('form');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Ngăn chặn hành động mặc định của form
        
        const employeeNameInput = document.getElementById('employeeName');
        const departmentInput = document.getElementById('departmentInput');
        
        const fullName = employeeNameInput.value;
        const departmentID = departmentInput.value;
        if(typeStaff.value==="staff")
            createStaff(fullName, departmentID);
        else if(typeStaff.value==="administrator") 
            createAdministrator(fullName, departmentID);
    });

    document.getElementById('searchInput').addEventListener('input', function() {
        var searchQuery = this.value.trim().toLowerCase(); // Lấy nội dung tìm kiếm và chuẩn hóa thành chữ thường
        if (searchQuery === "") {
            populateStaffTable(); // Nếu không có nội dung tìm kiếm, hiển thị lại toàn bộ dữ liệu
        } else {
            var filteredData = staffs.filter(function(staff) {
                return staff.fullName.toLowerCase().includes(searchQuery); // Lọc dữ liệu dựa trên tên khoa
            });
            populateStaffFilteredTable(filteredData); // Hiển thị dữ liệu lọc được
        }
    });
});

function createStaff(fullName, departmentID) {
    const url = 'http://localhost:8080/api/v1/staff/create-staff';
    const data = {
        fullName: fullName,
        departmentID: departmentID
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('New staff created:', data);
        alert("Đã thêm nhân viên thành công")
        fetchAllStafff(); // Sau khi tạo nhân viên, cập nhật lại bảng nhân viên
    })
    .catch(error => {
        console.error('There was a problem with the request:', error);
    });
}

function createAdministrator(fullName, departmentID) {
    console.log('>>>>>>>>>>>.');
    
    const url = 'http://localhost:8080/api/v1/staff/create-administrator';
    const data = {
        fullName: fullName,
        departmentID: departmentID
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Administrator rights granted:', data);
        alert(`Đã tạo Administrator cho ${fullName}`);
        fetchAllStafff();
    })
    .catch(error => {
        console.error('There was a problem with the request:', error);
    });
}
