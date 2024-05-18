var editingIndex = -1; // Biến toàn cục lưu trữ index của học kì đang được sửa

// Bắt sự kiện khi nhấn vào phần tử trong bảng
document.getElementById('semesterTable').addEventListener('click', function(event) {
    var target = event.target;
    // Kiểm tra xem phần tử được nhấp vào có phải là một cell trong tbody không
    if (target.tagName.toLowerCase() === 'td') {
        var row = target.parentElement; // Lấy row chứa cell được nhấp vào
        var rowIndex = row.rowIndex; // Lấy index của row
        
        // Lấy dữ liệu từ cell và đổ lên input
        var yearInput = document.getElementById('year');
        var semesterInput = document.getElementById('semester');
        yearInput.value = row.cells[2].innerText; // Cột năm
        semesterInput.value = row.cells[1].innerText; // Cột kì

        // Lưu index của học kì đang được sửa
        editingIndex = rowIndex - 1;

        // Vô hiệu hóa nút submit và kích hoạt nút cập nhật
        document.getElementById('submitButton').disabled = true;
        document.getElementById('updateButton').disabled = false;
    }
});

// Thêm sự kiện click cho nút cập nhật
document.getElementById('updateButton').addEventListener('click', function() {
    // Lấy giá trị từ input "year" và "semester"
    var yearValue = document.getElementById('year').value;
    var semesterValue = document.getElementById('semester').value;
    
    // Kiểm tra xem index của học kì đang được sửa có hợp lệ không
    if (editingIndex >= 0 && editingIndex < semesters.length) {
        // Cập nhật dữ liệu của học kì trong mảng semesters
        semesters[editingIndex].year = parseInt(yearValue);
        semesters[editingIndex].semesterNumber = parseInt(semesterValue);

        // Gọi lại hàm displayHocKi() để cập nhật dữ liệu trên bảng
        displayHocKi();

        // Reset biến editingIndex và form sau khi đã cập nhật dữ liệu
        editingIndex = -1;
        document.getElementById('submitButton').disabled = false;
        document.getElementById('updateButton').disabled = true;
    }
});

// Bắt sự kiện submit của form
document.querySelector('form').addEventListener('submit', function(event) {
    // Ngăn chặn việc gửi form đi, để không load lại trang
    event.preventDefault();

    // Lấy giá trị từ input "year" và "semester"
    var yearValue = document.getElementById('year').value;
    var semesterValue = document.getElementById('semester').value;

    // Thêm học kì mới
    createSemester(yearValue, semesterValue)
    .then(data => {
        // Tạo học kì mới thành công, thêm vào mảng semesters và hiển thị lại
        semesters.push({ id: data.id, year: parseInt(yearValue), semesterNumber: parseInt(semesterValue) });
        displayHocKi();
    })
    .catch(error => {
        console.error('Error creating semester:', error);
    });

    // Reset form sau khi đã thêm dữ liệu
    this.reset();
});

// Hàm tạo UUID để tạo id mới cho học kì
function generateUUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

function addDeleteButtonEvent() {
    var deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            var row = this.closest('tr');
            var rowIndex = row.rowIndex - 1; // Lấy index của row trong mảng semesters
            semesters.splice(rowIndex, 1); // Xóa học kì khỏi mảng semesters
            displayHocKi(); // Hiển thị lại bảng
        });
    });
}

var semesters = []; // Khởi tạo mảng semesters trống ban đầu

document.addEventListener('DOMContentLoaded', function() {
    var selectedYear = document.getElementById('selectYear').value; // Lấy giá trị năm được chọn mặc định
    fetchSemestersByYear(selectedYear); // Gọi hàm fetchSemestersByYear với năm đã chọn ban đầu
});

document.getElementById('selectYear').addEventListener('change', function() {
    var selectedYear = this.value; // Lấy giá trị năm được chọn
    fetchSemestersByYear(selectedYear); // Gọi hàm fetchSemestersByYear với năm đã chọn
});

function fetchSemestersByYear(year) {
    const url = `http://localhost:8080/api/v1/semester/search-by-year?year=${year}`;
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch semesters');
        }
        return response.json();
    })
    .then(data => {
        // Kiểm tra xem data có phải là mảng không
        if (!Array.isArray(data)) {
            throw new Error('Data received is not an array');
        }

        // Gán dữ liệu học kỳ từ API vào mảng semesters
        semesters = data.map(item => {
            return {
                id: item._id,
                year: item.year,
                semesterNumber: item.semesterNumber,
            };
        });

        // Hiển thị dữ liệu học kỳ
        displayHocKi();
    })
    .catch(error => {
        console.error('Error fetching semesters:', error);
    });
}

function displayHocKi() {
    var tbody = document.getElementById('semesterTable');
    tbody.innerHTML = ''; // Xóa hết dữ liệu cũ trong tbody

    let stt = 0;
    semesters.forEach(function(semester) {
        stt++;
        var row = document.createElement("tr");
        row.innerHTML = "<td>" + stt + "</td>" +
            "<td>" + semester.semesterNumber + "</td>" +
            "<td>" + semester.year + "</td>" +
            "<td>" +
            "<button class='btn btn-danger delete-button'>Xóa</button>" + // Nút xóa
            "<button class='btn btn-warning edit-button'>Sửa</button>" + // Nút sửa
            "</td>";
        tbody.appendChild(row);
    });

    addDeleteButtonEvent(); // Thêm sự kiện cho các nút xóa mới được thêm vào
    addEditButtonEvent(); // Thêm sự kiện cho các nút sửa mới được thêm vào
}

// Thêm sự kiện click cho các nút sửa mới được thêm vào
function addEditButtonEvent() {
    var editButtons = document.querySelectorAll('.edit-button');
    editButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            var row = this.closest('tr');
            var rowIndex = row.rowIndex - 1; // Lấy index của row trong mảng semesters
            var semester = semesters[rowIndex];
            // Hiển thị thông tin của học kì trong các trường nhập liệu
            document.getElementById('year').value = semester.year;
            document.getElementById('semester').value = semester.semesterNumber;
            // Lưu index của học kì đang được sửa
            editingIndex = rowIndex;
            // Vô hiệu hóa nút submit và kích hoạt nút cập nhật
            document.getElementById('submitButton').disabled = true;
            document.getElementById('updateButton').disabled = false;
        });
    });
}

// Gọi hàm để hiển thị dữ liệu ban đầu
displayHocKi();

function createSemester(year, semesterNumber) {
    const url = 'http://localhost:8080/api/v1/semester/create';
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        },
        body: JSON.stringify({ year: year, semesterNumber: semesterNumber })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to create semester');
        }
        return response.json();
    });
}
