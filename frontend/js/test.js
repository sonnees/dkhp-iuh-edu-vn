function toast({
    state = 'success',
    title = 'Thành công !',
    desc = 'Chúc bạn may mắn lần sau',
}) {
    var main = document.getElementById('toast');
    if (main) {
        var toastBody = document.createElement('div');
        icons = {
            success: 'fa-solid fa-circle-check',
            info: 'fa-solid fa-circle-info',
            error: 'fa-solid fa-circle-exclamation',
            warn: 'fa-solid fa-triangle-exclamation',
        }

        toastBody.classList.add(`toast--${state}`);
        toastBody.innerHTML =
                    `
                    <div class="toast show">
                        <div class="toast-icon">
                            <i class="${icons[state]}" ></i>
                        </div>
                        <div class="toast-body">
                            <h3 class="toast__title">${title}</h3>
                            <p class="toast__msg">${desc}</p>
                        </div>
                        <div class="toast__close">
                            <i class="fas fa-times"></i>
                        </div>
                    </div>
                    `

        main.appendChild(toastBody);

        toastBody.onclick = function (event) {
            if (event.target.closest('.toast__close')) {
                main.removeChild(toastBody);
            }
        }

        setTimeout(function () {
            if (main.contains(toastBody))
                main.removeChild(toastBody);
        }, 4000)
    }
}

function showSuccessToast(desc) {
    toast({
        state: 'success',
        title: 'Thành công !',
        desc: desc,
    })
}

function showErrorToast(desc) {
    toast({
        state: 'error',
        title: 'Lỗi !',
        desc: desc
    })
}

function showInfoToast(desc) {
    toast({
        state: 'info',
        title: 'Thông tin !',
        desc: desc
    })
}

function showWarnToast(desc) {
    toast({
        state: 'warn',
        title: 'Cảnh báo !',
        desc: desc
    })
}