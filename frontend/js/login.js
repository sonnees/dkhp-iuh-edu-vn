function submitLoginForm() {
    var id = document.getElementById('UserName').value;
    var password = document.getElementById('Password').value;

    // Gọi endpoint /authorize bằng fetch
    fetch(`http://localhost:3000/authorize?id=${id}&password=${password}`)
        .then(response => response.json()) // Parse phản hồi thành JSON
        .then(data => {
            // Xử lý dữ liệu nhận được từ endpoint
            if (data.token) {
                // Nếu nhận được token, chuyển hướng đến trang khác và gửi token qua query params
                
                // console.log(data);
                localStorage.setItem("studentID", id);
                localStorage.setItem("token", data.token);
                window.location.href = "dashboard.html";
            } else {
<<<<<<< HEAD
                alert("Tài khoản hoặc mật khẩu không chính xác!")
=======
>>>>>>> origin
                console.error('Token not received');
                // Xử lý trường hợp không nhận được token
            }
        })
        .catch(error => {
            // Xử lý lỗi nếu có
            alert("Tài khoản hoặc mật khẩu không chính xác!")
            console.error('Error:', error);
        });
}
