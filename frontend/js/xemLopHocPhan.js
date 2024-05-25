var semesters = [];
var allCourses = [];
var selectedCourseID = null;
var fileScore="D:\\Word_Space\\New folder\\dkhp-iuh-edu-vn\\backend\\data\\scoreBigData.xlsx"

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
        if (!Array.isArray(data)) {
            throw new Error('Data received is not an array');
        }

        semesters = data.map(item => {
            return {
                id: item.id,
                year: item.year,
                semesterNumber: item.semesterNumber,
            };
        });

        updateSemesterDropdown();
    })
    .catch(error => {
        console.error('Error fetching semesters:', error);
    });
}

function updateSemesterDropdown() {
    const semesterInput = document.getElementById('semesterInput');
    semesterInput.innerHTML = '';
    semesters.forEach(semester => {
        const option = document.createElement('option');
        option.value = semester.id;
        option.textContent = `Học kì ${semester.semesterNumber} - ${semester.year}`;
        semesterInput.appendChild(option);
    });
    if (semesters.length > 0) {
        fetchCoursesBySemesterId(semesters[0].id);
    }
}

function fetchCoursesBySemesterId(semesterID) {
    console.log('ID SEMESTER>>>>>>',semesterID);
    
    const url = `http://localhost:8080/api/v1/course/search-by-semester-id?semesterID=${semesterID}`;
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch courses');
        }
        return response.json();
    })
    .then(data => {
        console.log('data>>>>',data);
        
        allCourses = data; // Lưu tất cả các khóa học vào biến toàn cục
        updateCourseTable(allCourses);
    })
    .catch(error => {
        console.error('Error fetching courses:', error);
    });
}

function mapStatus(status) {
    switch (status) {
        case 'PREPARING':
            return 'Chuẩn bị mở';
        case 'WAITING_FOR_STUDENT_REGISTRATION':
            return 'Chờ sinh viên đăng kí';
        case 'REGISTRATION_DEADLINE_PASSED':
            return 'Hết thời hạn đăng kí';
        case 'ACCEPTANCE_TO_OPEN':
            return 'Chấp nhận mở lớp';
        case 'COURSE_CANCELLED':
            return 'Hủy lớp';
        default:
            return status;
    }
}

function updateCourseTable(courses) {
    const courseList = document.getElementById('courseList');
    courseList.innerHTML = '';
    courses.forEach((course, index) => {
        const row = document.createElement('tr');
        if (course.status==='COURSE_CANCELLED'){
            row.innerHTML = `
            <td>${index + 1}</td>
            <td>${course.subject.name}</td>
            <td>${course.subject.creditUnits}</td>
            <td>${course.tuitionFee}</td>
            <td>Học kì ${course.semester.semesterNumber} năm ${course.semester.year}</td>
            <td>${mapStatus(course.status)}</td>
            <td><button class="btn btn-primary" onclick="showCourseDetail('${course.id}')">Xem chi tiết</button></td>
        `;
        }
        else{
            row.innerHTML = `
            <td>${index + 1}</td>
            <td>${course.subject.name}</td>
            <td>${course.subject.creditUnits}</td>
            <td>${course.tuitionFee}</td>
            <td>Học kì ${course.semester.semesterNumber} năm ${course.semester.year}</td>
            <td>${mapStatus(course.status)}</td>
            <td><button class="btn btn-primary" onclick="showCourseDetail('${course.id}')">Xem chi tiết</button></td>
            <td><button class="btn btn-primary" onclick="openGradeModal('${course.id}','${course.subject.name}')">Nhập điểm</button></td>
            <td><button class="btn btn-primary" onclick="exportScore('${course.id}')">Xuất điểm</button></td>
        `;
        }
        
        
        courseList.appendChild(row);
    });
}

document.getElementById('selectYear').addEventListener('change', function() {
    var selectedYear = this.value;
    fetchSemestersByYear(selectedYear);
});

document.getElementById('semesterInput').addEventListener('change', function() {
    var selectedSemesterId = this.value;
    fetchCoursesBySemesterId(selectedSemesterId);
});

document.getElementById('searchInput').addEventListener('input', function() {
    var searchTerm = this.value.toLowerCase();
    var filteredCourses = allCourses.filter(course => 
        course.subject.name.toLowerCase().includes(searchTerm)
    );
    updateCourseTable(filteredCourses);
});

document.addEventListener('DOMContentLoaded', function() {
    var selectedYear = document.getElementById('selectYear').value;
    fetchSemestersByYear(selectedYear);
});

function openGradeModal(courseID, courseName) {
    selectedCourseID = courseID;
    $('#gradeModal').modal('show');
    document.getElementById('gradeModalLabel').textContent = `Nhập điểm cho ${courseName}`;
}


document.getElementById('fileInput').addEventListener('change', function(event) {
    var file = event.target.files[0];
    if (file && file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        var reader = new FileReader();
        reader.onload = function(e) {
            var data = new Uint8Array(e.target.result);
            var workbook = XLSX.read(data, {type: 'array'});
            var sheetName = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[sheetName];
            var json = XLSX.utils.sheet_to_json(worksheet, {header: 1});
            displayFileContent(json);
        };
        reader.readAsArrayBuffer(file);
    } else {
        // alert('Vui lòng chọn file xlsx');
        showErrorToast('Vui lòng chọn file xlsx')
    }
});

function displayFileContent(content) {
    var fileContentDiv = document.getElementById('fileContent');
    fileContentDiv.innerHTML = '';

    var table = document.createElement('table');
    table.className = 'table table-bordered';

    content.forEach((row, rowIndex) => {
        var tr = document.createElement('tr');
        row.forEach(cell => {
            var cellElement = rowIndex === 0 ? document.createElement('th') : document.createElement('td');
            cellElement.textContent = cell;
            tr.appendChild(cellElement);
        });
        table.appendChild(tr);
    });

    fileContentDiv.appendChild(table);
}
document.getElementById('confirmButton').addEventListener('click', function(event) {
    // console.log('HI>>>>>>>>>.',selectedCourseID);
    
    var selectedFile = document.getElementById('fileInput').files[0];
    if (!selectedFile) {
        // alert('Vui lòng chọn một file.');
        showErrorToast('Vui lòng chọn một file.')
        return;
    }
    if (!selectedCourseID) {
        // alert('Vui lòng chọn một lớp học phần.');
        showErrorToast('Vui lòng chọn một lớp học phần.')
        return;
    }
    $('#gradeModal').modal('hide');
    showInfoToast('Đang xử lý quá trình nhập điểm')
    fetch('http://localhost:8080/api/v1/course/update-score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        },
        body: JSON.stringify(
            { fileName: fileScore,
              courseID:selectedCourseID
             }
        )
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Không thể cập nhật điểm.');
        }
        // return response.json();
    })
    .then(data => {
        // alert('Nhập điểm thành công!');
        showSuccessToast('Nhập điểm thành công')
        // Thực hiện các hành động khác nếu cần
    })
    .catch(error => {
        console.error('Lỗi khi cập nhật điểm:', error);
    });
});

function showCourseDetail(courseID) {
    fetch(`http://localhost:8080/api/v1/detail_course/search-by-course-id?courseID=${courseID}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch course detail');
        }
        return response.json();
    })
    .then(data => {
        // Hiển thị thông tin chi tiết lớp học phần
        console.log(">>>>>>>>>>",data);
        displayCourseDetailModal(data);
    })
    .catch(error => {
        console.error('Error fetching course detail:', error);
    });
}

function displayCourseDetailModal(courseDetail) {
    const detailModalBody = document.getElementById('detailModalBody');
    detailModalBody.innerHTML = '';

    const table = document.createElement('table');
    table.className = 'table table-bordered';

    // Thêm tiêu đề cho bảng
    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    ['ID', 'Tên giảng viên', 'Tên nhóm', 'Số lượng', 'Đã đăng kí', 'Tiết', 'Phòng', 'Bắt đầu', 'Kết thúc'].forEach(headerText => {
        const header = document.createElement('th');
        header.textContent = headerText;
        headRow.appendChild(header);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    // Thêm dữ liệu cho từng phần tử của mảng courseDetail
    const tbody = document.createElement('tbody');
    courseDetail.forEach(course => {
        const row = document.createElement('tr');
        ['id', 'staff.fullName', 'groupNumber', 'classSize', 'classSizeAvailable', 'calender.classHour', 'calender.classRoom', 'calender.start', 'calender.end'].forEach(dataField => {
            const cell = document.createElement('td');
            let value = dataField.split('.').reduce((obj, key) => obj[key], course);
            // Chuyển đổi giá trị của giờ
            if (dataField === 'calender.classHour') {
                if (value === 'HOUR_1_TO_3') {
                    value = '1-3';
                } else if (value === 'HOUR_4_TO_6') {
                    value = '4-6';
                }else if (value === 'HOUR_7_TO_9') {
                    value = '7-9';
                }
                // Thêm các trường hợp khác tương tự ở đây
            }
            // Xử lý ngày giờ để hiển thị đúng định dạng
            if (dataField === 'calender.start' || dataField === 'calender.end') {
                value = new Date(value).toLocaleString();
            }
            cell.textContent = value;
            row.appendChild(cell);
        });
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    detailModalBody.appendChild(table);

    // Hiển thị modal
    $('#detailModal').modal('show');
}
document.getElementById('btnStatus').addEventListener('click', function() {
    var selectedSemester = document.getElementById('semesterInput');
    var selectedSemesterText = selectedSemester.options[selectedSemester.selectedIndex].text;
    var selectedStatus = document.getElementById('statusInput');
    var selectedStatusText = selectedStatus.options[selectedStatus.selectedIndex].text;

    var modalMessage = `Bạn có chắc muốn đổi các lớp học phần của ${selectedSemesterText} sang trạng thái ${selectedStatusText}?`;
    document.getElementById('statusModalMessage').textContent = modalMessage;

    $('#statusModal').modal('show');
});
document.getElementById('confirmStatusButton').addEventListener('click', function() {
    var selectedSemester = document.getElementById('semesterInput').value;
    var selectedStatus = document.getElementById('statusInput').value;
    $('#statusModal').modal('hide');
    showInfoToast('Đang xử lý quá trình đổi trạng thái')
    const url = `http://localhost:8080/api/v1/course/change-status-by-semester-id?semesterID=${selectedSemester}&status=${selectedStatus}`;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Không thể cập nhật trạng thái.');
        }
        // return response.json();
    })
    .then(data => {
        // alert('Đổi trạng thái thành công!');
       
        // Cập nhật lại danh sách các khóa học nếu cần
        showSuccessToast('Đổi trạng thái thành công')
        fetchCoursesBySemesterId(selectedSemester);
    })
    .catch(error => {
        $('#statusModal').modal('hide');
        showErrorToast('Đã có lỗi khi cập nhật trạng thái')
        console.error('Lỗi khi cập nhật trạng thái:', error);
    });
});
selectedCourseToChangeStatus=null
function openChangeStatus(courseID) {
    selectedCourseToChangeStatus = courseID;
    $('#changeStatusModal').modal('show');
}
let courseIdToExport = null;

function exportScore(courseID) {
    courseIdToExport = courseID;
    $('#exportScoreModal').modal('show');
}

document.getElementById('confirmExportScoreButton').addEventListener('click', function() {
    showInfoToast("Đang xử lý quá trình xuất bảng điểm")
    if (courseIdToExport) {
        const url = 'http://localhost:8080/api/v1/registration-form/gen-file-update-score';
        const body = {
            "courseID": courseIdToExport,
            "fileName": fileScore
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
            body: JSON.stringify(body)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Không thể xuất điểm.');
            }
            // return response.json();
        })
        .then(data => {
            // alert('Xuất điểm thành công!');
            $('#exportScoreModal').modal('hide');
            showSuccessToast('Xuất điểm thành công!')
        })
        .catch(error => {
            console.error('Lỗi khi xuất điểm:', error);
            // alert('Có lỗi xảy ra khi xuất điểm.');
            $('#exportScoreModal').modal('hide');
            showErrorToast('Đã có lỗi xảy ra trong quá trình xuất điểm')
        });
    }
});


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

