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
                row.innerHTML = `
                    <td>${index+1}</td>
                    <td >${data.id}</td>
                    <td>${data.subjectName}</td>
                    <td>${data.creditUnits}</td>
                    <td>${data.midtermScore}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>${data.finalScore}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                `;

                tableBody.appendChild(row);
            })

            
            
        });

    });
}