function Register(){
    var username = document.getElementById("username").value
    var password = document.getElementById("password").value
    var checkPassword = document.getElementById("checkpassword").value

    // Create a JSON object with the username and password
    var dataToSend = {
        "username": username,
        "password": password,
        "checkpassword": checkPassword
    }

    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (this.readyState == 4){
            console.log(this.responseText)
            var data = JSON.parse(this.responseText)
            console.log(data)

            if (this.status == 200){
                // If status is 200, redirect to the game page since everything is OK and the user is logged in
                window.location.href = "/mainMenu.html"
            }else{
                // If status is not 200, show the error message
                document.getElementById("message").innerHTML = data.message
            }
        
        }
    }
    
    // Open the request with POST method and URL /login
    request.open("POST", "/register", true);

    // Set the request header to JSON
    request.setRequestHeader("Content-Type", "application/json");

    // Send the request with the data. Stringify will convert the JSON object to a string.
    request.send(JSON.stringify(dataToSend));
}