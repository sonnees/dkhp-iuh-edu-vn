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

document.addEventListener("DOMContentLoaded", function() {
    setDay(getCurrentDate());
}); 

function handleButtonPrevious () {
    let dateString = document.getElementById("lichtheotuan-mon").innerText;
    let curDate = new Date(dateString);
    let newDate = new Date(curDate);
    newDate.setDate(curDate.getDate() - 7); // Trừ đi 7 ngày để lùi về thời điểm trước đó
    setDay(newDate);
}

function handleButtonNext () {
    let dateString = document.getElementById("lichtheotuan-mon").innerText;
    let curDate = new Date(dateString);
    let newDate = new Date(curDate);
    newDate.setDate(curDate.getDate() + 7); // Cộng thêm 7 ngày để tiến về thời điểm sau đó
    setDay(newDate);
}



function setDay(date) {
    let curDate = new Date(date);
    fetchDate(date);

    let newDate = new Date(curDate);
    console.log(newDate);
    let day = newDate.getDate();
    let month = newDate.getMonth() + 1; // Lưu ý: Tháng bắt đầu từ 0
    let year = newDate.getFullYear();
    document.getElementById("lichtheotuan-mon").innerHTML = year + '-' + month + '-' + day ;

    newDate.setDate(curDate.getDate() + 1);
    curDate.setDate(newDate.getDate());
    console.log(newDate);
    day = newDate.getDate();
    month = newDate.getMonth() + 1; // Lưu ý: Tháng bắt đầu từ 0
    year = newDate.getFullYear();
    document.getElementById("lichtheotuan-tue").innerHTML = year + '-' + month + '-' + day ;

    newDate.setDate(curDate.getDate() + 1);
    curDate.setDate(newDate.getDate());
    console.log(newDate);
    day = newDate.getDate();
    month = newDate.getMonth() + 1; // Lưu ý: Tháng bắt đầu từ 0
    year = newDate.getFullYear();
    document.getElementById("lichtheotuan-wed").innerHTML = year + '-' + month + '-' + day ;

    newDate.setDate(curDate.getDate() + 1);
    curDate.setDate(newDate.getDate());
    console.log(newDate);
    day = newDate.getDate();
    month = newDate.getMonth() + 1; // Lưu ý: Tháng bắt đầu từ 0
    year = newDate.getFullYear();
    document.getElementById("lichtheotuan-thu").innerHTML = year + '-' + month + '-' + day ;

    newDate.setDate(curDate.getDate() + 1);
    curDate.setDate(newDate.getDate());
    console.log(newDate);
    day = newDate.getDate();
    month = newDate.getMonth() + 1; // Lưu ý: Tháng bắt đầu từ 0
    year = newDate.getFullYear();
    document.getElementById("lichtheotuan-fri").innerHTML = year + '-' + month + '-' + day ;

    newDate.setDate(curDate.getDate() + 1);
    curDate.setDate(newDate.getDate());
    console.log(newDate);
    day = newDate.getDate();
    month = newDate.getMonth() + 1; // Lưu ý: Tháng bắt đầu từ 0
    year = newDate.getFullYear();
    document.getElementById("lichtheotuan-sat").innerHTML = year + '-' + month + '-' + day ;

    newDate.setDate(curDate.getDate() + 1);
    curDate.setDate(newDate.getDate());
    console.log(newDate);
    day = newDate.getDate();
    month = newDate.getMonth() + 1; // Lưu ý: Tháng bắt đầu từ 0
    year = newDate.getFullYear();
    document.getElementById("lichtheotuan-sun").innerHTML = year + '-' + month + '-' + day ;
}

function fetchDate(date) {
    const url = 'http://localhost:8084/api/v1/timetable/search-by-student-id';

    const data = { 
        "studentID": localStorage.getItem("studentID"),
        "start":date,
        "end":date
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
        console.log('Response:', data);
        // Process the response here
    })
    .catch(error => {
        console.error('There was a problem with the request:', error);
    });
}
