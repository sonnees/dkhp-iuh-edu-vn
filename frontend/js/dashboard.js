const token = localStorage.getItem("token");

// Tìm phần tử HTML mà bạn muốn hiển thị token
const tokenDisplay = document.getElementById("token");


function fetchStudentID() {
    const url = 'http://localhost:8084/api/v1/student/search-by-id?id='+localStorage.getItem("studentID");

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
        console.log('Response:', data);
        // Process the response here
    })
    .catch(error => {
        console.error('There was a problem with the request:', error);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    fetchStudentID();
});

