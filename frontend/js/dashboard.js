const token = localStorage.getItem("token");

// Tìm phần tử HTML mà bạn muốn hiển thị token
const tokenDisplay = document.getElementById("token");


function fetchStudentID() {
    const url = 'http://localhost:8080/api/v1/student/search-by-id?id='+localStorage.getItem("studentID");

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
        // nameUser
        // console.log(json.fullName);
        document.getElementById("nameUser").innerHTML = json.fullName;
        document.getElementById("mssv").innerHTML = json.id;
        document.getElementById("name").innerHTML = json.fullName;
        document.getElementById("sex").innerHTML = json.sex ? "Nam" : "Nữ";
        document.getElementById("address").innerHTML = json.address;
        document.getElementById("sdt").innerHTML = json.phoneNumber;
        document.getElementById("email").innerHTML = json.email;
    })
    .catch(error => {
        console.warn('There was a problem with the request:', error);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    fetchStudentID();
});

function handleLogout() {
    window.location.href = "login.html";
    localStorage.clear();  
}

