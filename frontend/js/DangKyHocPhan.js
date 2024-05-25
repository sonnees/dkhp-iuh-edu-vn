function fetchCourseAll(semester) {
    const url = 'http://localhost:8080/api/v1/semester/search-by-year?year=2024';

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        json = JSON.parse(data);
        // console.log(json);
        switch (semester) {
            case "semester1":
                clearTable();
                localStorage.setItem("semes", json[0].id);
                fetchCourse(localStorage.getItem("semes"));
                
                break;
            case "semester2":
                clearTable();
                localStorage.setItem("semes", json[1].id);
                fetchCourse(localStorage.getItem("semes"));
                
                break;
            case "semester3":
                clearTable();
                localStorage.setItem("semes", json[2].id);
                fetchCourse(localStorage.getItem("semes"));
                break;
            default:
                break;
        }
    })
    .catch(error => {
        console.error('There was a problem with the request:', error);
    });
}


document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById('nameUser').innerHTML = localStorage.getItem("name");

    const semester = document.getElementById('semester');
    semester.value = localStorage.getItem("semester");
    notify()
    fetchCourseAll(localStorage.getItem("semester"));

    semester.addEventListener('change', (event) => {
        const selectedSemester = event.target.value;
        console.log(selectedSemester);
        // console.log('Học kỳ đã chọn:', selectedSemester);
        // localStorage.setItem("semes", selectedSemester);
        localStorage.setItem("semester", selectedSemester);
        fetchCourseAll(selectedSemester);
    });

    const nhom = document.getElementById('NHOM');
    nhom.addEventListener('change', (event) => {
        const selectedNhom = event.target.value;
        let table = document.querySelector('#detailTable tbody');
        const allRows = table.querySelectorAll('tr');
        allRows.forEach(row => {
            row.classList.remove('table-active');
            // console.log(row);
        });

        allRows.forEach((row, index) => {
            if(index==0) {
                row.classList.add('table-active');
            }
            if (index==Number(selectedNhom)) {
                row.classList.add('table-active');
            }
        });


        
    });


});

const fetchDetailCourse = async (id, name) => {
    const url = 'http://localhost:8080/api/v1/detail_course/search-by-course-id?courseID='+id;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(async (data) => {
        json = JSON.parse(data);

        console.log(json);
        const tableBody = document.querySelector('#detailTable tbody');
        tableBody.innerHTML=""
        json.forEach((data, index) => {

            const row = document.createElement('tr');

            let date = formatDateRange(data.calender.start, data.calender.end);

            row.innerHTML = `
                <td id="idmh" style='display: none;'>${data.id}</td>

                <td class='size_min center-content'>${index+1}</td>
                <td class='size_midi1'>${getDayOfWeek(data.calender.start, data.calender.classHour)}</td>
                <td class='size_midi center-content'>${index == 0 ? "" : index}</td>
                <td class='center-content'>${data.calender.classRoom}</td>
                <td title ='${data.staff.fullName}'>${data.staff.fullName}</td>
                <td title= '${date}' class='center-content'>${date}</td>
            `;

            row.addEventListener('click', (event) => {
                const clickedRow = event.target.closest('tr');
                // Loại bỏ lớp 'table-active' từ tất cả các hàng trong bảng
                const allRows = tableBody.querySelectorAll('tr');
                allRows.forEach(row => {
                    row.classList.remove('table-active');
                });

                document.getElementById('NHOM').value=data.groupNumber

                allRows[0].classList.add('table-active');
                // Thêm lớp 'table-active' cho hàng được click
                row.classList.add('table-active');

            });
            tableBody.appendChild(row);
            
        });

    });
}

var stc = 0;

const fetchCourse = async (semesterID) =>  {
    const url = 'http://localhost:8080/api/v1/course/search-by-semester-id?semesterID='+semesterID;

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(async (data) => {
        json = JSON.parse(data);

        console.log(json);

        const ids = await fetchCourseIDs(localStorage.getItem("studentID"));
        console.log(ids);

        const dataHp = ids.semesters;
        
        dataHp.forEach((data) => {
            // console.log(data);
            if (data.id==semesterID) {
                data.subjects.forEach((sub) => {
                    stc += sub.creditUnits;
                    // console.log(sub);
                    console.log(stc);
                })
            }
        })

        

        const tableBody = document.querySelector('#subjectTable tbody');
        let listSubj = [];
        let listSubjED = [];
        listSubj = listArray(dataHp, semesterID);
        listSubjED = listArrayED(dataHp, semesterID);

        


        let count = 0;
        json.forEach((data, index) => {
            const url = 'http://localhost:8080/api/v1/detail_course/search-by-course-id?courseID=' + data.id;
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                },
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(async (courses) => {
                courses = JSON.parse(courses);
                let siSo = getSiSo(courses);
                
                if (ids.subjectIDs.includes(data.subject.id) && !listSubj.includes(data.subject.id)) {
                    let subject = data.subject;
                    const row = document.createElement('tr');
                    count += 1;
                    let status = changeStatus(data.status);
                    row.innerHTML = `
                    <td class='size_min center-content'>${count}</td>
                    <td title='${data.id}'>${data.id}</td>
                    <td class='size_full' >${subject.name}</td>
                    <td class='size_midi center-content'>${subject.creditUnits}</td>
                    <td class='size_midi center-content'>${siSo}</td>
                    <td title='${subject.prerequisites != null ? JSON.stringify(subject.prerequisites) : ""}'>${subject.prerequisites != null ? JSON.stringify(subject.prerequisites) : ""}</td>
                    <td class='size_midi' title=${status}>${status}</td>
                `;

                    row.addEventListener('click', (event) => {
                        // const clickedRow = event.target.closest('tr');
                        // Loại bỏ lớp 'table-active' từ tất cả các hàng trong bảng
                        const allRows = tableBody.querySelectorAll('tr');
                        allRows.forEach(row => {
                            row.classList.remove('table-active');
                        });
                        
                        if ( data.status == "WAITING_FOR_STUDENT_REGISTRATION") {
                            let check = true;
                            // if  (true) {
                            //     fetchDetailCourse(data.id, subject.name)
                            // }
                            // listSubjED
                            
                            if (subject.prerequisites != null) {
                                subject.prerequisites.forEach((data) => {
                                    if (!listSubjED.includes(data)) {
                                        check = false;
                                        showWarnToast(`Môn tiên quyết ${data} chưa được đáp ứng!`);
                                        const tableBody = document.querySelector('#detailTable tbody');
                                        tableBody.innerHTML=""
                                    }
                                })
                            }

                            if  (check) {
                                fetchDetailCourse(data.id, subject.name)
                            } else {
                                // showInfoToast('Môn tiên quyết chưa được đáp ứng!');
                                // const tableBody = document.querySelector('#detailTable tbody');
                                // tableBody.innerHTML=""
                            }
                            

                        } else {
                            showInfoToast('Môn học không thể đăng ký!');
                            const tableBody = document.querySelector('#detailTable tbody');
                            tableBody.innerHTML=""
                        }

                        // Thêm lớp 'table-active' cho hàng được click
                        document.getElementById('NHOM').value = "0"
                        row.classList.add('table-active');

                    });
                    tableBody.appendChild(row);
                } 
            })

            
        });


        const hptableBody = document.querySelector('#hpTable tbody');
        hptableBody.innerHTML=""
        dataHp.forEach((data, index) => {
        
            if (data.id==semesterID) {
                let subjects = data.subjects;

                // console.log(data);

                subjects.forEach((subject, index) => {
                    let url = 'http://localhost:8080/api/v1/registration-form/search?id=' + subject.registrationFormID;
                    fetch(url, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem("token")
                        },
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.text();
                        })
                        .then(async (registrationForm) => {
                            registrationForm = JSON.parse(registrationForm);

                            let status = changeStatus(registrationForm.course.status) 
                            let money = formatCurrency(registrationForm.course.tuitionFee);
                            const row = document.createElement('tr');

                            if (registrationForm.course.status=='WAITING_FOR_STUDENT_REGISTRATION') {
                                row.innerHTML = `
                                <td>${subject.registrationFormID}</td>
                                <td class='size_full'>${subject.name}</td>
                                <td class='size_midi center-content'>${subject.creditUnits}</td>
                                <td class='size_midi'>${money}</td>
                                <td title='${status}' class='size_midi'>${status}</td>
                                <td>
                                    <button type="button" onclick="deletaHP('${subject.id}', '${subject.registrationFormID}')" class="btn btn-danger" style='font-size: 13px'>Hủy</button>
                                </td>
                                `;
                            } else {
                                row.innerHTML = `
                                <td>${subject.registrationFormID}</td>
                                <td class='size_full'>${subject.name}</td>
                                <td class='size_midi center-content'>${subject.creditUnits}</td>
                                <td class='size_midi'>${money}</td>
                                <td title='${status}' class='size_midi'>${status}</td>
                                <td>
                                    
                                </td>
                                `;
                            }

                            

                            row.addEventListener('click', (event) => {
                                // const clickedRow = event.target.closest('tr');
                                // Loại bỏ lớp 'table-active' từ tất cả các hàng trong bảng
                                const allRows = hptableBody.querySelectorAll('tr');
                                allRows.forEach(row => {
                                    row.classList.remove('table-active');
                                });
                                document.getElementById('NHOM').value = "0"

                                // Thêm lớp 'table-active' cho hàng được click
                                row.classList.add('table-active');

                            });
                            hptableBody.appendChild(row);
                        });
                }) 
            } 
        });


    })
    .catch(error => {
        console.error('There was a problem with the request:', error);
    });
}



function clearTable() {
    const tbody = document.querySelector('#subjectTable tbody');
    tbody.innerHTML = '';
}

function listArray(array, semesterID)  {
    let list = []
    array.forEach((data) => {
        if (data.id) {
            
            data.subjects.forEach((data) => {
                list.push(data.id)

            })
            // console.log(list);
            return list;
        }
        return list;
    })
    return list;
}

function listArrayED(array, semesterID)  {
    let list = []
    array.forEach((data) => {
        if (data.id!=semesterID) {
            
            data.subjects.forEach((data) => {
                list.push(data.id)

            })
            // console.log(list);
            return list;
        }
        return list;
    })
    return list;
}



const fetchCourseIDs = async (studentID) => {
    const url = 'http://localhost:8080/api/v1/student-2/search-by-student-id?studentID='+studentID;

    try {

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
        });
    
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.text();
        console.log(JSON.parse(data));
        return JSON.parse(data);
    
        
    } catch(error) {
        console.error('There was a problem with the request:', error);
    };

}


function submitDKMH() {
    if (stc > 28) {
        showWarnToast("Số tín chỉ đã đăng ký không quá 30");
        return;
    }
    
    let nhom = Number(document.getElementById('NHOM').value);

    let groups = [];
    let table = document.querySelector('#detailTable tbody');
    const allRows = table.querySelectorAll('tr');

    console.log(allRows.length);




    allRows.forEach((row, index) => {
        if (row.classList.contains('table-active')) {
            // console.log(row);
            let idmh = row.querySelector("#idmh").textContent;
            // console.log(idmh);
            groups.push(idmh);
        }
        
    });

    if (allRows.length!=1) {
        if (groups.length==0) {
            showWarnToast('Chưa chọn môn hoặc nhóm thực hành!');
            return;
        } else if (groups.length==1) {
            showWarnToast('Chưa chọn nhóm thực hành!');
            return;
        } 
    } else if (allRows.length==1) {
        if (groups.length==0) {
            showWarnToast('Xin mời bạn chọn lớp học phần!');
            return;
        }
    }

    console.log(groups);

    


    let data = {
        // "gmail":"hieudong.dongthanh.02@gmail.com",
        "gmail":localStorage.getItem("email"),
        "studentID":localStorage.getItem("studentID"),
        "detailCourseIDs":groups,
        "groupNumber":nhom
    }

    console.log(JSON.stringify(data));

    const url = 'http://localhost:8080/api/v1/registration-form/create';
    showInfoToast('Đang xử lý thao tác đăng ký học phần...');
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.status==409) {
            showErrorToast('Lớp đã đủ số lượng người đăng ký');
            return;
        }
        if (response.status==404) {
            showWarnToast('Chưa chọn nhóm thực hành')
            return;
        }
        if (response.status!=200) {
            showErrorToast('Network response was not ok');
            return;
        }
        localStorage.setItem("notify", "create_dkhp_ss");
        window.location.href = "DangKyHocPhan.html";
        return ;
    })
    
}

const deletaHP = (subjID, formID) => {
    let semester = localStorage.getItem("semes");

    let data = {
        "id":localStorage.getItem("studentID"),
        "semesterID":semester,
        "subjectID":subjID,
        "registrationFormID":formID
    }

    console.log(JSON.stringify(data));

    const url = 'http://localhost:8080/api/v1/registration-form/delete';
    showInfoToast('Đang xử lý thao tác hủy đơn đăng ký học phần...');
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (response.status==409) {
            showErrorToast('Hủy học phần không thành công');
            return;
        }
        if (response.status==400) {
            showErrorToast('Hủy học phần không thành công');
            return;
        }
        if (response.status!=200) {
            showErrorToast('Network response was not ok');
            return;
        }
        localStorage.setItem("notify", "delete_dkhp_ss");
        window.location.href = "DangKyHocPhan.html";
        return ;
    })
}

function changeStatus(str) {
    //  PREPARING, 
    //  WAITING_FOR_STUDENT_REGISTRATION, 
    //  ACCEPTANCE_TO_OPEN, 
    //  COURSE_CANCELLED 
    switch (str) {
        case "PREPARING":
            return "Chuẩn bị";
        case "WAITING_FOR_STUDENT_REGISTRATION":
            return "Chờ đăng ký";
        case "ACCEPTANCE_TO_OPEN":
            return "Chấp nhận mở";
        case "COURSE_CANCELLED":
            return "Hủy";
        default:
            "";
    }
}

function getSiSo(courses) {
    classSize = courses[0].classSize;
    classSizeAvailable = parseInt(courses[0].classSize) - parseInt(courses[0].classSizeAvailable);

    return classSizeAvailable +"/"+classSize;
}


function getDayOfWeek(timestamp, timeRangeString) {
    const daysOfWeek = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const date = new Date(timestamp);
    const dayIndex = date.getDay();
    const dayName = daysOfWeek[dayIndex];

    startTime = "";
    endTime = "";
    switch (timeRangeString) {
        case "HOUR_1_TO_3":
            startTime = "T1";
            endTime = "T3";
            break;
        case "HOUR_4_TO_6":
            startTime = "T4";
            endTime = "T6";
            break;
        case "HOUR_7_TO_9":
            startTime = "T7";
            endTime = "T9";
            break;
        case "HOUR_10_TO_12":
            startTime = "T10";
            endTime = "T12";
            break;
        default:   
            startTime = "T10";
            endTime = "T12";
    }
    return `${dayName} (${startTime}-${endTime})`;
}

function formatDateRange(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Lưu ý: tháng trong JavaScript bắt đầu từ 0
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };

    const startDateFormatted = formatDate(startDate);
    const endDateFormatted = formatDate(endDate);

    return `${startDateFormatted} - ${endDateFormatted}`;
}

function formatCurrency(value) {
    const valueNum = parseInt(value, 10); // Chuyển đổi chuỗi thành số nguyên

    if (isNaN(valueNum)) {
        return "Giá trị đầu vào không hợp lệ";
    }

    const formatter = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
    });

    return formatter.format(valueNum);
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


function thing() {
    if(localStorage.getItem("semester") == null) {
        localStorage.setItem("semester", "semester");
    } 
}
thing()
function notify() {
    if (localStorage.getItem("notify") != null) {
        switch (localStorage.getItem("notify")) {
            case "create_dkhp_ss":
                showSuccessToast("Đăng ký học phần thành công! Kiểm tra gmail của bạn để nhận thông báo đóng học phí!");
                break;
            case "delete_dkhp_ss":
                showSuccessToast("Hủy Đơn đăng ký học phần thành công!");
                break;
            default:
                break;
        }
        localStorage.removeItem("notify");
    }
}