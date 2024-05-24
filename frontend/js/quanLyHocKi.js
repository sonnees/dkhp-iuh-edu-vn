var semesters = []; // Khởi tạo mảng semesters trống ban đầu
document.getElementById('semesterTable').addEventListener('click', function(event) {
    var target = event.target;
    if (target.tagName.toLowerCase() === 'td') {
        var row = target.parentElement; 
        var yearInput = document.getElementById('year');
        var semesterInput = document.getElementById('semester');
        yearInput.value = row.cells[2].innerText; // Cột năm
        semesterInput.value = row.cells[1].innerText; // Cột kì
        document.getElementById('submitButton').disabled = true;
    }
});

// Bắt sự kiện submit của form
document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();

    var yearValue = document.getElementById('year').value;
    var semesterValue = document.getElementById('semester').value;

    // Thêm học kì mới
    createSemester(yearValue, semesterValue)
    this.reset();
});

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
            "<td>" + semester.year + "</td>";
        tbody.appendChild(row);
    });
}// Gọi hàm để hiển thị dữ liệu ban đầu
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
        // return response.json();
    })
    .then(data => {
        var selectedYear = document.getElementById('selectYear').value; // Lấy giá trị năm được chọn mặc định
        fetchSemestersByYear(selectedYear);
        showSuccessToast("Tạo học kì mới thành công")
    })
    .catch(error => {
        console.error('There was a problem with the request:', error);
        showErrorToast('Đã xảy ra lỗi khi tạo học kì mới')
    });
}
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