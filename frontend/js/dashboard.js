const token = localStorage.getItem("token");

const tokenDisplay = document.getElementById("token");
let chart = null;

function fetchStudentID() {
    const url = 'http://localhost:8080/api/v1/student/search-by-id?id=' + localStorage.getItem("studentID");

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
            json = JSON.parse(data);
            console.log(json);
            
            fetch('http://localhost:8080/api/v1/classes/search?id=' + json.classesID, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem("token")
                },
            })

                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.text();
                })
                .then(data => {
                    data = JSON.parse(data);
                    document.getElementById("nameUser").innerHTML = json.fullName;
                    document.getElementById("mssv").innerHTML = json.id;
                    document.getElementById("name").innerHTML = json.fullName;
                    document.getElementById("sex").innerHTML = json.sex ? "Nam" : "Nữ";
                    document.getElementById("address").innerHTML = json.address;
                    document.getElementById("sdt").innerHTML = json.phoneNumber;
                    document.getElementById("email").innerHTML = json.email;

                    document.getElementById("majorsName").innerHTML = data.name
                    document.getElementById("typeOfEducation").innerHTML = data.typeOfEducation;
                    document.getElementById("modeOfEducation").innerHTML = data.modeOfEducation;
                    localStorage.setItem("name", json.fullName);
                    localStorage.setItem("email", json.email);
                })
        })
        .catch(error => {
            console.warn('There was a problem with the request:', error);
        });
}



document.addEventListener("DOMContentLoaded", function () {
    if (!token) {
        window.location.href = "login.html";
    }
    if (window.location.pathname != "/html/SinhVien/dashboard.html") {
        return;
    }
    fetchStudentID();
    updateSemester();
    showChart();
});

function handleLogout() {
    window.location.href = "login.html";
    localStorage.clear();
}

function updateSemester() {
    console.log("updateSemester");
    date = new Date();
    year = date.getFullYear();
    let select = document.getElementById("chartSelect");
    if (!select) {
        return;
    }
    fetch('http://localhost:8080/api/v1/semester/search-by-year?year=' + year, {
        method: 'Post',
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
            semester = JSON.parse(data);
            console.log(semester);
            semester.forEach(element => {
                let option = document.createElement("option");
                option.text = `Kì ${element.semesterNumber} (${element.year}-${element.year + 1})`;
                option.value = element.id;
                select.add(option);
            });
            document.getElementById("chartSelect").value = semester[0].id;
            showChart()
        })


}

function showChart() {
    
    let semesterID = document.getElementById("chartSelect").value;
    console.log("updateSemester " + semesterID);
    const ctx = document.getElementById('myChart').getContext('2d');
    let chartData = null;
    if (semesterID == 'null') chartData = {labels: [],scores: []}
    else {
        // http://localhost:8084/api/v1/academic-results/statistic-score?studentID=10000090&semesterID=dd2e5d9a-74c7-4232-9d56-ee253821241d
        let api = 'http://localhost:8080/api/v1/academic-results/statistic-score?studentID=' + localStorage.getItem("studentID") + '&semesterID=' + semesterID
        console.log(api);
        fetch(api, {
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
                console.log(data);
                if (data == "") chartData = { labels: [], scores: [] } 
                else{
                    data = JSON.parse(data);
                    chartData = null;
                    chartData = { labels: data.subjectNames, scores: data.finalScores }
                    console.log(chartData);
                }

                if (chart) {
                    chart.destroy(); 
                }

                chart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: chartData.labels,
                        datasets: [{
                            label: 'Điểm',
                            data: chartData.scores,
                            backgroundColor: 'rgb(250, 108, 81)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        indexAxis: 'y', 
                        scales: {
                            y: {

                                display: false, 
                            },
                            x: {
                                beginAtZero: true,
                                max: 10, 
                                ticks: {
                                    stepSize: 1 
                                }
                            }
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function (context) {
                                        let label = context.dataset.label || '';
                                        let subject = context.chart.data.labels[context.dataIndex];
                                        let score = context.parsed.x.toFixed(1); // Use 'x' instead of 'y' for horizontal bar chart
                                        return [subject, `${label}: ${score}`]; // Return an array with two lines
                                    }
                                }
                            }
                        }
                    }
                });
                return;
            })
    }

    if (chart) {
        chart.destroy(); // Destroy the existing chart instance if it exists
    }

    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartData.labels,
            datasets: [{
                label: 'Điểm',
                data: chartData.scores,
                backgroundColor: 'rgb(250, 108, 81)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y', // This setting makes the bar chart horizontal
            scales: {
                y: {
                    
                    display: false, // Hide the y-axis labels
                },
                x: {
                    beginAtZero: true,
                    max: 10, // Set the maximum value for the x-axis
                    ticks: {
                        stepSize: 1 // Set the step size for x-axis
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || '';
                            let subject = context.chart.data.labels[context.dataIndex];
                            let score = context.parsed.x.toFixed(1); // Use 'x' instead of 'y' for horizontal bar chart
                            return [subject, `${label}: ${score}`]; // Return an array with two lines
                        }
                    }
                }
            }
        }
    });
    
}




