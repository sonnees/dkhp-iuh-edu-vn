
document.addEventListener("DOMContentLoaded", async () => {
    document.getElementById('nameUser').innerHTML = localStorage.getItem("name");
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
        let TBTL10 = 0;
        let TBTL4 = 0;
        
        list.forEach((data, index) => {

            let subj = data.subjects
            console.log(subj);
           

            let TB10 = 0;
            let TB4 = 0;
            let flag = false;
            let check = true;
            if (subj.length !== 0) {

                const rowSem = document.createElement('tr');
                rowSem.innerHTML = `
                        <td colspan="19" style="background: #f5f5f5; color: #578ebe; font-weight: 600;">Học kỳ ${index+1}</td>
                    `;
                tableBody.appendChild(rowSem);
                subj.forEach((data, index)=> {
                    const row = document.createElement('tr');
                    let kq = 0;
                    let score4=0;
                    let score = "";
                    if (data.theoryScore != null) {
                        flag=true;
                        let TBC = data.midtermScore * 0.3 + data.finalScore*0.5  + (data.theoryScore[0] + data.theoryScore[1] + data.theoryScore[2])/3*0.2;
                        if (data.theoryScore != null && data.practicalScore == null) {
                            kq = TBC;
                            TB10+=kq;
                        }   else if (data.theoryScore != null && data.practicalScore[0] == undefined ) {
                            kq = TBC;
                            TB10+=kq;
                        }   else if (data.theoryScore != null && data.practicalScore != null ) {
                            kq = (TBC*2 + (data.practicalScore[0] + data.practicalScore[1] + data.practicalScore[2])/3*1)/3;
                            TB10+=kq;
                        }
    
                        
                        if (kq >= 9 && kq <= 10) {
                            score4 = 4.0;
                            score = "A+";
                        } else if (kq >= 8 && kq < 9) {
                            score4 = 3.8;
                            score = "A";
                        } else if (kq >= 7 && kq < 8) {
                            score4 = 3.5;
                            score = "B+";
                        } else if (kq >= 6 && kq < 7) {
                            score4 = 3.0;
                            score = "B";
                        } else if (kq >= 5 && kq < 6) {
                            score4 = 2.5;
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
                    } else {
                        check = false;
                    }
                    row.innerHTML = `
                        <td class='center-content'>${index+1} </td>
    
                        <td title='${data.subjectName}'>${data.subjectName}</td>
                        <td class='center-content'>${data.midtermScore}</td>
                        <td class='center-content'>${data.theoryScore != null ? data.theoryScore[0] : ""}</td>
                        <td class='center-content'>${data.theoryScore != null ? data.theoryScore[1] : ""}</td>
                        <td class='center-content'>${data.theoryScore != null ? data.theoryScore[2] : ""}</td>
                        <td class='center-content'>${data.practicalScore != null && data.practicalScore[0] != undefined? data.practicalScore[0] : ""}</td>
                        <td class='center-content'>${data.practicalScore != null && data.practicalScore[1] != undefined? data.practicalScore[1] : ""}</td>
                        <td class='center-content'>${data.practicalScore != null && data.practicalScore[2] != undefined? data.practicalScore[2] : ""}</td>
                        <td class='center-content'>${data.finalScore}</td>
                        <td class='center-content'>${data.theoryScore != null ? kq.toFixed(2) : ""}</td>
                        <td class='center-content'>${data.theoryScore != null ? score4 : ""}</td>
                        <td class='center-content'>${data.theoryScore != null ? score : ""}</td>
                    `;
                    TB4+=score4;
                    
                    tableBody.appendChild(row);
    
                })
    
                if (flag && check) {
                    const rowTBK10 = document.createElement('tr');
                    // let TBM = (TB10/data.subjects.length).toFixed(2);
                    rowTBK10.innerHTML = `
                        <td colspan="19">Điểm trung bình học kỳ hệ 10: ${(TB10/data.subjects.length).toFixed(2)}</td>
                    `;
                    tableBody.appendChild(rowTBK10);
    
                    const rowTBK4 = document.createElement('tr');
                    rowTBK4.innerHTML = `
                        <td colspan="19">Điểm trung bình học kỳ hệ 4: ${(TB4/data.subjects.length).toFixed(2) }</td>
                    `;
                    tableBody.appendChild(rowTBK4);

                    TBTL10+=TB10/data.subjects.length
                    const rowTBKTL10 = document.createElement('tr');
                    rowTBKTL10.innerHTML = `
                        <td colspan="19">Điểm trung bình tích lũy (hệ 10): ${(TBTL10/(index+1)).toFixed(2)}</td>
                    `;
                    tableBody.appendChild(rowTBKTL10);
    
    
                    TBTL4+=TB4/data.subjects.length
                    const rowTBKTL4 = document.createElement('tr');
                    rowTBKTL4.innerHTML = `
                        <td colspan="19">Điểm trung bình tích lũy (hệ 4): ${(TBTL4/(index+1)).toFixed(2)}</td>
                    `;
                    tableBody.appendChild(rowTBKTL4);
                }
            }
            
            
            
            
        });

    });
}


const get4 = (kq) => {
    if (kq >= 9 && kq <= 10) {
        return 4.0;
    } else if (kq >= 8 && kq < 9) {
        return 3.8;
    } else if (kq >= 7 && kq < 8) {
        return 3.5;
    } else if (kq >= 6 && kq < 7) {
        return 3.0;
    } else if (kq >= 5 && kq < 6) {
        return 2.5;
    } else if (kq >= 4 && kq < 5) {
        return 1.5;
    } else if (kq >= 0 && kq < 4) {
        return 0;
    }
}

