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

function displayFilteredData(filteredData) {
    var khoaBody = document.getElementById('khoaBody');
    khoaBody.innerHTML = '';

    let stt = 0;
    filteredData.forEach(function(nganh, index) {
        stt++;
        var row = "<tr>";
        row += "<td>" + stt + "</td>";
        row += "<td>" + nganh.name + "</td>";
        khoaBody.innerHTML += row;
    });

    addDeleteButtonEvent();
}

function displaykhoaData() {
    var khoaBody = document.getElementById('khoaBody');
    khoaBody.innerHTML = '';

    let stt = 0;
    khoaData.forEach(function(nganh, index) {
        stt++;
        var row = "<tr>";
        row += "<td>" + stt + "</td>";
        row += "<td>" + nganh.name + "</td>";
        khoaBody.innerHTML += row;
    });
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

    // Gắn sự kiện click cho nút Submit
    document.getElementById('actionButton').addEventListener('click', function() {
        var khoaName = document.getElementById('khoaName').value.trim();
        if (khoaName) {
            createDepartment(khoaName);
        } else {
            alert('Vui lòng nhập tên khoa');
        }
    });
});

function createDepartment(name) {
    const url = 'http://localhost:8080/api/v1/department/create';
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        },
        body: JSON.stringify({ name: name })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        alert('Khoa mới đã được tạo thành công');
        fetchDepartmentAll()
            .then(() => {
                displaykhoaData();
            });
    })
    .catch(error => {
        console.error('There was a problem with the request:', error);
        alert('Đã xảy ra lỗi khi tạo khoa');
    });
}
