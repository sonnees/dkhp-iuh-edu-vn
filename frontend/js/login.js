function submitLoginForm() {
    var id = document.getElementById('UserName').value;
    var password = document.getElementById('Password').value;

    if(id == "" || password == ""){
        document.getElementById('passwordAlert').innerHTML = "Vui lòng nhập đầy đủ thông tin!";
        document.getElementById('passwordAlert').style.display = 'block';
        return;
    }

    // Gọi endpoint /authorize bằng fetch
    fetch(`http://localhost:3000/authorize?id=${id}&password=${password}`)
        .then(response => response.json()) // Parse phản hồi thành JSON
        .then(data => {
            if (data.token) {
                localStorage.setItem("studentID", id);
                localStorage.setItem("token", data.token);
                window.location.href = "dashboard.html";
            } else {
                document.getElementById('passwordAlert').innerHTML = "Thông tin không chính xác!";
                document.getElementById('passwordAlert').style.display = 'block';
                console.error('Token not received');
            }
        })
        .catch(error => {
            document.getElementById('passwordAlert').innerHTML = "oops! Có lỗi xảy ra!"
            document.getElementById('passwordAlert').style.display = 'block';
            console.error('Error:', error);
        });
}
