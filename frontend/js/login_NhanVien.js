function submitLoginForm() {
    var id = document.getElementById('UserName').value;
    var password = document.getElementById('Password').value;

    // Gọi endpoint /authorize bằng fetch
    fetch(`http://localhost:3000/authorize?id=${id}&password=${password}`)
        .then(response => response.json()) // Parse phản hồi thành JSON
        .then(data => {
            // Xử lý dữ liệu nhận được từ endpoint
            if (data.token) {

                // http://localhost:8082/api/v1/check-administrator
                fetch(`http://localhost:8080/api/v1/check-administrator`,{
                    method: 'Post',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${data.token}`
                    }
                }).then(response => {
                    if(response.status === 200){
                        localStorage.setItem("userID", id);
                        localStorage.setItem("token", data.token);
                        window.location.href = "dashboard.html";
                    }
                    else if(response.status === 401 || response.status === 403)
                        alert("Bạn không phải là nhân viên")
                    else
                        alert("oops! Có lỗi xảy ra!")
                
                });
                
            } else {
                console.error('Token not received');
                // Xử lý trường hợp không nhận được token
            }
        })
        .catch(error => {
            // Xử lý lỗi nếu có
            
            console.error('Error:', error);
        });
}
