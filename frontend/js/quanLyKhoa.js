var khoaData = [];

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
        khoaData = data.map(item => {
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

fetchDepartmentAll()
    .then(() => {
        console.log("KhoaData: ", khoaData);
        displaykhoaData();
    })
    .catch(error => {
        console.error('Error occurred:', error);
    });

document.getElementById('searchButton').addEventListener('click', function() {
    var searchQuery = document.getElementById('searchInput').value.trim().toLowerCase();
    if (searchQuery === "") {
        displaykhoaData();
    } else {
        var filteredData = khoaData.filter(function(nganh) {
            return nganh.name.toLowerCase().includes(searchQuery);
        });
        displayFilteredData(filteredData);
    }
});

function displayFilteredData(filteredData) {
    var nganhBody = document.getElementById('nganhBody');
    nganhBody.innerHTML = '';

    let stt = 0;
    filteredData.forEach(function(nganh, index) {
        stt++;
        var row = "<tr>";
        row += "<td>" + stt + "</td>";
        row += "<td>" + nganh.name + "</td>";
        row += "<td><button type='button' class='btn btn-warning btn-sm edit-btn'>Sửa</button></td>";
        row += "<td><button type='button' class='btn btn-danger btn-sm delete-btn'>Xóa</button></td>";
        row += "</tr>";
        nganhBody.innerHTML += row;
    });

    addDeleteButtonEvent();
    addEditButtonEvent();
}

function displaykhoaData() {
    var nganhBody = document.getElementById('nganhBody');
    nganhBody.innerHTML = '';

    let stt = 0;
    khoaData.forEach(function(nganh, index) {
        stt++;
        var row = "<tr>";
        row += "<td>" + stt + "</td>";
        row += "<td>" + nganh.name + "</td>";
        row += "<td><button type='button' class='btn btn-warning btn-sm edit-btn'>Sửa</button></td>";
        row += "<td><button type='button' class='btn btn-danger btn-sm delete-btn'>Xóa</button></td>";
        row += "</tr>";
        nganhBody.innerHTML += row;
    });

    addDeleteButtonEvent();
    addEditButtonEvent();
}

document.getElementById('actionButton').addEventListener('click', function() {
    var nganhNameValue = document.getElementById('nganhName').value;
    var buttonValue = this.innerText;

    if (buttonValue === 'Submit') {
        createDepartment(nganhNameValue)
            .then(data => {
                khoaData.push({ id: data.id, name: nganhNameValue });
                displaykhoaData();
            })
            .catch(error => {
                console.error('Error creating department:', error);
            });
    } else if (buttonValue === 'Cập nhật') {
        var index = parseInt(document.getElementById('editIndex').value);

        if (!isNaN(index) && index >= 0 && index < khoaData.length) {
            khoaData[index].name = nganhNameValue;
        }
    }

    displaykhoaData();
    this.innerText = 'Submit';
    document.getElementById('nganhName').value = '';
    document.getElementById('editIndex').value = '';
    document.getElementById('editButton').disabled = true;
});

function addEditButtonEvent() {
    var editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(function(button, index) {
        button.addEventListener('click', function() {
            var row = button.closest('tr');
            var rowIndex = row.rowIndex - 1;
            var nganhNameInput = document.getElementById('nganhName');
            nganhNameInput.value = khoaData[rowIndex].name;
            document.getElementById('editIndex').value = rowIndex;
            document.getElementById('editButton').disabled = false;
            document.getElementById('actionButton').disabled = false;
            document.getElementById('actionButton').innerText = 'Cập nhật';
        });
    });
}

document.getElementById('editButton').addEventListener('click', function() {
    var nganhNameValue = document.getElementById('nganhName').value;
    var index = parseInt(document.getElementById('editIndex').value);

    if (!isNaN(index) && index >= 0 && index < khoaData.length) {
        khoaData[index].name = nganhNameValue;
        displaykhoaData();
        document.getElementById('editIndex').value = '';
        document.getElementById('editButton').disabled = true;
        document.getElementById('actionButton').disabled = false;
        document.getElementById('actionButton').innerText = 'Submit';
    }
});

function addDeleteButtonEvent() {
    var deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(function(button, index) {
        button.addEventListener('click', function() {
            khoaData.splice(index, 1);
            displaykhoaData();
            document.getElementById('editIndex').value = '';
            document.getElementById('editButton').disabled = true;
            document.getElementById('actionButton').disabled = false;
            document.getElementById('actionButton').innerText = 'Submit';
        });
    });
}

function generateUUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

displaykhoaData();

document.addEventListener("DOMContentLoaded", function () {
    // Lắng nghe sự kiện khi người dùng nhập dữ liệu vào ô tìm kiếm
    document.getElementById('searchInput').addEventListener('input', function() {
        var searchQuery = this.value.trim().toLowerCase(); // Lấy nội dung tìm kiếm và chuẩn hóa thành chữ thường
        if (searchQuery === "") {
            displaykhoaData(); // Nếu không có nội dung tìm kiếm, hiển thị lại toàn bộ dữ liệu
        } else {
            var filteredData = khoaData.filter(function(nganh) {
                return nganh.name.toLowerCase().includes(searchQuery); // Lọc dữ liệu dựa trên tên khoa
            });
            displayFilteredData(filteredData); // Hiển thị dữ liệu lọc được
        }
    });
});
