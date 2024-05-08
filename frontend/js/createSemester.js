// script.js

// Bắt sự kiện khi nhấn vào phần tử trong bảng
document.getElementById('semesterTable').addEventListener('click', function (event) {
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

        // Đặt giá trị cho input ẩn để lưu index của học kỳ trong mảng semesters
        document.getElementById('editIndex').value = rowIndex - 1;

        // Vô hiệu hóa nút submit và kích hoạt nút sửa
        document.getElementById('submitButton').disabled = true;
        document.getElementById('editButton').disabled = false;
    }
});

// Thêm sự kiện click cho nút sửa
document.getElementById('editButton').addEventListener('click', function () {
    // Lấy giá trị từ input "year" và "semester"
    var yearValue = document.getElementById('year').value;
    var semesterValue = document.getElementById('semester').value;

    // Lấy index của học kì cần sửa trong mảng semesters
    var index = parseInt(document.getElementById('editIndex').value);

    // Kiểm tra xem index có hợp lệ không
    if (!isNaN(index) && index >= 0 && index < semesters.length) {
        // Cập nhật dữ liệu của học kì trong mảng semesters
        semesters[index].year = parseInt(yearValue);
        semesters[index].semesterNumber = parseInt(semesterValue);

        // Gọi lại hàm displayHocKi() để cập nhật dữ liệu trên bảng
        displayHocKi();

        // Reset form sau khi đã sửa dữ liệu
        document.getElementById('editIndex').value = ''; // Xóa giá trị index
        document.getElementById('editButton').disabled = true; // Vô hiệu hóa nút sửa
        document.getElementById('submitButton').disabled = false; // Kích hoạt nút submit
    }
});

// Bắt sự kiện submit của form
document.querySelector('form').addEventListener('submit', function (event) {
    // Ngăn chặn việc gửi form đi, để không load lại trang
    event.preventDefault();

    // Lấy giá trị từ input "year" và "semester"
    var yearValue = document.getElementById('year').value;
    var semesterValue = document.getElementById('semester').value;

    // Tạo một object mới đại diện cho học kì mới
    var newSemester = {
        id: generateUUID(), // Tạo id mới
        year: parseInt(yearValue), // Chuyển giá trị sang số nguyên
        semesterNumber: parseInt(semesterValue) // Chuyển giá trị sang số nguyên
    };

    // Thêm học kì mới vào mảng semesters
    semesters.push(newSemester);

    // Gọi lại hàm displayHocKi() để cập nhật dữ liệu trên bảng
    displayHocKi();

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

var semesters = [
    { "_id": "dd2e5d9a-74c7-4232-9d56-ee253821241d", "year": 2024, "semesterNumber": 1, "_class": "edu.iuh.administratorservice.entity.Semester" },
    { "_id": "0dde8bd9-ed74-4f19-b70b-29b73a969ec6", "year": 2024, "semesterNumber": 2, "_class": "edu.iuh.administratorservice.entity.Semester" },
    { "_id": "15ab6081-0ff8-425f-aa55-2e206048e4a1", "year": 2024, "semesterNumber": 3, "_class": "edu.iuh.administratorservice.entity.Semester" }
    // Thêm dữ liệu môn học bắt buộc khác nếu cần
];

function displayHocKi() {
    var tbody = document.getElementById('semesterTable');
    tbody.innerHTML = ''; // Xóa hết dữ liệu cũ trong tbody

    let stt = 0;
    semesters.forEach(function (semester) {
        stt++;
        var row = document.createElement("tr");
        row.innerHTML = "<td>" + stt + "</td>" +
            "<td>" + semester.semesterNumber + "</td>" +
            "<td>" + semester.year + "</td>";

        tbody.appendChild(row);
    });
}

// Gọi hàm để hiển thị dữ liệu ban đầu
displayHocKi();
