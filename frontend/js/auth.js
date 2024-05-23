function validatePassword(password) {
    var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
}

function changePassword(){
    var password = document.getElementById("currentPassword").value;
    var newPassword = document.getElementById("newPassword").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    if(password === "" || newPassword === "" || confirmPassword === ""){
        document.getElementById("passwordAlert").style.display = "block";
        document.getElementById("passwordAlert").innerHTML = "Vui lòng nhập đầy đủ thông tin";
        return;
    }

    if (newPassword === confirmPassword) {
        if (validatePassword(newPassword)) {
            document.getElementById("passwordAlert").style.display = "none";
            let id = localStorage.getItem("studentID");
            fetch(`http://localhost:3000/change-password?id=${id}&oldPass=${password}&newPass=${newPassword}`, {
                method: 'POST'
            })
                .then(response => {
                    if (response.status === 200) {
                        window.location.href = "login.html"
                    } else {
                        document.getElementById("passwordAlert").style.display = "block";
                        document.getElementById("passwordAlert").innerHTML = "Tài khoản hoặc mật khẩu không chính xác!";
                    }
                
                }) 
                .catch(error => {
                    document.getElementById("passwordAlert").style.display = "block";
                    document.getElementById("passwordAlert").innerHTML = "Oops! Có lỗi xảy ra!";
                });
        } else {
            document.getElementById("passwordAlert").style.display = "block";
            document.getElementById("passwordAlert").innerHTML = "Mật khẩu mới không đủ mạnh";
        }
    } else {
        document.getElementById("passwordAlert").style.display = "block";
        document.getElementById("passwordAlert").innerHTML = "Mật khẩu mới không khớp";
    }
}

