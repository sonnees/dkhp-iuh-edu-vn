document.addEventListener("DOMContentLoaded", async () => {
    const semester = document.getElementById('semester');
    fetchAcademicResults();
});

const fetchAcademicResults = async () => {
    const url = 'http://localhost:8080/api/v1/academic-results/search?info='+localStorage.getItem("studentID");

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
    .then(async (data) => {
        json = JSON.parse(data);

        console.log(json);
        let list = json.semesters;

        const tableBody = document.querySelector('#scoreTable tbody');
        tableBody.innerHTML="";
        list.forEach((data, index) => {

            let subj = data.subjects
            const rowSem = document.createElement('tr');
            rowSem.innerHTML = `
                    <td colspan="19">Học kỳ ${index+1}</td>
                `;
            tableBody.appendChild(rowSem);

            subj.forEach((data, index)=> {
                const row = document.createElement('tr');
                let kq = 0;
                let score4=0;
                let score = "";
                if (data.theoryScore != null) {
                    let TBC = data.midtermScore * 0.3 + data.finalScore*0.5  + (data.theoryScore[0] + data.theoryScore[1] + data.theoryScore[2])/3*0.2;
                    if (data.theoryScore != null && data.practicalScore == null) {
                        kq = TBC
                    } else if (data.theoryScore != null && data.practicalScore[0] == undefined ) {
                        kq = TBC
                    }   else if (data.theoryScore != null && data.practicalScore != null ) {
                        kq = (TBC*2 + (data.practicalScore[0] + data.practicalScore[1] + data.practicalScore[2])/3*1)/3
                    }

                    
                    if (kq >= 9 && kq <= 10) {
                        score4 = 4.0;
                        score = "A+";
                    } else if (kq >= 8 && kq < 9) {
                        score4 = 3.5;
                        score = "A";
                    } else if (kq >= 7 && kq < 8) {
                        score4 = 3.0;
                        score = "B+";
                    } else if (kq >= 6 && kq < 7) {
                        score4 = 2.5;
                        score = "B";
                    } else if (kq >= 5 && kq < 6) {
                        score4 = 2.0;
                        score = "C";
                    } else if (kq >= 4 && kq < 5) {
                        score4 = 1.5;
                        score = "D";
                    } else if (kq >= 0 && kq < 4) {
                        score4 = 0;
                        score = "F";
                    } else {
                        score4 = 'Điểm không hợp lệ';
                    }
                }
                row.innerHTML = `
                    <td>${index+1}</td>
                    <td >${data.id}</td>
                    <td>${data.subjectName}</td>
                    <td>${data.creditUnits}</td>
                    <td>${data.midtermScore}</td>
                    <td>${data.theoryScore != null ? data.theoryScore[0] : ""}</td>
                    <td>${data.theoryScore != null ? data.theoryScore[1] : ""}</td>
                    <td>${data.theoryScore != null ? data.theoryScore[2] : ""}</td>
                    <td>${data.practicalScore != null && data.practicalScore[0] != undefined? data.practicalScore[0] : ""}</td>
                    <td>${data.practicalScore != null && data.practicalScore[1] != undefined? data.practicalScore[1] : ""}</td>
                    <td>${data.practicalScore != null && data.practicalScore[2] != undefined? data.practicalScore[2] : ""}</td>
                    <td>${data.finalScore}</td>
                    <td>${data.theoryScore != null ? kq.toFixed(2) : ""}</td>
                    <td>${data.theoryScore != null ? score4 : ""}</td>
                    <td>${data.theoryScore != null ? score : ""}</td>
                    <td></td>
                `;

                tableBody.appendChild(row);
            })

            
            
        });

    });
}

