const token = localStorage.getItem("token");

// Tìm phần tử HTML mà bạn muốn hiển thị token
const tokenDisplay = document.getElementById("token");

document.addEventListener("DOMContentLoaded", function() {
    const tokenDisplay = document.getElementById("token");
    // Kiểm tra tokenDisplay trước khi thực hiện các thao tác khác
    if(tokenDisplay !== null) {
        tokenDisplay.innerHTML = "<div>"+token+"</div>"
    }
});