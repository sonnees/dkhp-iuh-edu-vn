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
                fetchCourse(json[0].id);
                localStorage.setItem("semes", json[0].id);
                break;
            case "semester2":
                clearTable();
                fetchCourse(json[1].id);
                localStorage.setItem("semes", json[1].id);
                break;
            case "semester3":
                clearTable();
                fetchCourse(json[2].id);
                localStorage.setItem("semes", json[2].id);
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
    const semester = document.getElementById('semester');
    fetchCourseAll(semester.value);
    semester.addEventListener('change', (event) => {
        const selectedSemester = event.target.value;
        console.log(selectedSemester);
        // console.log('Học kỳ đã chọn:', selectedSemester);
        // localStorage.setItem("semes", selectedSemester);
        fetchCourseAll(selectedSemester);
        // Bạn có thể thực hiện các hành động khác ở đây
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
            row.innerHTML = `
                <td>${index+1}</td>
                <td id="idmh">${data.id}</td>
                <td>${name}</td>
                <td>${data.classSize}</td>
                <td>${data.classSize-data.classSizeAvailable}</td>
                <td></td>
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
        listSubj = listArray(dataHp, semesterID);
        // console.log(listSubj);
        let count = 0;
        json.forEach((data, index) => {
            
            if (ids.subjectIDs.includes(data.subject.id) && !listSubj.includes(data.subject.id)) {
                let subject = data.subject;
                const row = document.createElement('tr');
                count+=1;
                // <td>${data.status}</td>
                row.innerHTML = `
                    <td>${count}</td>
                    <td>${data.id}</td>
                    <td>${subject.id}</td>
                    <td>${subject.name}</td>
                    <td>${subject.creditUnits}</td>
                    <td>${subject.prerequisites!=null?JSON.stringify(subject.prerequisites):""}</td>
                    <td></td>
                `;

                row.addEventListener('click', (event) => {
                    // const clickedRow = event.target.closest('tr');
                    // Loại bỏ lớp 'table-active' từ tất cả các hàng trong bảng
                    const allRows = tableBody.querySelectorAll('tr');
                    allRows.forEach(row => {
                        row.classList.remove('table-active');
                    });

                    fetchDetailCourse(data.id, subject.name)

                    // Thêm lớp 'table-active' cho hàng được click
                    document.getElementById('NHOM').value="0"
                    row.classList.add('table-active');

                });
                tableBody.appendChild(row);
            } 
        });


        const hptableBody = document.querySelector('#hpTable tbody');
        hptableBody.innerHTML=""
        dataHp.forEach((data, index) => {
        
            if (data.id==semesterID) {
                let subjects = data.subjects;

                // console.log(data);

                subjects.forEach((subject, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index+1}</td>
                        <td>${subject.id}</td>
                        <td>${subject.name}</td>
                        <td>${subject.creditUnits}</td>
                        <td></td>
                        <td></td>
                        <td>
                            <button type="button" onclick="deletaHP('${subject.id}', '${subject.registrationFormID}')" class="text-white rounded-2" style="background-color: #1da1f2;">Hủy</button>
                        </td>
                    `;

                    row.addEventListener('click', (event) => {
                        // const clickedRow = event.target.closest('tr');
                        // Loại bỏ lớp 'table-active' từ tất cả các hàng trong bảng
                        const allRows = hptableBody.querySelectorAll('tr');
                        allRows.forEach(row => {
                            row.classList.remove('table-active');
                        });
                        document.getElementById('NHOM').value="0"

                        // Thêm lớp 'table-active' cho hàng được click
                        row.classList.add('table-active');

                    });
                    hptableBody.appendChild(row);
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
        if (data.id==semesterID) {
            
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
        console.log(data);
        return JSON.parse(data);
    
        
    } catch(error) {
        console.error('There was a problem with the request:', error);
    };

}


function submitDKMH() {
    if (stc > 28) {
        alert("Số tín chỉ đã đăng ký không quá 30");
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
            alert('Chưa chọn môn hoặc nhóm thực hành!');
            return;
        }
    } else if (allRows.length==1) {
        if (groups.length==0) {
            alert('Chưa chọn lớp!');
            return;
        }
    }

    console.log(groups);

    


    let data = {
        "gmail":"hieudong.dongthanh.02@gmail.com",
        // "gmail":localStorage.getItem("email"),
        "studentID":localStorage.getItem("studentID"),
        "detailCourseIDs":groups,
        "groupNumber":nhom
    }

    console.log(JSON.stringify(data));

    const url = 'http://localhost:8080/api/v1/registration-form/create';
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
            alert('Đăng ký không thành công')
        }
        if (response.status==404) {
            alert('Chưa chọn nhóm thực hành')
        }
        if (response.status!=200) {
            throw new Error('Network response was not ok');  
        }
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
            alert('Hủy học phần không thành công')
        }
        if (response.status==400) {
            alert('Hủy học phần không thành công')
        }
        if (response.status!=200) {
            throw new Error('Network response was not ok');  
        }
        window.location.href = "DangKyHocPhan.html";
        return ;
    })
}