function getCurrentDate() {
    // Tạo một đối tượng ngày mới
    let today = new Date();
    
    // Lấy ngày hiện tại trong tuần (0 là Chủ nhật, 1 là Thứ hai, ..., 6 là Thứ bảy)
    let currentDayOfWeek = today.getDay(); 
    
    // Tính toán sự chênh lệch giữa ngày hiện tại và ngày thứ hai của tuần này
    let daysToMonday = 1 - currentDayOfWeek; // 1 để lấy ngày thứ hai
    
    // Nếu ngày hiện tại là chủ nhật, chúng ta cần lấy ngày thứ hai của tuần tiếp theo
    if (currentDayOfWeek === 0) {
        daysToMonday = -5;
    } else if (currentDayOfWeek < 0) {
        // Nếu ngày hiện tại là thứ hai, chúng ta cần lấy ngày thứ hai của tuần này
        daysToMonday = 1 + currentDayOfWeek;
    }
    
    // Tạo một đối tượng Date mới cho ngày thứ hai của tuần này
    let monday = new Date(today);
    monday.setDate(today.getDate() + daysToMonday);

    // Trả về ngày đã được định dạng
    monday.setDate(today.getDate() + daysToMonday)
    // Lấy các thành phần của ngày thứ hai
    let day = monday.getDate();
    let month = monday.getMonth() + 1; // Lưu ý: Tháng bắt đầu từ 0
    let year = monday.getFullYear();
    
    // // Hiển thị ngày thứ hai trong định dạng dd-mm-yyyy
    // var formattedDate = day + '-' + month + '-' + year;
    return year + '-' + month + '-' + day;
}

function getDate(date) {
    // Tạo một đối tượng ngày mới
    let today = new Date(date);
    
    // Lấy ngày hiện tại trong tuần (0 là Chủ nhật, 1 là Thứ hai, ..., 6 là Thứ bảy)
    let currentDayOfWeek = today.getDay(); 
    
    // Tính toán sự chênh lệch giữa ngày hiện tại và ngày thứ hai của tuần này
    let daysToMonday = 1 - currentDayOfWeek; // 1 để lấy ngày thứ hai
    
    // Nếu ngày hiện tại là chủ nhật, chúng ta cần lấy ngày thứ hai của tuần tiếp theo
    if (currentDayOfWeek === 0) {
        daysToMonday = -5;
    } else if (currentDayOfWeek < 0) {
        // Nếu ngày hiện tại là thứ hai, chúng ta cần lấy ngày thứ hai của tuần này
        daysToMonday = 1 + currentDayOfWeek;
    }
    
    // Tạo một đối tượng Date mới cho ngày thứ hai của tuần này
    let monday = new Date(today);
    monday.setDate(today.getDate() + daysToMonday);

    // Trả về ngày đã được định dạng
    monday.setDate(today.getDate() + daysToMonday)
    // Lấy các thành phần của ngày thứ hai
    let day = monday.getDate();
    let month = monday.getMonth() + 1; // Lưu ý: Tháng bắt đầu từ 0
    let year = monday.getFullYear();
    
    // // Hiển thị ngày thứ hai trong định dạng dd-mm-yyyy
    // var formattedDate = day + '-' + month + '-' + year;
    return year + '-' + month + '-' + day;
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('nameUser').innerHTML = localStorage.getItem("name");
    setDay(getCurrentDate());

    document.getElementById('dateInput').addEventListener('change', function() {
        const selectedDate = this.value;
        handleSetDay(selectedDate);
    });
}); 

function handleButtonToday() {
    clearData();
    setDay(getCurrentDate());
}



function handleSetDay(date) {
    console.log('Selected date:', date);
    clearData();
    setDay(getDate(date));
    // Thực hiện các hành động cần thiết với giá trị date
}


function handleButtonPrevious () {
    clearData();
    let dateString = document.getElementById("lichtheotuan-mon").innerText;
    let curDate = new Date(dateString);
    let newDate = new Date(curDate);
    newDate.setDate(curDate.getDate() - 7); // Trừ đi 7 ngày để lùi về thời điểm trước đó
    setDay(newDate);
}

function handleButtonNext () {
    clearData();
    let dateString = document.getElementById("lichtheotuan-mon").innerText;
    let curDate = new Date(dateString);
    let newDate = new Date(curDate);
    newDate.setDate(curDate.getDate() + 7); // Cộng thêm 7 ngày để tiến về thời điểm sau đó
    setDay(newDate);
}

function clearData() {
    document.getElementById("sang-mon").innerHTML="";
    document.getElementById("sang-tue").innerHTML="";
    document.getElementById("sang-wed").innerHTML="";
    document.getElementById("sang-thu").innerHTML="";
    document.getElementById("sang-fri").innerHTML="";
    document.getElementById("sang-sat").innerHTML="";
    document.getElementById("sang-sun").innerHTML="";

    document.getElementById("chieu-mon").innerHTML="";
    document.getElementById("chieu-tue").innerHTML="";
    document.getElementById("chieu-wed").innerHTML="";
    document.getElementById("chieu-thu").innerHTML="";
    document.getElementById("chieu-fri").innerHTML="";
    document.getElementById("chieu-sat").innerHTML="";
    document.getElementById("chieu-sun").innerHTML="";

    document.getElementById("toi-mon").innerHTML="";
    document.getElementById("toi-tue").innerHTML="";
    document.getElementById("toi-wed").innerHTML="";
    document.getElementById("toi-thu").innerHTML="";
    document.getElementById("toi-fri").innerHTML="";
    document.getElementById("toi-sat").innerHTML="";
    document.getElementById("toi-sun").innerHTML="";

}



function setDay(date) {
    let curDate = new Date(date);
    

    let newDate = new Date(curDate);
    let day = newDate.getDate() < 10 ? "0" + newDate.getDate() : newDate.getDate();
    let month = newDate.getMonth() + 1 < 10 ? "0" + (newDate.getMonth() + 1) : newDate.getMonth() + 1; 
    let year = newDate.getFullYear();
    document.getElementById("lichtheotuan-mon").innerHTML = year + '-' + month + '-' + day ;
    let mon = year + '-' + month + '-' + day;
    // fetchDate(year + '-' + month + '-' + day);

    newDate.setDate(curDate.getDate() + 1);
    curDate.setDate(newDate.getDate());
    day = newDate.getDate() < 10 ? "0" + newDate.getDate() : newDate.getDate();
    month = newDate.getMonth() + 1 < 10 ? "0" + (newDate.getMonth() + 1) : newDate.getMonth() + 1; 
    year = newDate.getFullYear();
    document.getElementById("lichtheotuan-tue").innerHTML = year + '-' + month + '-' + day ;
    // fetchDate(year + '-' + month + '-' + day);

    newDate.setDate(curDate.getDate() + 1);
    curDate.setDate(newDate.getDate());
    day = newDate.getDate() < 10 ? "0" + newDate.getDate() : newDate.getDate();
    month = newDate.getMonth() + 1 < 10 ? "0" + (newDate.getMonth() + 1) : newDate.getMonth() + 1; 
    year = newDate.getFullYear();
    document.getElementById("lichtheotuan-wed").innerHTML = year + '-' + month + '-' + day ;
    // fetchDate(year + '-' + month + '-' + day);

    newDate.setDate(curDate.getDate() + 1);
    curDate.setDate(newDate.getDate());
    day = newDate.getDate() < 10 ? "0" + newDate.getDate() : newDate.getDate();
    month = newDate.getMonth() + 1 < 10 ? "0" + (newDate.getMonth() + 1) : newDate.getMonth() + 1; 
    year = newDate.getFullYear();
    document.getElementById("lichtheotuan-thu").innerHTML = year + '-' + month + '-' + day ;
    // fetchDate(year + '-' + month + '-' + day);

    newDate.setDate(curDate.getDate() + 1);
    curDate.setDate(newDate.getDate());
    day = newDate.getDate() < 10 ? "0" + newDate.getDate() : newDate.getDate();
    month = newDate.getMonth() + 1 < 10 ? "0" + (newDate.getMonth() + 1) : newDate.getMonth() + 1; 
    year = newDate.getFullYear();
    document.getElementById("lichtheotuan-fri").innerHTML = year + '-' + month + '-' + day ;
    // fetchDate(year + '-' + month + '-' + day);

    newDate.setDate(curDate.getDate() + 1);
    curDate.setDate(newDate.getDate());
    day = newDate.getDate() < 10 ? "0" + newDate.getDate() : newDate.getDate();
    month = newDate.getMonth() + 1 < 10 ? "0" + (newDate.getMonth() + 1) : newDate.getMonth() + 1; 
    year = newDate.getFullYear();
    document.getElementById("lichtheotuan-sat").innerHTML = year + '-' + month + '-' + day ;
    // fetchDate(year + '-' + month + '-' + day);

    newDate.setDate(curDate.getDate() + 1);
    curDate.setDate(newDate.getDate());
    day = newDate.getDate() < 10 ? "0" + newDate.getDate() : newDate.getDate();
    month = newDate.getMonth() + 1 < 10 ? "0" + (newDate.getMonth() + 1) : newDate.getMonth() + 1; 
    year = newDate.getFullYear();
    document.getElementById("lichtheotuan-sun").innerHTML = year + '-' + month + '-' + day ;
    let sun = year + '-' + month + '-' + day;
    fetchDate(mon, sun);
}

function fetchDate(start, end) {
    
    const url = 'http://localhost:8080/api/v1/timetable/search-by-student-id';

    const data = { 
        "studentID": localStorage.getItem("studentID"),
        "start":start,
        "end":end
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
        return response.text();
    })
    .then(data => {
        // console.log('Response:', data);
        let temp = "";
        json = JSON.parse(data);
        if (json) {
            json.map((lich) => {
                console.log(lich);
                //kiem tra buoi hoc
                if (lich.classHour=="HOUR_1_TO_3" || lich.classHour=="HOUR_4_TO_6") {
                    temp += "sang-";
                } else if (lich.classHour=="HOUR_7_TO_9" || lich.classHour=="HOUR_10_TO_12") {
                    temp += "chieu-";
                } else if (lich.classHour=="HOUR_13_TO_15") {
                    temp += "toi-";
                }

                //kiem tra thu
                let date = new Date(lich.date);

                switch (date.getDay()) {
                    case 0:
                        temp+="sun";
                        break;
                    case 1:
                        temp+="mon";
                        break;
                    case 2:
                        temp+="tue";
                        break;
                    case 3:
                        temp+="wed";
                        break;
                    case 4:
                        temp+="thu";
                        break;
                    case 5:
                        temp+="fri";
                        break;
                    case 6:
                        temp+="sat";
                        break;
                    default:
                        break;
                }

                // console.log(temp);
                // <p>Course ID: ${lich.courseID}</p>
                document.getElementById(temp).innerHTML = `
                <div class="d-inline-block border px-2 changeType" style="width: 120px; background-color: #fdff9a">
                    <b >${lich.subjectName}</b>
                    <p style='padding-top: 10px;  margin-bottom: 0px;'>Tiết: ${getDayOfWeek(lich.classHour)}</p>
                    <p style='margin-bottom: 0px;'>Phòng: ${lich.classRoom}</p>
                    <p style='margin-bottom: 0px;'>GV: ${lich.staffName}</p>  
                    <p></p>
                </div>
                `;




                temp = "";
            })
        }
        
    })
    .catch(error => {
        console.error('There was a problem with the request:', error);
    });
}

function getDayOfWeek(timeRangeString) {

    switch (timeRangeString) {
        case "HOUR_1_TO_3":
            startTime = "1";
            endTime = "3";
            break;
        case "HOUR_4_TO_6":
            startTime = "4";
            endTime = "6";
            break;
        case "HOUR_7_TO_9":
            startTime = "7";
            endTime = "9";
            break;
        case "HOUR_10_TO_12":
            startTime = "10";
            endTime = "12";
            break;
        default:   
            startTime = "10";
            endTime = "12";
    }
    return `${startTime}-${endTime}`;
}