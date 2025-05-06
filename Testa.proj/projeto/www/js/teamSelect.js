function GetTeamState() {
    var request = new XMLHttpRequest();

    request.onreadystatechange = function () {
        if (this.readyState == 4) {
            var data = JSON.parse(this.responseText);
            console.log(data)
            if (this.status == 401) {
                window.location.href = "/login.html";
                return;
            }
            if (this.status == 404) {
                document.getElementById("username").innerHTML = "username: " + data.username
                document.getElementById("points").innerHTML = "garcias: " + data.points
                document.getElementById("history").innerHTML = "match history: " + data.history
            }
            if (this.status == 200) {
                document.getElementById("username").innerHTML = "username: " + data.username
                document.getElementById("points").innerHTML = "garcias: " + data.points
                document.getElementById("history").innerHTML = "match history: " + data.history
                document.getElementById("sqr18").value = data.tank
                document.getElementById("sqr16").value = data.damage1
                document.getElementById("sqr19").value = data.damage2
                document.getElementById("sqr17").value = data.support
                document.getElementById("bigsqr").value = data.blessing
            }
        }
    }

    request.open("GET", "/getTeamState", true);

    request.send();
}

function ConfirmTeam() {
    // var tank = document.getElementById("sqr18").value
    // var damage1 = document.getElementById("sqr16").value
    // var damage2 = document.getElementById("sqr19").value
    // var support = document.getElementById("sqr17").value
    // var blessing = document.getElementById("bigsqr").value

    // if(!tank || !damage1 || !damage2 || !support || !blessing){
    //     console.log("Need team filled")
    //     return;
    // }

    // // Create a JSON object with the username and password
    // var dataToSend = {
    //     "tank": tank,
    //     "damage1": damage1,
    //     "damage2": damage2,
    //     "support": support,
    //     "blessing": blessing
    // }

    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == 4){
            // When the request is done, parse the response to JSON.
            var data = JSON.parse(this.response)

            // Log the response to the console of the browser.
            console.log(data)

            if (this.status == 200){
                // If status is 200, redirect to the main page since everything is OK and the team is chosen
                window.location.href = "mainMenu.html"
            }else{
                // If status is not 200, show the error message
                document.getElementById("message").innerHTML = data.message
            }
           
        }
    }
    
    request.open("PUT", "/confirmTeam", true);
  
    request.setRequestHeader("Content-Type", "application/json");

    // Send the request with the data. Stringify will convert the JSON object to a string.
    request.send(JSON.stringify(dataToSend));
}