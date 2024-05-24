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
    // showInfoToast('Đang xử lý tạo khoa...');
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
            // showErrorToast('Network response was not ok')
        }
        return response.json();
    })
    .then(data => {
        
        fetchDepartmentAll()
            .then(() => {
                displaykhoaData();
            });
        showSuccessToast("Tạo khoa thành công")
    })
    .catch(error => {
        console.error('There was a problem with the request:', error);
        showErrorToast('Đã xảy ra lỗi khi tạo khoa')
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